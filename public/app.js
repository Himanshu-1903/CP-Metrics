let radarChartInstance = null;
document.getElementById('searchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const cfHandle = document.getElementById('cfHandle').value.trim();
  const lcHandle = document.getElementById('lcHandle').value.trim();
  const errorBox = document.getElementById('errorBox');
  const submitBtn = document.getElementById('submitBtn');
  const dashboardGrid = document.getElementById('dashboardGrid');

  if (!cfHandle && !lcHandle) {
    errorBox.textContent = 'Please enter at least one handle.';
    errorBox.classList.remove('hidden');
    return;
  }
  errorBox.classList.add('hidden');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Analyzing...';
  dashboardGrid.classList.add('hidden');

  try {
    const res = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cfHandle, lcHandle }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch data');
    renderDashboard(data);
    dashboardGrid.classList.remove('hidden');
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Analyze Profile';
  }
});

function renderDashboard(data) {
  renderChart(data.chartData);
  renderList('strengthsList', data.strengths, 'badge-strength');
  renderList('weaknessesList', data.weaknesses, 'badge-weakness');
}

function renderChart(chartData) {
  const ctx = document.getElementById('radarChart').getContext('2d');
  if (radarChartInstance) radarChartInstance.destroy();
  const labels = chartData.map(d => d.subject);
  const dataPoints = chartData.map(d => d.A);
  const maxVal = chartData.length > 0 ? chartData[0].fullMark : 100;
  Chart.defaults.color = '#94a3b8';
  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{ label: 'Problems Solved', data: dataPoints, backgroundColor: 'rgba(139, 92, 246, 0.5)', borderColor: '#8b5cf6', pointBackgroundColor: '#0ea5e9', pointBorderColor: '#fff', borderWidth: 2 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        r: { angleLines: { color: 'rgba(255,255,255,0.1)' }, grid: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: '#f8fafc', font: { size: 12 } }, ticks: { color: 'rgba(255,255,255,0.5)', backdropColor: 'transparent', stepSize: Math.ceil(maxVal / 5) }, suggestedMin: 0, suggestedMax: maxVal }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function renderList(containerId, items, badgeClass) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `<span style="font-weight: 500">${item.subject}</span><span class="${badgeClass}">${item.A} solved</span>`;
    container.appendChild(div);
  });
}
