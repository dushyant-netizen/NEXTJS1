"use server";

import { openai } from "@/lib/openai";
import { pool } from "@/lib/db"; 

export async function performSemanticSearch(query: string) {
  try {
    // 1. Generate embedding vector from OpenAI
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    
    const queryVector = embeddingResponse.data[0].embedding;
    const vectorString = `[${queryVector.join(',')}]`;

    // 2. Query Postgres with correct Prisma Column Mappings
    // Changed "name" to "title" and added "price", "slug", "mainImage"
    const result = await pool.query(
      `SELECT 
        id, 
        title, 
        description, 
        price, 
        slug, 
        "mainImage", 
        "inStock",
        1 - (embedding <=> $1::vector) AS similarity
       FROM "Product"
       WHERE 1 - (embedding <=> $1::vector) > 0.3 -- Lowered slightly to 0.3 to find broader semantic relations
       ORDER BY similarity DESC
       LIMIT 8`,
      [vectorString]
    );

    return result.rows;
  } catch (error) {
    console.error("Semantic Search Error:", error);
    return [];
  }
}