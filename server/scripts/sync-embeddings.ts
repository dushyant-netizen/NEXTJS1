// scripts/sync-embeddings.ts
import { OpenAI } from 'openai';
import { Pool } from 'pg'; // or your preferred DB client

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function syncEmbeddings() {
  // 1. Fetch products that don't have an embedding yet
  const { rows } = await pool.query('SELECT id, name, description FROM "Product" WHERE embedding IS NULL');
  
  for (const product of rows) {
    console.log(`Generating embedding for: ${product.name}`);
    
    // 2. Generate embedding
    const input = `${product.name} ${product.description}`;
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: input,
    });
    const vector = embeddingResponse.data[0].embedding;

    // 3. Update the database
    await pool.query(
      'UPDATE "Product" SET embedding = $1 WHERE id = $2',
      [JSON.stringify(vector), product.id]
    );
  }
}

syncEmbeddings().catch(console.error);