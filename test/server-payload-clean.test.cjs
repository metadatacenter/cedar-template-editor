const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.join(__dirname, '..');
// The native server build refuses a dirty checkout. The reactor tests a copy without .git,
// so the checkout is rebuilt here from the ignore rules.
test('the server build leaves a clean checkout clean', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'editor-clean-'));
  const git = (...args) => execFileSync('git', args, {cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    env: {...process.env, GIT_CONFIG_GLOBAL: os.devNull, GIT_CONFIG_NOSYSTEM: '1'}});
  try {
    for (const file of ['.gitignore', 'gulpfile.js', 'app/config']) {
      fs.cpSync(path.join(root, file), path.join(dir, file), {recursive: true});
    }
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(dir, 'node_modules'));
    git('init', '-q');
    git('add', '-A');
    const before = git('status', '--porcelain', '--untracked-files=normal');
    execFileSync(process.execPath, [path.join(root, 'node_modules/gulp/bin/gulp.js'), '--cwd', dir,
      'replace-url', 'replace-version'], {stdio: 'pipe', env: {...process.env,
      CEDAR_FRONTEND_BEHAVIOR: 'server', CEDAR_FRONTEND_TARGET: 'fixture',
      CEDAR_FRONTEND_fixture_UI_HOST: 'ui.example', CEDAR_FRONTEND_fixture_REST_HOST: 'api.example',
      CEDAR_VERSION: '1.2.3-test', CEDAR_VERSION_MODIFIER: '', CEDAR_DATACITE_ENABLED: 'false',
      CEDAR_GA4_TRACKING_ID: '', CEDAR_SOURCE_COMMIT: '3'.repeat(40)}});
    // The native build then records the payload's identity beside the configuration.
    fs.writeFileSync(path.join(dir, 'app/config/build-info.json'), '{}\n');
    const cee = JSON.parse(fs.readFileSync(path.join(dir, 'app/config/embeddable-editor-config.json'), 'utf8'));
    assert.equal(cee.bridgeBaseUrl, 'https://bridge.api.example/');
    assert.equal(git('status', '--porcelain', '--untracked-files=normal'), before);
  } finally {
    fs.rmSync(dir, {recursive: true, force: true});
  }
});
