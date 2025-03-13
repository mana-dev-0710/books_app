import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomSession } from "@/app/api/auth/[...nextauth]/route";
import { Book } from "types/bookshelf";
import prisma from "@/lib/Prisma";

async function fetchDbData(ndlData: Book[]): Promise<Book[]> {

    if (!ndlData || ndlData.length === 0) {
        console.error("パラメータエラー");
        return ndlData;
    }

    // セッションのユーザーIDを取得
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || !session.user.id) {
        console.error("認証情報エラー");
        return ndlData;
    }
    const userId = session.user.id;

    // DB情報の取得処理
    let resDb: Book[] = [];
    try { 
        const isbns = ndlData.map(book => book.isbn);
        resDb = await prisma.bookshelf.findMany({
            where: {
                userId,
                isbn: { in: isbns },
            },
        });
        if(!resDb) return ndlData;

        let margedBook : Book[] = [];
        // DB情報を対応するndlDataに追加
        for (const resBook of resDb) {
            //DB情報に対応するndlDataの参照をndlBookとして定義
            const ndlBook : Book | undefined = ndlData.find(book => book.isbn === resBook.isbn);
            if (ndlBook) {
                ndlBook.finished = resBook.finished;
                ndlBook.finishedAt = resBook.finishedAt ?? null;
                ndlBook.rated = resBook.rated;
                ndlBook.rating = resBook.rating ?? null;
                ndlBook.reviewTitle = resBook.reviewTitle ?? null;
                ndlBook.reviewContent = resBook.reviewContent ?? null;
            }
        }
        return ndlData;
    } catch (e) {
        console.error("DB情報の検索中に予期せぬエラーが発生しました。:", e);
        return ndlData;
    }

}

export { fetchDbData };
