import { NextRequest, NextResponse } from "next/server";
import { validationSearchSchemaIsbn, validationSearchSchemaDetails } from "app/utils/validationSchema";
import { BaseBook, FavoriteBook } from "@/types/bookTypes";
import { SearchForm } from "@/types/formTypes";
import { fetchNdlData } from "app/api/favorites/services/fetchNdlData";
import { selectDbData, deleteFavoriteData } from "app/api/favorites/services/fetchDbData";

async function GET() {

    let books: FavoriteBook[] = [];

    try {
        // DB情報取得
        const booksOfDbData: FavoriteBook[] = await selectDbData();

        // NDL情報取得
        for (let bookOfDbData of booksOfDbData) {
            const searchForm: SearchForm = { isbn: bookOfDbData.isbn };

            // NDL情報取得
            const resNdlData: BaseBook[] = await fetchNdlData(searchForm);


            if (resNdlData.length > 0) {
                const ndlBook = resNdlData[0]; // ※ISBN検索のため、ndlから取得するBaseBookは1件

                Object.assign(bookOfDbData, {
                    title: ndlBook.title ?? bookOfDbData.title,
                    volume: ndlBook.volume ?? bookOfDbData.volume,
                    author: ndlBook.author ?? bookOfDbData.author,
                    publisher: ndlBook.publisher ?? bookOfDbData.publisher,
                    publicationDate: ndlBook.publicationDate ?? bookOfDbData.publicationDate,
                    genre: ndlBook.genre ?? bookOfDbData.genre,
                    jpeCode: ndlBook.jpeCode ?? bookOfDbData.jpeCode,
                    imgUrl: ndlBook.imgUrl ?? bookOfDbData.imgUrl,
                });
            }
        }
        books = booksOfDbData;

        return NextResponse.json(
            { books: booksOfDbData },
            { status: 200 },
        );
    } catch (e) {
        return NextResponse.json({ status: 500 });
    }

}

async function DELETE(req: NextRequest) {

    try {
        const { searchParams } = new URL(req.url);
        const favoriteBookId = decodeURIComponent(searchParams.get("favoriteBookId") || "") || undefined;

        if (!favoriteBookId) return NextResponse.json(
            { error: "パラメーターエラー" }, 
            { status: 400 }
        );

        // DBにお気に入り情報を削除
        await deleteFavoriteData(favoriteBookId);

        return NextResponse.json( { status: 200 } );
    } catch (e) {
        return NextResponse.json( { status: 500 } );
    }

}

export { GET, DELETE };