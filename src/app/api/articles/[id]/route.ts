import { prisma } from "@/utils/db";
import { UpdateArticleDTO } from "@/utils/dtos";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const article = await prisma.article.findUnique({ where: { id: +params.id }, include: { comments: { include: { user: { select: { username: true } } }, orderBy: { createdAt: "desc" } } } });
    if (!article) {
    return NextResponse.json({ message: "Article Not Found" }, { status: 404 });
  }
  return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (!user || user.isAdmin === false) {
      return NextResponse.json({ message: "Only Admin, Access Denied" }, { status: 403 });
    }
    const article = await prisma.article.findUnique({ where: { id: +params.id } });
    if (!article) {
      return NextResponse.json({ message: "Article Not Found" }, { status: 404 });
    }
    const body = (await request.json()) as UpdateArticleDTO;
    const updatedArticle = await prisma.article.update({where: {id: +params.id}, data: {title: body.title, description: body.description}})
    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (!user || user.isAdmin === false) {
      return NextResponse.json({ message: "Only Admin, Access Denied" }, { status: 403 });
    } 
    const article = await prisma.article.findUnique({ where: { id: +params.id }, include: { comments: true } });
    if (!article) {
      return NextResponse.json({ message: "Article Not Found" }, { status: 404 });
    }
    await prisma.article.delete({ where: { id: +params.id } });
    const commentsId: number[] = article?.comments.map((comment) => comment.id);
    await prisma.comment.deleteMany({ where: { id: { in: commentsId } } });
    return NextResponse.json({ message: "Article Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
