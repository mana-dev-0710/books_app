import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/Prisma";
import bcrypt from "bcrypt";
import { validationRegistSchema } from "app/utils/validationSchema";

export async function GET() {
  return new NextResponse(JSON.stringify({ message: "GET method not allowed" }), {
    status: 405,
  });
}

export async function POST(req: NextRequest) {

  try {
    const data = await req.json();
    const { email, userName, password } = data;

    // メールアドレス重複確認、バリデーション
    const [user, validationResult] = await Promise.all([
      prisma.user.findFirst({ where: { email } },),
      validationRegistSchema.safeParseAsync(data)
    ]);

    const errors = validationResult.success ? {} : validationResult.error.flatten().fieldErrors;
    //スプレッド構文で広げてから代入
    if (user) {
      errors.email = [...(errors.email || []), "このメールアドレスは既に使用されています。"];
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "パラメーターエラー" },
        { status: 400 }
      );
    }

    // パスワードをハッシュ化してユーザーを作成
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: email,
        name: userName,
        password: hashedPassword,
      },
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "サーバーエラー" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { status: 200 }
  );

}