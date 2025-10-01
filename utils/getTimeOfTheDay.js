"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeOfDay = void 0;
var getTimeOfDay = function () {
    var hour = new Date().getHours();
    if (hour < 12)
        return "morning";
    if (hour < 17)
        return "afternoon";
    return "evening";
};
exports.getTimeOfDay = getTimeOfDay;
