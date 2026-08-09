(function ($) {
  "use strict";
  var sparkline_chart = {
    init: function () {
      setTimeout(function () {
        $("#simple-line-chart-sparkline").sparkline(
          [5, 10, 20, 14, 17, 21, 20, 10, 4, 13, 0, 10, 30, 40, 10, 15, 20],
          {
            type: "line",
            width: "100%",
            height: "150",
            tooltipClassname: "chart-sparkline",
            lineColor: "#0f98a0",
            fillColor: "transparent",
            highlightLineColor: "#0f98a0",
            highlightSpotColor: "#0f98a0",
            targetColor: "#0f98a0",
            performanceColor: "#0f98a0",
            boxFillColor: "#0f98a0",
            medianColor: "#0f98a0",
            minSpotColor: "#0f98a0",
          },
        );
      });
    },
  };
  sparkline_chart.init();
})(jQuery);
