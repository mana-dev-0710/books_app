
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomSession } from "@/app/api/auth/[...nextauth]/route";
import { MyBook } from "types/bookTypes";
import prisma from "lib/Prisma";

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
                rated: book.isRated,
                finishedAt: book.finishedAt ?? null,
                rating: book.ratings.length > 0 ? book.ratings[0].rating : null,
                reviewTitle: book.ratings.length > 0 ? book.ratings[0].reviewTitle : null,
                reviewContent: book.ratings.length > 0 ? book.ratings[0].reviewContent : null,
            }
        });

        console.log("myBookData:", myBookData);
        return myBookData;
    } catch (e) {
        console.error("DB情報の検索中に予期せぬエラーが発生しました。:", e);
        return myBookData;
    }

}

async function deleteBookshelfData(bookshelfId: string) {


    try {
        // 書籍情報を削除
        await prisma.bookshelf.delete({
            where: {
                id: bookshelfId,
            },
        });

        // 評価情報を削除
        await prisma.rating.delete({
            where: {
                bookshelfId,
            },
        });
    } catch (e) {
        console.error("データの削除中に予期せぬエラーが発生しました。:", e);
    }

}


export { fetchDbData, deleteBookshelfData };