import { prisma } from "@/utils/db";
import { RegisterUserDTO } from "@/utils/dtos";
import { setCookie } from "@/utils/generateToken";
import { registerSchema } from "@/utils/validationSchemas";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterUserDTO;
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.message }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (user) {
      return NextResponse.json({ message: "This User already registered" }, { status: 400 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword
      },
      select: {
        username: true,
        id: true,
        isAdmin: true
      }
    });
    const cookie = setCookie({ id: newUser.id, username: newUser.username, isAdmin: newUser.isAdmin });
    return NextResponse.json({ ...newUser, message: "Registered & Authenticated" }, { status: 201, headers: {"Set-Cookie": cookie} });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" + error }, { status: 500 });
  }
}