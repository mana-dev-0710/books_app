import { NextRequest, NextResponse } from "next/server";
import { Book, SearchForm } from "types/bookshelf";
import { fetchNdlData } from "app/api/search/services/fetchNdlData";
import { fetchDbData } from "app/api/bookshelf/services/fetchDbData";

export async function GET(req: NextRequest) {

  let books: Book[] = [];

  try {
    // DB情報取得
    const booksOfDbData: Book[] = await fetchDbData();

    // DBから取得したisbnをパラメータとしてNDL情報取得
    for (let bookOfDbData of booksOfDbData) {
      const searchForm: SearchForm = { isbn: bookOfDbData.isbn };

      // NDL情報取得
      const resNdlData: Book[] = await fetchNdlData(searchForm);

      if (resNdlData.length > 0) {
        const resNdlDataByIsbn: Book = resNdlData[0]; // ※ISBN検索の場合、取得データは1件
        books.push({ ...bookOfDbData, ...resNdlDataByIsbn });
      }
    }

    return NextResponse.json({ books: books }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "本棚の検索中に想定外のエラーが発生しました。" }, { status: 500 });
  }

}


