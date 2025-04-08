'use client';

import React, { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "components/layout/Header";
import Sidebar from "components/layout/Sidebar";
import Loading from "components/layout/Loading";
import Title from "components/layout/Title";
import FavoriteBookList from "@/components/main/FavoriteBookList";

const Favorite = () => {

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // ローディング中に画面が表示されないよう、pushではなくreplaceを使用
      router.replace("/login");
    }
  }, [status, router]);

  // ローディングまたは未認証時にローディング画面を表示
  if (status === "loading" || status === "unauthenticated") {
    return <Loading className="h-screen flex justify-center items-center bg-secondary-50 dark:bg-secondary-50" />
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)] dark:text-gray-800 bg-secondary-50">
      <Header />
      <main className="flex pt-12">
        <div className="hidden lg:flex lg:basis-1/4 p-5 pt-10 bg-secondary-50">
          <Sidebar />
        </div>
        <div className="w-full lg:basis-3/4 h-screen bg-secondary-50">
          <div className="flex flex-col px-5 py-3">
            <div className="pt-2 pb-1 font-semibold">
              <Title titleName="お気に入り" />
            </div>
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-x-auto border border-gray-200 rounded-md">
                <FavoriteBookList/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Favorite;
