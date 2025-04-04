export function xorEncrypt(hex: string, checkDigit: number): string {
    return hex
        .split('')
        .map(char => {
            const num = parseInt(char, 16);
            const xorResult = (num ^ checkDigit) & 0xF;
            return xorResult.toString(16);
            return xorResult.toString(16);
        })
        .join("");
}

export function encryptHashFields(hashFields: Record<string, string>, checkDigit: number): Record<string, string> {
    const encrypted: Record<string, string> = {};
    for (const key in hashFields) {
        if (hashFields.hasOwnProperty(key)) {
            encrypted[key] = xorEncrypt(hashFields[key], checkDigit);
        }
    }
    return encrypted;
}

export function encryptSingleField(hashValue: string, checkDigit: number): string {
    return xorEncrypt(hashValue, checkDigit);
}
