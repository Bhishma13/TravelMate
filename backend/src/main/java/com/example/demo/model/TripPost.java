package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "trip_posts")
@Data
@NoArgsConstructor
public class TripPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long travelerId;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private String tripDates;

    @Column(nullable = false, length = 1000)
    private String description;

    // OPEN, IN_PROGRESS, FULFILLED, CANCELLED
    @Column(nullable = false)
    private String status = "OPEN";

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public TripPost(Long travelerId, String destination, String tripDates, String description) {
        this.travelerId = travelerId;
        this.destination = destination;
        this.tripDates = tripDates;
        this.description = description;
    }
}
