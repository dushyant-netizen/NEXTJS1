// app/actions/track.ts
"use server";

import { pool } from "@/lib/db";

export async function trackUserInteraction(userId: string, productId: string) {
  await pool.query(
    `INSERT INTO "UserHistory" (user_id, product_id, viewed_at) VALUES ($1, $2, NOW())`,
    [userId, productId]
  );
}