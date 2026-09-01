'use strict';

/**
 * Every field type the palette offers has the two templates the designer will
 * look for.
 *
 * `field.directive.js` resolves a template by convention —
 * `scripts/form/field-<directory>/<inputType>.html` — and nothing checks that the
 * file is there. When it is not, the `ng-include` fails, the field does not
 * render, and the abort leaves later bindings on the page uncompiled: most
 * visibly the top bar, which shows the literal `{{hc.formatDocumentTitle()}}`
 * instead of the template's name. A template carrying the missing type is
 * unopenable, and the symptom points at the header rather than at the field.
 *
 * That is how NIH Grant ID and DOI shipped in the palette configuration with no
 * templates behind them. This asserts the invariant rather than those two types,
 * so the next type added to the palette is covered by it.
 */
describe('field type templates', function () {
  var PALETTE = '/base/config/field-type-service.conf.json';
  var DIRECTORIES = ['field-create', 'field-render'];

  var fieldTypes = null;
  var templateCache = null;

  beforeAll(function (done) {
    var request = new XMLHttpRequest();
    request.open('GET', PALETTE, true);
    request.onload = function () {
      fieldTypes = JSON.parse(request.responseText);
      done();
    };
    request.onerror = function () {
      done.fail('could not read ' + PALETTE);
    };
    request.send();
  });

  beforeEach(function () {
    module('my.templates');
    inject(function ($templateCache) {
      templateCache = $templateCache;
    });
  });

  it('reads the palette', function () {
    expect(fieldTypes.length).toBeGreaterThan(0);
  });

  DIRECTORIES.forEach(function (directory) {
    it('has a ' + directory + ' template for every type in the palette', function () {
      var missing = [];
      fieldTypes.forEach(function (fieldType) {
        // The cache id the ng-html2js preprocessor assigns, from karma.conf.js.
        var path = 'scripts/form/' + directory + '/' + fieldType.cedarType + '.html';
        if (templateCache.get(path + '?v=karma') === undefined) {
          missing.push(fieldType.cedarType);
        }
      });
      expect(missing).toEqual([]);
    });
  });
});
