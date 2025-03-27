import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomSession } from "@/app/api/auth/[...nextauth]/authOptions";
import { BaseBook, MyBook } from "types/bookTypes";
import { SearchForm } from "types/formTypes";
import { fetchNdlData } from "app/api/search/services/fetchNdlData";
import { fetchDbData, deleteBookshelfData } from "app/api/bookshelf/services/fetchDbData";

async function GET() {

  // セッションのユーザーIDを取得
  const session = await getServerSession(authOptions) as CustomSession;

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { error: "認証情報エラー" },
      { status: 500 }
    );
  }

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
    //session.user.bookshelfSearchResults = booksOfDbData;

    return NextResponse.json(
      { books: booksOfDbData },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "本棚の検索中に想定外のエラーが発生しました。" },
      { status: 500 }
    );
  }

}

async function DELETE(req: NextRequest) {

  try {
    const { searchParams } = new URL(req.url);
    const bookshelfId = decodeURIComponent(searchParams.get("bookshelfId") || "") || undefined;

    if (!bookshelfId) return NextResponse.json(
      { error: "パラメーターエラー" },
      { status: 400 }
    );

    // DBのマイ書籍情報を削除
    await deleteBookshelfData(bookshelfId);

    return NextResponse.json(
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { status: 500 }
    );
  }

}

export { GET, DELETE };


