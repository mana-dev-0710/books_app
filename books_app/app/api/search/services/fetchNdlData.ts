import { BaseBook } from "@/types/bookTypes";
import { SearchForm } from "@/types/formTypes";
import { parseXmlToJson, parseXmlToJsonByIsbn } from "@/app/utils/parseXml";
import { getImageUrl } from "app/api/search/services/fetchNdlImgUrl";

const maximumRecords = "50";

async function fetchNdlData(searchForm: SearchForm): Promise<BaseBook[]> {
    const isbn = searchForm.isbn;
    const title = searchForm.title;
    const author = searchForm.author;
    const publisher = searchForm.publisher;

    // URL作成処理
    let apiUrl = 'https://ndlsearch.ndl.go.jp/api/opensearch?';
    if (isbn) {
        apiUrl += `isbn=${isbn}&`;
    } else {
        if (title) apiUrl += `title=${title}&`;
        if (author) apiUrl += `creator=${author}&`;
        if (publisher) apiUrl += `publisher=${publisher}&`;
    }
    apiUrl += `maximumRecords=${maximumRecords}`;

    try {
        const ndlRes = await fetch(apiUrl, {
            mode: "cors",
            headers: { "Accept": "application/xml" },
            credentials: "include",
        });

        if (!ndlRes.ok) {
            console.error("NDL情報取得処理に失敗しました。");
            return [];
        }

        const resNdlXml = await ndlRes.text();
        const resNdlJson = isbn
            ? await parseXmlToJsonByIsbn(resNdlXml)
            : await parseXmlToJson(resNdlXml);

        // 並列で書影URLを取得
        const books: BaseBook[] = await Promise.all(
            resNdlJson.map(async (resBook) => {
                if (isbn) {
                    resBook.isbn = isbn; // ISBN検索の場合は補完
                }

                const imgUrl = await getImageUrl(resBook.isbn, resBook.jpeCode);

                return {
                    isbn: resBook.isbn,
                    title: resBook.title,
                    volume: resBook.volume,
                    author: resBook.author,
                    publisher: resBook.publisher,
                    genre: resBook.genre,
                    publicationDate: resBook.publicationDate,
                    jpeCode: resBook.jpeCode,
                    imgUrl,
                };
            })
        );

        return books;
    } catch (e) {
        console.error("NDL情報取得処理中に予期せぬエラーが発生しました。:", e);
        return [];
    }
}

export { fetchNdlData };
