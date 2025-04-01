"use client";
import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validationRegistSchema } from "app/utils/validationSchema";

interface LoginForm {
  email: string;
  password: string;
  userName: string;
  passwordConfirm: string;
}

interface Error {
  email: [];
  userName: [];
  password: [];
  passwordConfirm: [];
}

const Page = () => {
  const { data: session, status } = useSession();
  const [resError, setResError] = useState<Error>();
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const [isRevealPasswordConfirm, setIsRevealPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginForm>({
    mode: "onChange",
    resolver: zodResolver(validationRegistSchema),
  });

  const togglePassword = () => {
    setIsRevealPassword((prevState) => !prevState);
  }
  const togglePasswordConfirm = () => {
    setIsRevealPasswordConfirm((prevState) => !prevState);
  }

  //登録処理
  const handleRegist = async (data: LoginForm) => {
    //フォーム取得
    const email = data.email;
    const password = data.password;
    const userName = data.userName;
    const res = await fetch("/api/register", {
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
    });

    if (res.ok) {
      const signInRes = await signIn("credentials", {
        email: email,
        password: password,
        userName: userName,
        redirect: false,
      });

      if (signInRes?.ok) {
        redirect("/bookshelf");
      } else {
       //setResError({ passwordConfirm: ["ユーザー登録に失敗しました。"] });
        return;
      }
    } else {
      const resError = await res.json();
      setResError(resError.errors);
    }

    //セッション判定
    if (session) redirect("/");

  };
  return (
    <div className="flex items-center justify-center bg-secondary-400 min-h-screen py-8">

      <div className="flex flex-col w-72 sm:w-96 md:w-116 items-center justify-center px-2 py-12 bg-secondary-50 shadow-lg">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 mr-2 inline-block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
          <span className="font-semibold text-xl">BOOKS</span>
        </div>
        <div className="mt-10 px-3 md:px-5 w-full">
          <h2 className="text-center text-md font-bold">アカウント登録</h2>
          <form onSubmit={handleSubmit(handleRegist)} className="mt-3">
            <div className="flex flex-col mt-4">
              <label className="w-full p-1 px-0 text-sm" htmlFor="email">
                メールアドレス
              </label>
              <input
                type="text"
                id="email"
                placeholder="ilovebooks@email.com"
                className="w-full p-1 pl-2 text-sm border focus:outline-primary-400"
                {...register("email")}
              />
              <p className="p-1 text-xss text-red-500">
                {errors.email?.message as React.ReactNode}
                {resError?.email?.map((error, index) => (
                  <span key={index}>{error}</span>
                ))}
              </p>
            </div>
            <div className="flex flex-col">
              <label className="w-full p-1 px-0 text-sm" htmlFor="password">
                ユーザー名
              </label>
              <input
                type="text"
                id="userName"
                placeholder="読書大臣"
                className="w-full p-1 pl-2 text-sm border focus:outline-primary-400"
                {...register("userName")}
              />
              <p className="p-1 text-xss text-red-500">
                {errors.userName?.message as React.ReactNode}
                {resError?.userName?.map((error, index) => (
                  <span key={index}>{error}</span>
                ))}
              </p>
            </div>
            <div className="flex flex-col">
              <label className="w-full p-1 px-0 text-sm" htmlFor="password">
                パスワード
              </label>
              <div className="relative w-full">
                <input
                  type={isRevealPassword ? 'text' : 'password'}
                  id="password"
                  placeholder=""
                  className="w-full p-1 pl-2 text-sm border focus:outline-primary-400"
                  {...register("password")}
                />
                <span
                  onClick={togglePassword}
                  role="presentation"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {isRevealPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>

                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>

                  )}
                </span>
              </div>
              <p className="p-1 text-xss text-red-500">
                {errors.password?.message as React.ReactNode}
                {resError?.password?.map((error, index) => (
                  <span key={index}>{error}</span>
                ))}
              </p>
            </div>
            <div className="flex flex-col">
              <label className="w-full p-1 px-0 text-sm" htmlFor="passwordConfirm">
                パスワード（確認用）
              </label>
              <div className="relative w-full">
                <input
                  type={isRevealPasswordConfirm ? 'text' : 'password'}
                  id="passwordConfirm"
                  placeholder=""
                  className="w-full p-1 pl-2 text-sm border focus:outline-primary-400"
                  {...register("passwordConfirm")}
                />
                <span
                  onClick={togglePasswordConfirm}
                  role="presentation"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {isRevealPasswordConfirm ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>

                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>

                  )}
                </span>
              </div>
              <p className="p-1 text-xss text-red-500">
                {errors.passwordConfirm?.message as React.ReactNode}
                {resError?.passwordConfirm?.map((error, index) => (
                  <span key={index}>{error}</span>
                ))}
              </p>
              <p className="h-5 p-1 text-xs text-red-500">
              </p>
            </div>
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="mt-5 w-full bg-primary-400 hover:bg-primary-500 text-white py-1 px-2 rounded-md hover:shadow hover:shadow-black disabled:bg-primary-200 disabled:shadow-none"
            >
              新規登録
            </button>
          </form>
          <Link href="/login" className="flex justify-center items-center w-full mt-3 text-center text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 inline-block pr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            ログインはこちら
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
