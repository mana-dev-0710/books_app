/**
 * 数字を抽出後、10桁または13桁の数字であれば返却。それ以外は空文字を返却。
 * 
 * @param isbn 
 * @returns 
 */
const validateIsbn = (isbn: string): string => {
    const digits = isbn.replace(/\D/g, "");
    return digits.length === 10 || digits.length === 13 ? digits : "";

}

export { validateIsbn };