'use client';

import React, { useState, useEffect } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "components/layout/Header";
import Sidebar from "components/layout/Sidebar";
<<<<<<< Updated upstream
=======
import Loading from "components/layout/Loading";
import BookList from "components/main/BookList";
>>>>>>> Stashed changes

const Bookshelf = () => {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // ローディング中にbookshelf画面が表示されないよう、pushではなくreplaceを使用
      router.replace("/login");
    }
  }, [status, router]);

  // ローディングまたは未認証時にローディング画面を表示
  if (status === "loading" || status === "unauthenticated") {
    return <div className="h-screen flex justify-center items-center bg-secondary-50" aria-label="読み込み中">
      <div className="animate-spin h-10 w-10 border-4 border-secondary-500 rounded-full border-t-transparent"></div>
    </div>
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
      <Header />
      <main className="flex">
        <div className="hidden lg:flex lg:basis-1/4 p-5 pt-10 bg-secondary-50">
          <Sidebar />
        </div>
        <div className="lg:basis-3/4 h-screen bg-secondary-50">
          {/* TODO:テーブル部分調整、ヘッダー部にフィルター機能追加（以下、仮） */}
          <div className="flex flex-col px-5 py-3">
            <div className="pt-2 pb-1 font-semibold">
              <h2>マイ本棚</h2>
            </div>
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-x-auto border border-gray-200 rounded-md">
                <BookList />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Bookshelf;
