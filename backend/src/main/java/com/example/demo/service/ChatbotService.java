package com.example.demo.service;

import com.example.demo.agent.PolicyAgent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ChatbotService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChatbotService.class);

    @Autowired
    private PolicyAgent policyAgent;

    
    public String askQuestion(String question, String sessionId) {
        LOGGER.info("Routing question to PolicyAgent | sessionId={}", sessionId);
        return policyAgent.chat(question, sessionId);
    }

    
    public String askQuestion(String question) {
        return askQuestion(question, "anonymous");
    }
}

