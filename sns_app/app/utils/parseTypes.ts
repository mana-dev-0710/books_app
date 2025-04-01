/**
 * Date型からstring型（YYYY/MM/DD）にparseする。
 * 
 * @param date 
 * @returns 
 */
function parseTypes(date: Date): string | null {

    try {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return null;
        }

        // 年・月・日を取得し、2桁にゼロ埋めする
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 1月は0なので+1
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}/${month}/${day}`;
    } catch (e) {
        console.error("型変換エラー", e);
        return null;
    }

}

export { parseTypes };