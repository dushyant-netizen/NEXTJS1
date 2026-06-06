"use server";

import { openai } from "@/lib/openai";
import { pool } from "@/lib/db"; 

export async function performSemanticSearch(query: string) {
  try {
    if (!query || query.trim() === "") return [];

    // 1. Generate embedding vector from OpenAI
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    
    const queryVector = embeddingResponse.data[0].embedding;
    const vectorString = `[${queryVector.join(',')}]`;

    // 2. Query Postgres using precise table and field casing
    // We alias "mainImage" and "inStock" directly to ensure the output format matches Prisma objects
    const result = await pool.query(
      `SELECT 
        id, 
        title, 
        description, 
        price, 
        slug, 
        "mainImage" AS "mainImage", 
        "inStock" AS "inStock",
        1 - (embedding <=> $1::vector) AS similarity
       FROM "Product"
       WHERE 1 - (embedding <=> $1::vector) > 0.25 -- Lowered to 0.25 for broader semantic matching
       ORDER BY similarity DESC
       LIMIT 8`,
      [vectorString]
    );

    // 3. Map rows to guarantee keys are formatted correctly for ProductItem
    return result.rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      price: Number(row.price),
      slug: row.slug,
      mainImage: row.mainImage,
      inStock: row.inStock
    }));

  } catch (error) {
    console.error("Semantic Search Error:", error);
    return [];
  }
}