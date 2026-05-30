import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    // 🛠️ Safely parse the direct JSON body input payload string
    const body = await request.json();
    const { email, image } = body;

    // Validate properties exist before talking to database
    if (!email || !image) {
      console.error("❌ BACKEND VALIDATION FAILED: Missing email or image property inside payload body.", body);
      return new NextResponse(
        JSON.stringify({ error: "Missing required properties: email or image" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`⏳ Prisma attempting to update user role row for email: ${email}`);

    // Update your matching user account row data field
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { 
        image: image 
      },
    });

    console.log("✅ Database record updated cleanly inside Prisma table mapping!");

    return new NextResponse(
      JSON.stringify({ 
        message: "Profile photo saved successfully", 
        imageUrl: updatedUser.image 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    // Catch-all safety logging block
    console.error("🚨 PRISMA PROFILE ROUTE REJECTION ERROR LOGS:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Processing Error", 
        details: error?.message || error 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
