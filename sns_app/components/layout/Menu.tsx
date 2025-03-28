'use client';

import { useRouter, usePathname } from 'next/navigation';
import Profile from 'components/layout/Profile';

const Menu = () => {

    const router = useRouter();
    const pathname = usePathname();

    // ボタン共通クラス
    const baseButtonClassName = "px-6 py-2 text-left transition-colors duration-300";
    // 現在のページが一致する場合に追加するクラス
    const activeClassName = "bg-primary-200";

    return (
        <div className="flex flex-col w-screen text-sm sm:text-base">
            <Profile
                className={"flex justify-start px-5 lg:px-4 py-3 border-b-2 border-gray-200"}
                imageClassName={"rounded-full border border-2 border-gray-200"}
            />
            <button
                type="button"
                onClick={() => router.push('/search')}
                className={`${baseButtonClassName} ${pathname === '/search' ? activeClassName : 'hover:bg-gray-200'}`}
            >
                書籍検索
            </button>
            <button
                type="button"
                onClick={() => router.push('/favorites')}
                className={`${baseButtonClassName} ${pathname === '/favorites' ? activeClassName : 'hover:bg-gray-200'}`}
            >
                お気に入り
            </button>
            <button type="button"
                onClick={() => router.push('/bookshelf')}
                className={`${baseButtonClassName} ${pathname === '/bookshelf' ? activeClassName : 'hover:bg-gray-200'}`}
            >
                マイ本棚
            </button>
            <button
                type="button"
                className={`${baseButtonClassName} ${pathname === '/' ? activeClassName : 'hover:bg-gray-200'}`}
            >
                プロフィール
            </button>
            {/* <button
                type="button"
                className={`${baseButtonClassName} ${pathname === '/progression' ? activeClassName : 'hover:bg-gray-200'}`}
            >
                プログレッション
            </button> */}
        </div>
    );
};

export default Menu;