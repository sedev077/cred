"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCredential = exports.updateCredential = exports.getCredentials = exports.createCredential = exports.setMasterPassword = exports.initDb = void 0;
var SQLite = require("expo-sqlite");
var Crypto = require("expo-crypto");
var SecureStore = require("expo-secure-store");
var DB_NAME = "credentials.db";
var db = SQLite.openDatabase(DB_NAME);
// --- Encryption Helpers ---
var ENCRYPTION_KEY_NAME = "master_encryption_key";
/**
 * Derives a consistent key from the user's master password
 * (in production you should use PBKDF2/argon2; for now we hash once for simplicity).
 */
function deriveKey(password) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Encrypts plaintext with a derived key.
 * Right now we do a simple XOR-like scheme for demo; you should replace with AES later.
 */
function simpleEncrypt(plain, key) {
    var plainBytes = new TextEncoder().encode(plain);
    var keyBytes = new TextEncoder().encode(key);
    var result = plainBytes.map(function (b, i) { return b ^ keyBytes[i % keyBytes.length]; });
    return Buffer.from(result).toString("base64");
}
function simpleDecrypt(cipher, key) {
    var cipherBytes = Buffer.from(cipher, "base64");
    var keyBytes = new TextEncoder().encode(key);
    var result = cipherBytes.map(function (b, i) { return b ^ keyBytes[i % keyBytes.length]; });
    return new TextDecoder().decode(result);
}
// --- DB Setup ---
function initDb() {
    db.transaction(function (tx) {
        tx.executeSql("\n      CREATE TABLE IF NOT EXISTS credentials (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        title TEXT NOT NULL,\n        username TEXT NOT NULL,\n        password TEXT NOT NULL,\n        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP\n      );\n    ");
    });
}
exports.initDb = initDb;
// --- Master Password Handling ---
function setMasterPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        var key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deriveKey(password)];
                case 1:
                    key = _a.sent();
                    return [4 /*yield*/, SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, key)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setMasterPassword = setMasterPassword;
function getMasterKey() {
    return __awaiter(this, void 0, Promise, function () {
        var key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, SecureStore.getItemAsync(ENCRYPTION_KEY_NAME)];
                case 1:
                    key = _a.sent();
                    if (!key)
                        throw new Error("No master password set!");
                    return [2 /*return*/, key];
            }
        });
    });
}
// --- CRUD Methods ---
function createCredential(title, username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var key, encryptedPass;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMasterKey()];
                case 1:
                    key = _a.sent();
                    encryptedPass = simpleEncrypt(password, key);
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            db.transaction(function (tx) {
                                tx.executeSql("INSERT INTO credentials (title, username, password) VALUES (?, ?, ?)", [title, username, encryptedPass], function () { return resolve(); }, function (_, error) {
                                    reject(error);
                                    return false;
                                });
                            });
                        })];
            }
        });
    });
}
exports.createCredential = createCredential;
function getCredentials() {
    return __awaiter(this, void 0, void 0, function () {
        var key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMasterKey()];
                case 1:
                    key = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            db.transaction(function (tx) {
                                tx.executeSql("SELECT * FROM credentials", [], function (_, _a) {
                                    var rows = _a.rows;
                                    var decrypted = rows._array.map(function (row) { return (__assign(__assign({}, row), { password: simpleDecrypt(row.password, key) })); });
                                    resolve(decrypted);
                                }, function (_, error) {
                                    reject(error);
                                    return false;
                                });
                            });
                        })];
            }
        });
    });
}
exports.getCredentials = getCredentials;
function updateCredential(id, title, username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var key, encryptedPass;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getMasterKey()];
                case 1:
                    key = _a.sent();
                    encryptedPass = simpleEncrypt(password, key);
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            db.transaction(function (tx) {
                                tx.executeSql("UPDATE credentials SET title=?, username=?, password=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?", [title, username, encryptedPass, id], function () { return resolve(); }, function (_, error) {
                                    reject(error);
                                    return false;
                                });
                            });
                        })];
            }
        });
    });
}
exports.updateCredential = updateCredential;
function deleteCredential(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.transaction(function (tx) {
                        tx.executeSql("DELETE FROM credentials WHERE id=?", [id], function () { return resolve(); }, function (_, error) {
                            reject(error);
                            return false;
                        });
                    });
                })];
        });
    });
}
exports.deleteCredential = deleteCredential;
