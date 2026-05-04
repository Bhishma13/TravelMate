package com.example.demo.service;

import com.example.demo.event.UserRegistrationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class EmailNotificationConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailNotificationConsumer.class);

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    @KafkaListener(topics = "user-registration-events", groupId = "travelmate-email-group")
    public void consume(UserRegistrationEvent event) {
        LOGGER.info(String.format("Consumed User Registration Event for email: %s", event.getEmail()));
        try {
            sendWelcomeEmail(event);
            LOGGER.info(String.format("Welcome email successfully sent to: %s via SendGrid API", event.getEmail()));
        } catch (Exception e) {
            LOGGER.error(String.format("Failed to send welcome email to %s: %s", event.getEmail(), e.getMessage()));
        }
    }

    private void sendWelcomeEmail(UserRegistrationEvent event) {
        String url = "https://api.sendgrid.com/v3/mail/send";

        String name = (event.getFirstName() != null && !event.getFirstName().isEmpty())
                ? event.getFirstName()
                : "Traveler";

        // Construct SendGrid V3 JSON Payload
        Map<String, Object> body = new HashMap<>();
        
        Map<String, String> from = new HashMap<>();
        from.put("email", fromEmail);
        from.put("name", "TravelMate Team");
        body.put("from", from);

        Map<String, Object> personalizations = new HashMap<>();
        List<Map<String, String>> to = new ArrayList<>();
        Map<String, String> recipient = new HashMap<>();
        recipient.put("email", event.getEmail());
        to.add(recipient);
        personalizations.put("to", to);
        personalizations.put("subject", "Welcome to TravelMate!");
        body.put("personalizations", Collections.singletonList(personalizations));

        List<Map<String, String>> content = new ArrayList<>();
        Map<String, String> textContent = new HashMap<>();
        textContent.put("type", "text/plain");
        textContent.put("value", "Hi " + name + ",\n\n"
                + "Welcome to TravelMate! We are thrilled to have you onboard.\n\n"
                + "Your registration is now complete. Feel free to explore trips, message guides, and start your journey.\n\n"
                + "Best Regards,\n"
                + "The TravelMate Team");
        content.add(textContent);
        body.put("content", content);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + sendGridApiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("SendGrid API returned error: " + response.getBody());
            }
        } catch (Exception e) {
            LOGGER.error("Error calling SendGrid API", e);
            throw e;
        }
    }
}
