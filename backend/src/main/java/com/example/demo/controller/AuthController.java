package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.example.demo.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        String emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
        if (user.getEmail() == null || !user.getEmail().matches(emailRegex)) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }

        if (user.getPhone() == null || !user.getPhone().matches("^\\d{10}$")) {
            return ResponseEntity.badRequest().body("Phone number must be exactly 10 digits");
        }

        if ("guide".equalsIgnoreCase(user.getRole())) {
            if (user.getAdhaar() == null || !user.getAdhaar().matches("^\\d{12}$")) {
                return ResponseEntity.badRequest().body("Aadhaar number must be exactly 12 digits");
            }
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole() != null ? user.getRole() : "traveler");
        return ResponseEntity.ok(Map.of("message", "User registered successfully", "user", user, "token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            String token = jwtUtil.generateToken(user.get().getEmail(),
                    user.get().getRole() != null ? user.get().getRole() : "traveler");
            return ResponseEntity.ok(Map.of("message", "Login successful", "user", user.get(), "token", token));
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // ── Forgot Password ──────────────────────────────────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        Optional<User> optUser = userRepository.findByEmail(email);

        // Always respond the same way — prevents attackers from learning which emails
        // are registered
        String genericMessage = "If this email is registered, a reset link has been sent.";

        if (optUser.isPresent()) {
            User user = optUser.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);

            try {
                emailService.sendPasswordResetEmail(email, token);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Failed to send reset email. Please try again.");
            }
        }

        return ResponseEntity.ok(Map.of("message", genericMessage));
    }

    // ── Reset Password ───────────────────────────────────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || token.isBlank() || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Token and new password are required");
        }

        Optional<User> optUser = userRepository.findByResetToken(token);
        if (optUser.isEmpty()) {
            return ResponseEntity.status(400).body("Invalid or expired reset link");
        }

        User user = optUser.get();
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body("Reset link has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}
