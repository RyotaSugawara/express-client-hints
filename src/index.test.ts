import test from 'ava';
import express from 'express';
import clientHintsHandler from './index';
import supertest from 'supertest';

const createApp = (accepts?: string[]): express.Express => {
  const app = express();
  app.use(clientHintsHandler(accepts));
  app.get('/', (req, res) => {
    res.json(req.clientHints);
  });
  return app;
};

test('should set accept-ch header (none)', async t => {
  const app = createApp();
  const res = await supertest(app).get('/');
  t.is(res.get('accept-ch'), undefined);
});

test('should set accept-ch header (single)', async t => {
  const app = createApp(['sec-ch-ua-platform']);
  const res = await supertest(app).get('/');
  t.is(res.get('accept-ch'), 'sec-ch-ua-platform');
});

test('should set accept-ch header (multi accepts)', async t => {
  const app = createApp(['sec-ch-ua-platform', 'sec-ch-ua-arch']);
  const res = await supertest(app).get('/');
  t.is(res.get('accept-ch'), 'sec-ch-ua-platform, sec-ch-ua-arch');
});

test('should return default client-hints', async t => {
  const app = createApp();
  const res = await supertest(app)
    .get('/')
    .set('sec-ch-ua', '"Google Chrome"; v="80"')
    .set('sec-ch-ua-mobile', '?0');
  t.is(res.body.brand, 'Google Chrome');
  t.is(res.body.version, '80');
  t.is(res.body.mobile, false);
  t.deepEqual(res.body._brandVersions, [
    { brand: 'Google Chrome', version: '80' },
  ]);
});

test('should return existing client-hints', async t => {
  const app = createApp();
  const res = await supertest(app)
    .get('/')
    .set('sec-ch-ua', '"Google Chrome"; v="82", "NotBrowser"; v="0"')
    .set('sec-ch-ua-mobile', '?1')
    .set('sec-ch-ua-arch', 'Intel')
    .set('sec-ch-ua-model', 'Pixel3 XL')
    .set('sec-ch-ua-platform', 'Mac OS X')
    .set('sec-ch-ua-platform-version', '82.0.4078.2');
  t.is(res.body.brand, 'Google Chrome');
  t.is(res.body.version, '82');
  t.is(res.body.mobile, true);
  t.is(res.body.architecture, 'Intel');
  t.is(res.body.platform, 'Mac OS X');
  t.is(res.body.model, 'Pixel3 XL');
  t.is(res.body.platformVersion, '82.0.4078.2');
  t.deepEqual(res.body._brandVersions, [
    { brand: 'Google Chrome', version: '82' },
    { brand: 'NotBrowser', version: '0' },
  ]);
});

test('should return client hints if early chrome', async t => {
  const app = createApp();
  const res = await supertest(app)
    .get('/')
    .set('sec-ch-ua', 'Google Chrome 80')
    .set('sec-ch-ua-mobile', '?0');
  t.is(res.body.brand, 'Google Chrome');
  t.is(res.body.version, '80');
  t.is(res.body.mobile, false);
  t.deepEqual(res.body._brandVersions, [
    {
      brand: 'Google Chrome',
      version: '80',
    },
  ]);
});

test('should return without errors if invalid ua', async t => {
  const app = createApp();
  const res = await supertest(app)
    .get('/')
    .set('sec-ch-ua', 'foo, bar')
    .set('sec-ch-ua-mobile', '?0');
  t.is(res.body.brand, null);
  t.is(res.body.version, null);
  t.is(res.body.mobile, null);
  t.deepEqual(res.body._brandVersions, null);
});
