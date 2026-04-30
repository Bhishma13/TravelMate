package com.example.demo.agent;

import com.example.demo.agent.tools.GuideSearchTool;
import com.example.demo.agent.tools.OpenTripSearchTool;
import com.example.demo.agent.tools.PolicyRagTool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * PolicyAgent — Agent 1 orchestrator.
 *
 * <p>This is the <strong>ideal Spring AI implementation</strong>:
 * <ol>
 *   <li>User's question + conversation history (auto-injected by
 *       {@link org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor})
 *       is sent to Gemini via Spring AI's {@link ChatClient}.</li>
 *   <li>Gemini reads the {@code @Tool} descriptions on the three tool classes
 *       and <strong>decides on its own</strong> which tool to call — or none.</li>
 *   <li>Spring AI intercepts the tool call, executes the Java method, and
 *       feeds the result back to Gemini automatically.</li>
 *   <li>Gemini synthesizes a final human-readable answer.</li>
 *   <li>The full turn is saved to {@link ChatMemory} automatically by the advisor.</li>
 * </ol>
 *
 * <p><strong>No if/else intent routing. No manual tool dispatch.</strong>
 * Gemini handles all of that based on the @Tool descriptions.
 *
 * <p>Registered tools (Gemini picks which to call):
 * <ul>
 *   <li>{@link PolicyRagTool#searchPolicies} — PgVector RAG over TravelMate policy docs</li>
 *   <li>{@link GuideSearchTool#searchGuidesByLocation} — guide search from DB</li>
 *   <li>{@link OpenTripSearchTool#searchOpenTrips} — open trip posts search from DB</li>
 * </ul>
 */
@Component
public class PolicyAgent {

    private static final Logger LOGGER = LoggerFactory.getLogger(PolicyAgent.class);

    private final ChatClient chatClient;

    @Autowired
    private PolicyRagTool policyRagTool;

    @Autowired
    private OpenTripSearchTool openTripSearchTool;

    @Autowired
    private GuideSearchTool guideSearchTool;

    public PolicyAgent(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    /**
     * Process a user question with full Spring AI agentic capabilities.
     *
     * @param question  The user's question text.
     * @param sessionId A unique ID for this conversation (e.g., "user-42" or anonymous UUID).
     *                  Used by {@link ChatMemory} to isolate conversation history per user.
     * @return The agent's final synthesized answer from Gemini.
     */
    public String chat(String question, String sessionId) {
        LOGGER.info("[PolicyAgent] sessionId={} | question={}",
                sessionId, question.substring(0, Math.min(80, question.length())));

        try {
            String answer = chatClient.prompt()
                    // The user's current message
                    .user(question)
                    // Register all 3 tools — Gemini reads their @Tool descriptions
                    // and autonomously decides which (if any) to invoke
                    .tools(policyRagTool, guideSearchTool, openTripSearchTool)
                    // Tell the memory advisor which session this message belongs to.
                    // It will automatically inject the last 20 messages before the prompt
                    // and save this turn to memory after.
                    .advisors(advisors -> advisors
                            .param(ChatMemory.CONVERSATION_ID, sessionId))
                    // Blocking call — Spring AI handles the full agentic loop:
                    // prompt → Gemini → tool call → tool result → Gemini → final answer
                    .call()
                    .content();

            LOGGER.info("[PolicyAgent] sessionId={} | answer generated ({} chars)",
                    sessionId, answer != null ? answer.length() : 0);

            return answer != null ? answer
                    : "I'm sorry, I couldn't generate a response right now. "
                    + "Please try again or contact support@travelmate.com.";

        } catch (Exception e) {
            LOGGER.error("[PolicyAgent] Error for sessionId={}: {}", sessionId, e.getMessage(), e);
            return "Technical issue: " + e.getMessage();
        }
    }
}
