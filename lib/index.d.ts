import { Handler } from 'express';
import { UABrandVersion } from './parser';
import { CLIENT_HINTS_RESPONSE_HEADER_MAP, CLIENT_HINTS_REQUEST_HEADER_MAP } from './headers';
/**
 * Override Express.Request to create new Request fields
 */
declare global {
    namespace Express {
        interface Request {
            clientHints: ClientHintsDetail;
        }
    }
}
declare type Nullable<T> = T | null;
/**
 * Interface based on Navigator
 * @see {@link https://wicg.github.io/ua-client-hints/#interface}
 */
export interface ClientHintsDetail {
    architecture: Nullable<string>;
    brand: Nullable<string>;
    mobile: Nullable<boolean>;
    model: Nullable<string>;
    platform: Nullable<string>;
    platformVersion: Nullable<string>;
    version: Nullable<string>;
    _brandVersions: Nullable<UABrandVersion[]>;
}
/**
 * sh-boolean
 * @see {@link https://tools.ietf.org/html/draft-ietf-httpbis-header-structure-15#section-3.3.6}
 */
export declare type StructuredHeadersBoolean = '?0' | '?1';
declare const clientHintsHandler: (accepts?: string[]) => Handler;
export default clientHintsHandler;
export { CLIENT_HINTS_REQUEST_HEADER_MAP, CLIENT_HINTS_RESPONSE_HEADER_MAP, };
//# sourceMappingURL=index.d.ts.map