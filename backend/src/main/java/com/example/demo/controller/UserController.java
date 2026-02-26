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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GuideProfileRepository guideProfileRepository;

    @Autowired
    private TravelerProfileRepository travelerProfileRepository;

    @GetMapping
    public ResponseEntity<?> getUsersByRole(
            @RequestParam String role,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userRepository.findByRole(role, pageable);
        List<User> finalUsers = new ArrayList<>();

        // If location is provided, we need to filter by location
        if (location != null && !location.trim().isEmpty()) {
            if ("guide".equalsIgnoreCase(role)) {
                Page<GuideProfile> profiles = guideProfileRepository.findByLocationContainingIgnoreCase(location,
                        pageable);
                profiles.getContent().forEach(p -> finalUsers.add(p.getUser()));
                usersPage = new org.springframework.data.domain.PageImpl<>(finalUsers, pageable,
                        profiles.getTotalElements());
            } else if ("traveler".equalsIgnoreCase(role)) {
                Page<TravelerProfile> profiles = travelerProfileRepository.findByLocationContainingIgnoreCase(location,
                        pageable);
                profiles.getContent().forEach(p -> finalUsers.add(p.getUser()));
                usersPage = new org.springframework.data.domain.PageImpl<>(finalUsers, pageable,
                        profiles.getTotalElements());
            }
        }

        List<Map<String, Object>> userList = new ArrayList<>();

        for (User user : usersPage.getContent()) {
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("name", user.getName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole());

            if ("guide".equalsIgnoreCase(role)) {
                Optional<GuideProfile> profile = guideProfileRepository.findByUser(user);
                if (profile.isPresent()) {
                    userData.put("location", profile.get().getLocation());
                    userData.put("experience", profile.get().getExperience());
                    userData.put("about", profile.get().getAbout());
                    userData.put("rating", profile.get().getRating());
                    userData.put("image", profile.get().getImageUrl());
                } else {
                    userData.put("location", "Not provided");
                    userData.put("experience", "Not provided");
                    userData.put("about", "No bio available");
                    userData.put("rating", 0.0);
                    userData.put("image", "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getName());
                }
            } else {
                Optional<TravelerProfile> profile = travelerProfileRepository.findByUser(user);
                if (profile.isPresent()) {
                    userData.put("location", profile.get().getLocation());
                    userData.put("requesting", profile.get().getRequesting());
                    userData.put("date", profile.get().getDate());
                    userData.put("budget", profile.get().getBudget());
                    userData.put("image", profile.get().getImageUrl());
                } else {
                    userData.put("location", "Flexible");
                    userData.put("requesting", "Any destination");
                    userData.put("date", "Anytime");
                    userData.put("budget", "Flexible");
                    userData.put("image", "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getName());
                }
            }

            userList.add(userData);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("content", userList);
        response.put("currentPage", usersPage.getNumber());
        response.put("totalItems", usersPage.getTotalElements());
        response.put("totalPages", usersPage.getTotalPages());

        return ResponseEntity.ok(response);
    }
}
