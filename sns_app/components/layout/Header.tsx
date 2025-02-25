'use client';

import React, { useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 min-w-screen">
      <nav className="flex items-center justify-between px-4 py-2 flex-wrap w-full bg-primary-600 text-white">
        {/* TODO:ハンバーガーアイコン押下処理(md未満でハンバーガーメニュー表示) */}
        <div className="lg:hidden text-sm align-content-center">
          <svg className="h-6 w-6 rocket-launch" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>
        <div className="flex items-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          <span className="font-semibold text-xl">BOOKS</span>
        </div>
        <div className="flex items-center">
          {/* TODO:ハンバーガメニューまたはサイドバーに以下を表示
          <div className="inline-block text-xs mr-2">
            <p className="max-w-32 font-bold overflow-hidden text-ellipsis">{session?.user?.email}</p>
            さんとしてログイン中
          </div> */}
          <div className="inline-block text-sm">
            {/* TODO:ログイン時の表示処理 */}
            <svg className="hidden inline-block h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="bg-secondary-400 hover:bg-secondary-500 text-white py-1 px-2 rounded-md hover:shadow hover:shadow-black">ログアウト</button>
          </div>
        </div>
      </nav>
    </header>
  );
};


export default Header;