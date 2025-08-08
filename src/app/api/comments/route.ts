import { prisma } from "@/utils/db";
import { CreateCommentDTO } from "@/utils/dtos";
import { createCommentSchema } from "@/utils/validationSchemas";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: "Only Logged In Users, Access Denied" }, { status: 401 });
    }
    const body = (await request.json()) as CreateCommentDTO;
    const validation = createCommentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.message }, { status: 400 });
    }
    const newComment = await prisma.comment.create({ data: { text: body.text, articleId: body.articleId, userId: user.id } });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user || user.isAdmin === false) {
      return NextResponse.json({ message: "Only Admin, Access Denied" }, { status: 403 });
    }
    const comments = await prisma.comment.findMany();
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}