
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomSession } from "@/app/api/auth/[...nextauth]/authOptions";
import { MyBook } from "types/bookTypes";
import { BookshelfEditForm } from "types/formTypes";
import prisma from "lib/Prisma";
import { parseTypes } from "app/utils/parseTypes";

async function fetchDbData(): Promise<MyBook[]> {

    let myBookData: MyBook[] = [];

    // セッションのユーザーIDを取得
    const session = await getServerSession(authOptions) as CustomSession;

    if (!session || !session.user || !session.user.id) {
        console.error("認証情報エラー");
        return myBookData;
    }
    const userId = session.user.id;

    // DB情報の取得処理
    try {
        const resBookshelf = await prisma.bookshelf.findMany({
            where: { userId },
            include: {
                ratings: true,
            },
        });

        const isbns: string[] = resBookshelf.map(book => book.isbn);
        const resFavorite = await prisma.favorite.findMany({
            where: {
                userId,
                isbn: { in: isbns },
            },
        });

        // resBookshelfとresFavoriteのデータをMyBook型に変換
        myBookData = resBookshelf.map(book => {
            // isbnが一致するresFavoriteのデータを取得（お気に入りに存在するかチェック）
            const isFavorite = resFavorite.some(fav => fav.isbn === book.isbn);

            return {
                isbn: book.isbn,
                bookshelfId: book.id,
                isFavorite: isFavorite,
                isRated: book.isRated,
                finishedReading: book.finishedReading,
                finishedAt: book.finishedAt ? parseTypes(book.finishedAt) : null,
                rating: book.ratings.length > 0 ? book.ratings[0].rating : null,
                reviewTitle: book.ratings.length > 0 ? book.ratings[0].reviewTitle : null,
                reviewContent: book.ratings.length > 0 ? book.ratings[0].reviewContent : null,
            }
        });

        return myBookData;
    } catch (e) {
        console.error("DB情報の検索中に予期せぬエラーが発生しました。:", e);
        return myBookData;
    }

}

async function updateBookshelfData(book: BookshelfEditForm) {

    try {
        // 書籍情報を更新
        await prisma.bookshelf.update({
            where: {
                id: book.bookshelfId,
            },
            data: {
                finishedReading: book.finishedReading ?? false,
                // string（YYYY/MM/DD）からDateに変換して設定
                finishedAt: book.finishedAt ? new Date(book.finishedAt.replace(/\//g, '-')) : null,
            },
        });

        // 評価情報の確認
        const selectedBook = await prisma.bookshelf.findUnique({
            where: {
                id: book.bookshelfId,
            },
        });
        if (!selectedBook || !selectedBook.userId) {
            console.error("ユーザーIDの検索に失敗しました。");
            return;
        }

        if (selectedBook.isRated == false && book.isRated == false) {
            // isRatedの変更がない場合、処理終了
            return;
        } else if (selectedBook.isRated == true && book.isRated == false) {
            // isRatedがtrueからfalseに変更される場合、評価情報を削除
            await prisma.$transaction([
                prisma.rating.delete({
                    where: {
                        bookshelfId: book.bookshelfId,
                    },
                }),
                prisma.bookshelf.update({
                    where: {
                        id: book.bookshelfId,
                    },
                    data: {
                        isRated: book.isRated,
                    },
                }),
            ]);
        } else {
            // 上記以外の場合、評価情報を更新（既にデータが存在する場合は新規追加）
            if (!book.rating || !book.reviewTitle) {
                console.error("評価と評価タイトルは必須です。");
                return;
            }

            await prisma.$transaction([
                prisma.rating.upsert({
                    where: {
                        bookshelfId: book.bookshelfId,
                    },
                    update: {
                        userId: selectedBook.userId,
                        bookshelfId: book.bookshelfId,
                        rating: book.rating,
                        reviewTitle: book.reviewTitle,
                        reviewContent: book.reviewContent ?? null,
                    },
                    create: {
                        userId: selectedBook.userId,
                        bookshelfId: book.bookshelfId,
                        rating: book.rating,
                        reviewTitle: book.reviewTitle,
                        reviewContent: book.reviewContent ?? null,
                    },
                }),
                prisma.bookshelf.update({
                    where: {
                        id: book.bookshelfId,
                    },
                    data: {
                        isRated: book.isRated,
                    },
                }),
            ]);

        }

    } catch (e) {
        console.error("データの更新中に予期せぬエラーが発生しました。:", e);
    }

}

async function deleteBookshelfData(bookshelfId: string) {

    try {
        // rating の存在を確認
        const existingRating = await prisma.rating.findUnique({
            where: {
                bookshelfId,
            },
        });

        // 削除するデータを格納
        const deleteOperations = [];

        if (existingRating) {
            deleteOperations.push(
                prisma.rating.delete({
                    where: {
                        bookshelfId,
                    },
                })
            );
        }

        deleteOperations.push(
            prisma.bookshelf.delete({
                where: {
                    id: bookshelfId,
                },
            })
        );

        // トランザクションで削除を実行
        await prisma.$transaction(deleteOperations);

    } catch (e) {
        console.error("データの削除中に予期せぬエラーが発生しました。:", e);
    }

}


export { fetchDbData, updateBookshelfData, deleteBookshelfData };