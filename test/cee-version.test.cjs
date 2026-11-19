const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const root = path.join(__dirname, '..');

// Runs the build's version task in a copy of the checkout whose installed CEE package declares
// `ceeVersion`, or which has no CEE package when it is undefined, and returns the globals that the
// generated version.js sets.
function buildGlobals(ceeVersion) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'editor-cee-version-'));
  try {
    fs.cpSync(path.join(root, 'gulpfile.js'), path.join(dir, 'gulpfile.js'));
    fs.cpSync(path.join(root, 'app/config/src'), path.join(dir, 'app/config/src'), {recursive: true});
    const modules = path.join(dir, 'node_modules');
    fs.mkdirSync(modules);
    for (const entry of fs.readdirSync(path.join(root, 'node_modules'))) {
      if (entry !== 'cedar-embeddable-editor') {
        fs.symlinkSync(path.join(root, 'node_modules', entry), path.join(modules, entry));
      }
    }
    if (ceeVersion !== undefined) {
      fs.mkdirSync(path.join(modules, 'cedar-embeddable-editor'));
      fs.writeFileSync(path.join(modules, 'cedar-embeddable-editor/package.json'),
          JSON.stringify({name: '@org.metadatacenter/cedar-embeddable-editor', version: ceeVersion}));
    }
    execFileSync(process.execPath, [path.join(root, 'node_modules/gulp/bin/gulp.js'), '--cwd', dir,
      'replace-version'], {stdio: 'pipe', env: {...process.env,
      CEDAR_FRONTEND_BEHAVIOR: 'server', CEDAR_FRONTEND_TARGET: 'fixture',
      CEDAR_FRONTEND_fixture_UI_HOST: 'ui.example', CEDAR_FRONTEND_fixture_REST_HOST: 'api.example',
      CEDAR_VERSION: '1.2.3-test', CEDAR_VERSION_MODIFIER: '', CEDAR_DATACITE_ENABLED: 'false',
      CEDAR_GA4_TRACKING_ID: '', CEDAR_SOURCE_COMMIT: '3'.repeat(40)}});
    const window = {};
    vm.runInNewContext(fs.readFileSync(path.join(dir, 'app/config/version.js'), 'utf8'), {window});
    return window;
  } finally {
    fs.rmSync(dir, {recursive: true, force: true});
  }
}

// Returns the CEE version the Settings page shows when the page's globals are `window`.
function settingsCeeVersion(window) {
  let controller;
  vm.runInNewContext(fs.readFileSync(path.join(root, 'app/scripts/profile/settings.controller.js'), 'utf8'), {
    define: (dependencies, body) => body({module: () => ({controller: (name, fn) => { controller = fn; }})}),
    window: {}
  });
  const $scope = {};
  controller({}, $scope, {}, window, {}, {}, {}, {getPreferredDateFormat: () => 'MM/DD/YYYY'}, {}, {});
  return $scope.ceeVersion;
}

test('the Settings page shows the version of the CEE package the build bundles', () => {
  const globals = buildGlobals('9.8.7-dev.20991231.abcdef1');
  assert.equal(globals.cedarCeeVersion, '9.8.7-dev.20991231.abcdef1');
  assert.equal(globals.cedarEmbeddableEditorVersion, undefined, 'CEE alone sets its own global');
  assert.equal(settingsCeeVersion(globals), '9.8.7-dev.20991231.abcdef1');
});

test('the Settings page shows the CEE version as unknown when the build finds no CEE package', () => {
  const globals = buildGlobals(undefined);
  assert.equal(globals.cedarCeeVersion, '');
  assert.equal(settingsCeeVersion(globals), 'unknown');
});
