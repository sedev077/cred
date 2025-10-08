"use strict";
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
exports.useCredentialStore = void 0;
// hooks/useCredentialStore.ts
var zustand_1 = require("zustand");
var db_1 = require("@/lib/db");
var toast_1 = require("@/utils/toast");
exports.useCredentialStore = (0, zustand_1.create)(function (set, get) { return ({
    credentials: [],
    isHydrated: false,
    loadCredentials: function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.prisma.credential.findMany({
                            orderBy: { createdAt: "desc" }
                        })];
                case 1:
                    data = _a.sent();
                    set({ credentials: data, isHydrated: true });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to load credentials:", error_1);
                    set({ isHydrated: false });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    addCredential: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var updated, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, db_1.prisma.credential.create({ data: data })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.credential.findMany({
                            orderBy: { createdAt: "desc" }
                        })];
                case 2:
                    updated = _a.sent();
                    set({ credentials: updated });
                    toast_1.AppToast.add.success("".concat(data.service, " has been added"));
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Failed to add credential:", error_2);
                    toast_1.AppToast.add.error("Failed to add credential");
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    updateCredential: function (id, data) { return __awaiter(void 0, void 0, void 0, function () {
        var updated, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, db_1.prisma.credential.update({ where: { id: id }, data: data })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.credential.findMany({
                            orderBy: { createdAt: "desc" }
                        })];
                case 2:
                    updated = _a.sent();
                    set({ credentials: updated });
                    toast_1.AppToast.update.success("".concat(data.service || "Credential", " has been updated"));
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Failed to update credential:", error_3);
                    toast_1.AppToast.update.error("Failed to update credential");
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    deleteCredential: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var credential, updated, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, db_1.prisma.credential.findUnique({
                            where: { id: id }
                        })];
                case 1:
                    credential = _a.sent();
                    return [4 /*yield*/, db_1.prisma.credential.delete({ where: { id: id } })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.credential.findMany({
                            orderBy: { createdAt: "desc" }
                        })];
                case 3:
                    updated = _a.sent();
                    set({ credentials: updated });
                    toast_1.AppToast.delete.success(credential
                        ? "".concat(credential.service, " has been removed")
                        : "Credential removed");
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error("Failed to delete credential:", error_4);
                    toast_1.AppToast.delete.error("Failed to delete credential");
                    throw error_4;
                case 5: return [2 /*return*/];
            }
        });
    }); },
    resetCredentials: function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.prisma.credential.deleteMany()];
                case 1:
                    _a.sent();
                    set({ credentials: [] });
                    toast_1.AppToast.delete.success("All credentials cleared");
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error("Failed to reset credentials:", error_5);
                    toast_1.AppToast.delete.error("Failed to clear credentials");
                    throw error_5;
                case 3: return [2 /*return*/];
            }
        });
    }); }
}); });
