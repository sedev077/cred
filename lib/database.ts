// lib/database.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('credentials.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS credentials (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          username TEXT,
          password TEXT NOT NULL,
          website TEXT,
          notes TEXT,
          createdAt TEXT DEFAULT (datetime('now')),
          updatedAt TEXT DEFAULT (datetime('now'))
        );`,
        [],
        () => resolve(true),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const database = {
  createCredential: (credential: {
    title: string;
    username?: string;
    password: string;
    website?: string;
    notes?: string;
  }) => {
    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO credentials (id, title, username, password, website, notes) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            id,
            credential.title,
            credential.username || null,
            credential.password, // This should already be encrypted
            credential.website || null,
            credential.notes || null,
          ],
          (_, result) => resolve({ id, ...credential, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getCredentials: () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM credentials ORDER BY createdAt DESC',
          [],
          (_, { rows: { _array } }) => resolve(_array),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  updateCredential: (id: string, updates: any) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE credentials SET ${fields}, updatedAt = datetime('now') WHERE id = ?`,
          [...values, id],
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  deleteCredential: (id: string) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM credentials WHERE id = ?',
          [id],
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },
};