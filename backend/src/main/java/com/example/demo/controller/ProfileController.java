package com.example.demo.controller;

import com.example.demo.model.GuideProfile;
import com.example.demo.model.TravelerProfile;
import com.example.demo.model.User;
import com.example.demo.repository.GuideProfileRepository;
import com.example.demo.repository.TravelerProfileRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private GuideProfileRepository guideProfileRepository;

    @Autowired
    private TravelerProfileRepository travelerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/guide")
    public ResponseEntity<?> createOrUpdateGuideProfile(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String location = (String) payload.get("location");
        String experience = (String) payload.get("experience");
        String about = (String) payload.get("about");
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        GuideProfile profile = guideProfileRepository.findByUser(user.get())
                .orElse(new GuideProfile());
        profile.setUser(user.get());
        profile.setLocation(location);
        profile.setExperience(experience);
        profile.setAbout(about);
        // Set default rating/image for now
        if (profile.getRating() == null)
            profile.setRating(0.0);

        String imageUrl = payload.containsKey("imageUrl") ? (String) payload.get("imageUrl") : null;
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            profile.setImageUrl(imageUrl.trim());
        } else if (profile.getImageUrl() == null || profile.getImageUrl().startsWith("https://api.dicebear.com")) {
            profile.setImageUrl(
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
        }

        guideProfileRepository.save(profile);

        if (!user.get().isProfileCompleted()) {
            user.get().setProfileCompleted(true);
            userRepository.save(user.get());
        }
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully", "profile", profile));
    }

    @GetMapping("/guide/{userId}")
    public ResponseEntity<?> getGuideProfile(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty())
            return ResponseEntity.status(404).body("User not found");

        Optional<GuideProfile> profile = guideProfileRepository.findByUser(user.get());
        if (profile.isPresent()) {
            return ResponseEntity.ok(profile.get());
        }
        return ResponseEntity.status(404).body("Profile not found");
    }

    @PostMapping("/traveler")
    public ResponseEntity<?> createOrUpdateTravelerProfile(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        String location = (String) payload.get("location");

        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        TravelerProfile profile = travelerProfileRepository.findByUser(user.get())
                .orElse(new TravelerProfile());

        profile.setUser(user.get());
        profile.setLocation(location);

        String imageUrl = payload.containsKey("imageUrl") ? (String) payload.get("imageUrl") : null;
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            profile.setImageUrl(imageUrl.trim());
        } else if (profile.getImageUrl() == null || profile.getImageUrl().startsWith("https://api.dicebear.com")) {
            profile.setImageUrl(
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
        }
        travelerProfileRepository.save(profile);

        if (!user.get().isProfileCompleted()) {
            user.get().setProfileCompleted(true);
            userRepository.save(user.get());
        }
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully", "profile", profile));
    }

    @GetMapping("/traveler/{userId}")
    public ResponseEntity<?> getTravelerProfile(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty())
            return ResponseEntity.status(404).body("User not found");

        Optional<TravelerProfile> profile = travelerProfileRepository.findByUser(user.get());
        if (profile.isPresent()) {
            return ResponseEntity.ok(profile.get());
        }
        return ResponseEntity.status(404).body("Profile not found");
    }
}
