'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dropdown } from 'flowbite-react';
import { Modal } from 'flowbite-react';
import { Book } from "@/types/bookshelf";
import { SearchForm } from "@/types/bookshelf";
import Icons from "components/icons/Icons";

const BookList = () => {

    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [books, setBooks] = useState<Book[]>([
        {
            isbn: "",
            finished: false,
        },
    ]);
    const [isLoading, setIsLoading] = useState(true);

    // 検索処理
    const searchBookshelf = async () => {

        const res = await fetch('/api/bookshelf', { method: 'GET' });
        console.log('res:', res);
        if (res.ok) {
            const resJson = await res.json();
            console.log('resData:', resJson);

            setBooks(resJson.books);

            console.log('bookshelf:', books);
        } else {
            alert('検索処理に失敗しました。');
        }

    };

    useEffect(() => {

        const fetchBookshelf = async () => {
            try {
                await searchBookshelf();
            } catch (e) {
                console.error('検索処理中に予期せぬエラーが発生しました。:', e);
                alert('検索処理中に予期せぬエラーが発生しました。');
            }
        }
        fetchBookshelf();

    }, [router]);

    // モーダルを開く
    const handleOpenDeleteModal = (bookId: string) => {
        console.log("handleOpenDeleteModal execute.");
        setSelectedBookId(bookId);
        setIsDeleteModalOpen(true);
    };

    // モーダルを閉じる
    const handleCloseDeleteModal = () => {
        setSelectedBookId(null);
        setIsDeleteModalOpen(false);
    };

    // 編集処理
    const handleEditConfirm = async () => {
        if (!selectedBookId) return;

        try {
            const response = await fetch(`/api/books/${selectedBookId}`, {
                method: 'PUT',
            });
            if (response.ok) {
                alert('編集が完了しました！');
                handleCloseDeleteModal();
                router.refresh();
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
        if (!selectedBookId) return;

        try {
            const response = await fetch(`/api/books/${selectedBookId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('削除が完了しました！');
                handleCloseDeleteModal();
                router.refresh();
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
                        <th className="hidden sm:table-cell min-w-[4rem] px-3 py-2 text-start">評価</th>
                        <th className="px-3 py-2 text-end"></th>
                    </tr>
                </thead>
                {books && books.length > 0 ? (
                    <tbody className="divide-y divide-gray-200 bg-white text-start text-xs">
                        {books.map((book, index) => (
                            <tr key={index}>
                                <td className="px-3 py-2 whitespace-normal font-medium">{book.title}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{book.volume}</td>
                                <td className="hidden sm:table-cell px-3 py-1 whitespace-normal">{book.author}</td>
                                <td className={`hidden sm:table-cell px-3 py-1 min-w-[4rem] whitespace-normal ${!book.rated ? 'text-gray-500' : ''}`}>
                                    {book.rated ? book.rating : "未評価"}
                                </td>
                                <td className="px-3 py-1">
                                    <Dropdown
                                        inline={true}
                                        placement="bottom-end"
                                        className="btn btn-ghost btn-sm btn-circle"
                                    >
                                        <Dropdown.Item onClick={() => console.log("詳細")}>
                                            詳細
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleEditConfirm()}>
                                            編集
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleOpenDeleteModal("1")}>
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
                            <td className="px-3 py-2"></td>
                            <td className="hidden sm:table-cell px-3 py-1"></td>
                            <td className="hidden sm:table-cell px-3 py-1"></td>
                            <td className="hidden md:table-cell px-3 py-1"></td>
                            <td className="px-3 py-1"></td>
                        </tr>
                    </tbody>
                )}
            </table>

            <Modal
                show={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                className="flex items-center justify-center py-32 bg-gray-400 bg-opacity-60 text-xs"
                size="md"
            >
                <div className="max-w-md w-full">
                    <Modal.Header className="rounded-t-lg border-none border-x border-t">
                        <div className="">
                            <p className="text-sm font-semibold">以下データを本棚から削除します。</p>
                            <p className="text-sm font-semibold">よろしいですか？</p>
                            <p className="mt-1 text-xs">※この操作は元に戻せません。</p>
                        </div>
                    </Modal.Header>
                    <Modal.Body className="px-5 py-4 border-x">
                        <div className="p-4 border border-gray-400">
                            <p className="mb-2 font-semibold text-sm border-b border-dashed">Hunter×hunterハンター×ハンター</p>
                            <div className="flex justify-between mb-2">
                                <p className="font-semibold">vol. 1</p>
                                <p>ポール＝マッカートニ=アレキサンドロス</p>
                            </div>
                            <ul className="space-y-1">
                                <li>出版社： 集英社</li>
                                <li>発行日： 199806</li>
                                <li>ジャンル： 漫画</li>
                                <li>ISBN： 9784088725710</li>
                            </ul>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="flex items-center justify-center p-5 rounded-b-lg border-none border-x border-b">
                        <button
                            className="basis-1/2 py-1 px-3 mr-3 rounded-md hover:shadow hover:shadow-black border-2 border-gray-400"
                            onClick={handleCloseDeleteModal}
                        >
                            キャンセル
                        </button>
                        <button
                            className="basis-1/2 py-1 px-3 bg-secondary-400 hover:bg-secondary-500 rounded-md hover:shadow hover:shadow-black text-white border-2 border-secondary-400 hover:border-secondary-500"
                            onClick={handleDeleteConfirm}
                        >
                            削除する
                        </button>
                    </Modal.Footer>
                </div>
            </Modal>
        </>
    );
};

export default BookList;
