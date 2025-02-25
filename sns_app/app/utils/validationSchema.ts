import { z } from "zod";

export const validationLoginSchema = z
  .object({
    email: z
      .string()
      .nonempty("メールアドレスを入力して下さい。")
      .email("無効なメールアドレス形式です。"),
    password: z
      .string()
      .nonempty("パスワードを入力して下さい。")
      .min(8, "パスワードは8文字以上で入力して下さい。"),
  })

export const validationRegistSchema = z
  .object({
    email: z
      .string()
      .nonempty("メールアドレスを入力してください。")
      .email("無効なメールアドレス形式です。"),
    userName: z
      .string()
      .nonempty("ユーザー名を入力してください。")
      .max(16, "ユーザー名は16文字以内で入力して下さい。")
      .regex(/^[a-zA-Zａ-ｚＡ-Ｚ0-9０-９ぁ-んァ-ヶ一-龯々〆〤_-]+$/, 
        { message: "ユーザー名には半角英字・全角英字・数字・かな・カナ・漢字・アンダースコア・ハイフンのみ使用できます。" })
      .regex(/^(?![_\-]).*(?<![_\-])$/, 
        { message: "ユーザー名の先頭または末尾にアンダースコア (_) またはハイフン (-) を使用しないでください。" }),
    password: z
      .string()
      .nonempty("パスワードを入力してください。")
      .min(8, "パスワードは8文字以上で入力して下さい。")
      .regex(/[0-9]+/, { message: "数字を1文字以上使用してください" })
      .regex(/[a-z]+/, { message: "英小文字を1文字以上使用してください" })
      .regex(/[A-Z]+/, { message: "英大文字を1文字以上使用してください" }),
    passwordConfirm: z
      .string()
      .nonempty("再確認パスワードを入力してください。")
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "パスワードが一致しません。",
        path: ["passwordConfirm"],
      })
    }
  });