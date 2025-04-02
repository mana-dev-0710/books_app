import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/Prisma";
import bcrypt from "bcrypt";
import { validationLoginSchema } from "app/utils/validationSchema";

export async function GET() {
  return new NextResponse(JSON.stringify({ message: "GET method not allowed" }), {
    status: 405,
  });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { email, password } = data;

  try {
    const [user, validationResult] = await Promise.all([
      prisma.user.findUnique({ where: { email: email }, }),
      validationLoginSchema.safeParseAsync(data),
    ]);

    if (!validationResult.success) throw new Error("Validation Error");
    if (!user || !password) throw new Error("User not found");
    if (user?.password) {
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        throw new Error("Incorrect password");
      }
    }
  } catch {
    return new NextResponse(
      JSON.stringify({ message: "メールアドレスかパスワードが間違っています。" }),
      { status: 400 }
    );
  }
  return new NextResponse(JSON.stringify({ message: "Success" }), {
    status: 201,
  });
}
