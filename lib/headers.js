"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @see {@link https://tools.ietf.org/html/draft-ietf-httpbis-client-hints-10#section-3}
 * @description
 * Accept-CH = sh-list
 * example
 * ```
 * Accept-CH: Sec-CH-Example, Sec-CH-Example-2
 * ```
 */
exports.CLIENT_HINTS_RESPONSE_HEADER_MAP = {
    ACCEPT_CH: 'Accept-CH',
};
/**
 * User Agent Hints
 * @see {@link https://wicg.github.io/ua-client-hints/#http-ua-hints}
 */
exports.CLIENT_HINTS_REQUEST_HEADER_MAP = {
    SEC_CH_UA: 'Sec-CH-UA',
    SEC_CH_UA_ARCH: 'Sec-CH-UA-Arch',
    SEC_CH_UA_MOBILE: 'Sec-CH-UA-Mobile',
    SEC_CH_UA_MODEL: 'Sec-CH-UA-Model',
    SEC_CH_UA_PLATFORM: 'Sec-CH-UA-Platform',
    SEC_CH_UA_PLATFORM_VERSION: 'Sec-CH-UA-Platform-Version',
};
//# sourceMappingURL=headers.js.map