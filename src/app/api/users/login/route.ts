import { prisma } from "@/utils/db";
import { LoginUserDTO } from "@/utils/dtos";
import { setCookie } from "@/utils/generateToken";
import { loginSchema } from "@/utils/validationSchemas";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginUserDTO;
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.message }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email: body.email } }, );
    if (!user) {
      return NextResponse.json({ message: "Invalid Email or Password" }, { status: 400 });
    }
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ message: "Invalid Email or Password" }, { status: 400 });
    }
    const cookie = setCookie({ id: user.id, isAdmin: user.isAdmin, username: user.username });
    return NextResponse.json({ message: "Authenticated" }, { status: 200, headers: {"Set-Cookie": cookie} });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}