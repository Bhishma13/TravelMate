package com.example.demo.controller;

import com.example.demo.dto.BookingRequestDTO;
import com.example.demo.model.BookingRequest;
import com.example.demo.model.TripPost;
import com.example.demo.model.User;
import com.example.demo.repository.BookingRequestRepository;
import com.example.demo.repository.TripPostRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingRequestRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripPostRepository tripPostRepository;

    // Create a new booking request
    @PostMapping("/request")
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> payload) {
        try {
            Long travelerId = Long.parseLong(payload.get("travelerId").toString());
            Long guideId = Long.parseLong(payload.get("guideId").toString());
            String tripDates = payload.get("tripDates").toString();

            // Check if there is an existing active booking with this guide
            List<BookingRequest> existingRequests = bookingRepository.findByTravelerId(travelerId);
            boolean hasActive = existingRequests.stream().anyMatch(r -> r.getGuideId().equals(guideId) &&
                    (r.getStatus().equals("PENDING") || r.getStatus().equals("ACCEPTED")));

            if (hasActive) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "You already have an active booking request with this guide."));
            }

            BookingRequest request;
            if (payload.containsKey("tripPostId") && payload.get("tripPostId") != null) {
                Long tripPostId = Long.parseLong(payload.get("tripPostId").toString());
                request = new BookingRequest(travelerId, guideId, tripPostId, tripDates);
            } else {
                request = new BookingRequest(travelerId, guideId, tripDates);
            }

            BookingRequest savedRequest = bookingRepository.save(request);

            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to create booking request: " + e.getMessage()));
        }
    }

    // Get all requests for a specific guide (so they can review them)
    @GetMapping("/guide/{guideId}")
    public ResponseEntity<List<BookingRequestDTO>> getGuideRequests(@PathVariable Long guideId) {
        List<BookingRequest> requests = bookingRepository.findByGuideId(guideId);
        List<BookingRequestDTO> dtoList = new ArrayList<>();

        for (BookingRequest req : requests) {
            Optional<User> travelerOpt = userRepository.findById(req.getTravelerId());
            if (travelerOpt.isPresent()) {
                User traveler = travelerOpt.get();
                BookingRequestDTO dto = new BookingRequestDTO(
                        req.getId(),
                        req.getTravelerId(),
                        traveler.getName(),
                        traveler.getPhone(),
                        req.getGuideId(),
                        req.getStatus(),
                        req.getTripDates(),
                        req.getTripPostId()); // key field for frontend tab logic
                dto.setCancellationReason(req.getCancellationReason());
                dtoList.add(dto);
            }
        }

        return ResponseEntity.ok(dtoList);
    }

    // Get all requests a traveler has sent
    @GetMapping("/traveler/{travelerId}")
    public ResponseEntity<List<BookingRequestDTO>> getTravelerRequests(@PathVariable Long travelerId) {
        List<BookingRequest> requests = bookingRepository.findByTravelerId(travelerId);
        List<BookingRequestDTO> dtoList = new ArrayList<>();

        for (BookingRequest req : requests) {
            Optional<User> guideOpt = userRepository.findById(req.getGuideId());
            if (guideOpt.isPresent()) {
                User guide = guideOpt.get();
                // We use the same DTO structure, but populate travelerName/Phone with the
                // GUIDE's details
                // so the Traveler frontend can easily read the "other party's" contact info.
                BookingRequestDTO dto = new BookingRequestDTO(
                        req.getId(),
                        req.getTravelerId(),
                        guide.getName(),
                        guide.getPhone(),
                        req.getGuideId(),
                        req.getStatus(),
                        req.getTripDates(),
                        req.getTripPostId()); // key field for frontend tab logic
                dto.setCancellationReason(req.getCancellationReason());
                dtoList.add(dto);
            }
        }

        return ResponseEntity.ok(dtoList);
    }

    // Update the status of a request (Guide accepting/declining)
    @PutMapping("/request/{requestId}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long requestId,
            @RequestBody Map<String, String> payload) {
        try {
            String newStatus = payload.get("status");
            if (newStatus == null || (!newStatus.equals("ACCEPTED") && !newStatus.equals("DECLINED")
                    && !newStatus.equals("COMPLETED") && !newStatus.equals("CANCELLED"))) {
                return ResponseEntity.badRequest().body("Invalid status");
            }

            Optional<BookingRequest> requestOpt = bookingRepository.findById(requestId);
            if (requestOpt.isPresent()) {
                BookingRequest request = requestOpt.get();

                // Guard: if tripPostId exists and traveler is trying to accept,
                // make sure no other booking for this post is already ACCEPTED
                if (newStatus.equals("ACCEPTED") && request.getTripPostId() != null) {
                    List<BookingRequest> otherAccepted = bookingRepository
                            .findByTripPostIdAndStatusAndIdNot(request.getTripPostId(), "ACCEPTED", requestId);
                    if (!otherAccepted.isEmpty()) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("error", "You have already chosen a guide for this trip."));
                    }
                }

                // If CANCELLED, save the reason provided
                if (newStatus.equals("CANCELLED")) {
                    String reason = payload.get("cancellationReason");
                    request.setCancellationReason(reason != null ? reason : "No reason provided");
                }

                request.setStatus(newStatus);
                BookingRequest updatedRequest = bookingRepository.save(request);

                // If a Trip Post proposal was just ACCEPTED:
                // 1. Mark the TripPost as FULFILLED (off the job board)
                // 2. Auto-DECLINE all other PENDING proposals for the same TripPost
                if (newStatus.equals("ACCEPTED") && request.getTripPostId() != null) {
                    Optional<TripPost> tripPostOpt = tripPostRepository.findById(request.getTripPostId());
                    if (tripPostOpt.isPresent()) {
                        TripPost tripPost = tripPostOpt.get();
                        tripPost.setStatus("FULFILLED");
                        tripPostRepository.save(tripPost);
                    }

                    // Auto-decline all other PENDING proposals for this same trip post
                    List<BookingRequest> otherPending = bookingRepository
                            .findByTripPostIdAndStatusAndIdNot(request.getTripPostId(), "PENDING", requestId);
                    for (BookingRequest other : otherPending) {
                        other.setStatus("DECLINED");
                        bookingRepository.save(other);
                    }
                }

                return ResponseEntity.ok(updatedRequest);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update status: " + e.getMessage());
        }
    }
}
