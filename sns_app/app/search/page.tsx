'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "components/layout/Header";
import Sidebar from "components/layout/Sidebar";
import Loading from "components/layout/Loading";
import Title from "components/layout/Title";
import IsbnSearchForm from "components/main/IsbnSearchForm";
import DetailsSearchForm from "components/main/DetailsSearchForm";
import BookCard from "components/main/BookCard";
import { SearchedBook } from "@/types/bookTypes";
import { Toast } from "@/types/toastTypes";
import ToastNotification from "@/components/common/ToastNotification";
import { Tabs } from 'flowbite-react';

type SearchForm = {
    isbn?: string;
    title?: string;
    author?: string;
    publisher?: string;
};

type SearchError = {
    message?: string;
};

const Search = () => {

    const { status } = useSession();
    const router = useRouter();
    const [books, setBooks] = useState<SearchedBook[]>([]);
    const [searchError, setSearchError] = useState<SearchError>();
    const [searchResultLoading, setSearchResultLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<Toast | null>(null);
    const [activeTab, setActiveTab] = useState<'isbn' | 'details'>('isbn');

    useEffect(() => {
        if (status === "unauthenticated") {
            // ローディング中に画面が表示されないよう、pushではなくreplaceを使用
            router.replace("/login");
        }
    }, [status, router]);

    // ローディングまたは未認証時にローディング画面を表示
    if (status === "loading" || status === "unauthenticated") {
        return <Loading className="h-screen flex justify-center items-center bg-secondary-50" />
    }

    // 書籍検索の処理
    const searchBooks = async (data: SearchForm) => {
        setSearchResultLoading(true);
        setBooks([]);
        setSearchError(undefined);
        setToast(null);

        //OpenSearchAPIから書籍情報を取得
        try {
            let fetchUrl = '/api/search?';
            const queryParams = new URLSearchParams();

            if (data.isbn) {
                queryParams.append("isbn", data.isbn);
            } else {
                if (data.title) {
                    queryParams.append("title", data.title);
                }
                if (data.author) {
                    queryParams.append("author", data.author);
                }
                if (data.publisher) {
                    queryParams.append("publisher", data.publisher);
                }
            }
            fetchUrl += queryParams;

            const res = await fetch(fetchUrl, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json; charset=UTF-8",
                },
            });

            const resData = await res.json();
            if (res.ok) {
                setBooks(resData.books);
            } else {
                setSearchError({ message: resData.error });
            }
        } catch (err) {
            setSearchError({ message: "書籍情報検索中にエラーが発生しました。" });
        } finally {
            setSearchResultLoading(false);
        }

    };

    return (
        <>
            <div className="font-[family-name:var(--font-geist-sans)] overflow-hidden">
                <Header />
                <main className="flex h-screen pt-12">
                    <div className="hidden lg:flex lg:basis-1/4 p-5 pt-10 bg-secondary-50">
                        <Sidebar />
                    </div>
                    <div className="lg:basis-3/4 w-full h-screen bg-secondary-50 overflow-x-auto">
                        <div className="flex flex-col h-full px-5 py-3">
                            <Title titleName="書籍検索" />
                            <div className="pb-3 border-b border-gray-300">
                                <Tabs onActiveTabChange={(tab) => setActiveTab(tab === 0 ? "isbn" : "details")}
                                    variant="underline"
                                    theme={{
                                        tablist: {
                                            base: "flex border-b border-gray-300",
                                            tabitem: {
                                                base: "px-4 py-2 text-xs",
                                                variant: {
                                                    underline: {
                                                        base: "rounded-t-md text-gray-800 ",
                                                        active: {
                                                            on: "bg-primary-200 font-semibold",
                                                            off: "text-gray-600 hover:font-semibold hover:text-primary-600",
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <Tabs.Item title="ISBN検索" active={activeTab === 'isbn'}>
                                        <IsbnSearchForm searchBooks={searchBooks} />
                                    </Tabs.Item>
                                    <Tabs.Item title="詳細検索" active={activeTab === 'details'}>
                                        <DetailsSearchForm searchBooks={searchBooks} />
                                    </Tabs.Item>
                                </Tabs>
                            </div>
                            {searchResultLoading ? (
                                <Loading className="flex justify-center items-center pt-10" />
                            ) : (
                                <>
                                    <p className="p-1 mt-2 text-xs md:text-sm text-red-500">
                                        {searchError?.message && <span>{searchError.message}</span>}
                                    </p>
                                    <div className="relative flex-1">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-1 py-3 pb-16">
                                            {Array.isArray(books) && books.map((book, index) => (
                                                <BookCard
                                                    key={index}
                                                    book={book}
                                                    setToast={setToast}
                                                    setError={setSearchError}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            {/* トースト表示 */}
            {toast &&
                <ToastNotification
                    className="fixed top-5 right-5 z-50"
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            }
        </>
    );
};

export default Search;

