import * as SQLite from "expo-sqlite";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

const DB_NAME = "credentials.db";
const db = SQLite.openDatabase(DB_NAME);

// --- Encryption Helpers ---
const ENCRYPTION_KEY_NAME = "master_encryption_key";

/**
 * Derives a consistent key from the user's master password
 * (in production you should use PBKDF2/argon2; for now we hash once for simplicity).
 */
async function deriveKey(password: string): Promise<string> {
    return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
    );
}

/**
 * Encrypts plaintext with a derived key.
 * Right now we do a simple XOR-like scheme for demo; you should replace with AES later.
 */
function simpleEncrypt(plain: string, key: string): string {
    const plainBytes = new TextEncoder().encode(plain);
    const keyBytes = new TextEncoder().encode(key);
    const result = plainBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
    return Buffer.from(result).toString("base64");
}

function simpleDecrypt(cipher: string, key: string): string {
    const cipherBytes = Buffer.from(cipher, "base64");
    const keyBytes = new TextEncoder().encode(key);
    const result = cipherBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
    return new TextDecoder().decode(result);
}

// --- DB Setup ---
export function initDb() {
    db.transaction(tx => {
        tx.executeSql(`
      CREATE TABLE IF NOT EXISTS credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    });
}

// --- Master Password Handling ---
export async function setMasterPassword(password: string) {
    const key = await deriveKey(password);
    await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, key);
}

async function getMasterKey(): Promise<string> {
    const key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME);
    if (!key) throw new Error("No master password set!");
    return key;
}

// --- CRUD Methods ---
export async function createCredential(
    title: string,
    username: string,
    password: string
) {
    const key = await getMasterKey();
    const encryptedPass = simpleEncrypt(password, key);

    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO credentials (title, username, password) VALUES (?, ?, ?)",
                [title, username, encryptedPass],
                () => resolve(),
                (_, error) => {
                    reject(error);
                    return false;
                }
            );
        });
    });
}

export async function getCredentials() {
    const key = await getMasterKey();
    return new Promise<any[]>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM credentials",
                [],
                (_, { rows }) => {
                    const decrypted = rows._array.map(row => ({
                        ...row,
                        password: simpleDecrypt(row.password, key)
                    }));
                    resolve(decrypted);
                },
                (_, error) => {
                    reject(error);
                    return false;
                }
            );
        });
    });
}

export async function updateCredential(
    id: number,
    title: string,
    username: string,
    password: string
) {
    const key = await getMasterKey();
    const encryptedPass = simpleEncrypt(password, key);

    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "UPDATE credentials SET title=?, username=?, password=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?",
                [title, username, encryptedPass, id],
                () => resolve(),
                (_, error) => {
                    reject(error);
                    return false;
                }
            );
        });
    });
}

export async function deleteCredential(id: number) {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                "DELETE FROM credentials WHERE id=?",
                [id],
                () => resolve(),
                (_, error) => {
                    reject(error);
                    return false;
                }
            );
        });
    });
}
