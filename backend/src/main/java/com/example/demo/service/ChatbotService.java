package com.example.demo.service;

import com.example.demo.agent.PolicyAgent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * ChatbotService — thin orchestration layer between the HTTP controller
 * and the agentic {@link PolicyAgent}.
 *
 * <p>The old manual RAG pipeline (embed → PgVector cosine search → raw Gemini
 * HTTP call) has been replaced by the Spring AI agent loop inside PolicyAgent.
 * The PgVector RAG logic is still reused unchanged inside {@code PolicyRagTool}.
 */
@Service
public class ChatbotService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChatbotService.class);

    @Autowired
    private PolicyAgent policyAgent;

    /**
     * Process a question with full agentic capabilities.
     *
     * @param question  User's question text.
     * @param sessionId Conversation session ID for memory scoping.
     * @return Agent's synthesized answer.
     */
    public String askQuestion(String question, String sessionId) {
        LOGGER.info("Routing question to PolicyAgent | sessionId={}", sessionId);
        return policyAgent.chat(question, sessionId);
    }

    /**
     * Backward-compatible overload — used by any callers that don't yet
     * pass a sessionId.  Defaults to "anonymous" session (shared memory bucket,
     * not recommended for production multi-user use).
     */
    public String askQuestion(String question) {
        return askQuestion(question, "anonymous");
    }
}

