const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const scripts = path.join(__dirname, '../app/scripts');

// Loads an AngularJS service from its AMD module, as messaging-paging.test.cjs does.
function load(file, register, ...dependencies) {
  let constructor;
  vm.runInNewContext(fs.readFileSync(path.join(scripts, file), 'utf8'), {
    define: (_, factory) => factory(
      {module: () => ({[register]: (_, ctor) => {constructor = ctor;}})},
      {terminologyRestAPI: 'https://terminology.test'}),
    console
  });
  return constructor(...dependencies);
}

const urlService = () => {
  const service = load('service/url.service.js', 'service');
  service.init();
  return service;
};
const params = url => new URL(url).searchParams;

test('a page asked for by number is sent as a limit and an offset', () => {
  const url = params(urlService().autocompleteOntology('melanoma', 'DOID', 3, 20));
  assert.equal(url.get('limit'), '20');
  assert.equal(url.get('offset'), '40');
  assert.equal(url.get('page'), null);
  assert.equal(url.get('page_size'), null);
  assert.equal(url.get('pageSize'), null);
});

test('with no page or size, the first page at the route default is asked for', () => {
  const url = params(urlService().autocompleteOntology('*', 'DOID', 0, 0));
  assert.equal(url.get('limit'), '500');
  assert.equal(url.get('offset'), '0');
});

test('every terminology URL the editor builds pages by limit and offset', () => {
  const service = urlService();
  const urls = Object.keys(service)
    .filter(name => typeof service[name] === 'function')
    .flatMap(name => {
      try {
        const built = service[name]('q', 'DOID', 'https://example.org/c', 2, 2, 10);
        return typeof built === 'string' ? [built] : [];
      } catch (e) {
        return [];
      }
    });
  assert.ok(urls.length > 0);
  for (const url of urls) {
    assert.doesNotMatch(url, /[?&](page|page_size|pageSize)=/, url);
  }
});

function autocomplete() {
  return load('controlled-term/autocomplete.service.js', 'factory', {instant: key => key}, {}, {}, {});
}

test('the next page is read from the envelope\'s next link', () => {
  const service = autocomplete();
  service.autocompleteResultsCache = {f: {q: {results: []}}};
  service.setAutocompleteResultsPaging('f', 'q', 'OntologyClass', 'u', {
    request: {limit: 20, offset: 40}, currentOffset: 40, totalCount: 100,
    paging: {first: 'x', prev: 'x', next: 'x', last: 'x'}, collection: []
  });
  assert.equal(service.getPage('f', 'q', 'OntologyClass', 'u'), 4);
  assert.equal(service.getSize('f', 'q', 'OntologyClass', 'u'), 20);
});

test('a page with no next link leaves nothing more to ask for', () => {
  const service = autocomplete();
  service.autocompleteResultsCache = {f: {q: {results: []}}};
  service.setAutocompleteResultsPaging('f', 'q', 'OntologyClass', 'u', {
    request: {limit: 20, offset: 80}, currentOffset: 80, totalCount: 100,
    paging: {first: 'x', prev: 'x', last: 'x'}, collection: []
  });
  assert.equal(service.getPage('f', 'q', 'OntologyClass', 'u'), 0);
});

function dataService(pages) {
  const requested = [];
  const backend = {
    doCall: (request, onSuccess) => {
      if (!request.url.includes('/children?')) {
        return Promise.resolve();
      }
      requested.push(request.url);
      const offset = Number(new URL(request.url).searchParams.get('offset'));
      return Promise.resolve(onSuccess({data: pages[offset]}));
    }
  };
  // Every other request the service makes when it starts is answered with nothing.
  const http = new Proxy({
    getClassChildren: () => ({method: 'GET', url: 'https://terminology.test/children?limit=500&offset=0'})
  }, {get: (target, name) => target[name] ?? (() => ({method: 'GET', url: 'https://terminology.test/other'}))});
  const angular = {extend: Object.assign};
  let constructor;
  vm.runInNewContext(fs.readFileSync(path.join(scripts, 'controlled-term/controlled-term-data.service.js'), 'utf8'), {
    define: (_, factory) => factory(Object.assign({module: () => ({service: (_, ctor) => {constructor = ctor;}, factory: (_, ctor) => {constructor = ctor;}})}, angular)),
    console
  });
  return {service: constructor({}, http, backend, {instant: k => k}, {all: promises => Promise.all(promises)}), requested};
}

const rows = (from, count) => Array.from({length: count}, (_, i) => ({'@id': `c${from + i}`}));
const servedPage = (offset, count, next) => ({collection: rows(offset, count), currentOffset: offset,
  request: {limit: 500, offset}, totalCount: 1200, paging: next ? {next: 'x'} : {}});

test('a class\'s children are read a page at a time, up to 1000', async () => {
  const {service, requested} = dataService({
    0: servedPage(0, 500, true), 500: servedPage(500, 500, true), 1000: servedPage(1000, 200, false)});
  const children = await service.getClassChildren('DOID', 'c');
  assert.equal(children.length, 1000);
  assert.equal(children[999]['@id'], 'c999');
  assert.deepEqual(requested.map(url => new URL(url).searchParams.get('offset')), ['0', '500']);
});

test('a listing that fits one page is read with one request', async () => {
  const {service, requested} = dataService({0: servedPage(0, 30, false)});
  assert.equal((await service.getClassChildren('DOID', 'c')).length, 30);
  assert.equal(requested.length, 1);
});
