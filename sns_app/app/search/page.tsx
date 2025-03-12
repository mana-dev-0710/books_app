'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Header from "components/layout/Header";
import Sidebar from "components/layout/Sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import { validationSearchSchema } from "app/utils/validationSchema";
import BookCard from "@/components/main/BookCard";
import { Book } from "@/types/bookshelf";

type SearchForm = {
    isbn: string;
    title?: string;
    creator?: string;
    publisher?: string;
};

//フォーム入力時のエラー
type SearchError = {
    message?: string;
};

const defaultProfileImage = '/images/default-profile.png';
const defaultBookImage = '/images/default-book.png';

const Bookshelf = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);
    const [searchError, setSearchError] = useState<SearchError>();
    const [iconsSolid, setIconsSolid] = useState({
        favorite: true,
        finishedReading: true,
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
    } = useForm<SearchForm>({
        mode: "onChange",
        resolver: zodResolver(validationSearchSchema),
    });

    // useEffect(() => {
    //     if (status === "unauthenticated") {
    //         // ローディング中にbookshelf画面が表示されないよう、pushではなくreplaceを使用
    //         router.replace("/login");
    //     }
    // }, [status, router]);

    // // ローディングまたは未認証時にローディング画面を表示
    // if (status === "loading" || status === "unauthenticated") {
    //     return <div className="h-screen flex justify-center items-center bg-secondary-50" aria-label="読み込み中">
    //         <div className="animate-spin h-10 w-10 border-4 border-secondary-500 rounded-full border-t-transparent"></div>
    //     </div>;
    // }

    const toggleIconVisibility = (iconName: keyof typeof iconsSolid) => {
        setIconsSolid((prev) => ({
            ...prev,
            [iconName]: !prev[iconName],
        }));
    };

    // 書籍検索の処理
    const searchBooks = async (data: SearchForm) => {
        setBooks([]);
        setSearchError(undefined);

        //OpenSearchAPIから書籍情報を取得
        try {
            const res = await fetch(`/api/books/search?isbn=${data.isbn}`, {
                method: "GET"
            });

            const resData = await res.json();

            if (res.ok) {
                setBooks(resData);
            } else {
                setSearchError({ message: resData.error });
            }
        } catch (err) {
            setSearchError({ message: "書籍情報検索中にエラーが発生しました。" });
        }

        //TODO:DBから読書情報を取得
        // try {
        //     // TODO:DBから取得する処理
        //     const res = await fetch(`/api/books/search?isbn=${data.isbn}`);
        //     const resJson = await res.json();

        //     if (resJson.error) {
        //         setError(resJson.error);
        //     } else {
        //         setBooks(resJson);
        //     }
        // } catch (err) {
        //     setError("読書情報取得中にエラーが発生しました。");
        // }
    };

    return (
        <div className="font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
            <Header />
            <main className="flex">
                <div className="hidden lg:flex lg:basis-1/4 p-5 pt-10 bg-secondary-50">
                    <Sidebar />
                </div>
                <div className="lg:basis-3/4 w-full h-screen bg-secondary-50 overflow-x-auto">
                    <div className="flex flex-col px-5 py-3">
                        <h2 className="py-2 text-base md:text-lg font-semibold">書籍検索</h2>
                        <div className="pb-5 border-b border-gray-300">
                            <form className="flex flex-col" onSubmit={handleSubmit(searchBooks)}>
                                <label className="py-1 text-sm md:text-base" htmlFor="isbn">
                                    ISBN
                                </label>
                                <input
                                    id="isbn"
                                    type="text"
                                    placeholder="ISBN"
                                    className="w-56 p-1 pl-2 text-sm border focus:outline-primary-400"
                                    {...register("isbn")}
                                />
                                <p className="p-1 text-xss text-red-500">
                                    {errors.isbn?.message as React.ReactNode}
                                </p>
                                <div className="w-full flex justify-end">
                                    <button className="py-1 px-3 text-sm sm:text-base rounded-md hover:shadow hover:shadow-black bg-primary-400 hover:bg-primary-500 text-white disabled:bg-primary-200 disabled:shadow-none" type="submit" disabled={!isValid}>検索</button>
                                </div>
                            </form>
                        </div>
                        <p className="p-1 mt-2 text-xs text-red-500">
                            {searchError?.message && <span>{searchError.message}</span>}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] pr-1 py-3">
                            {books.map((book, index) => (
                                <BookCard
                                    key={index}
                                    book={book}
                                    iconsSolid={iconsSolid}
                                    toggleIconVisibility={toggleIconVisibility}
                                    setError={setSearchError}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Bookshelf;
