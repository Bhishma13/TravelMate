package com.example.demo.repository;

import com.example.demo.model.BookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {

    // For a Guide to see their incoming requests
    List<BookingRequest> findByGuideId(Long guideId);

    // For a Traveler to see their outgoing requests
    List<BookingRequest> findByTravelerId(Long travelerId);
}
