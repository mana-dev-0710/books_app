import { NextRequest, NextResponse } from "next/server";
import { validationSearchSchema } from "app/utils/validationSchema";
import { Book, SearchForm } from "types/bookshelf";
import { fetchNdlData } from "app/api/search/services/fetchNdlData";
import { fetchDbData } from "app/api/search/services/fetchDbData";

export async function GET(req: NextRequest) {

    const searchForm: SearchForm = {};

    try {
        const { searchParams } = new URL(req.url);
        searchForm.isbn = searchParams.get("isbn") || undefined;
        searchForm.title = searchParams.get("title") || undefined;
        searchForm.author = searchParams.get("author") || undefined;
        searchForm.publisher = searchParams.get("publisher") || undefined;

        //バリデーション
        const [validationResult] = await Promise.all([
            validationSearchSchema.safeParseAsync(searchForm),
        ]);
        if (!validationResult.success) {
            return NextResponse.json({ error: "バリデーションエラー" }, { status: 400 });
        }

        // NDL情報取得
        const resNdlData: Book[] = await fetchNdlData(searchForm);
        // DB情報取得
        const booksOfDbData: Book[] = await fetchDbData(resNdlData);

        return booksOfDbData;
    } catch (e) {
        return NextResponse.json({ error: "書籍検索中に想定外のエラーが発生しました。" }, { status: 500 });
    }

}