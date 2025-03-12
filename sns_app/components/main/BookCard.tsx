'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Icons from "components/icons/Icons";
import { Book } from "@/types/bookshelf";
import Loading from "components/layout/Loading";

type SearchError = {
    message?: string;
};

type BookCardProp = {
    book: Book;
    iconsSolid: {
        favorite: boolean;
        finishedReading: boolean;
    };
    toggleIconVisibility: (iconName: "favorite" | "finishedReading") => void;
    setError: React.Dispatch<React.SetStateAction<SearchError | undefined>>;
};

const defaultBookImage = '/images/default-book.png';

const BookCard = ({ book, iconsSolid, toggleIconVisibility, setError }: BookCardProp) => {
    const [imageUrl, setImageUrl] = useState<string>(defaultBookImage);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                setLoading(true);
                const url = await searchImg(book, setError);
                setImageUrl(url);
            } catch (error) {
                setImageUrl(defaultBookImage);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [book, setError]);

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
                    src={imageUrl}
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
                        className={`${iconsSolid.favorite ? "hidden" : ""} text-gray-600`}
                        onClick={() => toggleIconVisibility("favorite")}
                    />
                    <Icons
                        name="favoriteSolid"
                        className={`${iconsSolid.favorite ? "" : "hidden"} text-gray-600`}
                        onClick={() => toggleIconVisibility("favorite")}
                    />
                    <Icons
                        name="finishedReading"
                        className={`${iconsSolid.finishedReading ? "hidden" : ""} text-gray-600`}
                        onClick={() => toggleIconVisibility("finishedReading")}
                    />
                    <Icons
                        name="finishedReadingSolid"
                        className={`${iconsSolid.finishedReading ? "" : "hidden"} text-gray-600`}
                        onClick={() => toggleIconVisibility("finishedReading")}
                    />
                </div>
            </div>

        </div>
    );
};

// 書影検索の処理
export async function searchImg(data: Book, setError: React.Dispatch<React.SetStateAction<SearchError | undefined>>): Promise<string> {
    let imageUrl = defaultBookImage;

    try {
        const res = await fetch(`/api/books/searchBookImg?isbn=${data.isbn}&jpeCode=${data.jpeCode}`, {
            method: "GET",
        });

        const resJson = await res.json();

        if (res.ok) {
            if (resJson.imageUrl) {
                imageUrl = resJson.imageUrl;
            }
        } else {
            setError({ message: resJson.error });
        }
        return imageUrl;

    } catch (e) {
        setError({ message: "書影検索中にエラーが発生しました。" });
        return imageUrl;
    }
};

export default BookCard;
