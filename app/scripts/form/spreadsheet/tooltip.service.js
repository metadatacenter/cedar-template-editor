define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.spreadsheet.tooltipService', [])
      .service('tooltipService', tooltipService);

  tooltipService.$inject = ['$sce', '$document'];

  function tooltipService($sce, $document) {
      var service = this;

      // Tooltip visibility flag and content
      service.isTooltipVisible = false;
      service.tooltipContent = '';

      // Function to parse markdown to HTML
      service.parseMarkdownToHtml = function (mdText) {
          // Simple Markdown parsing for links in this example
          var htmlText = mdText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
          return htmlText; //$sce.trustAsHtml(htmlText);
      };

      // Function to show the tooltip with parsed content
      service.showTooltip = function (event, title) {
        var tooltip = angular.element(document.querySelector('.tooltip'));
        tooltip.scope().tooltipContent = service.parseMarkdownToHtml(title);
        tooltip.scope().$apply();

        tooltip.scope().isTooltipVisible = true;
        // Get the mouse position relative to the document
        var x = event.pageX + 10; // Slight offset for visual clarity
        var y = event.pageY + 10;

        // Get the dimensions of the tooltip
        var tooltipWidth = tooltip[0].offsetWidth;
        var tooltipHeight = tooltip[0].offsetHeight;

        // Get the dimensions of the viewport
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;

        // Check if the tooltip will overflow on the right side of the viewport
        if (x + tooltipWidth > window.scrollX + viewportWidth) {
        x = event.pageX - tooltipWidth - 10; // Position to the left of the cursor
        }

        // Check if the tooltip will overflow at the bottom of the viewport
        if (y + tooltipHeight > window.scrollY + viewportHeight) {
        y = event.pageY - tooltipHeight - 10; // Position above the cursor
        }

        tooltip.css({
            top: y + 'px',
            left: x + 'px',
            position: 'absolute',
            display: 'block',
            opacity: 1
        });

        tooltip.scope().$apply()
      };

      // Close the tooltip when clicking outside
      $document.on('click', function (event) {

        var tooltip = angular.element(document.querySelector('.tooltip'));
        var tooltipScope = tooltip.scope();

        if (!tooltipScope.isTooltipVisible) return;


        if (!tooltip[0].contains(event.target)) {
            tooltipScope.isTooltipVisible = false;
            tooltipScope.$apply();
        }
      });

      // Cleanup on service destroy
      service.$onDestroy = function () {
          $document.off('click');
      };
  }
});
