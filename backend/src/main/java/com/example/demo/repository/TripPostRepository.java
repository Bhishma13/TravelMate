package com.example.demo.repository;

import com.example.demo.model.TripPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripPostRepository extends JpaRepository<TripPost, Long> {

    
    List<TripPost> findByTravelerIdOrderByCreatedAtDesc(Long travelerId);

    
    List<TripPost> findByStatusOrderByCreatedAtDesc(String status);

    
    List<TripPost> findByDestinationContainingIgnoreCaseAndStatusOrderByCreatedAtDesc(
            String destination, String status);
}
