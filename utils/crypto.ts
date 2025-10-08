// utils/crypto.ts
import * as Crypto from "expo-crypto";
import "react-native-get-random-values";

// Convert text <-> ArrayBuffer helpers
function textToBuffer(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const buffer = new Uint8Array(len);
  for (let i = 0; i < len; i++) buffer[i] = binary.charCodeAt(i);
  return buffer;
}

/**
 * Derives a key from the master password/PIN
 * For production, you'd want Argon2 or PBKDF2 with many iterations.
 * Expo gives us SHA-256, which is weaker but works cross-platform.
 */
async function deriveKey(masterKey: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    masterKey
  );
}

/**
 * Encrypts text with a masterKey
 * (AES is ideal but Expo doesn't support it natively, so this is
 * a "poor-man's AES" using XOR + SHA256 derived key for demo purposes).
 */
export function encryptData(data: string, masterKey: string): string {
  if (!data) return "";

  const keyHash = textToBuffer(masterKey).reduce((acc, cur) => acc + cur, 0);
  const encoded = textToBuffer(data).map((char, i) => char ^ (keyHash + i));
  return bufferToBase64(encoded);
}

/**
 * Decrypts text with a masterKey
 */
export function decryptData(encrypted: string, masterKey: string): string {
  if (!encrypted) return "";

  const keyHash = textToBuffer(masterKey).reduce((acc, cur) => acc + cur, 0);
  const decoded = base64ToBuffer(encrypted).map(
    (char, i) => char ^ (keyHash + i)
  );
  return new TextDecoder().decode(decoded);
}