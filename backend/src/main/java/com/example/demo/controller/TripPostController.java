package com.example.demo.controller;

import com.example.demo.model.TripPost;
import com.example.demo.model.User;
import com.example.demo.model.TravelerProfile;
import com.example.demo.repository.TripPostRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.TravelerProfileRepository;
import com.example.demo.security.OwnershipValidator;
import jakarta.servlet.http.HttpServletRequest;
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TravelerProfileRepository travelerProfileRepository;

    @Autowired
    private OwnershipValidator ownershipValidator;

    // Create a trip post
    // Security: You can only post under your own traveler ID
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Map<String, Object> payload,
            HttpServletRequest httpRequest) {
        try {
            Long travelerId = Long.parseLong(payload.get("travelerId").toString());

            // SECURITY: Logged-in user must be the traveler creating this post
            ownershipValidator.requireOwnership(httpRequest, travelerId);

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

    // Get a single post by ID — public, any logged-in user can view it
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        Optional<TripPost> postOpt = tripPostRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        TripPost post = postOpt.get();
        Optional<User> userOpt = userRepository.findById(post.getTravelerId());
        boolean hasUser = userOpt.isPresent();
        String travelerImageUrl = "";
        if (hasUser) {
            Optional<TravelerProfile> profileOpt = travelerProfileRepository.findByUser(userOpt.get());
            if (profileOpt.isPresent() && profileOpt.get().getImageUrl() != null) {
                travelerImageUrl = profileOpt.get().getImageUrl();
            }
        }
        Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", post.getId());
        map.put("travelerId", post.getTravelerId());
        map.put("destination", post.getDestination());
        map.put("tripDates", post.getTripDates());
        map.put("description", post.getDescription());
        map.put("status", post.getStatus());
        map.put("createdAt", post.getCreatedAt());
        map.put("travelerName", hasUser ? userOpt.get().getName() : "Traveler");
        map.put("travelerImage", travelerImageUrl);
        return ResponseEntity.ok(map);
    }

    // Get all trip posts for a specific traveler (their history)
    // Security: Only the traveler themselves can see their own post history
    @GetMapping("/traveler/{travelerId}")
    public ResponseEntity<?> getTravelerPosts(@PathVariable Long travelerId,
            HttpServletRequest httpRequest) {

        // SECURITY: Logged-in user must be this traveler
        ownershipValidator.requireOwnership(httpRequest, travelerId);

        List<TripPost> posts = tripPostRepository.findByTravelerIdOrderByCreatedAtDesc(travelerId);
        return ResponseEntity.ok(posts);
    }

    // Get all OPEN posts for the Guide Job Board — public, any logged-in user (guide) can view
    @GetMapping("/board")
    public ResponseEntity<List<Map<String, Object>>> getOpenBoardPosts() {
        List<TripPost> openPosts = tripPostRepository.findByStatusOrderByCreatedAtDesc("OPEN");
        List<Map<String, Object>> response = openPosts.stream().map(post -> {
            Optional<User> userOpt = userRepository.findById(post.getTravelerId());
            boolean hasUser = userOpt.isPresent();
            String travelerImageUrl = "";
            if (hasUser) {
                Optional<TravelerProfile> profileOpt = travelerProfileRepository.findByUser(userOpt.get());
                if (profileOpt.isPresent() && profileOpt.get().getImageUrl() != null) {
                    travelerImageUrl = profileOpt.get().getImageUrl();
                }
            }
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", post.getId());
            map.put("travelerId", post.getTravelerId());
            map.put("destination", post.getDestination());
            map.put("tripDates", post.getTripDates());
            map.put("description", post.getDescription());
            map.put("status", post.getStatus());
            map.put("createdAt", post.getCreatedAt());
            map.put("travelerName", hasUser ? userOpt.get().getName() : "Traveler");
            map.put("travelerImage", travelerImageUrl);
            return map;
        }).toList();
        return ResponseEntity.ok(response);
    }

    // Update the status of a trip post
    // Security: Only the traveler who owns the post can update its status
    @PutMapping("/{postId}/status")
    public ResponseEntity<?> updatePostStatus(@PathVariable Long postId,
            @RequestBody Map<String, String> payload,
            HttpServletRequest httpRequest) {
        try {
            String newStatus = payload.get("status");
            if (newStatus == null || (!newStatus.equals("OPEN") && !newStatus.equals("IN_PROGRESS")
                    && !newStatus.equals("FULFILLED") && !newStatus.equals("CANCELLED"))) {
                return ResponseEntity.badRequest().body("Invalid status");
            }

            Optional<TripPost> postOpt = tripPostRepository.findById(postId);
            if (postOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            TripPost post = postOpt.get();

            // SECURITY: Only the traveler who created this post can update its status
            ownershipValidator.requireOwnership(httpRequest, post.getTravelerId());

            post.setStatus(newStatus);
            TripPost updatedPost = tripPostRepository.save(post);
            return ResponseEntity.ok(updatedPost);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update status: " + e.getMessage());
        }
    }
}
