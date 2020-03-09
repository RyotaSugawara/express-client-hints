export interface UABrandVersion {
  brand: string;
  version: string;
}

const EARLY_CH_UA_REGEXP = /^(.*) ([\d.]+)$/;

export const shListParser = (shList: string): string[] => {
  return shList.split(',').map(shString => shString.trim());
};

export const earlyChUaParser = (uaString: string): UABrandVersion => {
  const match = uaString.match(EARLY_CH_UA_REGEXP);
  if (!match) {
    return { brand: '', version: '' };
  }

  const [, brand, version] = match;
  return { brand, version };
};

export const greaseLikeUserAgentParser = (uaString: string): UABrandVersion => {
  if (EARLY_CH_UA_REGEXP.test(uaString)) {
    return earlyChUaParser(uaString);
  }

  const [_brand, _version] = uaString.split(';').map(str => str.trim());
  const brandVersion: UABrandVersion = {
    brand: '',
    version: '',
  };
  try {
    brandVersion.brand = JSON.parse(_brand) as string;
    brandVersion.version = JSON.parse(
      _version.replace(/^v=(.+)/, '$1'),
    ) as string;
  } catch (e) {
    brandVersion.brand = _brand;
  }
  return brandVersion;
};

export const clientHintsUserAgentParser = (
  shList: string,
): UABrandVersion[] => {
  const brandVersionList = shListParser(shList);
  return brandVersionList.map(brandVersion =>
    greaseLikeUserAgentParser(brandVersion),
  );
};
