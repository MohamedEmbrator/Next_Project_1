import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const count = await prisma.article.count();
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.log(request.body);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}