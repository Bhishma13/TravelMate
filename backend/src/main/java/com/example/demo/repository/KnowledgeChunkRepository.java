package com.example.demo.repository;

import com.example.demo.model.KnowledgeChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeChunkRepository extends JpaRepository<KnowledgeChunk, Long> {

    @Query(value = "SELECT * FROM knowledge_chunks ORDER BY embedding <=> CAST(:queryVector AS vector) LIMIT :topK", nativeQuery = true)
    List<KnowledgeChunk> findMostSimilar(@Param("queryVector") String queryVector, @Param("topK") int topK);
}
