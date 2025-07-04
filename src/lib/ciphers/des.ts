import CryptoJS from 'crypto-js';

export function desEncrypt(text: string, key: string): string {
    try {
        return CryptoJS.DES.encrypt(text, key).toString();
    } catch (e) {
        return "Error en el cifrado. Verifique la clave.";
    }
}

export function desDecrypt(ciphertext: string, key: string): string {
    try {
        const bytes = CryptoJS.DES.decrypt(ciphertext, key);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (!originalText) {
            return "Error: Clave incorrecta o texto cifrado corrupto.";
        }
        return originalText;
    } catch (e) {
        return "Error en el descifrado. Verifique la clave y el texto cifrado.";
    }
}
