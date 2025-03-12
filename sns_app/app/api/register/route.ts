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
<<<<<<< Updated upstream
  const data = await req.json();
  const { email, password } = data;
=======
>>>>>>> Stashed changes

  try {
    const data = await req.json();
    const { email, userName, password } = data;

    // メールアドレス重複確認、バリデーション
    const [user, validationResult] = await Promise.all([
      prisma.user.findFirst({ where: { email } },),
      validationRegistSchema.safeParseAsync(data)
    ]);

    let errors = validationResult.success ? {} : validationResult.error.flatten().fieldErrors;
    //スプレッド構文で広げてから代入
    if (user) {
      errors.email = [...(errors.email || []), "このメールアドレスは既に使用されています。"];
    }

    if (Object.keys(errors).length > 0) {
      return new NextResponse(JSON.stringify({ errors }), { status: 400 });
    }

    // パスワードをハッシュ化してユーザーを作成
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await prisma.user.create({
        data: {
          email: email,
          name: userName,
          password: hashedPassword,
        },
      });
    } catch (e) {
      return NextResponse.json({ error: "新規登録に失敗しました。" }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: "新規登録中に予期せぬエラーが発生しました。" }, { status: 500 });
  }
  
  return new NextResponse(JSON.stringify({ message: "新規登録に成功しました。" }), { status: 201 });

<<<<<<< Updated upstream
  if (Object.keys(errors).length > 0) {
    return new NextResponse(JSON.stringify({ errors }), { status: 400 });
  }

  // パスワードをハッシュ化してユーザーを作成
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });

  return new NextResponse(JSON.stringify({ message: "Success" }), { status: 201 });
=======
>>>>>>> Stashed changes
}