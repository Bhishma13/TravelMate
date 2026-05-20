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

    
    public String chat(String question, String sessionId) {
        LOGGER.info("[PolicyAgent] sessionId={} | question={}",
                sessionId, question.substring(0, Math.min(80, question.length())));

        try {
            String answer = chatClient.prompt()
                    
                    .user(question)
                    
                    
                    .tools(policyRagTool, guideSearchTool, openTripSearchTool)
                    
                    
                    
                    .advisors(advisors -> advisors
                            .param(ChatMemory.CONVERSATION_ID, sessionId))
                    
                    
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
