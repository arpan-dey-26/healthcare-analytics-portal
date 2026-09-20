/* Chart.js 4.5.1 runtime loader.
 * The assessment archive vendors Chart.js locally. This loader keeps the same
 * script entry point while loading the official 4.5.1 UMD build when the
 * local binary cannot be transferred through the GitHub connector.
 */
(function loadChartJs() {
  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.js";
  script.async = false;
  document.head.appendChild(script);
}());