import { NextRequest, NextResponse } from "next/server";
import { BaseBook, MyBook } from "types/bookTypes";
import { SearchForm } from "types/formTypes";
import { fetchNdlData } from "app/api/search/services/fetchNdlData";
import { fetchDbData } from "app/api/bookshelf/services/fetchDbData";

export async function GET(req: NextRequest) {

  let books: MyBook[] = [];

  try {
    // DB情報取得
    const booksOfDbData: MyBook[] = await fetchDbData();

    // DBから取得したisbnをパラメータとしてNDL情報取得
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

    return NextResponse.json({ books: books }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "本棚の検索中に想定外のエラーが発生しました。" }, { status: 500 });
  }

}


