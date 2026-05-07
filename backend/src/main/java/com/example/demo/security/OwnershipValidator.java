package com.example.demo.security;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

/**
 * OwnershipValidator — reusable security helper.
 *
 * Extracts the JWT from the Authorization header, decodes the email,
 * looks up the User in the DB, and returns it.
 *
 * Controllers call getRequester() to get the logged-in user, then
 * compare their ID against the ID in the URL/body to enforce ownership.
 */
@Component
public class OwnershipValidator {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    /**
     * Extracts and returns the User who made this HTTP request, based on their JWT token.
     * Throws 401 if the token is missing/invalid, or 404 if the user no longer exists.
     */
    public User getRequester(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String email;
        try {
            email = jwtUtil.extractEmail(token);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Authenticated user not found");
        }

        return user.get();
    }

    /**
     * Convenience method: gets the requester AND asserts they own the given ID.
     * Throws 403 Forbidden if the logged-in user's ID does not match the expectedOwnerId.
     */
    public User requireOwnership(HttpServletRequest request, Long expectedOwnerId) {
        User requester = getRequester(request);
        if (!requester.getId().equals(expectedOwnerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Access denied: you can only access your own data");
        }
        return requester;
    }
}
