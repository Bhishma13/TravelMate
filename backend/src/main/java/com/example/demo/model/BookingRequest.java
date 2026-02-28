package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "booking_requests")
public class BookingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long travelerId;

    @Column(nullable = false)
    private Long guideId;

    @Column(nullable = false)
    private String status; // e.g., "PENDING", "ACCEPTED", "DECLINED"

    @Column(nullable = false)
    private String tripDates;

    // Default constructor
    public BookingRequest() {
        this.status = "PENDING";
    }

    public BookingRequest(Long travelerId, Long guideId, String tripDates) {
        this.travelerId = travelerId;
        this.guideId = guideId;
        this.tripDates = tripDates;
        this.status = "PENDING";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTravelerId() {
        return travelerId;
    }

    public void setTravelerId(Long travelerId) {
        this.travelerId = travelerId;
    }

    public Long getGuideId() {
        return guideId;
    }

    public void setGuideId(Long guideId) {
        this.guideId = guideId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTripDates() {
        return tripDates;
    }

    public void setTripDates(String tripDates) {
        this.tripDates = tripDates;
    }
}
