package com.example.demo.agent.tools;

import com.example.demo.model.KnowledgeChunk;
import com.example.demo.repository.KnowledgeChunkRepository;
import com.example.demo.service.EmbeddingService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Spring AI Tool — wraps the existing PgVector RAG pipeline as an agent tool.
 *
 * <p>This is the key bridge between the old system and the new agentic one.
 * Instead of always running RAG, Gemini now <em>decides</em> to call this tool
 * only when the question is about TravelMate policies or FAQs.
 *
 * <p>The existing {@link EmbeddingService} and {@link KnowledgeChunkRepository}
 * are reused unchanged — zero regression risk.
 */
@Component
public class PolicyRagTool {

    @Autowired
    private EmbeddingService embeddingService;

    @Autowired
    private KnowledgeChunkRepository knowledgeChunkRepository;

    @Tool(description = """
            Search TravelMate's official policy documents and FAQs to answer \
            questions about cancellations, payments, refunds, booking rules, \
            safety guidelines, guide requirements, platform terms, or any other \
            TravelMate-specific policies. Use this tool for any policy-related question.
            """)
    public String searchPolicies(String question) {
        try {
            // Reuse the existing embedding + PgVector similarity pipeline
            float[] queryEmbedding = embeddingService.getEmbedding(question);
            String queryVector = embeddingService.toVectorString(queryEmbedding);

            List<KnowledgeChunk> relevantChunks =
                    knowledgeChunkRepository.findMostSimilar(queryVector);

            if (relevantChunks.isEmpty()) {
                return "No matching policy found for: '" + question + "'. " +
                       "Please contact support@travelmate.com for further help.";
            }

            // Return the raw relevant context — Gemini will synthesize the final answer
            return relevantChunks.stream()
                    .map(KnowledgeChunk::getContent)
                    .collect(Collectors.joining("\n\n---\n\n"));

        } catch (Exception e) {
            return "Policy search temporarily unavailable. Please try again shortly.";
        }
    }
}
