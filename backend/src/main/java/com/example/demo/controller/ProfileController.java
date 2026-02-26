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
@CrossOrigin(origins = "http://localhost:5173")
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
        if (profile.getImageUrl() == null)
            profile.setImageUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.get().getName());

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
        String requesting = (String) payload.get("requesting");
        String date = (String) payload.get("date");
        String budget = (String) payload.get("budget");

        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        TravelerProfile profile = travelerProfileRepository.findByUser(user.get())
                .orElse(new TravelerProfile());

        profile.setUser(user.get());
        profile.setLocation(location);
        profile.setRequesting(requesting);
        profile.setDate(date);
        profile.setBudget(budget);

        if (profile.getImageUrl() == null) {
            profile.setImageUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.get().getName());
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
