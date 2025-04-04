'use client';

import { Modal, ModalBody, ModalFooter, ModalHeader, Accordion, AccordionPanel, AccordionTitle, AccordionContent, Rating, RatingStar } from 'flowbite-react';
import { MyBook } from "@/types/bookTypes"

type BookshelfDeleteModalProp = {
  isDeleteModalOpen: boolean;
  handleCloseDeleteModal: () => void;
  handleDeleteConfirm: () => void;
  className?: string;
  size?: string;
  book: MyBook | null;
}

const BookshelfDeleteModal: React.FC<BookshelfDeleteModalProp> = ({
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
            <ModalHeader className="flex items-center rounded-t-lg border-none border-x border-t">
              <div className="">
                <p className="text-sm font-semibold">データの取得に失敗しました。削除できません。</p>
              </div>
            </ModalHeader>
          </>
        ) : (
          <>
            <ModalHeader className="flex items-center rounded-t-lg border-none border-x border-t">
              <div className="">
                <p className="text-sm font-semibold">以下データを本棚から削除します。</p>
                <p className="text-sm font-semibold">本棚から削除すると、同書籍の評価も削除されます。</p>
                <p className="text-sm font-semibold">よろしいですか？</p>
                <p className="mt-1 text-xs text-red-600">※この操作は元に戻せません。</p>
              </div>
            </ModalHeader>
            <ModalBody className="px-5 py-3 border-x">
              <div className="p-4 border border-gray-400">
                <p className="mb-2 font-semibold text-sm border-b border-dashed">{book.title}</p>
                <div className="flex justify-between mb-2">
                  <p className="font-semibold">{book.volume}</p>
                  <p>{book.author}</p>
                </div>
                <ul className="space-y-1">
                  <li className="flex gap-1">
                    <span>出版社：</span>
                    <span>{book.publisher}</span>
                  </li>
                  <li className="flex gap-1">
                    <span>発行日：</span>
                    <span>{book.publicationDate}</span>
                  </li>
                  <li className="flex gap-1">
                    <span>ジャンル：</span>
                    <span>{book.genre}</span>
                  </li>
                  <li className="flex gap-1">
                    <span>ISBN：</span>
                    <span>{book.isbn}</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span>読了：</span>
                    {book.finishedReading ? (
                      <div className="flex items-center gap-1">
                        <p>{book.finishedAt}</p>
                        <p>読了</p>
                      </div>
                    ) : (
                      <span>未読</span>
                    )}
                  </li>
                </ul>

                {book.isRated && book.rating ? (
                  <Accordion className="mt-3">
                    <AccordionPanel>
                      <AccordionTitle className="flex w-full h-8 items-center justify-between p-3 text-left font-medium focus:ring-0 first:rounded-t-lg last:rounded-b-lg">
                        評価内容
                      </AccordionTitle>
                      <AccordionContent>
                        <div className="flex flex-col">
                          <p className="text-xs font-bold">{book.reviewTitle}</p>
                          <div className="flex items-center justify-end h-8">
                            <Rating className="w-20">
                              <RatingStar className={parseInt(book.rating, 10) > 0 ? `` : `text-gray-300`} />
                              <RatingStar className={parseInt(book.rating, 10) > 1 ? `` : `text-gray-300`} />
                              <RatingStar className={parseInt(book.rating, 10) > 2 ? `` : `text-gray-300`} />
                              <RatingStar className={parseInt(book.rating, 10) > 3 ? `` : `text-gray-300`} />
                              <RatingStar className={parseInt(book.rating, 10) > 4 ? `` : `text-gray-300`} />
                            </Rating>
                          </div>
                          <p className="mt-2 text-xss">{book.reviewContent}</p>
                        </div>
                      </AccordionContent>
                    </AccordionPanel>
                  </Accordion>
                ) : (
                  <></>
                )
                }
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

export default BookshelfDeleteModal;
