package com.example.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class EmbeddingService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmbeddingService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String EMBEDDING_URL = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent";

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public float[] getEmbedding(String text) {
        try {

            Map<String, Object> requestBody = Map.of(
                    "content", Map.of(
                            "parts", List.of(
                                    Map.of("text", text))));

            String requestJson = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(EMBEDDING_URL + "?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                LOGGER.error("Gemini Embedding API error: {}", response.body());
                throw new RuntimeException("Failed to get embedding from Gemini API");
            }

            JsonNode rootNode = objectMapper.readTree(response.body());
            JsonNode valuesNode = rootNode.path("embedding").path("values");

            if (!valuesNode.isArray() || valuesNode.isEmpty()) {
                throw new RuntimeException("No embedding values returned from Gemini API");
            }

            float[] embedding = new float[valuesNode.size()];
            for (int i = 0; i < valuesNode.size(); i++) {
                embedding[i] = (float) valuesNode.get(i).asDouble();
            }

            LOGGER.info("Generated embedding with {} dimensions for text: {}...",
                    embedding.length, text.substring(0, Math.min(50, text.length())));

            return embedding;

        } catch (Exception e) {
            LOGGER.error("Error generating embedding: {}", e.getMessage());
            throw new RuntimeException("Embedding generation failed", e);
        }
    }

    public String toVectorString(float[] embedding) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < embedding.length; i++) {
            sb.append(embedding[i]);
            if (i < embedding.length - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
