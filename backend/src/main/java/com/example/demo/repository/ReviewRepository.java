package com.example.demo.repository;

import com.example.demo.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Find all reviews left for a specific guide (used to calculate average rating)
    List<Review> findByGuideId(Long guideId);

    // Quick check if a booking has already been reviewed
    boolean existsByBookingRequestId(Long bookingRequestId);
}
