package com.example.demo.controller;

import com.example.demo.model.BookingRequest;
import com.example.demo.model.ChatMessage;
import com.example.demo.repository.BookingRequestRepository;
import com.example.demo.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private BookingRequestRepository bookingRequestRepository;

    
    @MessageMapping("/chat.sendMessage")
    public void processMessage(@Payload ChatMessage chatMessage) {
        
        Optional<BookingRequest> bookingOpt = bookingRequestRepository.findById(chatMessage.getBookingRequestId());
        if (bookingOpt.isEmpty())
            return;
        String status = bookingOpt.get().getStatus();
        if (!status.equals("PENDING") && !status.equals("ACCEPTED")) {
            return;
        }
        BookingRequest booking = bookingOpt.get();
        if ((chatMessage.getSenderId().equals(booking.getTravelerId())
                && chatMessage.getReceiverId().equals(booking.getGuideId())) ||
                (chatMessage.getSenderId().equals(booking.getGuideId())
                        && chatMessage.getReceiverId().equals(booking.getTravelerId()))) {

            ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

            messagingTemplate.convertAndSendToUser(
                    String.valueOf(chatMessage.getReceiverId()), "/queue/messages",
                    savedMessage);
        }
    }

    @GetMapping("/api/messages/{bookingRequestId}")
    public ResponseEntity<?> getChatHistory(@PathVariable Long bookingRequestId, @RequestParam Long userId) {
        Optional<BookingRequest> bookingOpt = bookingRequestRepository.findById(bookingRequestId);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BookingRequest booking = bookingOpt.get();
        String status = booking.getStatus();
        if (!status.equals("PENDING") && !status.equals("ACCEPTED")) {
            return ResponseEntity.badRequest()
                    .body("Chat is only available for active (pending or accepted) bookings.");
        }
        if (!userId.equals(booking.getTravelerId()) && !userId.equals(booking.getGuideId())) {
            return ResponseEntity.status(403).body("You are not authorized to view this chat.");
        }

        List<ChatMessage> messages = chatMessageRepository.findByBookingRequestIdOrderByTimestampAsc(bookingRequestId);
        return ResponseEntity.ok(messages);
    }
}
