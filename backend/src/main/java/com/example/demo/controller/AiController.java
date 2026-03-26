package com.example.demo.controller;

import com.example.demo.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/enhance-profile")
    public ResponseEntity<Map<String, String>> enhanceProfile(@RequestBody Map<String, String> request) {
        String rawText = request.getOrDefault("text", "");
        if (rawText.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Input text cannot be empty"));
        }
        String enhanced = aiService.enhanceProfileDescription(rawText);
        return ResponseEntity.ok(Map.of("enhancedText", enhanced));
    }

    @PostMapping("/enhance-trip")
    public ResponseEntity<Map<String, String>> enhanceTrip(@RequestBody Map<String, String> request) {
        String rawText = request.getOrDefault("text", "");
        if (rawText.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Input text cannot be empty"));
        }
        String enhanced = aiService.enhanceTripRequest(rawText);
        return ResponseEntity.ok(Map.of("enhancedText", enhanced));
    }
}
