const Y_AXIS_MINIMUM = 60;
const Y_AXIS_MAXIMUM = 180;
const Y_AXIS_STEP = 20;
const LINE_TENSION = 0.4;
const LINE_WIDTH = 2;
const POINT_RADIUS = 5;

function designToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function lineDataset(label, values, lineToken, pointToken) {
  return {
    label,
    data: values,
    borderColor: designToken(lineToken),
    borderWidth: LINE_WIDTH,
    tension: LINE_TENSION,
    fill: false,
    pointBackgroundColor: designToken(pointToken),
    pointBorderColor: designToken(pointToken),
    pointRadius: POINT_RADIUS,
    pointHoverRadius: POINT_RADIUS,
  };
}

export function renderBloodPressureChart(readings) {
  const canvas = document.getElementById("blood-pressure-chart");

  /* If the charting library fails to load, show the table it would otherwise
     duplicate rather than leaving an empty panel. */
  if (!window.Chart) {
    canvas.hidden = true;
    document.getElementById("blood-pressure-data").classList.remove("visually-hidden");
    return;
  }

  Chart.defaults.font.family = designToken("--font-family");
  Chart.defaults.color = designToken("--color-text-primary");

  Chart.getChart(canvas)?.destroy();

  new Chart(canvas, {
    type: "line",
    data: {
      labels: readings.map((reading) => reading.label),
      datasets: [
        lineDataset(
          "Systolic",
          readings.map((reading) => reading.systolic),
          "--color-systolic-line",
          "--color-systolic-point"
        ),
        lineDataset(
          "Diastolic",
          readings.map((reading) => reading.diastolic),
          "--color-diastolic-line",
          "--color-diastolic-point"
        ),
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          grid: { display: false, drawTicks: false },
          border: { display: false },
        },
        y: {
          min: Y_AXIS_MINIMUM,
          max: Y_AXIS_MAXIMUM,
          ticks: { stepSize: Y_AXIS_STEP },
          grid: { color: designToken("--color-chart-grid"), drawTicks: false },
          border: { display: false },
        },
      },
    },
  });
}