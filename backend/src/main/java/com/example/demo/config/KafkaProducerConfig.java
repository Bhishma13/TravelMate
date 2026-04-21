package com.example.demo.config;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaProducerConfig {

    @Value("${KAFKA_URL}")
    private String bootstrapServers;

    @Value("${KAFKA_USERNAME}")
    private String kafkaUsername;

    @Value("${KAFKA_PASSWORD}")
    private String kafkaPassword;

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);

        // Aiven SASL_SSL Security
        config.put("security.protocol", "SASL_SSL");
        config.put("sasl.mechanism", "SCRAM-SHA-256");
        config.put("sasl.jaas.config",
                "org.apache.kafka.common.security.scram.ScramLoginModule required username=\""
                        + kafkaUsername + "\" password=\"" + kafkaPassword + "\";");
        config.put("ssl.endpoint.identification.algorithm", "");

        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
