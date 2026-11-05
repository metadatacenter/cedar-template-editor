define(['require'], function (loadModule) {
  'use strict';
  return {
    load: function (target, ready, failed) {
      function registered() {
        return target.customElements && target.customElements.get('cedar-embeddable-editor');
      }
      if (registered()) { ready(); return; }
      loadModule(['cedar-embeddable-editor'], function () {
        if (registered()) { ready(); }
        else { failed(new Error('CEDAR Embeddable Editor did not initialize')); }
      }, function (error) {
        // A later visit may retry a failed script, using RequireJS's normal URL and cache key.
        if (target.requirejs && target.requirejs.undef) target.requirejs.undef('cedar-embeddable-editor');
        failed(error);
      });
    }
  };
});
