package com.example.demo.controller;

import com.example.demo.model.BookingRequest;
import com.example.demo.model.User;
import com.example.demo.repository.BookingRequestRepository;
import com.example.demo.security.OwnershipValidator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {

    @Autowired
    private BookingRequestRepository bookingRepository;

    @Autowired
    private OwnershipValidator ownershipValidator;

    // Get the notification count for a user
    // Security: You can only see YOUR OWN notification count
    @GetMapping("/count")
    public ResponseEntity<?> getNotificationCount(
            @RequestParam Long userId,
            @RequestParam String role,
            HttpServletRequest httpRequest) {
        try {
            // SECURITY: The logged-in user must match the userId being queried
            ownershipValidator.requireOwnership(httpRequest, userId);

            int pendingCount = 0;

            if ("traveler".equals(role)) {
                List<BookingRequest> all = bookingRepository.findByTravelerId(userId);
                pendingCount = (int) all.stream()
                        .filter(r -> r.getTripPostId() != null && "PENDING".equals(r.getStatus()))
                        .count();
            } else if ("guide".equals(role)) {
                List<BookingRequest> all = bookingRepository.findByGuideId(userId);
                pendingCount = (int) all.stream()
                        .filter(r -> r.getTripPostId() == null && "PENDING".equals(r.getStatus()))
                        .count();
            }

            return ResponseEntity.ok(Map.of("pending", pendingCount));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get notifications: " + e.getMessage());
        }
    }
}
