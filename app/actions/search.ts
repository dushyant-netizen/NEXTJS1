"use server";

import { openai } from "@/lib/openai";
import { pool } from "@/lib/db"; 

export async function performSemanticSearch(query: string) {
  try {
    if (!query || query.trim() === "") return [];

    // 1. Try Vector Semantic Search
    try {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query,
      });
      
      const queryVector = embeddingResponse.data[0].embedding;
      const vectorString = `[${queryVector.join(',')}]`;

      const result = await pool.query(
        `SELECT id, title, description, price, slug, "mainImage", "inStock"
         FROM "Product"
         WHERE 1 - (embedding <=> $1::vector) > 0.25
         ORDER BY 1 - (embedding <=> $1::vector) DESC
         LIMIT 8`,
        [vectorString]
      );

      if (result.rows.length > 0) return normalizeRows(result.rows);
    } catch (openaiError: any) {
      console.warn("OpenAI Quota Limit Hit. Falling back to regular database text search...");
    }

    // 2. FALLBACK: Normal ILIKE Text Search (Runs for free when OpenAI is down/out of credits)
    const textResult = await pool.query(
      `SELECT id, title, description, price, slug, "mainImage", "inStock"
       FROM "Product"
       WHERE title ILIKE $1 OR description ILIKE $1
       LIMIT 8`,
      [`%${query}%`]
    );

    return normalizeRows(textResult.rows);

  } catch (error) {
    console.error("Search system breakdown:", error);
    return [];
  }
}

// Small helper to keep keys perfectly clean for <ProductItem />
function normalizeRows(rows: any[]) {
  return rows.map((row: any) => ({
    id: row.id,
    title: row.title || "Untitled Product",
    description: row.description || "",
    price: row.price ? Number(row.price) : 0,
    slug: row.slug || "",
    mainImage: row.mainImage || "product_placeholder.jpg",
    inStock: row.inStock !== undefined ? row.inStock : true
  }));
}