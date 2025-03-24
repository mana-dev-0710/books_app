import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomSession } from "@/app/api/auth/[...nextauth]/route";
import { myBook } from "@/types/bookTypes";
import prisma from "@/lib/Prisma";

async function selectDbData(ndlData: myBook[]): Promise<myBook[]> {

    // セッションのユーザーIDを取得
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || !session.user.id) {
        console.error("認証情報エラー");
        return ndlData;
    }
    const userId = session.user.id;

    // DB情報の取得処理
    try {
        let dbBooks: myBook[] = [];
        const isbns = ndlData.map(book => book.isbn);

        // 本棚の書籍情報を取得
        const resBookshelf = await prisma.bookshelf.findMany({
            where: {
                userId,
                isbn: { in: isbns },
            },
            include: {
                ratings: true,
            },
        });
        if (!resBookshelf || resBookshelf.length !== 0) {
            // DBデータをBook型に変換
            dbBooks = resBookshelf.map(resData => ({
                isbn: resData.isbn,
                isFavorite: false,
                isInBookshelf: true,
                finishedAt: resData.finishedAt ?? null,
                rated: resData.isRated,
                rating: resData.ratings.length > 0 ? resData.ratings[0].rating : null,
                reviewTitle: resData.ratings.length > 0 ? resData.ratings[0].reviewTitle : null,
                reviewContent: resData.ratings.length > 0 ? resData.ratings[0].reviewContent : null,
            }));
        }

        // お気に入り情報を取得
        const resFavorite = await prisma.favorite.findMany({
            where: {
                userId,
                isbn: { in: isbns },
            },
        });
        if (!resFavorite || resFavorite.length !== 0) {
            // ISBNをキーにしたマップを作成
            const dbBooksMap = new Map(dbBooks.map(book => [book.isbn, book]));

            // favoriteの情報を適用
            resFavorite.forEach(favorite => {
                const book = dbBooksMap.get(favorite.isbn);
                if (book) {
                    book.isFavorite = true;
                } else {
                    // ISBNがdbBooksに存在しない場合、新しいBookを追加
                    dbBooks.push({
                        isbn: favorite.isbn,
                        isFavorite: true,
                        isInBookshelf: false, 
                        finishedAt: null,
                        rated: false,
                        rating: null,
                        reviewTitle: null,
                        reviewContent: null,
                    });
                }
            });
        }

        // ndlDataにresDbの情報を適用
        for (const ndlBook of ndlData) {
            const dbBook = dbBooks.find(book => book.isbn === ndlBook.isbn);
            if (dbBook) {
                Object.assign(ndlBook, dbBook);
            }
        }
        return ndlData;
    } catch (e) {
        console.error("DB情報の検索中に予期せぬエラーが発生しました。:", e);
        return ndlData;
    }

}

async function insertBookshelfData(isbn: string) {

    // セッションのユーザーIDを取得
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || !session.user.id) {
        console.error("認証情報エラー");
        return;
    }
    const userId = session.user.id;

    // 本棚へ登録
    try {
        await prisma.bookshelf.create({
            data: {
                userId,
                isbn,
            },
        });
    } catch (e) {
        console.error("本棚に登録中に予期せぬエラーが発生しました。:", e);
    }

}

async function insertFavoriteData(isbn: string) {

    // セッションのユーザーIDを取得
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || !session.user.id) {
        console.error("認証情報エラー");
        return;
    }
    const userId = session.user.id;

    // お気に入り情報登録処理
    try {
        await prisma.favorite.create({
            data: {
                userId,
                isbn,
            },
        });
    } catch (e) {
        console.error("お気に入りの削除中に予期せぬエラーが発生しました。:", e);
    }

}

async function deleteFavoriteData(isbn: string) {

    // セッションのユーザーIDを取得
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || !session.user.id) {
        console.error("認証情報エラー");
        return;
    }
    const userId = session.user.id;

    // お気に入り情報削除処理
    try {
        await prisma.favorite.delete({
            where: {
                userId_isbn: {
                    userId,
                    isbn,
                }
            },
        });
    } catch (e) {
        console.error("お気に入りの削除中に予期せぬエラーが発生しました。:", e);
    }

}

export { selectDbData, insertBookshelfData, insertFavoriteData, deleteFavoriteData };
