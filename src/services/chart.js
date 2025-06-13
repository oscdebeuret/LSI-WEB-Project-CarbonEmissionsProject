import Chart from 'chart.js/auto'

const chartInstances = new WeakMap()

function createChart(canvas, labels, data, colors) {
  if (chartInstances.has(canvas)) {
    chartInstances.get(canvas).destroy()
  }

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw} kg CO₂e`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            font: { size: 12 },
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'kg CO₂e',
            font: { size: 12 },
          },
        },
      },
    },
  })

  chartInstances.set(canvas, chart)
}

export function renderFlightChart(canvas, userEmission) {
  const targetEmission = 3000
  createChart(
    canvas,
    ['Recommandation annuelle', 'Votre vol'],
    [targetEmission, userEmission],
    ['#60A5FA', '#34D399'],
  )
}

export function renderElectricityChart(canvas, userEmission) {
  const targetEmission = 126
  createChart(
    canvas,
    ['Moyenne annuelle', 'Votre consommation'],
    [targetEmission, userEmission],
    ['#60A5FA', '#34D399'],
  )
}
