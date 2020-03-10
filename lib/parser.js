"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EARLY_CH_UA_REGEXP = /^(.*) ([\d.]+)$/;
exports.shListParser = function (shList) {
    return shList.split(',').map(function (shString) { return shString.trim(); });
};
exports.earlyChUaParser = function (uaString) {
    var match = uaString.match(EARLY_CH_UA_REGEXP);
    if (!match) {
        return { brand: '', version: '' };
    }
    var brand = match[1], version = match[2];
    return { brand: brand, version: version };
};
exports.greaseLikeUserAgentParser = function (uaString) {
    if (EARLY_CH_UA_REGEXP.test(uaString)) {
        return exports.earlyChUaParser(uaString);
    }
    var _a = uaString.split(';').map(function (str) { return str.trim(); }), _brand = _a[0], _version = _a[1];
    var brandVersion = {
        brand: '',
        version: '',
    };
    try {
        brandVersion.brand = JSON.parse(_brand);
        brandVersion.version = JSON.parse(_version.replace(/^v=(.+)/, '$1'));
    }
    catch (e) {
        brandVersion.brand = _brand;
    }
    return brandVersion;
};
exports.clientHintsUserAgentParser = function (shList) {
    var brandVersionList = exports.shListParser(shList);
    return brandVersionList.map(function (brandVersion) {
        return exports.greaseLikeUserAgentParser(brandVersion);
    });
};
//# sourceMappingURL=parser.js.map