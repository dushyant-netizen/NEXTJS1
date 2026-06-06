"use server";

import { openai } from "@/lib/openai";
import { pool } from "@/lib/db"; 

export async function performSemanticSearch(query: string) {
  try {
    if (!query || query.trim() === "") return [];
    console.log("=== SEMANTIC SEARCH DIAGNOSTIC SYSTEM ===");
    console.log("User Input Query:", query);

    // 1. Check database connection & verify table count
    const countCheck = await pool.query('SELECT COUNT(*) FROM "Product"');
    console.log("Total products inside database table right now:", countCheck.rows[0].count);

    if (Number(countCheck.rows[0].count) === 0) {
      console.error("CRITICAL: Your Product table is empty. Sync or re-upload your items.");
      return [];
    }

    // 2. Generate embedding vector from OpenAI
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    
    const queryVector = embeddingResponse.data[0].embedding;
    const vectorString = `[${queryVector.join(',')}]`;
    console.log("OpenAI Vector successfully generated. Array dimensions length:", queryVector.length);

    // 3. Query Postgres - REMOVED similarity filter (> 0.25) to catch any structural mismatches
    console.log("Executing raw SQL statement on Neon...");
    const result = await pool.query(
      `SELECT 
        id, 
        title, 
        description, 
        price, 
        slug, 
        "mainImage", 
        "inStock"
       FROM "Product"
       LIMIT 4`
    );

    console.log("Database raw returned rows count:", result.rows.length);
    if (result.rows.length > 0) {
      console.log("Sample row structural keys returned from database:", Object.keys(result.rows[0]));
    }

    // 4. Return formatted data
    return result.rows.map((row: any) => ({
      id: row.id,
      title: row.title || "Untitled Product",
      description: row.description || "",
      price: row.price ? Number(row.price) : 0,
      slug: row.slug || "",
      mainImage: row.mainImage || "product_placeholder.jpg",
      inStock: row.inStock !== undefined ? row.inStock : true
    }));

  } catch (error: any) {
    console.error("!!! CRITICAL DIANOSTIC CRASH !!!");
    console.error("Error Message:", error?.message || error);
    console.error("Full Error Object:", error);
    return [];
  }
}