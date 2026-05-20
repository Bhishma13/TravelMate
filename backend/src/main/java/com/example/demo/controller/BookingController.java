package com.example.demo.controller;

import com.example.demo.dto.BookingRequestDTO;
import com.example.demo.model.BookingRequest;
import com.example.demo.model.TripPost;
import com.example.demo.model.User;
import com.example.demo.repository.BookingRequestRepository;
import com.example.demo.repository.TripPostRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.OwnershipValidator;
import jakarta.servlet.http.HttpServletRequest;
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

    @Autowired
    private OwnershipValidator ownershipValidator;

    
    
    @PostMapping("/request")
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> payload,
            HttpServletRequest httpRequest) {
        try {
            Long travelerId = Long.parseLong(payload.get("travelerId").toString());

            
            ownershipValidator.requireOwnership(httpRequest, travelerId);

            Long guideId = Long.parseLong(payload.get("guideId").toString());
            String tripDates = payload.get("tripDates").toString();

            
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

    
    
    @GetMapping("/guide/{guideId}")
    public ResponseEntity<?> getGuideRequests(@PathVariable Long guideId,
            HttpServletRequest httpRequest) {

        
        ownershipValidator.requireOwnership(httpRequest, guideId);

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
                        req.getTripPostId());
                dto.setCancellationReason(req.getCancellationReason());
                dtoList.add(dto);
            }
        }

        return ResponseEntity.ok(dtoList);
    }

    
    
    @GetMapping("/traveler/{travelerId}")
    public ResponseEntity<?> getTravelerRequests(@PathVariable Long travelerId,
            HttpServletRequest httpRequest) {

        
        ownershipValidator.requireOwnership(httpRequest, travelerId);

        List<BookingRequest> requests = bookingRepository.findByTravelerId(travelerId);
        List<BookingRequestDTO> dtoList = new ArrayList<>();

        for (BookingRequest req : requests) {
            Optional<User> guideOpt = userRepository.findById(req.getGuideId());
            if (guideOpt.isPresent()) {
                User guide = guideOpt.get();
                BookingRequestDTO dto = new BookingRequestDTO(
                        req.getId(),
                        req.getTravelerId(),
                        guide.getName(),
                        guide.getPhone(),
                        req.getGuideId(),
                        req.getStatus(),
                        req.getTripDates(),
                        req.getTripPostId());
                dto.setCancellationReason(req.getCancellationReason());
                dtoList.add(dto);
            }
        }

        return ResponseEntity.ok(dtoList);
    }

    
    
    @PutMapping("/request/{requestId}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long requestId,
            @RequestBody Map<String, String> payload,
            HttpServletRequest httpRequest) {
        try {
            String newStatus = payload.get("status");
            if (newStatus == null || (!newStatus.equals("ACCEPTED") && !newStatus.equals("DECLINED")
                    && !newStatus.equals("COMPLETED") && !newStatus.equals("CANCELLED"))) {
                return ResponseEntity.badRequest().body("Invalid status");
            }

            Optional<BookingRequest> requestOpt = bookingRepository.findById(requestId);
            if (requestOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            BookingRequest bookingRequest = requestOpt.get();

            
            User requester = ownershipValidator.getRequester(httpRequest);
            boolean isTraveler = requester.getId().equals(bookingRequest.getTravelerId());
            boolean isGuide = requester.getId().equals(bookingRequest.getGuideId());

            if (!isTraveler && !isGuide) {
                return ResponseEntity.status(403).body("Access denied: you are not part of this booking");
            }

            
            
            if (newStatus.equals("ACCEPTED") && bookingRequest.getTripPostId() != null) {
                List<BookingRequest> otherAccepted = bookingRepository
                        .findByTripPostIdAndStatusAndIdNot(bookingRequest.getTripPostId(), "ACCEPTED", requestId);
                if (!otherAccepted.isEmpty()) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "You have already chosen a guide for this trip."));
                }
            }

            
            if (newStatus.equals("CANCELLED")) {
                String reason = payload.get("cancellationReason");
                bookingRequest.setCancellationReason(reason != null ? reason : "No reason provided");
            }

            bookingRequest.setStatus(newStatus);
            BookingRequest updatedRequest = bookingRepository.save(bookingRequest);

            
            
            
            if (newStatus.equals("ACCEPTED") && bookingRequest.getTripPostId() != null) {
                Optional<TripPost> tripPostOpt = tripPostRepository.findById(bookingRequest.getTripPostId());
                if (tripPostOpt.isPresent()) {
                    TripPost tripPost = tripPostOpt.get();
                    tripPost.setStatus("FULFILLED");
                    tripPostRepository.save(tripPost);
                }

                List<BookingRequest> otherPending = bookingRepository
                        .findByTripPostIdAndStatusAndIdNot(bookingRequest.getTripPostId(), "PENDING", requestId);
                for (BookingRequest other : otherPending) {
                    other.setStatus("DECLINED");
                    bookingRepository.save(other);
                }
            }

            return ResponseEntity.ok(updatedRequest);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update status: " + e.getMessage());
        }
    }
}
