package com.example.demo.agent.tools;

import com.example.demo.model.GuideProfile;
import com.example.demo.repository.GuideProfileRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
public class GuideSearchTool {

    @Autowired
    private GuideProfileRepository guideProfileRepository;

    @Tool(description = """
            Search for available local tour guides in a specific city or location. \
            Use this when the user asks to find guides, see who is available in a \
            destination, or wants recommendations for a guide in a specific place. \
            If the user asks for ANY guides without specifying a location, pass "anywhere" as the location.
            """)
    public String searchGuidesByLocation(String location) {
        Page<GuideProfile> page;
        
        if (location == null || location.trim().isEmpty() || 
            location.equalsIgnoreCase("anywhere") || location.equalsIgnoreCase("any")) {
            // Fetch top 5 guides overall
            page = guideProfileRepository.findAll(PageRequest.of(0, 5));
            location = "any location";
        } else {
            // Fetch top 5 matching guides by location
            page = guideProfileRepository
                    .findByLocationContainingIgnoreCase(location, PageRequest.of(0, 5));
        }
        
        List<GuideProfile> guides = page.getContent();

        if (guides.isEmpty()) {
            return "No guides found in or near '" + location + "' right now. " +
                   "New guides join regularly — check back soon or post a trip request!";
        }

        StringBuilder sb = new StringBuilder(
                "Here are some guides available in " + location + ":\n"
        );
        for (GuideProfile g : guides) {
            String rating = (g.getRating() != null)
                    ? String.format("%.1f★", g.getRating()) : "Not rated yet";
            String experience = (g.getExperience() != null) ? g.getExperience() : "—";
            sb.append(String.format(
                    "  • %s | Location: %s | Rating: %s | Experience: %s\n",
                    g.getUser() != null ? g.getUser().getName() : "Guide #" + g.getId(),
                    g.getLocation(),
                    rating,
                    experience
            ));
        }
        sb.append("\nYou can view their full profiles on the TravelMate guides page.");
        return sb.toString();
    }
}
