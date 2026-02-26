package com.example.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.GuideProfile;
import java.util.Optional;

public interface GuideProfileRepository extends JpaRepository<GuideProfile, Long> {
    Optional<GuideProfile> findByUser(com.example.demo.model.User user);

    Page<GuideProfile> findByLocationContainingIgnoreCase(String location, Pageable pageable);
}
