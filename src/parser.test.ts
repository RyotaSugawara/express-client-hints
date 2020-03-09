import test from 'ava';
import {
  clientHintsUserAgentParser,
  earlyChromeUaParser,
  greaseLikeUserAgentParser,
  shListParser,
} from './parser';

const EARLY_CHROME_UA = 'Google Chrome 80';
const INVALID_UA = 'fooo';
const VALID_UA_1 = '"Google Chrome"; v="82"';
const VALID_UA_2 = '"Not Browser"; v="30"';
const VALID_UA_LIST = `${VALID_UA_1}, ${VALID_UA_2}`;

test('shListParser: should return string[] if sh-list length is 1', t => {
  t.deepEqual(shListParser(VALID_UA_1), [VALID_UA_1]);
});

test('shListParser: should return string[]', t => {
  t.deepEqual(shListParser(VALID_UA_LIST), [VALID_UA_1, VALID_UA_2]);
});

test('earlyChromeUaParser: should return UABrandVersion if early chrome', t => {
  t.deepEqual(earlyChromeUaParser(EARLY_CHROME_UA), {
    brand: 'Google Chrome',
    version: '80',
  });
});

test('earlyChromeUaParser: should return empty UABrandVersion if not early chrome', t => {
  t.deepEqual(earlyChromeUaParser(VALID_UA_1), {
    brand: '',
    version: '',
  });
});

test('greaseLikeUserAgentParser: should return UABrandVersion if valid ua', t => {
  t.deepEqual(greaseLikeUserAgentParser(VALID_UA_1), {
    brand: 'Google Chrome',
    version: '82',
  });
  t.deepEqual(greaseLikeUserAgentParser(VALID_UA_2), {
    brand: 'Not Browser',
    version: '30',
  });
});

test('greaseLikeUserAgentParser: should return UABrandVersion if early chrome', t => {
  t.deepEqual(greaseLikeUserAgentParser(EARLY_CHROME_UA), {
    brand: 'Google Chrome',
    version: '80',
  });
});

test('greaseLikeUserAgentParser: should return empty version if invalid ua', t => {
  t.deepEqual(greaseLikeUserAgentParser(INVALID_UA), {
    brand: INVALID_UA,
    version: '',
  });
});

test('clientHintsUserAgentParser: should return UABrandVersion[] if valid ua', t => {
  t.deepEqual(clientHintsUserAgentParser(VALID_UA_LIST), [
    greaseLikeUserAgentParser(VALID_UA_1),
    greaseLikeUserAgentParser(VALID_UA_2),
  ]);
});

test('clientHintsUserAgentParser: should return UABrandVersion[] if early chrome', t => {
  t.deepEqual(clientHintsUserAgentParser(EARLY_CHROME_UA), [
    earlyChromeUaParser(EARLY_CHROME_UA),
  ]);
});
