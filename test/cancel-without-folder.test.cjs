const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const scripts = path.join(__dirname, '../app/scripts');

// The real URL service, as the controllers receive it.
function frontendUrlService() {
  let factory;
  vm.runInNewContext(fs.readFileSync(path.join(scripts, 'service/frontend-url.service.js'), 'utf8'), {
    define: (_, body) => body({module: () => ({service: (_, fn) => {factory = fn;}})}, {})
  });
  return factory({URL, location: {href: 'https://cedar.example/templates/create', origin: 'https://cedar.example'}});
}

// An editor opened without a folder, for example from OpenView's login link, has no folderId in its
// address. Cancelling it, or going back to its folder, returns to the dashboard without naming a folder.
for (const [file, handler] of [
  ['template/create-template.controller.js', 'cancelTemplate'],
  ['template-element/create-element.controller.js', 'cancelElement'],
  ['template-element/create-element.controller.js', 'backToFolder'],
  ['template-field/create-field.controller.js', 'cancelField'],
  ['template-field/create-field.controller.js', 'backToFolder']
]) {
  test(`${handler} in ${path.basename(file)} without a folder identifier returns to the dashboard without one`, () => {
    const source = fs.readFileSync(path.join(scripts, file), 'utf8');
    const body = source.match(new RegExp(`\\$scope\\.${handler} = function \\(\\) \\{([\\s\\S]*?)\\n\\s*\\};`))[1];
    for (const missing of [undefined, null]) {
      const visited = [];
      vm.runInNewContext(body, {
        $location: {url: value => visited.push(value)},
        FrontendUrlService: frontendUrlService(),
        QueryParamUtilsService: {getFolderId: () => missing}
      });
      assert.deepEqual(visited, ['/dashboard']);
      assert.doesNotMatch(visited[0], /undefined|null/);
    }
  });
}
