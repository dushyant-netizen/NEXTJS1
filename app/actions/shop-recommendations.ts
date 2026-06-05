// app/actions/shop-recommendations.ts
"use server";

import { pool } from "@/lib/db";

export async function getCategoryRecommendations(categorySlug: string) {
  try {
    // This query finds products that are 'semantically' related to the category name
    const query = `
      SELECT id, name, price, mainImage, 
      1 - (embedding <=> (SELECT AVG(embedding) FROM "Product" WHERE category = $1)::vector) AS similarity
      FROM "Product"
      WHERE category = $1
      ORDER BY similarity DESC
      LIMIT 4
    `;
    const result = await pool.query(query, [categorySlug]);
    return result.rows;
  } catch (error) {
    return [];
  }
}