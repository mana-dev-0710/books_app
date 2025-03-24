'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Icons from "components/icons/Icons";
import { SearchedBook } from "@/types/bookTypes";
import Loading from "components/layout/Loading";

const defaultBookImage = '/images/default-book.png';

type SearchError = {
    message?: string;
};

type Toast = {
    message: string; 
    type: "success" | "error" | "info";
};

type BookCardProp = {
    book: SearchedBook;
    setToast: React.Dispatch<React.SetStateAction<Toast | null>>;
    setError: React.Dispatch<React.SetStateAction<SearchError | undefined>>;
};

const BookCard = ({ book, setToast, setError }: BookCardProp) => {
    const [imageUrl, setImageUrl] = useState<string>(defaultBookImage);
    const [loading, setLoading] = useState<boolean>(true);
    const [isFavorite, setIsFavorite] = useState<boolean>(book.isFavorite);
    const [isInBookshelf, setIsInBookshelf] = useState<boolean>(book.isInBookshelf);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                setLoading(true);
                const imgUrl = book.imgUrl;
                if (imgUrl) {
                    setImageUrl(imgUrl);
                } else {
                    setImageUrl(defaultBookImage);
                }
            } catch (error) {
                setImageUrl(defaultBookImage);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [book, setError]);

    // お気に入りトグル処理
    const toggleFavorite = async () => {

        try {
            let alertMessage: string = "";

            if (isFavorite) {
                // お気に入り追加済みの場合、削除
                const res = await fetch(`/api/search/favorite?isbn=${book.isbn}`, {
                    method: "DELETE"
                });
                alertMessage = "お気に入りから削除しました。";
            } else {
                // お気に入り登録
                const res = await fetch(`/api/search/favorite?isbn=${book.isbn}`, {
                    method: 'PUT',
                });
                alertMessage = "お気に入りに追加しました。";
            }
            setIsFavorite(!isFavorite);
            setToast({ message: alertMessage, type: "success" });
        } catch (e) {
            setToast({ message: "お気に入りの更新に失敗しました。", type: "error" });
            console.error("お気に入りの更新中に予期せぬエラーが発生しました。:", e);
        }

    };

    // 本棚トグル処理
    const toggleBookshelf = async () => {

        try {
            if (!isInBookshelf) {
                // 未登録の場合、本棚に登録
                const res = await fetch(`/api/search/?isbn=${book.isbn}`, {
                    method: "PUT"
                });
                const resData = await res.json();

                if(res.ok) {
                    setToast({ message: "本棚に追加しました。", type: "success" });
                    setIsInBookshelf(!isInBookshelf);
                } else {
                    setToast({ message: "本棚の追加に失敗しました。", type: "error" });
                    console.error("本棚に追加に失敗しました。:", resData.error);
                }
            } else {
                return;
            }
        } catch (e) {
            setToast({ message: "本棚の追加に失敗しました。", type: "error" });
            console.error("本棚に追加中に予期せぬエラーが発生しました。:", e);
        }

    };

    return (
        <div className="flex flex-col bg-white border rounded-lg shadow-sm p-4">
            <p className="py-1 font-semibold text-sm border-b mb-2">{book.title}</p>
            <div className="flex justify-between text-xs mb-2">
                <p className="font-semibold">vol. {book.volume}</p>
                <p>{book.author}</p>
            </div>
            {loading ? (
                <Loading className={"h-32 flex justify-center items-center"} />
            ) : (
                <Image
                    src={`${book.imgUrl}`}
                    alt="書影イメージ"
                    width={80}
                    height={80}
                    priority
                    className="rounded-md border border-gray-100 mb-2"
                />
            )}
            <div className="flex flex-col justify-between h-full">
                <ul className="text-xs space-y-1">
                    <li>出版社：{book.publisher}</li>
                    <li>発行日：{book.publicationDate}</li>
                    <li>ジャンル：{book.genre}</li>
                    <li>ISBN：{book.isbn}</li>
                </ul>

                <div className="flex justify-end items-center gap-3 mt-2">
                    <Icons
                        name="favorite"
                        className={`${!isFavorite ? "" : "hidden"} text-gray-600`}
                        onClick={() => toggleFavorite()}
                    />
                    <Icons
                        name="favoriteSolid"
                        className={`${isFavorite ? "" : "hidden"} text-gray-600`}
                        onClick={() => toggleFavorite()}
                    />
                    <Icons
                        name="addBookshelf"
                        className={`${isInBookshelf ? "hidden" : ""} text-gray-600`}
                        onClick={() => toggleBookshelf()}
                    />
                    <Icons
                        name="isInBookshelf"
                        className={`${!isInBookshelf ? "hidden" : ""} text-gray-600`}
                    />
                </div>
            </div>

        </div>
    );
};


export default BookCard;
