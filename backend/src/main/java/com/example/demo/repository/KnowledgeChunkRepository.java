package com.example.demo.repository;

import com.example.demo.model.KnowledgeChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeChunkRepository extends JpaRepository<KnowledgeChunk, Long> {

    @Query(value = "SELECT id, content, CAST(embedding AS text) AS embedding FROM knowledge_chunks ORDER BY embedding <=> CAST(:queryVector AS vector) LIMIT 3", nativeQuery = true)
    List<KnowledgeChunk> findMostSimilar(@Param("queryVector") String queryVector);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO knowledge_chunks (content, embedding) VALUES (:content, CAST(:embedding AS vector))", nativeQuery = true)
    void insertChunk(@Param("content") String content, @Param("embedding") String embedding);
}
