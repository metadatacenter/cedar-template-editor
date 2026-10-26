const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const scripts = path.join(__dirname, '../app/scripts');

const CONTROLLERS = [
  'template/create-template.controller.js',
  'template-element/create-element.controller.js',
  'template-field/create-field.controller.js'
];

function handler(file, name) {
  const source = fs.readFileSync(path.join(scripts, file), 'utf8');
  return source.match(new RegExp(`\\$scope\\.${name} = function \\(\\) \\{([\\s\\S]*?)\\n\\s*\\};`))[1];
}

// The model library's YAML writer refuses an artifact it cannot state, such as a field whose name the
// author has just cleared. The preview, which re-renders on every digest while it is open, shows the
// reason instead of throwing, and copying takes the path a refused copy already takes.
for (const file of CONTROLLERS) {
  const refused = () => { throw new Error('A field must have a name.'); };

  test(`the YAML preview in ${path.basename(file)} shows the YAML, or why there is none`, () => {
    const body = handler(file, 'getYamlRepresentation');
    for (const [writeYaml, shown] of [[() => 'name: "Study"\n', 'name: "Study"\n'], [refused, 'A field must have a name.']]) {
      assert.equal(vm.runInNewContext(`(function () {${body}})()`, {$scope: {writeYaml}}), shown);
    }
  });

  test(`copying the YAML in ${path.basename(file)} copies only YAML the writer produced`, async () => {
    const body = handler(file, 'copyYaml2Clipboard');
    for (const [writeYaml, copied, flashed] of [
      [() => 'name: "Study"\n', ['name: "Study"\n'], 'flashSuccess'],
      [refused, [], 'flashWarning']
    ]) {
      const writes = [], flashes = [];
      const context = {
        $scope: {writeYaml, $apply: () => {}},
        navigator: {clipboard: {writeText: async text => { writes.push(text); }}},
        UIMessageService: {
          flashSuccess: key => flashes.push(['flashSuccess', key]),
          flashWarning: key => flashes.push(['flashWarning', key])
        },
        console: {error: () => {}},
        Promise
      };
      vm.runInNewContext(`(function () {${body}})()`, context);
      await new Promise(resolve => setImmediate(resolve));
      assert.deepEqual(writes, copied);
      assert.deepEqual(flashes.map(([kind]) => kind), [flashed]);
      if (flashed === 'flashWarning') assert.equal(flashes[0][1], 'METADATAEDITOR.YamlCopyFail');
    }
  });
}
