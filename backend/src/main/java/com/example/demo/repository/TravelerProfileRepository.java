package com.example.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.TravelerProfile;
import com.example.demo.model.User;

import java.util.Optional;

public interface TravelerProfileRepository extends JpaRepository<TravelerProfile, Long> {
    Optional<TravelerProfile> findByUser(User user);

    Page<TravelerProfile> findByLocationContainingIgnoreCase(String location, Pageable pageable);
}
