'use client';

import LoginForm from "./LoginForm";
import { useSession } from "next-auth/react";
import Loading from "components/layout/Loading";

function Login() {

  const { status } = useSession();

  // ローディング時にローディング画面を表示
  if (status === "loading") {
    return <Loading className="h-screen w-screen flex justify-center items-center bg-secondary-50 dark:bg-secondary-50" />
  }

  return (
    <div className="flex items-center justify-center bg-primary-600 min-h-screen py-5">
      <LoginForm />
    </div>
  );
}

export default Login;


