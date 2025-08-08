import { prisma } from "@/utils/db";
import { UpdateCommentDTO } from "@/utils/dtos";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: any) {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: +params.id } });
    if (!comment) {
      return NextResponse.json({ message: "Comment Not Found" }, { status: 404 });
    }
    const user = verifyToken(request);
    if (!user || user.id !== comment.userId) {
      return NextResponse.json({ message: "You are not allowed, Access Denied" }, { status: 403 });
    }
    const body = await request.json() as UpdateCommentDTO;
    const updatedComment = await prisma.comment.update({ where: { id: +params.id }, data: { text: body.text } });
    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: +params.id } });
    if (!comment) {
      return NextResponse.json({ message: "Comment Not Found" }, { status: 404 });
    }
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: "No Token Provided, Access Denied" }, { status: 401 });
    }
    if (user.isAdmin || user.id === comment.userId) {
      await prisma.comment.delete({ where: { id: +params.id } });
      return NextResponse.json({ message: "Comment Deleted" }, { status: 200 }); 
    }
    return NextResponse.json({message: "You are not allowed, Access Denied"}, { status: 403 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}