import { parseStringPromise } from "xml2js";

/**
 * isbnでの検索時、返却されたXmlデータを1件分のJsonデータにparseする。
 * 
 * @param xml 
 * @returns 
 */
async function parseXmlToJsonByIsbn(xml: string): Promise<Record<string, string>[]> {

    let resJsonArray: Record<string, string>[] = [];

    try {
        const result = await parseStringPromise(xml);

        const channel = result["rss"]["channel"]?.[0];
        if (!channel || !channel["item"] || channel["item"].length === 0) {
            return resJsonArray;
        }
        const metadata = channel["item"];

        // itemごとにチェックし、最初に取得できたデータを返却
        const findFirstValidValue = (key: string, defaultValue: string): string => {
            for (const item of metadata) {
                const value = item[key]?.[0];
                if (value) return value;
            }
            return defaultValue;
        };

        let title = findFirstValidValue("title", "");
        if (title === "") {
            console.warn("タイトルが見つかりませんでした");
            //　タイトル不明の場合は空のまま返却
            return resJsonArray;
        }

        const resJson: Record<string, string> = {
            isbn: "",
            title: title,
            volume: findFirstValidValue("dcndl:volume", "-"),
            author: findFirstValidValue("dc:creator", "-"),
            publisher: findFirstValidValue("dc:publisher", "-"),
            publicationDate: findFirstValidValue("dcterms:issued", "-"),
            genre: findFirstValidValue("dcndl:genre", "-"),
            jpeCode: getJpeCodeByIsbn(metadata) // 書影用のJP-eコード
        };
        resJsonArray.push(resJson);

        return resJsonArray;
    } catch (e) {
        return resJsonArray;
    }

}

/**
 * isbn以外での検索時、返却されたXmlデータをJsonデータにparseする。
 * 
 * @param xml 
 * @returns 
 */
async function parseXmlToJson(xml: string): Promise<Record<string, string>[]> {

    let resJsonArray: Record<string, string>[] = [];

    try {
        const result = await parseStringPromise(xml);

        const channel = result["rss"]["channel"]?.[0];
        if (!channel || !channel["item"] || channel["item"].length === 0) {
            return resJsonArray;
        }
        const metadata = channel["item"];

        // ISBNをキーとしたデータマップ
        const isbnMap: Record<string, Record<string, string>> = {};

        metadata.forEach((item: Record<string, string[]>) => {
            const findAllValidValues = (searchKey: string, defaultValue: string): string => {
                return item[searchKey]?.[0] || defaultValue;
            };

            // ISBNを取得
            const findIsbn = (): string => {
                type DcIdentifier = {
                    "xsi:type"?: string;
                    "_"?: string;
                };

                const identifiers: DcIdentifier[] = (item["dc:identifier"] ?? []) as DcIdentifier[];
                for (const identifier of identifiers) {
                    if (identifier["xsi:type"] === "dcndl:ISBN") {
                        return validateIsbn(identifier["_"] || "");
                    }
                }
                return "";
            };

            const isbn = findIsbn();
            const title = findAllValidValues("title", "");
            //ISBNまたはタイトルが空の場合はデータをセットせずスキップ
            if (!isbn || !title) return;

            // 共通のデータ構造を初期化
            const newData: Record<string, string> = {
                isbn: isbn,
                title: title,
                volume: findAllValidValues("dcndl:volume", "-"),
                author: findAllValidValues("dc:creator", "-"),
                publisher: findAllValidValues("dc:publisher", "-"),
                publicationDate: findAllValidValues("dcterms:issued", "-"),
                genre: findAllValidValues("dcndl:genre", "-"),
                jpeCode: getJpeCode(item) || "-"
            };

            // 既存データにマージ（存在しない場合は初期値を設定）
            const existingData = isbnMap[isbn] || {
                isbn: isbn,
                title: "-",
                volume: "-",
                author: "-",
                publisher: "-",
                publicationDate: "-",
                genre: "-",
                jpeCode: "-"
            };

            // 必要な場合にのみ上書きする関数
            const updateIfNotSet = (key: string, newValue: string) => {
                if (!existingData[key] || existingData[key] === "-") {
                    existingData[key] = newValue;
                }
            };

            // 既存データと新規データをマージ
            Object.keys(newData).forEach((key) => {
                updateIfNotSet(key, newData[key]);
            });

            // ISBNをキーにデータを保存
            isbnMap[isbn] = existingData;
        });

        resJsonArray.push(...Object.values(isbnMap));
        return resJsonArray;
    } catch (e) {
        return resJsonArray;
    }
}

// ISBNのバリデーション関数 (10桁または13桁の数字のみ許可)
const validateIsbn = (isbn: string): string => {
    const digits = isbn.match(/\d+/g)?.join('') || '';
    return /^(\d{10}|\d{13})$/.test(digits) ? digits : '';
};

/**
 * JP-eコードを取得（isbn検索）
 * @param metadata 書籍データの配列：XML形式
 * @returns JP-eコード：取得失敗した場合は空文字""
 */
const getJpeCodeByIsbn = (metadata: (Record<string, any> | undefined)[]): string => {

    const seeAlsoUrls = metadata
        .flatMap(item => item?.["rdfs:seeAlso"] ?? [])
        .map(item => item?.["$"]?.["rdf:resource"])
        .filter(url => url !== undefined);

    const jpeUrlRegex = /^https:\/\/www\.books\.or\.jp\/book-details\/([a-zA-Z0-9]{20})$/;
    const jpeCodeUrl = seeAlsoUrls.find((url) => url && jpeUrlRegex.test(url));

    //最初に取得できたJP-eコードを返却
    return jpeCodeUrl?.match(jpeUrlRegex)?.[1] ?? "";

};

/**
 * JP-eコードを取得
 * @param item 書籍データのitem：XML形式
 * @returns JP-eコード：取得失敗した場合は空文字""
 */
const getJpeCode = (item: Record<string, string[]>): string => {

    //  seeAlsoItemのデータを配列で返却
    const rdfResources = (item: Record<string, string[]>): string[] => {
        type SeeAlso = {
            "rdf:resource"?: string;
        }

        const seeAlsoItems = item["rdfs:seeAlso"] as SeeAlso[] | undefined;
        return seeAlsoItems?.map((seeAlsoItem: SeeAlso) => seeAlsoItem["rdf:resource"])
            .filter((url): url is string => typeof url === "string") ?? [];
    };

    // 最初にマッチしたJP-eコードを返却
    const extractFirstJpeCode = (item: Record<string, string[]>): string => {
        const jpeUrlRegex = /^https:\/\/www\.books\.or\.jp\/book-details\/([a-zA-Z0-9]{20})$/;
        const matchedUrl = rdfResources(item).find((url) => jpeUrlRegex.test(url));

        return matchedUrl ? matchedUrl.match(jpeUrlRegex)?.[1] ?? "" : "";
    };

    const jpeCode = extractFirstJpeCode(item);

    return jpeCode;

};

export { parseXmlToJson, parseXmlToJsonByIsbn };
