package com.example.demo.controller;

import com.example.demo.dto.ChatRequest;
import com.example.demo.dto.ChatResponse;
import com.example.demo.service.ChatbotService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChatbotController.class);

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> askQuestion(@RequestBody ChatRequest request) {
        LOGGER.info("Chatbot request received: {}", request.getQuestion());

        if (request.getQuestion() == null || request.getQuestion().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ChatResponse("Please provide a question."));
        }

        String answer = chatbotService.askQuestion(request.getQuestion().trim());
        return ResponseEntity.ok(new ChatResponse(answer));
    }

    @Autowired
    private com.example.demo.repository.KnowledgeChunkRepository knowledgeChunkRepository;

    @Autowired
    private com.example.demo.service.EmbeddingService embeddingService;

    @GetMapping("/debug")
    public ResponseEntity<String> debugDatabaseSave() {
        try {
            long existing = knowledgeChunkRepository.count();
            float[] queryEmbedding = embeddingService.getEmbedding("What is TravelMate?");
            String queryVector = embeddingService.toVectorString(queryEmbedding);

            java.util.List<com.example.demo.model.KnowledgeChunk> chunks = knowledgeChunkRepository
                    .findMostSimilar(queryVector);

            StringBuilder result = new StringBuilder(
                    "Total in DB: " + existing + "\\n\\nTOP 3 RESULTS FOR 'What is TravelMate?':\\n");
            for (com.example.demo.model.KnowledgeChunk c : chunks) {
                result.append("--- CHUNK ID ").append(c.getId()).append(" ---\\n");
                result.append("CONTENT: ").append(c.getContent()).append("\\n\\n");
            }
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            String errorMsg = "Error: " + e.getClass().getName() + " - " + e.getMessage();
            if (e.getCause() != null) {
                errorMsg += " | Cause: " + e.getCause().getMessage();
            }
            return ResponseEntity.status(500).body(errorMsg);
        }
    }
}
