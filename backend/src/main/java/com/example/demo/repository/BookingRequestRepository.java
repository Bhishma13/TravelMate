package com.example.demo.repository;

import com.example.demo.model.BookingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {

    
    List<BookingRequest> findByGuideId(Long guideId);

    
    List<BookingRequest> findByTravelerId(Long travelerId);

    
    
    List<BookingRequest> findByTripPostIdAndStatusAndIdNot(Long tripPostId, String status, Long acceptedId);
}
