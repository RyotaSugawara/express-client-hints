/**
 * @see {@link https://tools.ietf.org/html/draft-ietf-httpbis-client-hints-10#section-3}
 * @description
 * Accept-CH = sh-list
 * example
 * ```
 * Accept-CH: Sec-CH-Example, Sec-CH-Example-2
 * ```
 */
export declare const CLIENT_HINTS_RESPONSE_HEADER_MAP: {
    ACCEPT_CH: string;
};
/**
 * User Agent Hints
 * @see {@link https://wicg.github.io/ua-client-hints/#http-ua-hints}
 */
export declare const CLIENT_HINTS_REQUEST_HEADER_MAP: {
    SEC_CH_UA: string;
    SEC_CH_UA_ARCH: string;
    SEC_CH_UA_MOBILE: string;
    SEC_CH_UA_MODEL: string;
    SEC_CH_UA_PLATFORM: string;
    SEC_CH_UA_PLATFORM_VERSION: string;
};
//# sourceMappingURL=headers.d.ts.map