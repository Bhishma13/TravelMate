package com.example.demo.service;

import com.example.demo.model.KnowledgeChunk;
import com.example.demo.repository.KnowledgeChunkRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChatbotService.class);

    @Autowired
    private EmbeddingService embeddingService;

    @Autowired
    private KnowledgeChunkRepository knowledgeChunkRepository;

    @Autowired
    private AiService aiService;

    public String askQuestion(String question) {
        try {
            LOGGER.info("Processing chatbot question: {}", question);

            float[] queryEmbedding = embeddingService.getEmbedding(question);
            String queryVector = embeddingService.toVectorString(queryEmbedding);

            List<KnowledgeChunk> relevantChunks = knowledgeChunkRepository.findMostSimilar(queryVector);

            if (relevantChunks.isEmpty()) {
                return "I'm sorry, I don't have enough information to answer that question. Please contact TravelMate support at support@travelmate.com for further assistance.";
            }

            String context = relevantChunks.stream()
                    .map(KnowledgeChunk::getContent)
                    .collect(Collectors.joining("\n\n"));

            String prompt = buildRagPrompt(question, context);

            String answer = aiService.generateEnhancedText(prompt);

            LOGGER.info("Generated answer for question: {}...", question.substring(0, Math.min(50, question.length())));
            return answer;

        } catch (Exception e) {
            LOGGER.error("Error processing chatbot question: {}", e.getMessage(), e);
            return "I'm experiencing a technical issue right now. Please try again later or contact support@travelmate.com.";
        }
    }

    private String buildRagPrompt(String question, String context) {
        return """
                You are TravelMate AI Assistant — a friendly, helpful chatbot for the TravelMate travel platform.

                RULES:
                1. Answer the user's question ONLY using the context provided below.
                2. If the answer is NOT in the context, politely say you don't have that information and suggest contacting support@travelmate.com.
                3. Be concise, friendly, and helpful. Keep answers to 2-4 sentences.
                4. Do NOT make up information that is not in the context.
                5. Do NOT use markdown formatting in your response — reply in plain text.

                CONTEXT (from TravelMate's official policies and FAQs):
                %s

                USER QUESTION: %s

                YOUR ANSWER:
                """
                .formatted(context, question);
    }
}
