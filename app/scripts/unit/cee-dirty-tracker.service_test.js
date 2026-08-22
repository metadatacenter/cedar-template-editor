'use strict';

define(['app', 'angular'], function (app) {
  describe('CeeDirtyTrackerService', function () {
    var tracker;

    beforeEach(module(app.name));
    beforeEach(module('cedar.templateEditor.service.ceeDirtyTrackerService'));

    beforeEach(inject(function (_CeeDirtyTrackerService_) {
      tracker = _CeeDirtyTrackerService_;
      tracker.reset();
    }));

    it('compares structural metadata rather than object identity', function () {
      tracker.markClean({_field: {'@value': 'loaded'}});

      expect(tracker.isDirty({_field: {'@value': 'loaded'}})).toBe(false);
      expect(tracker.isDirty({_field: {'@value': 'edited'}})).toBe(true);
    });

    it('clears dirty when an edit is reverted to the saved baseline', function () {
      var metadata = {_field: {'@value': 'loaded'}};
      tracker.markClean(metadata);

      metadata._field['@value'] = 'edited';
      expect(tracker.isDirty(metadata)).toBe(true);

      metadata._field['@value'] = 'loaded';
      expect(tracker.isDirty(metadata)).toBe(false);
    });

    it('rebases after a successful save without retaining a mutable reference', function () {
      var metadata = {_field: {'@value': 'first edit'}};
      tracker.markClean(metadata);
      metadata._field['@value'] = 'second edit';
      expect(tracker.isDirty(metadata)).toBe(true);

      tracker.markClean(metadata);
      expect(tracker.isDirty(metadata)).toBe(false);
      metadata._field['@value'] = 'first edit';
      expect(tracker.isDirty(metadata)).toBe(true);
    });

    it('does not call an uninitialised page dirty', function () {
      expect(tracker.hasBaseline()).toBe(false);
      expect(tracker.isDirty({_field: {'@value': 'anything'}})).toBe(false);
    });
  });
});
