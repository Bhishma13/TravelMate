package com.example.demo.service;

import com.example.demo.event.UserRegistrationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailNotificationConsumer.class);

    @Autowired
    private JavaMailSender mailSender;

    @KafkaListener(topics = "user-registration-events", groupId = "travelmate-email-group")
    public void consume(UserRegistrationEvent event) {
        LOGGER.info(String.format("Consumed User Registration Event for email: %s", event.getEmail()));
        try {
            sendWelcomeEmail(event);
            LOGGER.info(String.format("Welcome email successfully sent to: %s", event.getEmail()));
        } catch (Exception e) {
            LOGGER.error(String.format("Failed to send welcome email to %s: %s", event.getEmail(), e.getMessage()));
        }
    }

    private void sendWelcomeEmail(UserRegistrationEvent event) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(event.getEmail());
        message.setSubject("Welcome to TravelMate!");

        String name = (event.getFirstName() != null && !event.getFirstName().isEmpty())
                ? event.getFirstName()
                : "Traveler";

        message.setText("Hi " + name + ",\n\n"
                + "Welcome to TravelMate! We are thrilled to have you onboard.\n\n"
                + "Your registration is now complete. Feel free to explore trips, message guides, and start your journey.\n\n"
                + "Best Regards,\n"
                + "The TravelMate Team");

        mailSender.send(message);
    }
}
