'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dropdown } from 'flowbite-react';
import { FavoriteBook, MyBook } from "@/types/bookTypes"
import DeleteModal from "components/modals/DeleteModal"

const MyBookList = () => {

    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<FavoriteBook | null>(null);
    const [books, setBooks] = useState<FavoriteBook[] | null>(null);

    // お気に入り検索処理
    const searchFavorites = async () => {

        const res = await fetch('/api/favorites', { method: 'GET' });
        console.log('res:', res);
        if (res.ok) {
            const resJson = await res.json();
            console.log('resData:', resJson);

            setBooks(resJson.books);
        } else {
            alert('検索処理に失敗しました。');
        }

    };

    useEffect(() => {

        const fetchFavorites = async () => {
            try {
                await searchFavorites();
            } catch (e) {
                console.error('検索処理中に予期せぬエラーが発生しました。:', e);
                alert('検索処理中に予期せぬエラーが発生しました。');
            }
        }
        fetchFavorites();

    }, []);

    // モーダルを開く
    const handleOpenDeleteModal = (book: FavoriteBook) => {
        console.log("handleOpenDeleteModal execute.");
        setSelectedBook(book);
        setIsDeleteModalOpen(true);
    };

    // モーダルを閉じる
    const handleCloseDeleteModal = () => {
        setSelectedBook(null);
        setIsDeleteModalOpen(false);
    };

    // 編集処理
    const handleEditConfirm = async () => {
        if (!selectedBook) return;

        try {
            const response = await fetch(`/api/books/${selectedBook.favoriteBookId}`, {
                method: 'PUT',
            });
            if (response.ok) {
                alert('編集が完了しました！');
                handleCloseDeleteModal();
                await searchFavorites();
            } else {
                alert('編集に失敗しました。');
            }
        } catch (error) {
            console.error('編集処理エラー:', error);
            alert('エラーが発生しました。');
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
                alert('削除が完了しました！');//TODO:トーストにする
                handleCloseDeleteModal();
                await searchFavorites();
            } else {
                alert('削除処理に失敗しました。');
            }
        } catch (error) {
            console.error('削除処理エラー:', error);
            alert('エラーが発生しました。');
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
                            <th className="px-3 py-2 text-start"></th>
                            <th className="hidden sm:table-cell px-3 py-2 text-start"></th>
                            <th className="hidden sm:table-cell min-w-[4rem] px-3 py-2 text-start"></th>
                            <th className="px-3 py-2 text-end"></th>
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
                                    {book.isInBookshelf ? "保存済み" : "未保存"}
                                </td>
                                <td className="px-3 py-1">
                                    <Dropdown inline={true} placement="bottom-end" className="btn btn-ghost btn-sm btn-circle">
                                        <Dropdown.Item onClick={() => console.log("詳細")}>詳細</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleEditConfirm()}>編集</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleOpenDeleteModal(book)}>削除</Dropdown.Item>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                ) : (
                    <tbody className="px-3 py-2 bg-white text-start text-sm text-gray-700">
                        <tr>
                            <td className="px-3 py-2 whitespace-normal font-medium">本棚に書籍がありません。</td>
                        </tr>
                    </tbody>
                )}
            </table>
            <DeleteModal
                isDeleteModalOpen={isDeleteModalOpen}
                handleCloseDeleteModal={handleCloseDeleteModal}
                handleDeleteConfirm={handleDeleteConfirm}
                className="flex items-center justify-center py-32 bg-gray-400 bg-opacity-60 text-xs"
                size="md"
                book={selectedBook}
            />
        </>
    );
};

export default MyBookList;
