"use server";

import { pool } from "@/lib/db";

export async function getPersonalizedRecommendations(currentProductId: string) {
  try {
    // We use the <=> operator provided by pgvector for cosine distance
    const query = `
      SELECT id, name, price, mainImage, 
      1 - (embedding <=> (SELECT embedding FROM "Product" WHERE id = $1)::vector) AS similarity
      FROM "Product"
      WHERE id != $1
      ORDER BY similarity DESC
      LIMIT 4
    `;

    const result = await pool.query(query, [currentProductId]);
    return result.rows;
  } catch (error) {
    console.error("Recommendation Error:", error);
    return [];
  }
}