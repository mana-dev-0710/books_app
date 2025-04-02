'use client';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { FavoriteBook } from "@/types/bookTypes"

type FavoriteDeleteModalProp = {
  isDeleteModalOpen: boolean;
  handleCloseDeleteModal: () => void;
  handleDeleteConfirm: (data: any) => void;
  className?: string;
  size?: string;
  book: FavoriteBook | null;
}

const FavoriteDeleteModal: React.FC<FavoriteDeleteModalProp> = ({
  isDeleteModalOpen,
  handleCloseDeleteModal,
  handleDeleteConfirm,
  className,
  size,
  book,
}) => {

  return (
    <Modal
      show={isDeleteModalOpen}
      onClose={handleCloseDeleteModal}
      className={className}
      size={size}
    >
      <div className="max-w-md w-full">

        {book === null ? (
          <>
            <ModalHeader className="rounded-t-lg border-none border-x border-t">
              <div className="">
                <p className="text-sm font-semibold">データの取得に失敗しました。削除できません。</p>
              </div>
            </ModalHeader>
          </>
        ) : (
          <>
            <ModalHeader className="rounded-t-lg border-none border-x border-t">
              <div className="">
                <p className="text-sm font-semibold">以下データをお気に入りから削除します。</p>
                <p className="text-sm font-semibold">よろしいですか？</p>
                <p className="mt-1 text-xs text-red-600">※この操作は元に戻せません。</p>
              </div>
            </ModalHeader>
            <ModalBody className="px-5 py-4 border-x">
              <div className="p-4 border border-gray-400">
                <p className="mb-2 font-semibold text-sm border-b border-dashed">{book.title}</p>
                <div className="flex justify-between mb-2">
                  <p className="font-semibold">{book.volume}</p>
                  <p>{book.author}</p>
                </div>
                <ul className="space-y-1">
                  <li>出版社： {book.publisher}</li>
                  <li>発行日： {book.publicationDate}</li>
                  <li>ジャンル： {book.genre}</li>
                  <li>ISBN： {book.isbn}</li>
                </ul>
              </div>
            </ModalBody>
            <ModalFooter className="flex items-center justify-center p-5 rounded-b-lg border-none border-x border-b">
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
            </ModalFooter>
          </>
        )}
      </div>
    </Modal>
  );
};

export default FavoriteDeleteModal;
