package com.example.demo.agent.tools;

import com.example.demo.model.TripPost;
import com.example.demo.model.User;
import com.example.demo.repository.TripPostRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;


@Component
public class OpenTripSearchTool {

    @Autowired
    private TripPostRepository tripPostRepository;

    @Autowired
    private UserRepository userRepository;

    @Tool(description = """
            Search for open traveler trip posts by destination or location. \
            Use this when the user asks about open trips, travel plans, \
            trip companions, or wants to know if anyone is going to a specific place. \
            If the user asks for ANY open trips without specifying a destination, pass "anywhere" as the destination. \
            Returns a list of open trips with direct links so users can view and connect.
            """)
    public String searchOpenTrips(String destination) {
        List<TripPost> trips;
        
        // Handle cases where the AI guesses "anywhere" or leaves it empty
        if (destination == null || destination.trim().isEmpty() || 
            destination.equalsIgnoreCase("anywhere") || destination.equalsIgnoreCase("any")) {
            // Query all OPEN trips regardless of destination
            trips = tripPostRepository.findByStatusOrderByCreatedAtDesc("OPEN");
            destination = "any location";
        } else {
            // Query only OPEN trips matching the destination keyword
            trips = tripPostRepository
                    .findByDestinationContainingIgnoreCaseAndStatusOrderByCreatedAtDesc(
                            destination, "OPEN");
        }

        if (trips.isEmpty()) {
            return "No open trips found for '" + destination + "' right now. "
                    + "You can post your own trip on the Open Trips page and "
                    + "let guides or fellow travelers find you!";
        }

        // Limit to top 5 results
        List<TripPost> topTrips = trips.size() > 5 ? trips.subList(0, 5) : trips;

        StringBuilder sb = new StringBuilder(
                "Found " + trips.size() + " open trip(s) to " + destination + ":\n\n"
        );

        for (TripPost trip : topTrips) {
            // Try to get the traveler's first name for a friendly display
            String travelerName = "A traveler";
            Optional<User> user = userRepository.findById(trip.getTravelerId());
            if (user.isPresent() && user.get().getName() != null) {
                // Use first name only for privacy
                String[] nameParts = user.get().getName().trim().split("\\s+");
                travelerName = nameParts[0];
            }

            sb.append(String.format(
                    "• %s is going to %s | Dates: %s\n  %s\n  /post/%d\n\n",
                    travelerName,
                    trip.getDestination(),
                    trip.getTripDates(),
                    truncate(trip.getDescription(), 80),
                    trip.getId()
            ));
        }

        if (trips.size() > 5) {
            sb.append("...and ").append(trips.size() - 5).append(" more on the Open Trips page.");
        }

        return sb.toString();
    }

    /** Truncate description to keep AI response concise. */
    private String truncate(String text, int maxLength) {
        if (text == null) return "";
        return text.length() <= maxLength ? text : text.substring(0, maxLength) + "...";
    }
}
