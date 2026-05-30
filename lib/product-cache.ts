import { redis } from './redis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CACHE_TTL = 3600; // 1 hour

export type CachedProduct = {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  slug: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
};

// ==================== POPULAR PRODUCTS ====================
export async function getPopularProducts(limit: number = 8): Promise<CachedProduct[]> {
  const cacheKey = `products:popular:${limit}`;

  // Try cache first
  const cached = await redis.get<CachedProduct[]>(cacheKey);
  if (cached) return cached;

  // Fetch from database
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      price: true,
      salePrice: true,
      images: true,
      slug: true,
      rating: true,
      reviewCount: true,
    },
    orderBy: [
      { rating: 'desc' },
      { reviewCount: 'desc' },
      { createdAt: 'desc' },
    ],
    take: limit,
  });

  const formatted = products.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : undefined,
    images: p.images || [],
    slug: p.slug,
    rating: p.rating ? Number(p.rating) : undefined,
    reviewCount: p.reviewCount ? Number(p.reviewCount) : undefined,
  }));

  // Save to cache
  await redis.set(cacheKey, formatted, { ex: CACHE_TTL });

  return formatted;
}

// ==================== FEATURED PRODUCTS ====================
export async function getFeaturedProducts(limit: number = 6): Promise<CachedProduct[]> {
  const cacheKey = `products:featured:${limit}`;

  const cached = await redis.get<CachedProduct[]>(cacheKey);
  if (cached) return cached;

  const products = await prisma.product.findMany({
    where: { 
      isActive: true,
      isFeatured: true,        // Make sure this field exists in your Prisma schema
    },
    select: {
      id: true,
      name: true,
      price: true,
      salePrice: true,
      images: true,
      slug: true,
      rating: true,
      reviewCount: true,
    },
    take: limit,
  });

  const formatted = products.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : undefined,
    images: p.images || [],
    slug: p.slug,
    rating: p.rating ? Number(p.rating) : undefined,
    reviewCount: p.reviewCount ? Number(p.reviewCount) : undefined,
  }));

  await redis.set(cacheKey, formatted, { ex: CACHE_TTL });

  return formatted;
}