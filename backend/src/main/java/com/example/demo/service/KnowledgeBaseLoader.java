package com.example.demo.service;

import com.example.demo.model.KnowledgeChunk;
import com.example.demo.repository.KnowledgeChunkRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Service
public class KnowledgeBaseLoader {

    private static final Logger LOGGER = LoggerFactory.getLogger(KnowledgeBaseLoader.class);

    @Autowired
    private KnowledgeChunkRepository knowledgeChunkRepository;

    @Autowired
    private EmbeddingService embeddingService;

    @PostConstruct
    public void loadKnowledgeBase() {

        long existingCount = knowledgeChunkRepository.count();
        if (existingCount > 0) {
            LOGGER.info("Knowledge base already loaded with {} chunks. Skipping.", existingCount);
            return;
        }

        LOGGER.info("Loading knowledge base into PgVector...");

        try {

            ClassPathResource resource = new ClassPathResource("knowledge/travelmate-policies.txt");
            String fullText;
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                fullText = reader.lines().collect(Collectors.joining("\n"));
            }

            String[] chunks = fullText.split("---");

            int savedCount = 0;
            for (String chunk : chunks) {
                String trimmedChunk = chunk.trim();
                if (trimmedChunk.isEmpty()) {
                    continue;
                }

                try {

                    float[] embedding = embeddingService.getEmbedding(trimmedChunk);
                    String vectorString = embeddingService.toVectorString(embedding);

                    knowledgeChunkRepository.insertChunk(trimmedChunk, vectorString);

                    savedCount++;
                    LOGGER.info("Indexed chunk {}: {}...", savedCount,
                            trimmedChunk.substring(0, Math.min(60, trimmedChunk.length())));

                    Thread.sleep(500);

                } catch (Exception e) {
                    LOGGER.error("Failed to index chunk: {}...",
                            trimmedChunk.substring(0, Math.min(50, trimmedChunk.length())), e);
                }
            }

            LOGGER.info("Knowledge base loading complete. {} chunks indexed.", savedCount);

        } catch (Exception e) {
            LOGGER.error("Failed to load knowledge base file: {}", e.getMessage(), e);
        }
    }
}
