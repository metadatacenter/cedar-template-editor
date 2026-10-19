'use strict';

define(['angular', 'angularMocks', 'cedar/template-editor/service/string-utils.service'], function () {
  describe('Unicode display abbreviations', function () {
    beforeEach(module('cedar.templateEditor.service.stringUtilsService'));

    it('keeps joined emoji and accents intact in a shortened identifier', inject(function (StringUtilsService) {
      expect(StringUtilsService.getShortId('urn:prefix/abc👩‍💻é', 2)).toBe('...👩‍💻é');
      expect(StringUtilsService.getShortId('urn:prefix/abcdef', 3)).toBe('...def');
    }));

    it('keeps a wordless Unicode prefix instead of dropping it', inject(function (StringUtilsService) {
      expect(StringUtilsService.getShortText('👩‍💻👩‍💻👩‍💻', 2, '...', '')).toBe('👩‍💻👩‍💻...');
      expect(StringUtilsService.getShortText('alpha beta gamma', 11, '...', '')).toBe('alpha beta...');
    }));
  });
});
