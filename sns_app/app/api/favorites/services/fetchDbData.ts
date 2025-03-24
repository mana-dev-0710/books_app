import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomSession } from "@/app/api/auth/[...nextauth]/route";
import { FavoriteBook } from "@/types/bookTypes";
import prisma from "@/lib/Prisma";

async function selectDbData(): Promise<FavoriteBook[]> {

    //ndlDataをSearchedBook型に変換し、デフォルト値を設定
    const defaultSearchedBook: FavoriteBook[] = [];

    // セッションのユーザーIDを取得
    const session = await getServerSession(authOptions) as CustomSession;
    if (!session || !session.user || !session.user.id) {
        console.error("認証情報エラー");
        return defaultSearchedBook;
    }
    const userId = session.user.id;

    // DB情報の取得処理
    try {
        // お気に入り情報を取得
        const resFavorite = await prisma.favorite.findMany({
            where: {
                userId,
            },
        });
        const isbns: string[] = resFavorite.map(fav => fav.isbn);

        // 本棚の書籍情報を取得
        const resBookshelf = await prisma.bookshelf.findMany({
            where: {
                userId,
                isbn: { in: isbns },
            },
        });

        // DB情報を統合
        const searchedBook: FavoriteBook[] = resFavorite.map(book => {
            // isbnが一致するresBookshelfのデータを取得（本棚に存在するかチェック）
            const isInBookshelf = resBookshelf.some(bookshelf => bookshelf.isbn === book.isbn);

            return {
                isbn: book.isbn,
                favoriteBookId: book.id,
                isInBookshelf,
            };
        });
        console.log("searchedBook:", searchedBook);
        return searchedBook;
    } catch (e) {
        console.error("DB情報の検索中に予期せぬエラーが発生しました。:", e);
        return defaultSearchedBook;
    }

}

// async function insertBookshelfData(isbn: string) {

//     // セッションのユーザーIDを取得
//     const session = await getServerSession(authOptions) as CustomSession;
//     if (!session || !session.user || !session.user.id) {
//         console.error("認証情報エラー");
//         return;
//     }
//     const userId = session.user.id;

//     // 本棚へ登録
//     try {
//         await prisma.bookshelf.create({
//             data: {
//                 userId,
//                 isbn,
//             },
//         });
//     } catch (e) {
//         console.error("本棚に登録中に予期せぬエラーが発生しました。:", e);
//     }

// }

// async function insertFavoriteData(isbn: string) {

//     // セッションのユーザーIDを取得
//     const session = await getServerSession(authOptions) as CustomSession;
//     if (!session || !session.user || !session.user.id) {
//         console.error("認証情報エラー");
//         return;
//     }
//     const userId = session.user.id;

//     // お気に入り情報登録処理
//     try {
//         await prisma.favorite.create({
//             data: {
//                 userId,
//                 isbn,
//             },
//         });
//     } catch (e) {
//         console.error("お気に入りの削除中に予期せぬエラーが発生しました。:", e);
//     }

// }

async function deleteFavoriteData(favoriteBookId: string) {

    // お気に入り情報削除処理
    try {
        await prisma.favorite.delete({
            where: {
                id: favoriteBookId,
            },
        });
    } catch (e) {
        console.error("お気に入りの削除中に予期せぬエラーが発生しました。:", e);
    }

}

export { selectDbData, deleteFavoriteData };
