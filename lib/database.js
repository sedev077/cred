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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.initDatabase = void 0;
// lib/database.ts
var SQLite = require("expo-sqlite");
var db = SQLite.openDatabase('credentials.db');
var initDatabase = function () {
    return new Promise(function (resolve, reject) {
        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS credentials (\n          id TEXT PRIMARY KEY NOT NULL,\n          title TEXT NOT NULL,\n          username TEXT,\n          password TEXT NOT NULL,\n          website TEXT,\n          notes TEXT,\n          createdAt TEXT DEFAULT (datetime('now')),\n          updatedAt TEXT DEFAULT (datetime('now'))\n        );", [], function () { return resolve(true); }, function (_, error) {
                reject(error);
                return false;
            });
        });
    });
};
exports.initDatabase = initDatabase;
exports.database = {
    createCredential: function (credential) {
        return new Promise(function (resolve, reject) {
            var id = Math.random().toString(36).substring(2) + Date.now().toString(36);
            db.transaction(function (tx) {
                tx.executeSql("INSERT INTO credentials (id, title, username, password, website, notes) \n           VALUES (?, ?, ?, ?, ?, ?)", [
                    id,
                    credential.title,
                    credential.username || null,
                    credential.password,
                    credential.website || null,
                    credential.notes || null,
                ], function (_, result) { return resolve(__assign(__assign({ id: id }, credential), { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })); }, function (_, error) {
                    reject(error);
                    return false;
                });
            });
        });
    },
    getCredentials: function () {
        return new Promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM credentials ORDER BY createdAt DESC', [], function (_, _a) {
                    var _array = _a.rows._array;
                    return resolve(_array);
                }, function (_, error) {
                    reject(error);
                    return false;
                });
            });
        });
    },
    updateCredential: function (id, updates) {
        return new Promise(function (resolve, reject) {
            var fields = Object.keys(updates).map(function (key) { return "".concat(key, " = ?"); }).join(', ');
            var values = Object.values(updates);
            db.transaction(function (tx) {
                tx.executeSql("UPDATE credentials SET ".concat(fields, ", updatedAt = datetime('now') WHERE id = ?"), __spreadArray(__spreadArray([], values, true), [id], false), function (_, result) { return resolve(result); }, function (_, error) {
                    reject(error);
                    return false;
                });
            });
        });
    },
    deleteCredential: function (id) {
        return new Promise(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM credentials WHERE id = ?', [id], function (_, result) { return resolve(result); }, function (_, error) {
                    reject(error);
                    return false;
                });
            });
        });
    },
};
