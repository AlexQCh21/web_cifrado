export function caesarEncrypt(text: string, shift: number): string {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) { // Uppercase letters
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        if (code >= 97 && code <= 122) { // Lowercase letters
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char; // Non-alphabetic characters
    }).join('');
}

export function caesarDecrypt(text: string, shift: number): string {
    // Decryption is just encryption with the inverse shift
    return caesarEncrypt(text, 26 - (shift % 26));
}
