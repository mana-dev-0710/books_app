'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dropdown, Rating, RatingStar } from 'flowbite-react';
import BookshelfDetailModal from 'components/modals/BookshelfDetailModal';
import BookshelfEditModal from 'components/modals/BookshelfEditModal';
import BookshelfDeleteModal from 'components/modals/BookshelfDeleteModal';
import Icons from "components/icons/Icons"
import { MyBook } from "@/types/bookTypes"
import { BookshelfEditForm } from "@/types/formTypes"

const MyBookList = () => {

    const router = useRouter();
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<MyBook | null>(null);
    const [books, setBooks] = useState<MyBook[] | null>(null);

    // 検索処理
    const searchBookshelf = async () => {

        const res = await fetch('/api/bookshelf', { method: 'GET' });
        if (res.ok) {
            const resJson = await res.json();
            setBooks(resJson.books);
        } else {
            alert('検索処理に失敗しました。');
        }

    };

    useEffect(() => {

        const fetchBookshelf = async () => {
            try {
                await searchBookshelf();
            } catch (e) {
                console.error('マイ本棚の検索処理エラー:', e);
                alert('マイ本棚の検索処理に失敗しました。');
            }
        }
        fetchBookshelf();

    }, [router]);

    // 詳細モーダルを開く
    const handleOpenDetailModal = (book: MyBook) => {
        setSelectedBook(book);
        setIsDetailModalOpen(true);
    };

    // 詳細モーダルを閉じる
    const handleCloseDetailModal = () => {
        setSelectedBook(null);
        setIsDetailModalOpen(false);
    };

    // 編集モーダルを開く
    const handleOpenEditModal = (book: MyBook) => {
        setSelectedBook(book);
        setIsEditModalOpen(true);
    };

    // 編集モーダルを閉じる
    const handleCloseEditModal = () => {
        setSelectedBook(null);
        setIsEditModalOpen(false);
    };

    // 削除モーダルを開く
    const handleOpenDeleteModal = (book: MyBook) => {
        setSelectedBook(book);
        setIsDeleteModalOpen(true);
    };

    // 削除モーダルを閉じる
    const handleCloseDeleteModal = () => {
        setSelectedBook(null);
        setIsDeleteModalOpen(false);
    };

    // 編集処理
    const handleEditConfirm = async (data: BookshelfEditForm) => {
        if (!data) return;
        if (!selectedBook) return;

        if (!data.finishedReading && data.finishedAt) {
            alert('読了日を追加する場合、読了状態で"読了"を選択してください。');
            return;
        }

        if ((data.rating || data.reviewTitle || data.reviewContent)
            && (!data.rating || !data.reviewTitle)) {
            alert('評価する場合、評価と評価タイトルの入力は必須です。');
            return;
        }

        try {
            const fetchUrl = `/api/bookshelf`;
            const requestBody = {
                bookshelfId: selectedBook.bookshelfId,
                finishedReading: data.finishedReading ?? false,
                finishedAt: data.finishedAt || "",
                isRated: data.rating ? true : false,
                reviewTitle: data.reviewTitle || "",
                rating: data.rating || "",
                reviewContent: data.reviewContent || "",
            };

            const response = await fetch(fetchUrl, {
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                alert('書籍情報を編集しました！');
                handleCloseEditModal();
                await searchBookshelf();
            } else {
                alert('書籍情報の編集に失敗しました。');
            }
        } catch (error) {
            console.error('書籍情報の編集処理エラー:', error);
            alert('書籍情報の編集に失敗しました。');
        }
    };

    // 削除処理
    const handleDeleteConfirm = async () => {
        if (!selectedBook) return;

        try {
            let fetchUrl = '/api/bookshelf?';
            const queryParams = new URLSearchParams();

            queryParams.append("bookshelfId", selectedBook.bookshelfId);
            fetchUrl += queryParams;

            const res = await fetch(fetchUrl, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json; charset=UTF-8",
                },
            });
            if (res.ok) {
                handleCloseDeleteModal();
                alert('書籍情報を削除しました！');
                await searchBookshelf();
            } else {
                alert('書籍情報の削除に失敗しました。');
            }
        } catch (error) {
            console.error('書籍情報の削除処理エラー:', error);
            alert('書籍情報の削除に失敗しました。');
        }
    };

    return (
        <>
            <table className="min-w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-primary-100 text-gray-500 text-xs font-medium">
                    <tr>
                        <th className="px-3 py-2 text-start">書籍タイトル</th>
                        <th className="px-3 py-2 text-start">vol.</th>
                        <th className="hidden sm:table-cell px-3 py-2 text-start">作者</th>
                        <th className="hidden sm:table-cell min-w-[4rem] px-3 py-2 text-start">読了</th>
                        <th className="hidden sm:table-cell min-w-[4rem] px-3 py-2 text-start">評価</th>
                        <th className="px-3 py-2 text-end"></th>
                    </tr>
                </thead>
                {books === null ? (
                    <tbody className="bg-white text-gray-500 text-xs font-medium">
                        <tr>
                            <td className="px-3 py-2 whitespace-normal font-medium">
                                マイ本棚を取得中...
                            </td>
                            <td className="px-3 py-2 text-start"></td>
                            <td className="hidden sm:table-cell px-3 py-2 text-start"></td>
                            <td className="hidden sm:table-cell min-w-[4rem] px-3 py-2 text-start"></td>
                            <td className="hidden sm:table-cell min-w-[7rem] px-3 py-2 text-start"></td>
                            <td className="px-3 py-2 text-end"></td>
                        </tr>
                    </tbody>
                ) : books.length > 0 ? (
                    <tbody className="divide-y divide-gray-200 bg-white text-start text-xs">
                        {books.map((book, index) => (
                            <tr key={index}>
                                <td className="px-3 py-2 whitespace-normal font-medium">{book.title}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{book.volume}</td>
                                <td className="hidden sm:table-cell px-3 py-1 whitespace-normal">{book.author}</td>
                                <td className={`hidden sm:table-cell px-3 py-1 min-w-[7rem] whitespace-normal ${!book.finishedReading ? 'text-gray-500' : ''}`}>
                                    {book.finishedReading ?
                                        <div className="flex items-center gap-1">
                                            <Icons name="isInBookshelf" className="w-5 text-primary-400" />
                                            <p>{book.finishedAt}</p>
                                        </div>
                                        : "未読"
                                    }
                                </td>
                                <td className={`hidden sm:table-cell px-3 py-1 min-w-[4rem] whitespace-normal ${!book.isRated ? 'text-gray-500' : ''}`}>
                                    {book.isRated ?
                                        <Rating>
                                            <RatingStar className="text-yellow-400" />
                                            <p>{book.rating}/5</p>
                                        </Rating> :
                                        "未評価"
                                    }
                                </td>
                                <td className="px-3 py-1">
                                    <Dropdown
                                        inline={true}
                                        placement="bottom-end"
                                        className="btn btn-ghost btn-sm btn-circle dark:bg-white-100 dark:text-gray-800"
                                    >
                                        <Dropdown.Item
                                            onClick={() => handleOpenDetailModal(book)}
                                            className="dark:hover:bg-gray-100 dark:hover:text-gray-700"
                                        >
                                            詳細
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => handleOpenEditModal(book)}
                                            className="dark:hover:bg-gray-100 dark:hover:text-gray-700"
                                        >
                                            編集
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => handleOpenDeleteModal(book)}
                                            className="dark:hover:bg-gray-100 dark:hover:text-gray-700"
                                        >
                                            削除
                                        </Dropdown.Item>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                ) : (
                    <tbody className="px-3 py-2 bg-white text-start text-sm text-gray-700">
                        <tr>
                            <td className="px-3 py-2 whitespace-normal font-medium">本棚に書籍がありません。</td>
                            <td className="px-3 py-2 text-start"></td>
                            <td className="hidden sm:table-cell px-3 py-2 text-start"></td>
                            <td className="hidden sm:table-cell min-w-[4rem] px-3 py-2 text-start"></td>
                            <td className="hidden sm:table-cell min-w-[4rem] px-3 py-2 text-start"></td>
                            <td className="px-3 py-2 text-end"></td>
                        </tr>
                    </tbody>
                )}
            </table>
            <BookshelfDetailModal
                isDetailModalOpen={isDetailModalOpen}
                handleCloseDetailModal={handleCloseDetailModal}
                className="flex items-center justify-center py-8 bg-gray-400 bg-opacity-60 text-xs"
                size="md"
                book={selectedBook}
            />
            <BookshelfEditModal
                isEditModalOpen={isEditModalOpen}
                handleCloseEditModal={handleCloseEditModal}
                handleEditConfirm={handleEditConfirm}
                className="flex items-center justify-center py-8 bg-gray-400 bg-opacity-60 text-xs"
                size="md"
                book={selectedBook}
            />
            <BookshelfDeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                handleCloseDeleteModal={handleCloseDeleteModal}
                handleDeleteConfirm={handleDeleteConfirm}
                className="flex items-center justify-center py-8 bg-gray-400 bg-opacity-60 text-xs"
                size="md"
                book={selectedBook}
            />
        </>
    );
};

export default MyBookList;
