package com.example.demo.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring AI configuration.
 *
 * <p>Registers two beans:
 * <ul>
 *   <li>{@link ChatMemory} — sliding window of last 20 messages per user session.
 *       Scoped by {@code sessionId} sent from the frontend.</li>
 *   <li>{@link ChatClient} — the central Spring AI entry point wired to Google GenAI
 *       (via your existing GEMINI_API_KEY) with memory and system prompt pre-configured.
 *       Each call automatically injects the user's conversation history.</li>
 * </ul>
 */
@Configuration
public class SpringAiConfig {

    /**
     * In-memory sliding-window chat memory.
     * Keeps the last 20 messages per unique conversationId (= user's sessionId).
     *
     * <p>Swap {@link InMemoryChatMemoryRepository} with a JDBC one
     * if you want memory to survive server restarts.
     */
    @Bean
    public ChatMemory chatMemory() {
        return MessageWindowChatMemory.builder()
                .chatMemoryRepository(new InMemoryChatMemoryRepository())
                .maxMessages(20)
                .build();
    }

    /**
     * Pre-built ChatClient with:
     * <ul>
     *   <li>System prompt — defines TravelMate AI persona and rules</li>
     *   <li>{@link MessageChatMemoryAdvisor} — automatically injects conversation
     *       history for the current sessionId before every Gemini call</li>
     * </ul>
     *
     * <p>The underlying model is Google GenAI (Gemini) configured via
     * {@code spring.ai.google.genai.api-key} — same {@code GEMINI_API_KEY}
     * you already have. No Vertex AI or GCP account needed.
     *
     * <p>Tools are NOT registered here — they are registered per-call
     * in {@link com.example.demo.agent.PolicyAgent} so Gemini can
     * dynamically decide which one to invoke.
     */
    @Bean
    public ChatClient chatClient(ChatClient.Builder builder, ChatMemory chatMemory) {
        return builder
                .defaultSystem("""
                        You are TravelMate AI — a smart, warm, and helpful assistant for the \
                        TravelMate travel platform. TravelMate connects travelers with \
                        local tour guides across India.

                        Your capabilities (use the right tool for each):
                        - Answer questions about TravelMate policies, cancellations, refunds, \
                          payments, and platform rules → use the policy search tool
                        - Search for available tour guides in a city or location → use the guide search tool
                        - Find open traveler trip posts by destination → use the open trip search tool
                        - Handle greetings and casual conversation warmly and briefly

                        IMPORTANT — Deep Links (always include these):
                        - When showing trip posts from the open trip tool, the tool returns lines \
                          ending with /post/{id}. Always include that path in your response \
                          exactly as given so the user can click to view the trip.
                        - When showing guides from the guide search tool, if the tool returns \
                          a guide profile path like /guide/{id}, include it in your response.

                        Rules you must always follow:
                        1. Always prefer calling a tool over guessing or hallucinating.
                        2. If a tool returns no data, say so honestly and suggest support@travelmate.com.
                        3. Keep answers concise — 2 to 4 sentences max unless detail is needed.
                        4. Never invent booking IDs, guide names, prices, or policy details.
                        5. Be warm and friendly — you represent TravelMate's brand.
                        6. Respond in plain text only — no markdown, no bullet points symbols, no asterisks.
                        7. IMPORTANT: If the user sends a simple acknowledgment or greeting (like 'okay', 'thanks', 'hello'), DO NOT call any tools. Just respond politely and conversationally.
                        """)
                .defaultAdvisors(
                        // Automatically injects the last N messages of this user's
                        // conversation history before every Gemini call.
                        // The conversationId = sessionId sent from the frontend.
                        MessageChatMemoryAdvisor.builder(chatMemory).build()
                )
                .build();
    }
}
