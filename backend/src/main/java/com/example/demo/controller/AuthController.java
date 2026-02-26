package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Validations
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
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully", "user", user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        String emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
        if (email == null || !email.matches(emailRegex)) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return ResponseEntity.ok(Map.of("message", "Login successful", "user", user.get()));
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
