
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomSession } from "@/app/api/auth/[...nextauth]/route";
import { Book } from "types/bookshelf";
import prisma from "lib/Prisma";

async function fetchDbData(): Promise<Book[]> {
    
    let books: Book[] = [];

    // セッションのユーザーIDを取得
    const session = await getServerSession(authOptions) as CustomSession;

    if (!session || !session.user || !session.user.id) {
        console.error("認証情報エラー");
        return books;
    }
    const userId = session.user.id;

    // DB情報の取得処理
    let resDb: Book[] = [];
    try {
        //TODO: 評価データの結合
        resDb = await prisma.bookshelf.findMany({
            where: { userId },
        });

        console.log("resDb:", resDb);
        for (const resBook of resDb) {
            books.push({
                isbn: resBook.isbn,
                finished: resBook.finished,
                finishedAt: resBook.finishedAt || null,
                rated: resBook.rated,
                rating: resBook.rating || null,
                reviewTitle: resBook.reviewTitle || null,
                reviewContent: resBook.reviewContent || null,
            });
        }

        return books;
    } catch (e) {
        console.error("DB情報の検索中に予期せぬエラーが発生しました。:", e);
        return books;
    }

}

export { fetchDbData };