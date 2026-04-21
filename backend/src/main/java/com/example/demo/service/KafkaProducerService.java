package com.example.demo.service;

import com.example.demo.event.UserRegistrationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private static final Logger LOGGER = LoggerFactory.getLogger(KafkaProducerService.class);
    private static final String TOPIC = "user-registration-events";

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void sendRegistrationEvent(UserRegistrationEvent event) {
        LOGGER.info(String.format("Producing User Registration Event for email: %s", event.getEmail()));
        kafkaTemplate.send(TOPIC, event);
    }
}
