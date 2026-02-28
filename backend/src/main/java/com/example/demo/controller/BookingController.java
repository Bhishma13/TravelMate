package com.example.demo.controller;

import com.example.demo.dto.BookingRequestDTO;
import com.example.demo.model.BookingRequest;
import com.example.demo.model.User;
import com.example.demo.repository.BookingRequestRepository;
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
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingRequestRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new booking request
    @PostMapping("/request")
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> payload) {
        try {
            Long travelerId = Long.parseLong(payload.get("travelerId").toString());
            Long guideId = Long.parseLong(payload.get("guideId").toString());
            String tripDates = payload.get("tripDates").toString();

            BookingRequest request = new BookingRequest(travelerId, guideId, tripDates);
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
                        req.getTripDates());
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
                        req.getTripDates());
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
            if (newStatus == null || (!newStatus.equals("ACCEPTED") && !newStatus.equals("DECLINED"))) {
                return ResponseEntity.badRequest().body("Invalid status");
            }

            Optional<BookingRequest> requestOpt = bookingRepository.findById(requestId);
            if (requestOpt.isPresent()) {
                BookingRequest request = requestOpt.get();
                request.setStatus(newStatus);
                BookingRequest updatedRequest = bookingRepository.save(request);
                return ResponseEntity.ok(updatedRequest);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update status: " + e.getMessage());
        }
    }
}
