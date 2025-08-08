import { Article } from "@/generated/prisma/client";
import { ARTICLE_PER_PAGE } from "@/utils/constants";
import { prisma } from "@/utils/db";
import { CreateArticleDTO } from "@/utils/dtos";
import { createArticleSchema } from "@/utils/validationSchemas";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";
    const articles = await prisma.article.findMany({ skip: (+pageNumber - 1) * ARTICLE_PER_PAGE, take: ARTICLE_PER_PAGE, orderBy: { createdAt: "desc" } });
    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user || user.isAdmin === false) {
      return NextResponse.json({ message: "Only Admin, Access Denied" }, { status: 403 });
    }
    const body = (await request.json()) as CreateArticleDTO;
    const validation = createArticleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.message }, { status: 400 });
    }
    const newArticle: Article = await prisma.article.create({ data: { title: body.title, description: body.description }});
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
