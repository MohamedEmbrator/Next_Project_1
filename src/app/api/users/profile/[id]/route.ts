import { prisma } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { UpdateUserDTO } from "@/utils/dtos";
import bcrypt from "bcryptjs";
import { updateUserSchema } from "@/utils/validationSchemas";

interface Props {
  params: { id: string };
}

export async function DELETE(request: NextRequest, {params}: Props) {
  try {
    const user = await prisma.user.findUnique({ where: { id: +params.id }, include: { comments: true } });
    if (!user) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }
    const userFromToken = verifyToken(request);
    if (userFromToken !== null && userFromToken.id === user.id) {
      await prisma.user.delete({ where: { id: +params.id } });
      const commentsId = user.comments.map((comment) => comment.id);
      await prisma.comment.deleteMany({ where: { id: { in: commentsId } } });
      return NextResponse.json({ message: "Account Deleted Succefully" }, { status: 200 });
    }
    return NextResponse.json({ message: "Only User himself can delete his profile, forbidden" }, { status: 4030 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: +params.id }, select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        isAdmin: true
    } });
    if (!user) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }
    const userFromToken = verifyToken(request);
    if (userFromToken === null || userFromToken.id !== user.id) {
      return NextResponse.json({ message: "You Are Not Allowed, Access Denied" }, { status: 403 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}


export async function PUT(request: NextRequest, { params }: Props) {
    try {
      const user = await prisma.user.findUnique({ where: { id: +params.id } });
      if (!user) {
        return NextResponse.json({ message: "User Not Found" }, { status: 404 });
      }
      const userFromToken = verifyToken(request);
      if (userFromToken === null || userFromToken.id !== user.id) {
        return NextResponse.json({ message: "You Are Not Allowed, Access Denied" }, { status: 403 });
      }
      const body = await request.json() as UpdateUserDTO;
      const validation = updateUserSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json({ message: validation.error.message }, { status: 400 });
      }
      if (body.password) {
        const salt = await bcrypt.genSalt(10);
        body.password = await bcrypt.hash(body.password, salt);
      }
        const updatedUser = await prisma.user.update({
          where: { id: +params.id }, data: {
            username: body.username,
            email: body.email,
            password: body.password
          }
        });
      const { password, ...other } = updatedUser;
      return NextResponse.json({ ...other }, { status: 200 });
      console.log(password);
    } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}