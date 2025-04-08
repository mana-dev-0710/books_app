'use client';

import { Modal, ModalBody, ModalFooter, ModalHeader, Accordion, AccordionPanel, AccordionTitle, AccordionContent } from 'flowbite-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validationBookshelfEditSchema } from "app/utils/validationSchema";
import { useEffect, useState } from 'react';
import { MyBook } from "@/types/bookTypes"
import { BookshelfEditForm } from "@/types/formTypes"

type BookshelfEditModalProp = {
    isEditModalOpen: boolean;
    handleCloseEditModal: () => void;
    handleEditConfirm: (data: BookshelfEditForm) => void;
    className?: string;
    size?: string;
    book: MyBook | null;
}

const BookshelfEditModal: React.FC<BookshelfEditModalProp> = ({
    isEditModalOpen,
    handleCloseEditModal,
    handleEditConfirm,
    className,
    size,
    book,
}) => {

    const {
        register,
        formState: { errors },
        setValue,
        handleSubmit,
        reset,
    } = useForm<BookshelfEditForm>({
        mode: "onChange",
        resolver: zodResolver(validationBookshelfEditSchema),
    });

    const [isFinishedReading, setIsFinishedReading] = useState<boolean>(book?.finishedReading ?? true);

    useEffect(() => {
        if (book) {
            reset({
                finishedReading: book.finishedReading ? true : false,
                readingStatus: book.finishedReading ? "finishedReading" : "unread",
                finishedAt: book.finishedAt || "",
                isRated: book.isRated ? true : false,
                reviewTitle: book.isRated ? book.reviewTitle || "" : "",
                rating: book.isRated ? book.rating || "" : "",
                reviewContent: book.isRated ? book.reviewContent || "" : "",
            });
        }
    }, [book, reset]);

    // readingStatusの変更時にisFinishedReadingを更新
    const handleReadingStatusChange = (value: string) => {
        const valueIsFinishedReading: boolean = (value === "finishedReading")

        setIsFinishedReading(valueIsFinishedReading);
        if (!valueIsFinishedReading) {
            setValue("finishedAt", "");
        } else {
            setValue("finishedAt", book?.finishedAt ?? "");
        }
    };

    // フォームの送信処理
    const onSubmit = (data: BookshelfEditForm) => {
        // finishedReadingを手動で設定
        data.finishedReading = isFinishedReading;

        handleEditConfirm(data);
    };

    return (
        <Modal
            show={isEditModalOpen}
            onClose={handleCloseEditModal}
            className={className}
            size={size}
        >
            <div className="max-w-md w-full dark:bg-white dark:text-gray-800 rounded-lg overflow-hidden">

                {book === null ? (
                    <>
                        <ModalHeader className="flex items-center border-none border-x border-t">
                            <div className="dark:text-gray-800">
                                <p className="text-sm font-semibold">データの取得に失敗しました。編集できません。</p>
                            </div>
                        </ModalHeader>
                    </>
                ) : (
                    <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader className="flex items-center border-none border-x border-t">
                                <div className="">
                                    <p className="text-sm font-semibold dark:text-gray-800">書籍情報の編集</p>
                                </div>
                            </ModalHeader>
                            <ModalBody className="px-5 py-3 border-x">
                                <div className="p-4 border border-gray-400">
                                    <Accordion className="dark:border dark:border-gray-200">
                                        <AccordionPanel>
                                            <AccordionTitle
                                                className="flex w-full h-8 items-center justify-between p-4 text-left text-sm text-gray-800 focus:ring-0 first:rounded-t-lg last:rounded-b-lg
                                                dark:bg-gray-100 dark:hover:bg-gray-100 dark:text-gray-800"
                                            >
                                                書籍情報
                                            </AccordionTitle>
                                            <AccordionContent>
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
                                                </ul>
                                            </AccordionContent>
                                        </AccordionPanel>
                                    </Accordion>
                                    <div className="mt-3 text-xss md:text-xs">
                                        <div className="py-1 font-semibold">
                                            読了状態
                                            <span className="px-2.5 py-0.5 ml-2 rounded-full bg-red-100 font-medium text-xss text-red-800">
                                                必須
                                            </span>
                                        </div>
                                        <div className="flex gap-4 py-1">
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    id="unread"
                                                    {...register("readingStatus")}
                                                    name="readingStatus"
                                                    value="unread"
                                                    onChange={(e) => handleReadingStatusChange(e.target.value)}
                                                />
                                                <label htmlFor="unread" className="text-xss md:text-xs">未読</label>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    id="finishedReading"
                                                    {...register("readingStatus")}
                                                    name="readingStatus"
                                                    value="finishedReading"
                                                    onChange={(e) => handleReadingStatusChange(e.target.value)}
                                                />
                                                <label htmlFor="finishedReading" className="text-xss md:text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <p>読了</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="py-1 mt-2 font-semibold">
                                            読了日
                                        </div>
                                        <input
                                            id="finishedAt"
                                            type="text"
                                            placeholder="2000/01/01"
                                            className={`w-[112px] p-1 pl-2 text-xss md:text-xs placeholder-gray-500 border-gray-400 focus:outline-primary-400 ${!isFinishedReading ? "bg-gray-200 text-gray-500" : ""}`}
                                            disabled={!isFinishedReading}
                                            {...register("finishedAt")}
                                        />
                                        <p className="p-1 text-xss text-red-500">{errors.finishedAt?.message as React.ReactNode}</p>
                                        <label className="flex items-center py-1 mt-2 font-semibold" htmlFor="title">
                                            評価タイトル
                                            <span className="px-2.5 ml-2 rounded-full bg-yellow-100 font-medium text-xss text-yellow-800">
                                                評価する場合、入力必須
                                            </span>
                                        </label>
                                        <textarea
                                            id="reviewTitle"
                                            rows={1}
                                            className="w-full max-w-[488px] p-1 pl-2 text-xss md:text-xs border-gray-400 focus:outline-primary-400"
                                            {...register("reviewTitle")}
                                        />
                                        <p className="p-1 text-xss text-red-500">{errors.reviewTitle?.message as React.ReactNode}</p>
                                        <label className="flex items-center py-1 font-semibold" htmlFor="rating">
                                            評価
                                            <span className="px-2.5 ml-2 rounded-full bg-yellow-100 font-medium text-xss text-yellow-800">
                                                評価する場合、入力必須
                                            </span>
                                        </label>
                                        <div className="flex items-center gap-1">
                                            <input
                                                id="rating"
                                                type="text"
                                                className="w-[32px] p-1 pl-2 text-xss md:text-xs placeholder-gray-500 border-gray-400 focus:outline-primary-400"
                                                {...register("rating")}
                                            />
                                            <p>/5</p>
                                        </div>
                                        <p className="p-1 text-xss text-red-500">{errors.rating?.message as React.ReactNode}</p>
                                        <label className="flex items-center py-1 font-semibold" htmlFor="reviewContent">
                                            評価内容
                                        </label>
                                        <textarea
                                            id="reviewContent"
                                            rows={4}
                                            className="w-full max-w-[488px] p-1 pl-2 text-xss md:text-xs border-gray-400 focus:outline-primary-400"
                                            {...register("reviewContent")}
                                        />
                                        <p className="p-1 text-xss text-red-500">{errors.reviewContent?.message as React.ReactNode}</p>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="flex items-center justify-center p-5 rounded-b-lg border-none border-x border-b">
                                <button
                                    className="basis-1/2 py-1 px-3 mr-3 rounded-md hover:shadow hover:shadow-black border-2 border-gray-400"
                                    onClick={handleCloseEditModal}
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    className="basis-1/2 py-1 px-3 bg-secondary-400 hover:bg-secondary-500 rounded-md hover:shadow hover:shadow-black text-white border-2 border-secondary-400 hover:border-secondary-500"
                                >
                                    編集する
                                </button>
                            </ModalFooter>
                        </form>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default BookshelfEditModal;
