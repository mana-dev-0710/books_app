import { NextRequest, NextResponse } from "next/server";
import { validationSearchSchemaIsbn, validationSearchSchemaDetails } from "app/utils/validationSchema";
import { BaseBook, SearchedBook } from "@/types/bookTypes";
import { SearchForm } from "@/types/formTypes";
import { fetchNdlData } from "app/api/search/services/fetchNdlData";
import { selectDbData, insertBookshelfData } from "app/api/search/services/fetchDbData";

export const runtime = 'edge'; // 外部API接続時のタイムアウト回避のため、Edge Functionとして扱う

async function GET(req: NextRequest) {

    const searchForm: SearchForm = {};

    try {
        const { searchParams } = new URL(req.url);
        searchForm.isbn = decodeURIComponent(searchParams.get("isbn") || "") || undefined;
        searchForm.title = decodeURIComponent(searchParams.get("title") || "") || "";
        searchForm.author = decodeURIComponent(searchParams.get("author") || "") || "";
        searchForm.publisher = decodeURIComponent(searchParams.get("publisher") || "") || "";

        //バリデーション
        if (searchForm.isbn) {
            const validationResultIsbn = await validationSearchSchemaIsbn.safeParseAsync({
                isbn: searchForm.isbn
            });
            if (!validationResultIsbn.success) {
                return NextResponse.json(
                    { error: "バリデーションエラー" },
                    { status: 400 },
                );
            }
        } else {
            const validationResultDetails = await validationSearchSchemaDetails.safeParseAsync({
                title: searchForm.title,
                author: searchForm.author,
                publisher: searchForm.publisher
            });
            if (!validationResultDetails.success) {
                return NextResponse.json(
                    { error: "バリデーションエラー" },
                    { status: 400 },
                );
            }
        }

        // NDL情報取得
        const resNdlData: BaseBook[] = await fetchNdlData(searchForm);
        if (!resNdlData || resNdlData.length === 0) {
            return NextResponse.json(
                { books: resNdlData },
                { status: 200 },
            );
        }

        // NDL情報を基にDB情報取得
        const margedData: SearchedBook[] = await selectDbData(resNdlData);

        return NextResponse.json(
            { books: margedData },
            { status: 200 },
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "サーバーエラー" },
            { status: 500 }
        );
    }

}

async function PUT(req: NextRequest) {

    try {
        const reqUrl = new URL(req.url);
        const isbn = reqUrl.searchParams.get("isbn");
        if (!isbn) return NextResponse.json(
            { error: "パラメーターエラー" },
            { status: 400 }
        );

        //バリデーション
        const validationResult = await validationSearchSchemaIsbn.safeParseAsync({ isbn });
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "バリデーションエラー" },
                { status: 400 }
            );
        }

        // 本棚への登録
        await insertBookshelfData(isbn);

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

export { GET, PUT };