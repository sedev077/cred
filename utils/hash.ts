// utils/hash.ts
import * as Crypto from 'expo-crypto';
import 'react-native-get-random-values';

export async function hashPassword(password: string) {
  // Generate a random salt
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Use SHA-256 (not as secure as Argon2, but works in Expo)
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + salt
  );

  return { hash, salt };
}

export async function verifyPassword(password: string, salt: string, storedHash: string) {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + salt
  );
  
  return hash === storedHash;
}