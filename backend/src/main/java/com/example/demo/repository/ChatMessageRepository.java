package com.example.demo.repository;

import com.example.demo.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Fetch all messages for a specific trip, ordered by when they were sent
    List<ChatMessage> findByBookingRequestIdOrderByTimestampAsc(Long bookingRequestId);

}
