'use client';

import React, { useState, useEffect, useRef } from 'react'
import { signOut } from "next-auth/react"
import Icons from "components/icons/Icons";
import Menu from "components/layout/Menu";

const Header = () => {

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);

  const handleMenuOpen = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    setOpenMenu(false);
  }, []);

  // メニュー範囲外押下の検知（押下時、閉じる処理実行）
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current &&
        !menuRef.current.contains(target) &&
        iconRef.current &&
        !iconRef.current.contains(target)
      ) {
        setOpenMenu(false);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [openMenu]);

  return (
    <div>
      <header className="fixed top-0 min-w-screen left-0 w-full bg-white z-50">
        <nav className="flex items-center justify-between px-4 py-2 flex-wrap w-full bg-primary-600 text-white">
          <div
            ref={iconRef}
            className="lg:hidden text-sm align-content-center">
            <Icons
              name="hamburger"
              className={"h-6 w-6"}
              onClick={() => handleMenuOpen()}
            />
          </div>
          <div className="flex items-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="font-semibold text-xl">BOOKS</span>
          </div>
          <div className="flex items-center">
            <div className="inline-block text-sm">
              <svg className="hidden inline-block h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="py-1 px-2 bg-secondary-400 hover:bg-secondary-500 text-white text-sm sm:text-base rounded-md hover:shadow hover:shadow-black">ログアウト</button>
            </div>
          </div>
        </nav>
      </header >
      <div
        ref={menuRef}
        className={`absolute left-0 pt-12 z-10 bg-gray-100 shadow-sm transition-all duration-300 ease-in-out ${openMenu
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
      >
        <Menu />
      </div>
    </div>
  );
};

export default Header;