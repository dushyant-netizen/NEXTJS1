"use server";

import { openai } from "@/lib/openai";
import { pool } from "@/lib/db"; 

export async function performSemanticSearch(query: string) {
  try {
    // 1. Generate embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    
    const queryVector = embeddingResponse.data[0].embedding;
    const vectorString = `[${queryVector.join(',')}]`;

    // 2. Query Postgres
    const result = await pool.query(
      `SELECT id, name, description, 1 - (embedding <=> $1::vector) AS similarity
       FROM "Product"
       WHERE 1 - (embedding <=> $1::vector) > 0.5
       ORDER BY similarity DESC
       LIMIT 5`,
      [vectorString]
    );

    return result.rows;
  } catch (error) {
    console.error("Semantic Search Error:", error);
    return [];
  }
}