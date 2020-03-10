"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var headers_1 = require("./headers");
exports.CLIENT_HINTS_RESPONSE_HEADER_MAP = headers_1.CLIENT_HINTS_RESPONSE_HEADER_MAP;
exports.CLIENT_HINTS_REQUEST_HEADER_MAP = headers_1.CLIENT_HINTS_REQUEST_HEADER_MAP;
var clientHintsHandler = function (accepts) {
    if (accepts === void 0) { accepts = []; }
    return function (req, res, next) {
        // set accept-ch header if have accepts setting.
        if (accepts.length) {
            res.set(headers_1.CLIENT_HINTS_RESPONSE_HEADER_MAP.ACCEPT_CH, accepts);
        }
        req.clientHints = {
            architecture: null,
            brand: null,
            mobile: null,
            model: null,
            platform: null,
            platformVersion: null,
            version: null,
            _brandVersions: null,
        };
        /**
         * GREASE-like UA Strings
         * @see {@link https://wicg.github.io/ua-client-hints/#sec-ch-ua}
         * @see {@link https://wicg.github.io/ua-client-hints/#grease}
         * @description
         * e.g. Sec-CH-UA: "Chrome"; v="82", "NotBrowser"; v="0"
         */
        var shListUserAgent = req.get(headers_1.CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA) || '';
        var brandVersionList = parser_1.clientHintsUserAgentParser(shListUserAgent);
        var mobileString = req.get(headers_1.CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA_MOBILE);
        if (!mobileString) {
            next();
            return;
        }
        var primaryBrandVersion = brandVersionList[0];
        if (!primaryBrandVersion.version) {
            next();
            return;
        }
        req.clientHints.brand = primaryBrandVersion.brand;
        req.clientHints.version = primaryBrandVersion.version;
        req.clientHints._brandVersions = brandVersionList;
        req.clientHints.mobile =
            req.get(headers_1.CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA_MOBILE) === '?1';
        var architecture = req.get(headers_1.CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA_ARCH);
        var model = req.get(headers_1.CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA_MODEL);
        var platform = req.get(headers_1.CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA_PLATFORM);
        var platformVersion = req.get(headers_1.CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA_PLATFORM_VERSION);
        if (architecture !== undefined) {
            req.clientHints.architecture = architecture;
        }
        if (model !== undefined) {
            req.clientHints.model = model;
        }
        if (platform) {
            req.clientHints.platform = platform;
        }
        if (platformVersion !== undefined) {
            req.clientHints.platformVersion = platformVersion;
        }
        next();
    };
};
exports.default = clientHintsHandler;
//# sourceMappingURL=index.js.map