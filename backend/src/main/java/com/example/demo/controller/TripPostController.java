package com.example.demo.controller;

import com.example.demo.model.TripPost;
import com.example.demo.repository.TripPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TripPostController {

    @Autowired
    private TripPostRepository tripPostRepository;

    // Create a new Trip Post
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Map<String, Object> payload) {
        try {
            Long travelerId = Long.parseLong(payload.get("travelerId").toString());
            String destination = payload.get("destination").toString();
            String tripDates = payload.get("tripDates").toString();
            String description = payload.get("description").toString();

            TripPost post = new TripPost(travelerId, destination, tripDates, description);
            TripPost savedPost = tripPostRepository.save(post);

            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create trip post: " + e.getMessage()));
        }
    }

    // Get all history specifically for one traveler
    @GetMapping("/traveler/{travelerId}")
    public ResponseEntity<List<TripPost>> getTravelerPosts(@PathVariable Long travelerId) {
        List<TripPost> posts = tripPostRepository.findByTravelerIdOrderByCreatedAtDesc(travelerId);
        return ResponseEntity.ok(posts);
    }

    // Get all OPEN posts for the Guide Job Board
    @GetMapping("/board")
    public ResponseEntity<List<TripPost>> getOpenBoardPosts() {
        List<TripPost> openPosts = tripPostRepository.findByStatusOrderByCreatedAtDesc("OPEN");
        return ResponseEntity.ok(openPosts);
    }

    // Update the status of a post
    @PutMapping("/{postId}/status")
    public ResponseEntity<?> updatePostStatus(@PathVariable Long postId, @RequestBody Map<String, String> payload) {
        try {
            String newStatus = payload.get("status");
            if (newStatus == null || (!newStatus.equals("OPEN") && !newStatus.equals("IN_PROGRESS")
                    && !newStatus.equals("FULFILLED") && !newStatus.equals("CANCELLED"))) {
                return ResponseEntity.badRequest().body("Invalid status");
            }

            Optional<TripPost> postOpt = tripPostRepository.findById(postId);
            if (postOpt.isPresent()) {
                TripPost post = postOpt.get();
                post.setStatus(newStatus);
                TripPost updatedPost = tripPostRepository.save(post);
                return ResponseEntity.ok(updatedPost);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update status: " + e.getMessage());
        }
    }
}
