'use client';

import React, { Component } from 'react';

class Sidebar extends Component {
  render(){
    return (
      <div>
        <div className="box shadow-md">
          <div className="mt-3 flex items-center justify-center">
            {/* TODO:アイコン <img className="rounded-full" src="" alt="plofile image"/> */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <div className="px-2 py-3 mb-2 text-sm">
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li className="col-span-2 font-semibold">名前:</li>
              <li className="font-semibold">性別:</li>
              <li className="font-semibold">年齢:</li>
              <li className="col-span-2 font-semibold">職業:</li>
              <li className="col-span-2 font-semibold">総読書冊数:</li>
            </ul>
          </div>
        </div>
        {/* メニューリスト */}
        <div className="px-3 py-8">
          <ul className="grid grid-cols-1 gap-2 text-sm">
            <li className="font-semibold">
              <button type="button" className="inline-flex items-center gap-x-2 py-1 px-2 w-full justify-center rounded-md text-white bg-primary-400 hover:bg-primary-500 hover:shadow hover:shadow-gray">プロフィール</button>
            </li>
            <li className="font-semibold">
              <button type="button" className="inline-flex items-center gap-x-2 py-1 px-2 w-full justify-center rounded-md text-white bg-primary-400 hover:bg-primary-500 hover:shadow hover:shadow-gray">プログレッション</button>
            </li>
            <li className="font-semibold">
              <button type="button" className="inline-flex items-center gap-x-2 py-1 px-2 w-full justify-center rounded-md text-white bg-primary-400 hover:bg-primary-500 hover:shadow hover:shadow-gray">書籍検索</button>
            </li>
            <li className="font-semibold">
              <button type="button" className="inline-flex items-center gap-x-2 py-1 px-2 w-full justify-center rounded-md text-white bg-primary-400 hover:bg-primary-500 hover:shadow hover:shadow-gray">お気に入り</button>
            </li>
            <li className="font-semibold">
              <button type="button" className="inline-flex items-center gap-x-2 py-1 px-2 w-full justify-center rounded-md text-white bg-primary-400 hover:bg-primary-500 hover:shadow hover:shadow-gray">設定</button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;