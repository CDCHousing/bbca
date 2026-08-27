import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { ApplicationStatus, Prisma } from "@/generated/prisma/client";
import { getSerialMap } from "@/lib/membership-serial.server";
import { SERIAL_ORDER_BY } from "@/lib/membership-serial";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const q = searchParams.get("q")?.trim();

  const where: Prisma.MembershipApplicationWhereInput = {
    ...(statusParam &&
    Object.values(ApplicationStatus).includes(statusParam as ApplicationStatus)
      ? { status: statusParam as ApplicationStatus }
      : {}),
    ...(q
      ? {
          OR: [
            { businessName: { contains: q, mode: "insensitive" } },
            { contactName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSizeParam = parseInt(searchParams.get("pageSize") ?? "20", 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const pageSize =
    Number.isFinite(pageSizeParam) && pageSizeParam > 0
      ? Math.min(pageSizeParam, 100)
      : 20;

  const [applications, total, serials] = await Promise.all([
    prisma.membershipApplication.findMany({
      where,
      orderBy: SERIAL_ORDER_BY,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.membershipApplication.count({ where }),
    getSerialMap(),
  ]);

  return NextResponse.json({
    applications: applications.map((app) => ({
      ...app,
      serial: serials.get(app.id) ?? 0,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}
