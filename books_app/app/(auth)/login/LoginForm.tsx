"use client";

import { useForm } from "react-hook-form";
import { validationLoginSchema } from "app/utils/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

interface LoginForm {
  email: string;
  password: string;
  loginCheck: string;
}

interface Error {
  email?: string;
  password?: string;
  loginCheck?: string;
}

function LoginForm() {
  const { data: session } = useSession();
  const [resError, setResError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const [isRevealPassword, setIsRevealPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginForm>({
    mode: "onChange",
    resolver: zodResolver(validationLoginSchema),
  });

  const togglePassword = () => {
    setIsRevealPassword((prevState) => !prevState);
  };

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);

    const res = await fetch("/api/login", {
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
    });

    if (res.ok) {
      signIn("credentials", { email: data.email, password: data.password });
    } else {
      const resData = await res.json();
      setResError({ loginCheck: resData.message });
      setIsLoading(false);
    }
  };

  //セッション判定
  if (session) redirect("/bookshelf");

  return (
    <div className="flex flex-col items-center justify-center w-72 sm:w-96 md:w-116 px-2 py-12 bg-secondary-50 shadow-lg dark:text-gray-800">
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
        <h2 className="text-center text-md font-bold">ログイン</h2>
        <form onSubmit={handleSubmit(handleLogin)} className="mt-3">
          <div className="flex flex-col mt-4">
            <label className="w-full p-1 px-0 text-sm" htmlFor="email">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              placeholder="ilovebooks@email.com"
              className="w-full p-1 pl-2 text-sm placeholder-gray-400 border focus:outline-secondary-400"
              {...register("email")}
            />
            <p className="p-1 text-xss text-red-500">
              {errors.email?.message as React.ReactNode}
              {resError?.email && <span>{resError.email}</span>}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="w-full p-1 px-0 text-sm" htmlFor="password">
              パスワード
            </label>
            <div className="relative w-full">
              <input
                id="password"
                type={isRevealPassword ? 'text' : 'password'}
                placeholder=""
                className="w-full p-1 pl-2 text-sm border focus:outline-secondary-400"
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
            <p className="h-5 p-1 text-xss text-red-500">
              {errors.password?.message as React.ReactNode}
              {resError?.password && <span>{resError.password}</span>}
            </p>
            <p className="p-1 text-xss text-red-500">
              {resError?.loginCheck && <span>{resError.loginCheck}</span>}
            </p>
          </div>
          <button
            type="submit"
            disabled={!isDirty || !isValid}
            className="mt-5 w-full bg-secondary-400 hover:bg-secondary-500 text-white py-1 px-2 rounded-md hover:shadow hover:shadow-black disabled:bg-secondary-200 disabled:shadow-none"
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        <Link
          href="/register"
          className="flex justify-center items-center w-full mt-3 text-center text-xs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 inline-block pr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
          新規登録はこちら
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
