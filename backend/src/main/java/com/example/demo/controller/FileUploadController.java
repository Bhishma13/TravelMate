package com.example.demo.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = { "http://localhost:3000", "${app.frontend-url}" })
public class FileUploadController {

    private final Cloudinary cloudinary;

    // Reads from application.properties → set via env vars on Render
    public FileUploadController(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Upload directly to Cloudinary — returns a URL that works forever
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("resource_type", "image"));

            String imageUrl = (String) result.get("secure_url"); // always HTTPS
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));

        } catch (IOException ex) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Could not upload file. Please try again!"));
        }
    }
}
