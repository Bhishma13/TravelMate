package com.example.demo.repository;

import com.example.demo.model.TripPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripPostRepository extends JpaRepository<TripPost, Long> {

    // For a traveler to see all their own posts
    List<TripPost> findByTravelerIdOrderByCreatedAtDesc(Long travelerId);

    // For the Job Board (Guides looking for work)
    List<TripPost> findByStatusOrderByCreatedAtDesc(String status);
}
