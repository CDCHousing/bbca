import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seed endpoint is disabled in production" },
      { status: 403 }
    );
  }

  const existing = await prisma.adminUser.findUnique({
    where: { email: "admin@bbca.co.uk" },
  });

  if (existing) {
    return NextResponse.json({
      message: "Admin user already exists",
      email: existing.email,
    });
  }

  const passwordHash = await bcrypt.hash("admin123", 10);

  const user = await prisma.adminUser.create({
    data: {
      email: "admin@bbca.co.uk",
      passwordHash,
    },
  });

  return NextResponse.json({
    message: "Admin user created successfully",
    email: user.email,
  });
}
