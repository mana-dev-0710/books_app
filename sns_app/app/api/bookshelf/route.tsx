import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { CustomSession } from "@/app/api/auth/[...nextauth]/authOptions";
import { BaseBook, MyBook } from "types/bookTypes";
import { SearchForm, BookshelfEditForm } from "types/formTypes";
import { fetchNdlData } from "app/api/search/services/fetchNdlData";
import { fetchDbData, deleteBookshelfData, updateBookshelfData } from "app/api/bookshelf/services/fetchDbData";
import { validationBookshelfEditSchema } from "app/utils/validationSchema";

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
    
    return NextResponse.json(
      { books: booksOfDbData },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "サーバーエラー" },
      { status: 500 }
    );
  }

}

async function PUT(req: NextRequest) {

  try {
    const requestBody: BookshelfEditForm = await req.json();

    if (!requestBody || !requestBody.bookshelfId) {
      return NextResponse.json(
        { error: "パラメーターエラー" },
        { status: 400 }
      );
    }

    // バリデーションの対象となる項目を抽出
    const schemaKeys = Object.keys(validationBookshelfEditSchema.shape);
    const filteredBody = Object.fromEntries(
      Object.entries(requestBody).filter(([key]) => schemaKeys.includes(key))
    );
    // バリデーション実行
    try {
      validationBookshelfEditSchema.parse(filteredBody);
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        { error: "バリデーションエラー" },
        { status: 400 }
      );
    }

    //isRatedがfalseかつ、評価関連の項目が入力されていた場合、パラメーターエラー
    if ((requestBody.isRated) && (requestBody.rating || requestBody.reviewTitle || requestBody.reviewTitle)
      && (!requestBody.rating || !requestBody.reviewTitle)) {
      return NextResponse.json(
        { error: "パラメーターエラー（評価情報）" },
        { status: 400 }
      );
    }
    //評価情報の入力があるが、評価時の必須項目であるratingとreviewTitleのいずれかまたは両方の入力がなかった場合、パラメーターエラー
    if ((requestBody.isRated) && (requestBody.rating || requestBody.reviewTitle || requestBody.reviewTitle)
      && (!requestBody.rating || !requestBody.reviewTitle)) {
      return NextResponse.json(
        { error: "パラメーターエラー（評価情報）" },
        { status: 400 }
      );
    }

    // DBの読了情報と評価情報を更新
    await updateBookshelfData(requestBody);

    return NextResponse.json(
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "サーバーエラー" },
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
    console.error(e);
    return NextResponse.json(
      { error: "サーバーエラー" },
      { status: 500 }
    );
  }

}

export { GET, PUT, DELETE };


