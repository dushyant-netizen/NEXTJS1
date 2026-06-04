import prisma from "@/utils/db";
import { NextResponse } from "next/server";

// ADDITION: Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://next-merce-k354cgpsp-dushyant-netizens-projects.vercel.app",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export const POST = async (request: Request) => {
  // ADDITION: Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { email, image } = body;

    if (!email || !image) {
      console.error("❌ BACKEND VALIDATION FAILED: Missing email or image property inside payload body.", body);
      return new NextResponse(
        JSON.stringify({ error: "Missing required properties: email or image" }),
        { status: 400, headers: corsHeaders } // UPDATED
      );
    }

    console.log(`⏳ Prisma attempting to update user role row for email: ${email}`);

    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { image: image },
    });

    console.log("✅ Database record updated cleanly inside Prisma table mapping!");

    return new NextResponse(
      JSON.stringify({ 
        message: "Profile photo saved successfully", 
        imageUrl: updatedUser.image 
      }),
      { status: 200, headers: corsHeaders } // UPDATED
    );

  } catch (error: any) {
    console.error("🚨 PRISMA PROFILE ROUTE REJECTION ERROR LOGS:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Processing Error", 
        details: error?.message || error 
      }),
      { status: 500, headers: corsHeaders } // UPDATED
    );
  }
};