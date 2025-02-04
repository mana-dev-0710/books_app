'use client';

import React, { Component } from 'react';
import Header from "../components/layout/Header";
import SideBar from "../components/layout/SideBar";

class Home extends Component {
  render() {

    return (
      <div className="font-[family-name:var(--font-geist-sans)]">
        <Header/>
        <main className="flex">
          <div className="hidden lg:block basis-2/6 p-5 pt-10 bg-secondary-50">
            <SideBar/>
          </div>
          <div className="w-full h-screen lg:basis-4/6 bg-secondary-50">
            {/* TODO:テーブル部分調整、ヘッダー部にフィルター機能追加（以下、仮） */}
            <div className="flex flex-col px-5 py-3">
              <div className="pt-2 pb-1 font-semibold">
                <h2>マイブック一覧</h2>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-primary-100">
                        <tr>
                          <th scope="col" className="px-5 py-2 text-start text-xs font-medium text-gray-500 uppercase">書籍タイトル</th>
                          <th scope="col" className="px-5 py-2 text-start text-xs font-medium text-gray-500 uppercase">作者</th>
                          <th scope="col" className="px-5 py-2 text-start text-xs font-medium text-gray-500 uppercase">評価</th>
                          <th scope="col" className="px-5 py-2 text-start text-xs font-medium text-gray-500 uppercase">評価タイトル</th>
                          <th scope="col" className="px-5 py-2 text-end text-xs font-medium text-gray-500 uppercase"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                          <td className="px-5 py-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">Hunter×hunter = ハンター ハンター</td>
                          <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">冨樫義博</td>
                          {/* TODO:評価機能追加 */}
                          <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">⭐️⭐️⭐️⭐️⭐️</td>
                          <td className="px-5 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">頭脳戦が面白い</td>
                          <td className="px-5 py-2 whitespace-nowrap text-end text-sm font-medium">
                            {/* TODO:詳細、編集、削除ボタン追加&押下処理 */}
                            <button type="button" className="inline-flex items-center gap-x-2 py-1 px-2 rounded-md border border-secondary-400 hover:border-secondary-500 hover:shadow hover:shadow-gray">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                              </svg>
                            </button>
                          </td>
                        </tr>

                        
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Home;
