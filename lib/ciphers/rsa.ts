// Helper function to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Helper function to convert Base64 to ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

// 1. Generate RSA-OAEP key pair
export async function generateRsaKeyPair(): Promise<CryptoKeyPair> {
  return window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
      hash: 'SHA-256',
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

// 2. Export keys to a readable format (Base64)
export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('spki', key);
  return arrayBufferToBase64(exported);
}

export async function exportPrivateKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('pkcs8', key);
  return arrayBufferToBase64(exported);
}

// 3. Import keys from Base64
async function importPublicKey(keyData: string): Promise<CryptoKey> {
    const buffer = base64ToArrayBuffer(keyData);
    return window.crypto.subtle.importKey(
        'spki',
        buffer,
        {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
        },
        true,
        ['encrypt']
    );
}

async function importPrivateKey(keyData: string): Promise<CryptoKey> {
    const buffer = base64ToArrayBuffer(keyData);
    return window.crypto.subtle.importKey(
        'pkcs8',
        buffer,
        {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
        },
        true,
        ['decrypt']
    );
}


// 4. Encrypt a message
export async function rsaEncrypt(
  publicKeyStr: string,
  plaintext: string
): Promise<string> {
  const publicKey = await importPublicKey(publicKeyStr);
  const encodedPlaintext = new TextEncoder().encode(plaintext);
  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    encodedPlaintext
  );
  return arrayBufferToBase64(ciphertext);
}

// 5. Decrypt a message
export async function rsaDecrypt(
  privateKeyStr: string,
  ciphertext: string
): Promise<string> {
    const privateKey = await importPrivateKey(privateKeyStr);
    const ciphertextBuffer = base64ToArrayBuffer(ciphertext);
    const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP',
    },
    privateKey,
    ciphertextBuffer
  );
  return new TextDecoder().decode(decryptedBuffer);
}
