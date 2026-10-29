const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../app/scripts/handlers/UserProfileHandler.js'), 'utf8');

// Runs the start-up that loads the URL configuration and then the signed-in user's profile, against a jQuery
// that answers each request with the status given, and records which outcome the start-up reached. The
// application starts on a loaded profile or on a user the server does not know yet; every other answer is a
// failure the page must report, because the application stays hidden until it starts.
function start({config = 200, profile = 200, withFailureCallback = true} = {}) {
  const outcome = {started: false, failed: false, requested: null, errors: []};
  const jQuery = {
    get(url, success) {
      const request = {
        fail(handler) {
          if (config !== 200) handler({status: config, statusText: 'error'});
          return request;
        }
      };
      if (config === 200) success({userRestAPI: 'https://user.example.org'});
      return request;
    },
    ajax(url, options) {
      outcome.requested = {url, authorization: options.headers.Authorization};
      if (profile === 200) options.success({homeFolderId: 'home'});
      else options.error({status: profile, statusText: profile === 0 ? 'error' : 'Server Error'});
    }
  };
  const context = {
    jQuery,
    window: {cedarCacheControl: 'v', cedarClientSessionId: 'session'},
    console: {log() {}, error: message => outcome.errors.push(message)}
  };
  vm.runInNewContext(source, context);
  const userHandler = {getParsedToken: () => ({sub: 'user-1'}), getToken: () => 'token'};
  const handler = new context.UserProfileHandler();
  const onFailure = withFailureCallback ? () => { outcome.failed = true; } : undefined;
  handler.proceed(userHandler, () => { outcome.started = true; }, onFailure);
  outcome.profile = userHandler.cedarUserProfile;
  return outcome;
}

test('a loaded profile starts the application and reports nothing', () => {
  const outcome = start();
  assert.equal(outcome.started, true);
  assert.equal(outcome.failed, false);
  assert.deepEqual(outcome.profile, {homeFolderId: 'home'});
  assert.deepEqual(outcome.errors, []);
});

test('a user the server does not know yet starts the application without a profile', () => {
  const outcome = start({profile: 404});
  assert.equal(outcome.started, true);
  assert.equal(outcome.failed, false);
  assert.equal(outcome.profile, null);
});

for (const status of [0, 401, 500, 502, 503]) {
  test(`a profile load that ends in status ${status} reports the failure instead of starting`, () => {
    const outcome = start({profile: status});
    assert.equal(outcome.started, false);
    assert.equal(outcome.failed, true);
    assert.match(outcome.errors.join('\n'), new RegExp(`user profile: HTTP ${status} `));
  });
}

test('a failed URL configuration load reports the failure and requests no profile', () => {
  const outcome = start({config: 404});
  assert.equal(outcome.started, false);
  assert.equal(outcome.failed, true);
  assert.equal(outcome.requested, null);
  assert.match(outcome.errors.join('\n'), /URL configuration: HTTP 404 /);
});

test('the profile is requested for the signed-in user with the bearer token', () => {
  assert.deepEqual(start().requested, {url: 'https://user.example.org/users/user-1', authorization: 'Bearer token'});
});

test('a caller that passes no failure callback still starts nothing after a failure', () => {
  const outcome = start({profile: 500, withFailureCallback: false});
  assert.equal(outcome.started, false);
  assert.match(outcome.errors.join('\n'), /user profile: HTTP 500 /);
});
