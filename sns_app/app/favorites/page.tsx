'use client';

import React, { useState, useEffect } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "components/layout/Header";
import Sidebar from "components/layout/Sidebar";
import Loading from "components/layout/Loading";
import Title from "components/layout/Title";
// import FavoriteBookList from "@/components/main/FavoriteBookList";

const Favorite = () => {

  const { data: session, status } = useSession();
  const router = useRouter();

  // ローディングまたは未認証時にローディング画面を表示
  if (status === "loading" || status === "unauthenticated") {
    return <Loading className="h-screen flex justify-center items-center bg-secondary-50" />
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="flex pt-12">
        <div className="hidden lg:flex lg:basis-1/4 p-5 pt-10 bg-secondary-50">
          <Sidebar />
        </div>
        <div className="w-full lg:basis-3/4 h-screen bg-secondary-50">
          {/* TODO:テーブル部分調整、ヘッダー部にフィルター機能追加（以下、仮） */}
          <div className="flex flex-col px-5 py-3">
            <div className="pt-2 pb-1 font-semibold">
              <Title titleName="お気に入り" />
            </div>
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-x-auto border border-gray-200 rounded-md">
                {/* <FavoriteBookList /> */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Favorite;
