import { NextRequest, NextResponse } from "next/server";
import { validationSearchSchemaIsbn } from "app/utils/validationSchema";
import { insertFavoriteData, deleteFavoriteData } from "app/api/search/services/fetchDbData";

async function GET() {
    return new NextResponse(JSON.stringify({ message: "GET method not allowed" }), {
        status: 405,
    });
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
        const validationResult = await validationSearchSchemaIsbn.safeParseAsync({ isbn: isbn });
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "バリデーションエラー" },
                { status: 400 }
            );
        }

        // DBにお気に入り情報を登録
        await insertFavoriteData(isbn);

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
        const reqUrl = new URL(req.url);
        const isbn = reqUrl.searchParams.get("isbn");
        if (!isbn) return NextResponse.json(
            { error: "ISBNが不正です。" },
            { status: 400 }
        );

        //バリデーション
        const validationResult = await validationSearchSchemaIsbn.safeParseAsync({ isbn: isbn });
        if (!validationResult.success) {
            return NextResponse.json(
                { error: "バリデーションエラー" },
                { status: 400 }
            );
        }

        // DBにお気に入り情報を削除
        await deleteFavoriteData(isbn);

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