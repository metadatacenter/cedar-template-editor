const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const scripts = path.join(__dirname, '../app/scripts');

function makeService(pages) {
  let constructor;
  vm.runInNewContext(fs.readFileSync(path.join(scripts, 'service/messaging.service.js'), 'utf8'), {
    define: (_, factory) => factory(
      {module: () => ({service: (_, ctor) => {constructor = ctor;}})},
      {delay: 1000}),
    console
  });
  const requested = [];
  const errors = [];
  const backend = {
    doCall: (request, onSuccess, onError) => {
      requested.push(request.url);
      const offset = Number(new URL(request.url, 'https://messaging.test').searchParams.get('offset'));
      if (!(offset in pages)) {
        onError({status: 500});
        return;
      }
      onSuccess({data: structuredClone(pages[offset])});
    }
  };
  const service = constructor(
    () => {}, () => {},
    {get: url => ({method: 'GET', url})},
    {messagingMessages: () => 'https://messaging.test/messages'},
    backend,
    {showBackendError: (key, error) => errors.push({key, error})});
  return {service, requested, errors};
}

function page(offset, count, total) {
  const messages = Array.from({length: count}, (_, i) => ({id: `m${offset + i}`}));
  return {total, unread: 1, notnotified: 2, totalCount: total, currentOffset: offset,
    request: {limit: 500, offset}, paging: {}, messages};
}

test('a listing on one page is handed over after one request', () => {
  const {service, requested} = makeService({0: page(0, 3, 3)});
  let listing;

  service.loadMessages(result => {listing = result;});

  assert.deepEqual(requested, ['https://messaging.test/messages?limit=500&offset=0']);
  assert.deepEqual(listing.messages.map(m => m.id), ['m0', 'm1', 'm2']);
  assert.equal(listing.unread, 1);
});

test('every page is gathered, in order, before the callback sees the listing', () => {
  const {service, requested} = makeService({0: page(0, 500, 1203), 500: page(500, 500, 1203),
    1000: page(1000, 203, 1203)});
  let listing;

  service.loadMessages(result => {listing = result;});

  assert.deepEqual(requested.map(u => new URL(u).searchParams.get('offset')), ['0', '500', '1000']);
  assert.equal(listing.messages.length, 1203);
  assert.equal(listing.messages[0].id, 'm0');
  assert.equal(listing.messages[1202].id, 'm1202');
  assert.equal(listing.total, 1203);
  assert.equal(listing.notnotified, 2, 'the summary counts come from the first page');
});

test('an empty listing is handed over', () => {
  const {service} = makeService({0: page(0, 0, 0)});
  let listing;

  service.loadMessages(result => {listing = result;});

  assert.deepEqual(listing.messages, []);
});

test('a page that comes back empty ends the walk rather than looping', () => {
  // The total shrank between requests: messages were deleted while the listing was being read.
  const {service, requested} = makeService({0: page(0, 500, 900), 500: {...page(500, 0, 900)}});
  let listing;

  service.loadMessages(result => {listing = result;});

  assert.equal(requested.length, 2);
  assert.equal(listing.messages.length, 500);
});

test('a failed page reports the error and never calls back with a partial listing', () => {
  const {service, errors} = makeService({0: page(0, 500, 700)});
  let called = false;

  service.loadMessages(() => {called = true;});

  assert.equal(called, false);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].key, 'SERVER.MESSAGING.load.error');
});
