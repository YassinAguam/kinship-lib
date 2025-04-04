export function xorDecrypt(encrypted: string, checkDigit: number): string {
    return encrypted
        .split("")
        .map(char => {
            const num = parseInt(char, 16);
            const decrypted = (num ^ checkDigit) & 0xF;
            return decrypted.toString(16);
        })
        .join("");
}

export function decryptHashFields(
    encryptedFields: Record<string, string>,
    checkDigit: number
): Record<string, string> {
    const decrypted: Record<string, string> = {};
    for (const key in encryptedFields) {
        if (encryptedFields.hasOwnProperty(key)) {
            decrypted[key] = xorDecrypt(encryptedFields[key], checkDigit);
        }
    }
    return decrypted;
}
