'use client';

import React from 'react'
import { useRouter } from 'next/navigation';
import Profile from 'components/layout/Profile';

const Sidebar = () => {

  const router = useRouter();
  return (
    <div className="w-full">
      <Profile
        className={"memo relative px-4 pt-6 pb-2 bg-white shadow-md"}
        imageClassName={"rounded-full border border-2 border-gray-100"}
      />
      {/* メニューリスト */}
      <div className="px-3 py-8">
        <ul className="grid grid-cols-1 gap-2 text-sm">
          <li className="font-semibold">
            <button
              type="button"
              className="inline-flex items-center gap-x-2 py-1 px-2 w-full justify-center rounded-md text-white bg-primary-400 hover:bg-primary-500 hover:shadow hover:shadow-gray"
            >
              プロフィール
            </button>
          </li>
          <li className="font-semibold">
            <button
              type="button"
              onClick={() => router.push('/search')}
              className="inline-flex items-center gap-x-2 py-1 px-2 w-full justify-center rounded-md text-white bg-primary-400 hover:bg-primary-500 hover:shadow hover:shadow-gray"
            >
              書籍検索
            </button>
          </li>
          <li className="font-semibold">
            <button
              type="button"
              onClick={() => router.push('/favorites')}
              className="inline-flex items-center gap-x-2 py-1 px-2 w-full justify-center rounded-md text-white bg-primary-400 hover:bg-primary-500 hover:shadow hover:shadow-gray"
            >
              お気に入り
            </button>
          </li>
          <li className="font-semibold">
            <button
              type="button"
              onClick={() => router.push('/bookshelf')}
              className="inline-flex items-center gap-x-2 py-1 px-2 w-full justify-center rounded-md text-white bg-primary-400 hover:bg-primary-500 hover:shadow hover:shadow-gray"
            >
              マイ本棚
            </button>
          </li>
          <li className="font-semibold">
            <button
              type="button"
              className="inline-flex items-center gap-x-2 py-1 px-2 w-full justify-center rounded-md text-white bg-primary-400 hover:bg-primary-500 hover:shadow hover:shadow-gray"
            >
              プログレッション
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
