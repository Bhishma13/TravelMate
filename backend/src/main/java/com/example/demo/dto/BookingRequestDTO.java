package com.example.demo.dto;

public class BookingRequestDTO {
    private Long id;
    private Long travelerId;
    private String travelerName;
    private String travelerPhone;
    private Long guideId;
    private String status;
    private String tripDates;

    public BookingRequestDTO() {
    }

    public BookingRequestDTO(Long id, Long travelerId, String travelerName, String travelerPhone, Long guideId,
            String status, String tripDates) {
        this.id = id;
        this.travelerId = travelerId;
        this.travelerName = travelerName;
        this.travelerPhone = travelerPhone;
        this.guideId = guideId;
        this.status = status;
        this.tripDates = tripDates;
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

    public String getTravelerName() {
        return travelerName;
    }

    public void setTravelerName(String travelerName) {
        this.travelerName = travelerName;
    }

    public String getTravelerPhone() {
        return travelerPhone;
    }

    public void setTravelerPhone(String travelerPhone) {
        this.travelerPhone = travelerPhone;
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
