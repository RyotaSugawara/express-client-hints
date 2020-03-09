import { Handler, Request, Response, NextFunction } from 'express';
import { clientHintsUserAgentParser, UABrandVersion } from './parser';
import {
  CLIENT_HINTS_RESPONSE_HEADER_MAP,
  CLIENT_HINTS_REQUEST_HEADER_MAP,
} from './headers';

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

type Nullable<T> = T | null;

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
export type StructuredHeadersBoolean = '?0' | '?1';

const clientHintsHandler = (accepts: string[] = []): Handler => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // set accept-ch header if have accepts setting.
  if (accepts.length) {
    res.set(CLIENT_HINTS_RESPONSE_HEADER_MAP.ACCEPT_CH, accepts);
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
  const shListUserAgent =
    req.get(CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA) || '';
  const brandVersionList = clientHintsUserAgentParser(shListUserAgent);
  const mobileString = req.get(
    CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA_MOBILE,
  );

  if (!mobileString) {
    next();
    return;
  }

  const primaryBrandVersion = brandVersionList[0];
  if (!primaryBrandVersion.version) {
    next();
    return;
  }

  req.clientHints.brand = primaryBrandVersion.brand;
  req.clientHints.version = primaryBrandVersion.version;
  req.clientHints._brandVersions = brandVersionList;

  req.clientHints.mobile =
    req.get(CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA_MOBILE) === '?1';

  const architecture = req.get(CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA_ARCH);
  const model = req.get(CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA_MODEL);
  const platform = req.get(CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA_PLATFORM);
  const platformVersion = req.get(
    CLIENT_HINTS_REQUEST_HEADER_MAP.SEC_CH_UA_PLATFORM_VERSION,
  );
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

export default clientHintsHandler;
export {
  CLIENT_HINTS_REQUEST_HEADER_MAP,
  CLIENT_HINTS_RESPONSE_HEADER_MAP,
};
