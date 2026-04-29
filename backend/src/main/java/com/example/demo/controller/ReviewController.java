package com.example.demo.controller;

import com.example.demo.model.BookingRequest;
import com.example.demo.model.Review;
import com.example.demo.repository.BookingRequestRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRequestRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Map<String, Object> payload) {
        try {
            Long bookingId = Long.parseLong(payload.get("bookingRequestId").toString());
            Long travelerId = Long.parseLong(payload.get("travelerId").toString());
            Long guideId = Long.parseLong(payload.get("guideId").toString());
            Integer rating = Integer.parseInt(payload.get("rating").toString());
            String comment = payload.get("comment") != null ? payload.get("comment").toString() : "";

            if (reviewRepository.existsByBookingRequestId(bookingId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "This trip has already been reviewed."));
            }

            Review review = new Review(bookingId, travelerId, guideId, rating, comment);
            Review savedReview = reviewRepository.save(review);

            Optional<BookingRequest> bookingOpt = bookingRepository.findById(bookingId);
            if (bookingOpt.isPresent()) {
                BookingRequest booking = bookingOpt.get();
                booking.setStatus("REVIEWED");
                bookingRepository.save(booking);
            }

            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to submit review: " + e.getMessage()));
        }
    }

    @GetMapping("/guide/{guideId}")
    public ResponseEntity<?> getGuideReviews(@PathVariable Long guideId) {
        List<Review> reviews = reviewRepository.findByGuideId(guideId);
        List<Map<String, Object>> responseList = reviews.stream().map(review -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", review.getId());
            map.put("rating", review.getRating());
            map.put("comment", review.getComment());
            map.put("createdAt", review.getCreatedAt());

            userRepository.findById(review.getTravelerId()).ifPresent(traveler -> {
                map.put("travelerName", traveler.getName());
            });
            return map;
        }).toList();

        return ResponseEntity.ok(responseList);
    }
}
