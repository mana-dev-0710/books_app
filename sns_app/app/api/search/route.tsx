import { NextRequest, NextResponse } from "next/server";
import { validationSearchSchema } from "app/utils/validationSchema";
import { Book, SearchForm } from "types/bookshelf";
import { fetchNdlData } from "app/api/search/services/fetchNdlData";
import { selectDbData, insertBookshelfData } from "app/api/search/services/fetchDbData";

async function GET(req: NextRequest) {

    const searchForm: SearchForm = {};

    try {
        const { searchParams } = new URL(req.url);
        searchForm.isbn = searchParams.get("isbn") || undefined;
        searchForm.title = searchParams.get("title") || undefined;
        searchForm.author = searchParams.get("author") || undefined;
        searchForm.publisher = searchParams.get("publisher") || undefined;

        //バリデーション
        const validationResult = await validationSearchSchema.safeParseAsync(searchForm);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "バリデーションエラー" },  // TODO:項目ごとにエラーメッセージを返却？
                { status: 400 },
            );
        }

        // NDL情報取得
        const resNdlData: Book[] = await fetchNdlData(searchForm);
        if (!resNdlData || resNdlData.length === 0) {
            return NextResponse.json(
                { books: resNdlData },
                { status: 200 },
            );
        }

        // DB情報取得
        const booksOfDbData: Book[] = await selectDbData(resNdlData);

        return NextResponse.json(
            { books: booksOfDbData },
            { status: 200 },
        );
    } catch (e) {
        return NextResponse.json({ status: 500 });
    }

}

async function PUT(req: NextRequest) {

    try {
        const reqUrl = new URL(req.url);
        const isbn = reqUrl.searchParams.get("isbn");
        if (!isbn) return NextResponse.json(
            { error: "ISBNが不正です。" },
            { status: 400 }
        );

        //バリデーション
        const validationResult = await validationSearchSchema.safeParseAsync({ isbn });
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "バリデーションエラー" },
                { status: 400 }
            );
        }

        // 本棚への登録
        await insertBookshelfData(isbn);

        return NextResponse.json({ status: 200 });
    } catch (e) {
        return NextResponse.json({ status: 500 });
    }

}

export { GET, PUT };