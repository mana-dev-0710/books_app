async function getImageUrl(isbn: string | undefined | null, jpeCode: string | undefined | null): Promise<string> {

    let searchImgRes: Response | null = null;
    const imageUrlDefault = "/images/default-book.png";
    let imageUrl = "";

    if (!isbn && !jpeCode) {
        return imageUrlDefault;
    }

    try {
        if (jpeCode) {
            imageUrl = `https://ndlsearch.ndl.go.jp/thumbnail/${jpeCode}.jpg`;
            searchImgRes = await fetch(imageUrl, {
                method: "GET",
            });

            if (searchImgRes.ok) {
                return imageUrl;
            }
        }

        if (isbn) {
            imageUrl = `https://ndlsearch.ndl.go.jp/thumbnail/${isbn}.jpg`;
            searchImgRes = await fetch(imageUrl, {
                method: "GET",
            });

            if (searchImgRes.ok) {
                return imageUrl;
            }
        }

        return imageUrlDefault;
    } catch (e) {
        console.error("書影URLをチェック中に予期せぬエラーが発生しました。:", e);
        return imageUrlDefault;
    }

}

export { getImageUrl };
export const maxDuration = 60;
