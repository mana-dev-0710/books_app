'use client';

import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { FavoriteBook } from "@/types/bookTypes"

type FavoriteDetailModalProp = {
  isDetailModalOpen: boolean;
  handleCloseDetailModal: () => void;
  className?: string;
  size?: string;
  book: FavoriteBook | null;
}

const FavoriteDetailModal: React.FC<FavoriteDetailModalProp> = ({
  isDetailModalOpen,
  handleCloseDetailModal,
  className,
  size,
  book,
}) => {

  return (
    <Modal
      show={isDetailModalOpen}
      onClose={handleCloseDetailModal}
      className={className}
      size={size}
    >
      <div className="max-w-md w-full">

        {book === null ? (
          <>
            <ModalHeader className="flex items-center rounded-t-lg border-none border-x border-t">
              <div className="">
                <p className="text-sm font-semibold">データの取得に失敗しました。削除できません。</p>
              </div>
            </ModalHeader>
          </>
        ) : (
          <>
            <ModalHeader className="flex items-center rounded-t-lg border-none border-x border-t">
              <p className="text-sm font-semibold">書籍の詳細情報</p>
            </ModalHeader>
            <ModalBody className="px-5 py-3 border-x">
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
                onClick={handleCloseDetailModal}
              >
                キャンセル
              </button>
            </ModalFooter>
          </>
        )}
      </div>
    </Modal>
  );
};

export default FavoriteDetailModal;
