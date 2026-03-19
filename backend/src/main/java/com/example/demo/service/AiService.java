package com.example.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateEnhancedText(String prompt) {
        try {
            // Build the Gemini API Request Body
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)))));

            String requestJson = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl + "?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                System.err.println("Error from Gemini API: " + response.body());
                return "AI Enhancement failed right now. Please try again.";
            }

            // Parse response
            JsonNode rootNode = objectMapper.readTree(response.body());
            JsonNode candidates = rootNode.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    return parts.get(0).path("text").asText();
                }
            }

            return "Could not extract text from AI.";

        } catch (Exception e) {
            e.printStackTrace();
            return "AI Enhancement failed due to an internal error.";
        }
    }

    public String enhanceProfileDescription(String rawKeywords) {
        String prompt = "Act as an expert travel copywriter. Keep it under 4 sentences. Make it engaging, professional, and warm. "
                +
                "Transform these raw notes into a high-quality 'About Me' biography for a local tour guide looking to attract international travelers: "
                + rawKeywords;
        return generateEnhancedText(prompt);
    }

    public String enhanceTripRequest(String rawKeywords) {
        String prompt = "Act as an expert travel copywriter. Keep it under 4 sentences. Make it clear and exciting. " +
                "Transform these raw notes into an engaging trip request written by a traveler who is looking for local guides to propose tours. Raw notes: "
                + rawKeywords;
        return generateEnhancedText(prompt);
    }
}
