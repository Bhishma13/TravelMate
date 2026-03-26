package com.example.demo.controller;

import com.example.demo.model.BookingRequest;
import com.example.demo.repository.BookingRequestRepository;
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

    /**
     * Returns pending notification counts for the logged-in user.
     * For a TRAVELER: counts PENDING proposals (tripPostId != null) sent to them by
     * Guides.
     * For a GUIDE: counts PENDING requests (tripPostId == null) sent to them by
     * Travelers.
     */
    @GetMapping("/count")
    public ResponseEntity<?> getNotificationCount(
            @RequestParam Long userId,
            @RequestParam String role) {
        try {
            int pendingCount = 0;

            if ("traveler".equals(role)) {
                // Incoming proposals from Guides (Guide applied to Traveler's trip post)
                List<BookingRequest> all = bookingRepository.findByTravelerId(userId);
                pendingCount = (int) all.stream()
                        .filter(r -> r.getTripPostId() != null && "PENDING".equals(r.getStatus()))
                        .count();
            } else if ("guide".equals(role)) {
                // Incoming requests from Travelers (Traveler contacted Guide directly)
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
