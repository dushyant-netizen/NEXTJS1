// config.ts
const getApiBaseUrl = (): string => {
  // Client-side
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  // Server-side (Vercel)
  return process.env.API_BASE_URL || 
         process.env.NEXT_PUBLIC_API_BASE_URL || 
         'http://localhost:3000';   // Use 3000 for local dev
};

const config = {
  apiBaseUrl: getApiBaseUrl(),
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};

export default config;