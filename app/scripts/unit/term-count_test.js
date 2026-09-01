'use strict';

define(['app', 'angular'], function (app) {
  /**
   * How an unknown term count is recorded, which is by not recording one.
   *
   * The terminology layer answers `n/a` for some ontologies — GAZ among them — and
   * a value set's count is unknown until its tree has loaded. Both used to reach
   * the artifact as `numTerms: 0`, which is not what either meant: the meta-schema
   * reads zero as a quantity, so a whole ontology was recorded as holding no terms.
   * For a while it could not be saved at all, because the ontologies fragment
   * required a minimum of 1 — and because field kinds are validated through a
   * `oneOf`, that single failure surfaced as a cascade of unrelated-looking errors.
   *
   * The fragment accepts zero now, so this is no longer what stops a save. It is
   * still the difference between a count nobody knew and a count of none.
   */
  describe('DataManipulationService.termCountOrUnknown', function () {
    var service = null;

    beforeEach(module(app.name));
    beforeEach(module('cedar.templateEditor.service.dataManipulationService'));

    beforeEach(inject(function (DataManipulationService) {
      service = DataManipulationService;
    }));

    it('keeps a count the terminology layer reported', function () {
      expect(service.termCountOrUnknown(4231)).toBe(4231);
    });

    it('keeps a count of one', function () {
      expect(service.termCountOrUnknown(1)).toBe(1);
    });

    it('records nothing for a count of zero, which is how "unknown" arrives', function () {
      expect(service.termCountOrUnknown(0)).toBeUndefined();
    });

    it('records nothing when the layer answered with nothing', function () {
      expect(service.termCountOrUnknown(undefined)).toBeUndefined();
      expect(service.termCountOrUnknown(null)).toBeUndefined();
    });

    it('records nothing for a value that is not a count', function () {
      expect(service.termCountOrUnknown('n/a')).toBeUndefined();
      expect(service.termCountOrUnknown(NaN)).toBeUndefined();
      expect(service.termCountOrUnknown(12.5)).toBeUndefined();
      expect(service.termCountOrUnknown(-1)).toBeUndefined();
    });

    it('reads a numeric string, which is what some responses carry', function () {
      expect(service.termCountOrUnknown('87')).toBe(87);
    });
  });
});
