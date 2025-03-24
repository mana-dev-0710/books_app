// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Dropdown } from 'flowbite-react';
// import { FavoriteBook } from "@/types/favorites/FavoriteBook"
// import DeleteModal from "components/modals/DeleteModal"

// const FavoriteBookList = () => {

//     const router = useRouter();
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
//     const [books, setBooks] = useState<FavoriteBook[]>();
    
//     // 検索処理
//     const searchBookshelf = async () => {

//         const res = await fetch('/api/bookshelf', { method: 'GET' });
//         console.log('res:', res);
//         if (res.ok) {
//             const resJson = await res.json();
//             console.log('resData:', resJson);

//             setBooks(resJson.books);

//             console.log('bookshelf:', books);
//         } else {
//             alert('検索処理に失敗しました。');
//         }

//     };

//     useEffect(() => {

//         const fetchBookshelf = async () => {
//             try {
//                 await searchBookshelf();
//             } catch (e) {
//                 console.error('検索処理中に予期せぬエラーが発生しました。:', e);
//                 alert('検索処理中に予期せぬエラーが発生しました。');
//             }
//         }
//         fetchBookshelf();

//     }, [router]);

//     // モーダルを開く
//     const handleOpenDeleteModal = (book: FavoriteBook) => {
//         setSelectedBookId(book.id);
//         setIsDeleteModalOpen(true);
//     };

//     // モーダルを閉じる
//     const handleCloseDeleteModal = () => {
//         setSelectedBookId(null);
//         setIsDeleteModalOpen(false);
//     };

//     // 編集処理
//     const handleEditConfirm = async () => {
//         if (!selectedBookId) return;

//         try {
//             const response = await fetch(`/api/books/${selectedBookId}`, {
//                 method: 'PUT',
//             });
//             if (response.ok) {
//                 alert('編集が完了しました！');
//                 handleCloseDeleteModal();
//                 router.refresh();
//             } else {
//                 alert('編集に失敗しました。');
//             }
//         } catch (error) {
//             console.error('編集処理エラー:', error);
//             alert('エラーが発生しました。');
//         }
//     };

//     // 削除処理
//     const handleDeleteConfirm = async () => {
//         if (!selectedBookId) return;

//         try {
//             const response = await fetch(`/api/books/${selectedBookId}`, {
//                 method: 'DELETE',
//             });
//             if (response.ok) {
//                 alert('削除が完了しました！');
//                 handleCloseDeleteModal();
//                 router.refresh();
//             } else {
//                 alert('削除処理に失敗しました。');
//             }
//         } catch (error) {
//             console.error('削除処理エラー:', error);
//             alert('エラーが発生しました。');
//         }
//     };

//     return (
//         <>
//             <table className="min-w-full table-fixed divide-y divide-gray-200">
//                 <thead className="bg-primary-100 text-gray-500 text-xs font-medium">
//                     <tr>
//                         <th className="px-3 py-2 text-start">書籍タイトル</th>
//                         <th className="px-3 py-2 text-start">vol.</th>
//                         <th className="hidden sm:table-cell px-3 py-2 text-start">作者</th>
//                         <th className="hidden sm:table-cell min-w-[4rem] px-3 py-2 text-start">本棚</th>
//                         <th className="px-3 py-2 text-end"></th>
//                     </tr>
//                 </thead>
//                 {books && books.length > 0 ? (
//                     <tbody className="divide-y divide-gray-200 bg-white text-start text-xs">
//                         {books.map((book, index) => (
//                             <tr key={index}>
//                                 <td className="px-3 py-2 whitespace-normal font-medium">{book.title}</td>
//                                 <td className="px-3 py-2 whitespace-nowrap">{book.volume}</td>
//                                 <td className="hidden sm:table-cell px-3 py-1 whitespace-normal">{book.author}</td>
//                                 <td className={`hidden sm:table-cell px-3 py-1 min-w-[4rem] whitespace-normal ${!book.rated ? 'text-gray-500' : ''}`}>
//                                     {book.rated ? book.rating : "未評価"}
//                                 </td>
//                                 <td className="px-3 py-1">
//                                     <Dropdown
//                                         inline={true}
//                                         placement="bottom-end"
//                                         className="btn btn-ghost btn-sm btn-circle"
//                                     >
//                                         <Dropdown.Item onClick={() => console.log("詳細")}>
//                                             詳細
//                                         </Dropdown.Item>
//                                         <Dropdown.Item onClick={() => handleEditConfirm()}>
//                                             編集
//                                         </Dropdown.Item>
//                                         <Dropdown.Item onClick={() => handleOpenDeleteModal(book)}>
//                                             削除
//                                         </Dropdown.Item>
//                                     </Dropdown>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 ) : (
//                     <tbody className="px-3 py-2 bg-white text-start text-sm text-gray-700">
//                         <tr>
//                             <td className="px-3 py-2 whitespace-normal font-medium">お気に入りした書籍がありません。</td>
//                             <td className="px-3 py-2"></td>
//                             <td className="hidden sm:table-cell px-3 py-1"></td>
//                             <td className="hidden sm:table-cell px-3 py-1"></td>
//                             <td className="px-3 py-1"></td>
//                         </tr>
//                     </tbody>
//                 )}
//             </table>
//             <DeleteModal
//                 isDeleteModalOpen={isDeleteModalOpen}
//                 handleCloseDeleteModal={handleCloseDeleteModal}
//                 handleDeleteConfirm={handleDeleteConfirm}
//                 className="flex items-center justify-center py-32 bg-gray-400 bg-opacity-60 text-xs"
//                 size="md"
//                 book={selectedBookId}
//             />
//         </>
//     );
// };

// export default FavoriteBookList;
