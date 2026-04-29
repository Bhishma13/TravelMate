package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    private String question;

    /**
     * Unique session identifier for conversation memory.
     * The frontend should pass the logged-in user's ID (as a String) or a
     * randomly generated browser session UUID for anonymous users.
     * Defaults to "anonymous" if not provided.
     */
    private String sessionId = "anonymous";
}

