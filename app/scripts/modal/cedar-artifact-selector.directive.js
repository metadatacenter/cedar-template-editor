'use strict';

define([
      'angular',
    ], function (angular) {
      angular.module('cedar.templateEditor.modal.cedarArtifactSelectorDirective', [])
          .directive('cedarArtifactSelector', cedarArtifactSelectorDirective);

      cedarArtifactSelectorDirective.$inject = [];

      /**
       * The tree of artifacts that reuse the one just edited, with a tick on each that should take
       * the change.
       *
       * <p>The caller owns the tree: `tree` is the preview response from the resource server, and this
       * directive writes each artifact's `operation` back into that same object, which is what the caller
       * posts. Nothing else about the preview is touched, because the update command reads its request
       * body strictly and would refuse a member this added.
       *
       * <p>Ticking an artifact changes which artifacts are affected — an element reveals whatever reuses
       * it — so a tick calls `onSelectionChange`, and the caller answers with a fresh preview.
       */
      function cedarArtifactSelectorDirective() {

        cedarArtifactSelectorController.$inject = ['$scope'];

        /** Publication fixes an artifact's content; the update command refuses such a target outright. */
        var PUBLISHED = 'bibo:published';

        var ICONS = {
          field: 'large fa field fa-cube',
          element: 'large fa element fa-cubes',
          template: 'large fa template fa-file-text'
        };

        function cedarArtifactSelectorController($scope) {
          var vm = this;

          vm.groups = [];
          vm.selectedId = null;
          vm.toggleNode = toggleNode;
          vm.toggleGroup = toggleGroup;
          vm.selectArtifact = selectArtifact;
          vm.isTicked = isTicked;
          vm.tick = tick;
          vm.artifactIcon = artifactIcon;
          vm.detailsIcon = detailsIcon;
          vm.locationOf = locationOf;
          vm.instanceCount = instanceCount;
          vm.inspect = inspect;

          // The caller replaces the whole tree after every tick, so rebuild rather than patch.
          $scope.$watch(function () { return vm.tree; }, function (tree) {
            vm.selectedId = null;
            vm.groups = tree ? groupsOf(tree, 0) : [];
          });

          /**
           * The element and template groups directly under `container`, each holding the artifacts it
           * carries. Only these two members describe reuse; every other member of a preview node is
           * the artifact's own metadata and has no place in the tree.
           */
          function groupsOf(container, depth) {
            var groups = [];
            ['elements', 'templates'].forEach(function (kind) {
              var artifacts = artifactsOf(container[kind], depth + 1);
              if (artifacts.length) {
                groups.push({kind: kind, depth: depth, expanded: true, artifacts: artifacts});
              }
            });
            return groups;
          }

          function artifactsOf(container, depth) {
            var artifacts = [];
            angular.forEach(container, function (artifact, id) {
              if (!artifact || !artifact['schema:name']) {
                return;
              }
              var published = artifact['bibo:status'] === PUBLISHED;
              // A tick carried in from an earlier preview cannot stand on a published artifact: the
              // whole tree is posted back, so leaving it would fail every target in the request.
              if (published && artifact.operation === 'update') {
                artifact.operation = 'do-not-update';
              }
              artifacts.push({
                id: id,
                artifact: artifact,
                name: artifact['schema:name'],
                resourceType: artifact.resourceType,
                published: published,
                depth: depth,
                expanded: true,
                groups: groupsOf(artifact, depth)
              });
            });
            return artifacts;
          }

          function toggleNode(node) {
            node.expanded = !node.expanded;
          }

          function toggleGroup(group) {
            group.expanded = !group.expanded;
          }

          function selectArtifact(node) {
            vm.selectedId = node.id;
            if (vm.onArtifactSelect) {
              vm.onArtifactSelect({artifact: {atId: node.id, type: node.resourceType}});
            }
          }

          function isTicked(node) {
            return node.artifact.operation === 'update';
          }

          function tick(node) {
            if (node.published) {
              return;
            }
            node.artifact.operation = isTicked(node) ? 'do-not-update' : 'update';
            if (vm.onSelectionChange) {
              vm.onSelectionChange({tree: vm.tree});
            }
          }

          function artifactIcon(node) {
            return ICONS[node.resourceType] || '';
          }

          function detailsIcon() {
            return vm.details ? (ICONS[vm.details.resourceType] || '') : '';
          }

          /** The folder an artifact sits in, which is its path without the artifact's own name. */
          function locationOf(path) {
            if (!path) {
              return '';
            }
            var lastSlash = path.lastIndexOf('/');
            return lastSlash === -1 ? path : path.substring(0, lastSlash);
          }

          function instanceCount(details) {
            var count = details && details.numberOfInstances;
            return count > 0 ? count : null;
          }

          function inspect(details) {
            var plural = {element: 'elements', template: 'templates', field: 'fields'};
            var type = plural[details.resourceType];
            if (!type) {
              return;
            }
            window.open(window.location.origin + '/' + type + '/edit/' + details['@id'], '_blank');
          }
        }

        return {
          bindToController: {
            tree             : '<',
            details          : '<',
            onSelectionChange: '&',
            onArtifactSelect : '&'
          },
          controller  : cedarArtifactSelectorController,
          controllerAs: 'selector',
          restrict    : 'E',
          scope       : {},
          templateUrl : 'scripts/modal/cedar-artifact-selector.directive.html'
        };
      }
    }
);
