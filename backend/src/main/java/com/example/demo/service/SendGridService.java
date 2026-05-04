package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class SendGridService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SendGridService.class);

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendEmail(String toEmail, String subject, String contentValue, boolean isHtml) {
        String url = "https://api.sendgrid.com/v3/mail/send";

        // Construct SendGrid V3 JSON Payload
        Map<String, Object> body = new HashMap<>();
        
        Map<String, String> from = new HashMap<>();
        from.put("email", fromEmail);
        from.put("name", "TravelMate Team");
        body.put("from", from);

        Map<String, Object> personalizations = new HashMap<>();
        List<Map<String, String>> to = new ArrayList<>();
        Map<String, String> recipient = new HashMap<>();
        recipient.put("email", toEmail);
        to.add(recipient);
        personalizations.put("to", to);
        personalizations.put("subject", subject);
        body.put("personalizations", Collections.singletonList(personalizations));

        List<Map<String, String>> content = new ArrayList<>();
        Map<String, String> emailContent = new HashMap<>();
        emailContent.put("type", isHtml ? "text/html" : "text/plain");
        emailContent.put("value", contentValue);
        content.add(emailContent);
        body.put("content", content);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + sendGridApiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                LOGGER.error("SendGrid API error: {}", response.getBody());
                throw new RuntimeException("Failed to send email via SendGrid");
            }
        } catch (Exception e) {
            LOGGER.error("Error calling SendGrid API", e);
            throw e;
        }
    }
}
