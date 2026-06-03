// config.ts
const getApiBaseUrl = (): string => {
  // During build time or server-side
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  // Development
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  }

  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
};

// lib/config.ts
const config = {
  // Always use the server-side variable for internal API calls/database access
  apiBaseUrl: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  
  // Use public variables for client-side visibility
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  
  // Good practice to ensure OpenAI is configured
  openaiApiKey: process.env.OPENAI_API_KEY,
};

export default config;