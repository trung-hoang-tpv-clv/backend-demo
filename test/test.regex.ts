/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import * as path from 'path';
import * as fg from 'fast-glob';
import * as nock from 'nock';

const specs = fg.sync([
  path.join(__dirname, '/**/*.spec.ts').replace(/\\/g, '/'),
  path.join(__dirname, '../src/**/*.spec.ts').replace(/\\/g, '/'),
]);

specs.forEach((file) => {
  require(file);
});

afterAll(() => {
  nock.restore();
});
