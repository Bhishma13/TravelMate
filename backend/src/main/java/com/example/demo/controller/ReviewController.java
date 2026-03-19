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
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRequestRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Submit a new review
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Map<String, Object> payload) {
        try {
            Long bookingId = Long.parseLong(payload.get("bookingRequestId").toString());
            Long travelerId = Long.parseLong(payload.get("travelerId").toString());
            Long guideId = Long.parseLong(payload.get("guideId").toString());
            Integer rating = Integer.parseInt(payload.get("rating").toString());
            String comment = payload.get("comment") != null ? payload.get("comment").toString() : "";

            // Validate logic: has it already been reviewed?
            if (reviewRepository.existsByBookingRequestId(bookingId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "This trip has already been reviewed."));
            }

            // Create and save the review
            Review review = new Review(bookingId, travelerId, guideId, rating, comment);
            Review savedReview = reviewRepository.save(review);

            // MAGIC TRICK: Automatically update the BookingRequest status to "REVIEWED"
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

    // 2. Fetch all reviews for a specific guide (so we can display them on their
    // profile)
    @GetMapping("/guide/{guideId}")
    public ResponseEntity<?> getGuideReviews(@PathVariable Long guideId) {
        List<Review> reviews = reviewRepository.findByGuideId(guideId);

        // Let's also attach the Traveler's Name to each review so the UI can show who
        // wrote it
        // Rather than a DTO, we can just return a list of Maps for simplicity here.
        List<Map<String, Object>> responseList = reviews.stream().map(review -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", review.getId());
            map.put("rating", review.getRating());
            map.put("comment", review.getComment());
            map.put("createdAt", review.getCreatedAt());

            // Look up the traveler's name
            userRepository.findById(review.getTravelerId()).ifPresent(traveler -> {
                map.put("travelerName", traveler.getName());
            });
            return map;
        }).toList();

        return ResponseEntity.ok(responseList);
    }
}
