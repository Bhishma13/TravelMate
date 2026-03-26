package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // BCrypt encoder — strength 10 means 2^10 hashing rounds (industry default)
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Validate email format
        String emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
        if (user.getEmail() == null || !user.getEmail().matches(emailRegex)) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }

        // Validate phone: exactly 10 digits
        if (user.getPhone() == null || !user.getPhone().matches("^\\d{10}$")) {
            return ResponseEntity.badRequest().body("Phone number must be exactly 10 digits");
        }

        // Guides must provide a valid 12-digit Aadhaar number
        if ("guide".equalsIgnoreCase(user.getRole())) {
            if (user.getAdhaar() == null || !user.getAdhaar().matches("^\\d{12}$")) {
                return ResponseEntity.badRequest().body("Aadhaar number must be exactly 12 digits");
            }
        }

        // Check for duplicate email
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Hash the password before saving — never store plain text!
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully", "user", user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Basic null check only — no format validation needed here,
        // valid emails are already guaranteed to be in the DB from signup
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        Optional<User> user = userRepository.findByEmail(email);

        // BCrypt's matches() hashes the incoming password and compares it
        // to the stored hash — the original plain text is never recoverable
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return ResponseEntity.ok(Map.of("message", "Login successful", "user", user.get()));
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
