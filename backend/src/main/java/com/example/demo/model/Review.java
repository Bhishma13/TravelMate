package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long bookingRequestId; // Links to the specific trip

    @Column(nullable = false)
    private Long travelerId;

    @Column(nullable = false)
    private Long guideId;

    @Column(nullable = false)
    private Integer rating; // 1 to 5 stars

    @Column(length = 2000)
    private String comment;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Review(Long bookingRequestId, Long travelerId, Long guideId, Integer rating, String comment) {
        this.bookingRequestId = bookingRequestId;
        this.travelerId = travelerId;
        this.guideId = guideId;
        this.rating = rating;
        this.comment = comment;
    }
}
