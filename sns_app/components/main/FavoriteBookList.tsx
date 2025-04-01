'use client';

import { useState, useEffect } from 'react';
import { Dropdown } from 'flowbite-react';
import { FavoriteBook } from "types/bookTypes"
import Icons from "components/icons/Icons"
import FavoriteDetailModal from "components/modals/FavoriteDetailModal"
import FavoriteDeleteModal from "components/modals/FavoriteDeleteModal"
import ToastNotification from "@/components/common/ToastNotification";
import { Toast } from "@/types/toastTypes";

const FavoriteBookList = () => {

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<FavoriteBook | null>(null);
    const [books, setBooks] = useState<FavoriteBook[] | null>(null);
    const [toast, setToast] = useState<Toast | null>(null);

    // お気に入り検索処理
    const searchFavorites = async () => {

        const res = await fetch('/api/favorites', { method: 'GET' });
        if (res.ok) {
            const resJson = await res.json();
            setBooks(resJson.books);
        } else {
            setToast({ message: "お気に入りの検索に失敗しました。", type: "error" });
        }

    };

    useEffect(() => {

        const fetchFavorites = async () => {
            try {
                await searchFavorites();
            } catch (e) {
                console.error('お気に入り検索処理エラー:', e);
                setToast({ message: "お気に入りの検索に失敗しました。", type: "error" });
            }
        }
        fetchFavorites();

    }, []);

    // モーダルを開く
    const handleOpenDetailModal = (book: FavoriteBook) => {
        setSelectedBook(book);
        setIsDetailModalOpen(true);
    };

    // モーダルを閉じる
    const handleCloseDetailModal = () => {
        setSelectedBook(null);
        setIsDetailModalOpen(false);
    };

    // モーダルを開く
    const handleOpenDeleteModal = (book: FavoriteBook) => {
        setSelectedBook(book);
        setIsDeleteModalOpen(true);
    };

    // モーダルを閉じる
    const handleCloseDeleteModal = () => {
        setSelectedBook(null);
        setIsDeleteModalOpen(false);
    };

    // 本棚追加処理
    const handleAddToBookshelf = async (book: FavoriteBook) => {
        if (!book) return;

        try {
            let fetchUrl = '/api/favorites?';
            const queryParams = new URLSearchParams();

            queryParams.append("favoriteBookId", book.favoriteBookId);
            fetchUrl += queryParams;
            const res = await fetch(fetchUrl, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json; charset=UTF-8",
                },
            });

            if (res.ok) {
                setToast({ message: "本棚に追加しました！", type: "success" });
                await searchFavorites();
            } else {
                setToast({ message: "本棚への追加に失敗しました。", type: "error" });
            }
        } catch (error) {
            console.error('本棚への追加処理エラー:', error);
            setToast({ message: "本棚への追加に失敗しました。", type: "error" });
        }
    };

    // 削除処理
    const handleDeleteConfirm = async () => {
        if (!selectedBook) return;

        try {
            let fetchUrl = '/api/favorites?';
            const queryParams = new URLSearchParams();

            queryParams.append("favoriteBookId", selectedBook.favoriteBookId);
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
                setToast({ message: "お気に入りから削除しました！", type: "success" });
                await searchFavorites();
            } else {
                handleCloseDeleteModal();
                setToast({ message: "お気に入りの削除に失敗しました。", type: "error" });
            }
        } catch (error) {
            console.error('お気に入り削除処理エラー:', error);
            handleCloseDeleteModal();
            setToast({ message: "お気に入りの削除に失敗しました。", type: "error" });
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
                        <th className="hidden sm:table-cell min-w-[4rem] px-3 py-2 text-start">本棚</th>
                        <th className="px-3 py-2 text-end"></th>
                    </tr>
                </thead>
                {books === null ? (
                    <tbody className="bg-white text-gray-500 text-xs font-medium">
                        <tr>
                            <td className="px-3 py-2 whitespace-normal font-medium">
                                お気に入り書籍を取得中...
                            </td>
                            <td className="px-3 py-2 text-start"></td>
                            <td className="hidden sm:table-cell px-3 py-2 text-start"></td>
                            <td className="hidden sm:table-cell min-w-[4rem] px-3 py-2 text-start"></td>
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
                                <td className={`hidden sm:table-cell px-3 py-1 min-w-[4rem] whitespace-normal ${!book.isInBookshelf ? 'text-gray-500' : ''}`}>
                                    {book.isInBookshelf ?
                                        <div className="flex items-center">
                                            保存済み<Icons name="isInBookshelf" className="w-5 text-primary-400" />
                                        </div>
                                        : "未保存"
                                    }
                                </td>
                                <td className="px-3 py-1">
                                    <Dropdown inline={true} placement="bottom-end" className="btn btn-ghost btn-sm btn-circle">
                                        <Dropdown.Item onClick={() => handleOpenDetailModal(book)}>詳細</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleOpenDeleteModal(book)}>削除</Dropdown.Item>
                                        {book.isInBookshelf ?
                                            <></>
                                            : <Dropdown.Item onClick={() => handleAddToBookshelf(book)}>本棚追加</Dropdown.Item>
                                        }
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                ) : (
                    <tbody className="px-3 py-2 bg-white text-start text-sm text-gray-700">
                        <tr>
                            <td className="px-3 py-2 whitespace-normal font-medium">お気に入り書籍がありません。</td>
                            <td className="px-3 py-2 text-start"></td>
                            <td className="hidden sm:table-cell px-3 py-2 text-start"></td>
                            <td className="hidden sm:table-cell min-w-[4rem] px-3 py-2 text-start"></td>
                            <td className="px-3 py-2 text-end"></td>
                        </tr>
                    </tbody>
                )}
            </table>
            <FavoriteDetailModal
                isDetailModalOpen={isDetailModalOpen}
                handleCloseDetailModal={handleCloseDetailModal}
                className="flex items-center justify-center py-32 bg-gray-400 bg-opacity-60 text-xs"
                size="md"
                book={selectedBook}
            />
            <FavoriteDeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                handleCloseDeleteModal={handleCloseDeleteModal}
                handleDeleteConfirm={handleDeleteConfirm}
                className="flex items-center justify-center py-32 bg-gray-400 bg-opacity-60 text-xs"
                size="md"
                book={selectedBook}
            />
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

export default FavoriteBookList;
