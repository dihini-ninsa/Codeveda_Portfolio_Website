// ── PAGE NAV ────────────────────────────────────────────
const pages = ['home', 'projects', 'explorer', 'about'];

function showPage(id) {
  pages.forEach(p => {
    const el = document.getElementById(p);
    if (el) el.classList.toggle('active', p === id);
  });
  
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  
  window.scrollTo({ top: 0, behavior: 'instant' });
  
  if (id === 'about') {
    setTimeout(animateBars, 200);
  }
  if (id === 'explorer') {
    setTimeout(() => {
      // Find current active explorer tab
      const activeTab = document.querySelector('.explorer-tab.active');
      if (activeTab) {
        const name = activeTab.id.replace('etab-', '');
        const activePanelBtn = document.querySelector(`#epanel-${name} .ctrl-btn.active`);
        // Re-init chart
        if (activePanelBtn) activePanelBtn.click();
      } else {
        initAllCharts();
      }
    }, 100);
  }
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}

function goExplore(tab) {
  showPage('explorer');
  setTimeout(() => { 
    const tabEl = document.getElementById('etab-' + tab);
    if (tabEl) {
      switchExplorer(tab, tabEl); 
    }
  }, 150);
}

// ── SCROLL TO TOP ────────────────────────────────────────
window.addEventListener('scroll', () => {
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }
});

// ── TOAST ────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (t) {
    t.textContent = msg; 
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }
}

// ── FILTER ──────────────────────────────────────────────
function filterCards(level, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#all-cards .project-card').forEach(card => {
    card.classList.toggle('hidden', level !== 'all' && card.dataset.level !== level);
  });
}

// ── SKILL BARS ──────────────────────────────────────────
function animateBars() {
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    bar.style.width = bar.dataset.w + '%';
  });
}

// ── THEME TOGGLE ────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    
    // Redraw active chart with new theme colors
    const activeTab = document.querySelector('.explorer-tab.active');
    if (activeTab) {
      const name = activeTab.id.replace('etab-', '');
      const activePanelBtn = document.querySelector(`#epanel-${name} .ctrl-btn.active`);
      if (activePanelBtn) activePanelBtn.click();
    }
  });
}

// Load Theme on Startup
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const isLight = savedTheme === 'light';
  if (isLight) {
    document.body.classList.add('light-mode');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  // Route Handling
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  const tab = urlParams.get('tab');
  
  if (page && pages.includes(page)) {
    if (page === 'explorer' && tab) {
      goExplore(tab);
    } else {
      showPage(page);
    }
  } else {
    showPage('home');
  }
});

// ── CHART GLOBALS & HELPERS ─────────────────────────────
const charts = {};

function getColors() {
  const isLight = document.body.classList.contains('light-mode');
  return {
    blue: isLight ? '#2563eb' : '#3b82f6',
    blue2: isLight ? '#3b82f6' : '#60a5fa',
    teal: isLight ? '#0d9488' : '#14b8a6',
    purple: isLight ? '#7c3aed' : '#a78bfa',
    coral: isLight ? '#dc2626' : '#f87171',
    amber: isLight ? '#d97706' : '#fbbf24',
    green: isLight ? '#059669' : '#34d399',
    gridColor: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(148, 163, 184, 0.07)',
    borderColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(148, 163, 184, 0.1)',
    text: isLight ? '#64748b' : '#94a3b8',
    tooltipBg: isLight ? '#ffffff' : '#0e1117',
    tooltipBorder: isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(148, 163, 184, 0.2)'
  };
}

function destroyChart(id) {
  if (charts[id]) {
    charts[id].destroy();
    delete charts[id];
  }
}

function baseOpts(colors, extra = {}) {
  const isLight = document.body.classList.contains('light-mode');
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.text,
          boxWidth: 12,
          padding: 16,
          font: { family: "'JetBrains Mono',monospace", size: 10 }
        }
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        borderWidth: 1,
        padding: 10,
        titleColor: isLight ? '#0f172a' : '#e2e8f0',
        bodyColor: colors.text,
        titleFont: { size: 11, family: "'JetBrains Mono',monospace", weight: 'bold' },
        bodyFont: { size: 11, family: "'JetBrains Mono',monospace" }
      }
    },
    ...extra
  };
}

function getAxesStyles(colors) {
  return {
    grid: { color: colors.gridColor, borderColor: colors.borderColor },
    ticks: { color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } }
  };
}

let chartsInited = false;
function initAllCharts() {
  if (chartsInited) return;
  chartsInited = true;
  
  // Set default switches
  const panels = ['iris', 'regression', 'kmeans', 'churn', 'stock', 'nlp'];
  panels.forEach(p => {
    const defaultBtn = document.querySelector(`#epanel-${p} .ctrl-btn`);
    if (defaultBtn) defaultBtn.click();
  });
}

function switchExplorer(name, btn) {
  document.querySelectorAll('.explorer-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.explorer-panel').forEach(p => p.classList.remove('active'));
  
  btn.classList.add('active');
  const panel = document.getElementById('epanel-' + name);
  if (panel) {
    panel.classList.add('active');
    // Click active or default sub button
    const activeBtn = panel.querySelector('.ctrl-btn.active') || panel.querySelector('.ctrl-btn');
    if (activeBtn) activeBtn.click();
  }
}

// Helper to update control active state
function updateControls(btn) {
  const siblings = btn.parentElement.querySelectorAll('.ctrl-btn');
  siblings.forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
}

// ── IRIS CHARTS ──────────────────────────────────────────
const irisInsights = {
  corr: '<strong>Correlation Heatmap Summary</strong>: Petal length and petal width show an extremely strong positive correlation of <strong>0.96</strong>. This means petal dimensions grow proportionally across all species. In contrast, sepal width is weakly negatively correlated with sepal length (-0.11), proving sepal dimensions are poor classifiers compared to petals.',
  dist: '<strong>Scatter Plot (Petal vs Sepal Length)</strong>: Setosa clusters tightly in the bottom-left corner (Petals under 2cm). Versicolor occupies the center range, and Virginica spreads out in the upper right. There is clear visual separation, proving the dataset features allow accurate classification.',
  species: '<strong>Mean Measurements by Species</strong>: Iris Virginica (purple) has the largest overall dimensions, particularly in petal size. Setosa (teal) has short petals but relatively wide sepals, and Versicolor (blue) sits precisely between the two.'
};

function irisView(view, btn) {
  updateControls(btn);
  destroyChart('iris');
  document.getElementById('iris-insight').innerHTML = irisInsights[view];
  
  const ctx = document.getElementById('chart-iris');
  if (!ctx) return;
  
  const colors = getColors();
  
  if (view === 'corr') {
    // Correlation horizontal bar chart
    charts['iris'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Petal Length ↔ Petal Width', 'Sepal Length ↔ Petal Length', 'Sepal Length ↔ Petal Width', 'Sepal Width ↔ Sepal Length', 'Sepal Width ↔ Petal Length'],
        datasets: [{
          label: 'Correlation Coefficient (r)',
          data: [0.96, 0.87, 0.82, -0.11, -0.43],
          backgroundColor: [colors.blue2, colors.teal, colors.purple, colors.coral, colors.coral],
          borderRadius: 6
        }]
      },
      options: baseOpts(colors, {
        indexAxis: 'y',
        scales: {
          x: { ...getAxesStyles(colors), min: -1.0, max: 1.0 },
          y: getAxesStyles(colors)
        }
      })
    });
  } else if (view === 'dist') {
    // Scatter plot
    // Generate simulated iris scatter data for visualization
    const setosaPoints = [];
    const versicolorPoints = [];
    const virginicaPoints = [];
    
    for (let i = 0; i < 30; i++) {
      setosaPoints.push({ x: 4.3 + Math.random() * 1.2, y: 1.0 + Math.random() * 0.9 });
      versicolorPoints.push({ x: 4.9 + Math.random() * 1.8, y: 3.0 + Math.random() * 1.7 });
      virginicaPoints.push({ x: 5.8 + Math.random() * 2.1, y: 4.5 + Math.random() * 2.3 });
    }
    
    charts['iris'] = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          { label: 'Setosa', data: setosaPoints, backgroundColor: colors.teal, pointRadius: 5 },
          { label: 'Versicolor', data: versicolorPoints, backgroundColor: colors.purple, pointRadius: 5 },
          { label: 'Virginica', data: virginicaPoints, backgroundColor: colors.blue2, pointRadius: 5 }
        ]
      },
      options: baseOpts(colors, {
        scales: {
          x: { ...getAxesStyles(colors), title: { display: true, text: 'Sepal Length (cm)', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } },
          y: { ...getAxesStyles(colors), title: { display: true, text: 'Petal Length (cm)', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } }
        }
      })
    });
  } else if (view === 'species') {
    // Grouped radar chart of mean feature sizes
    charts['iris'] = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'],
        datasets: [
          {
            label: 'Setosa Mean',
            data: [5.01, 3.43, 1.46, 0.25],
            backgroundColor: 'rgba(20, 184, 166, 0.15)',
            borderColor: colors.teal,
            borderWidth: 2
          },
          {
            label: 'Versicolor Mean',
            data: [5.94, 2.77, 4.26, 1.33],
            backgroundColor: 'rgba(167, 139, 250, 0.15)',
            borderColor: colors.purple,
            borderWidth: 2
          },
          {
            label: 'Virginica Mean',
            data: [6.59, 2.97, 5.55, 2.03],
            backgroundColor: 'rgba(96, 165, 250, 0.15)',
            borderColor: colors.blue2,
            borderWidth: 2
          }
        ]
      },
      options: baseOpts(colors, {
        scales: {
          r: {
            angleLines: { color: colors.gridColor },
            grid: { color: colors.gridColor },
            pointLabels: { color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } },
            ticks: { display: false }
          }
        }
      })
    });
  }
}

// ── REGRESSION CHARTS ─────────────────────────────────────
const regInsights = {
  pred: '<strong>Actual vs Predicted house prices</strong> shows the performance of the fitted Linear Regression model (Test set size = 102). With an <strong>R² score of 0.669</strong> and <strong>MSE of 24.29</strong>, the points lie along the diagonal 45-degree line, showing a strong linear fit. The model predicts price accurately in lower to mid ranges, with slight variance in high-end estates.',
  coeff: '<strong>Feature Coefficients</strong> highlight how each variable impacts the home price. The average number of rooms per dwelling (<strong>RM</strong>) is the strongest positive predictor (+3.8), indicating that adding a room dramatically boosts value. Percentage of lower status population (<strong>LSTAT</strong>) and pupil-teacher ratio (<strong>PTRATIO</strong>) are negative predictors.'
};

function regView(view, btn) {
  updateControls(btn);
  destroyChart('reg');
  document.getElementById('reg-insight').innerHTML = regInsights[view];
  
  const ctx = document.getElementById('chart-reg');
  if (!ctx) return;
  
  const colors = getColors();
  
  if (view === 'pred') {
    // Generate scatter points showing 0.67 correlation
    const points = [];
    for (let i = 0; i < 60; i++) {
      const act = 10 + Math.random() * 38;
      const pred = act + (Math.random() - 0.5) * 8.5; // adding realistic variance
      points.push({ x: act, y: pred });
    }
    
    // Add reference line points (y=x)
    const linePoints = [{ x: 5, y: 5 }, { x: 50, y: 50 }];
    
    charts['reg'] = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Predicted vs Actual (Median Price in $1000s)',
            data: points,
            backgroundColor: colors.coral,
            pointRadius: 4.5
          },
          {
            label: 'Perfect Fit Reference (y=x)',
            data: linePoints,
            type: 'line',
            borderColor: colors.blue2,
            borderWidth: 1.5,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: baseOpts(colors, {
        scales: {
          x: { ...getAxesStyles(colors), title: { display: true, text: 'Actual Price ($k)', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } },
          y: { ...getAxesStyles(colors), title: { display: true, text: 'Predicted Price ($k)', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } }
        }
      })
    });
  } else if (view === 'coeff') {
    // Feature Coefficients Bar Chart
    charts['reg'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['RM (Rooms)', 'CHAS (River)', 'RAD (Highways)', 'CRIM (Crime)', 'DIS (Dist)', 'LSTAT (% Lower)', 'PTRATIO (School)'],
        datasets: [{
          label: 'Regression Coefficient',
          data: [3.8, 2.68, 0.3, -0.11, -1.48, -0.52, -0.95],
          backgroundColor: [colors.green, colors.green, colors.green, colors.coral, colors.coral, colors.coral, colors.coral],
          borderRadius: 6
        }]
      },
      options: baseOpts(colors, {
        scales: {
          x: getAxesStyles(colors),
          y: { ...getAxesStyles(colors), title: { display: true, text: 'Coefficient Value', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } }
        }
      })
    });
  }
}

// ── K-MEANS CHARTS ───────────────────────────────────────
const kmeansInsights = {
  elbow: '<strong>The Elbow Method</strong> plots Within-Cluster Sum of Squares (WCSS) against cluster counts. A sharp drop occurs from k=1 (681.4) to k=2 (152.3), followed by a clear "elbow" inflection point at <strong>k=3</strong> (78.9). This mathematically proves that 3 clusters best partition the Iris dataset.',
  cluster: '<strong>Cluster Size Distribution</strong>: K-Means (k=3) splits the 147 preprocessed rows into 3 groups of size: <strong>50 (Cluster 0)</strong>, <strong>38 (Cluster 1)</strong>, and <strong>59 (Cluster 2)</strong>. Since the original species count was 50 setosa, 47 versicolor, and 50 virginica, K-Means achieved an outstanding <strong>97.2% overall alignment</strong>.',
  scatter: '<strong>K-Means Clustering Result</strong>: Plots sample classes based on K-Means assignment. Cluster 0 (teal) is completely separated. Clusters 1 (purple) and 2 (amber) show slight overlap at the boundary. Standardizing features with StandardScaler was crucial for this alignment.'
};

function kView(view, btn) {
  updateControls(btn);
  destroyChart('kmeans');
  document.getElementById('kmeans-insight').innerHTML = kmeansInsights[view];
  
  const ctx = document.getElementById('chart-kmeans');
  if (!ctx) return;
  
  const colors = getColors();
  
  if (view === 'elbow') {
    charts['kmeans'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1', '2', '3 (Elbow)', '4', '5', '6'],
        datasets: [{
          label: 'WCSS Value',
          data: [681.4, 152.3, 78.9, 57.2, 46.4, 39.0],
          borderColor: colors.blue2,
          backgroundColor: colors.blue2,
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: [colors.blue2, colors.blue2, colors.amber, colors.blue2, colors.blue2, colors.blue2]
        }]
      },
      options: baseOpts(colors, {
        scales: {
          x: { ...getAxesStyles(colors), title: { display: true, text: 'Number of Clusters (k)', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } },
          y: getAxesStyles(colors)
        }
      })
    });
  } else if (view === 'cluster') {
    charts['kmeans'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Cluster 0 (Iris-setosa)', 'Cluster 1 (Iris-versicolor)', 'Cluster 2 (Iris-virginica)'],
        datasets: [{
          data: [50, 38, 59],
          backgroundColor: [colors.teal, colors.purple, colors.amber],
          borderColor: colors.borderColor,
          borderWidth: 1
        }]
      },
      options: baseOpts(colors, {
        cutout: '60%'
      })
    });
  } else if (view === 'scatter') {
    // Generate scatter plot representing K-Means assignment on Petal Length vs Petal Width
    const c0Points = [];
    const c1Points = [];
    const c2Points = [];
    
    for (let i = 0; i < 48; i++) {
      c0Points.push({ x: 1.0 + Math.random() * 0.9, y: 0.1 + Math.random() * 0.4 });
      c1Points.push({ x: 3.3 + Math.random() * 1.4, y: 1.0 + Math.random() * 0.6 });
      c2Points.push({ x: 4.7 + Math.random() * 2.0, y: 1.5 + Math.random() * 0.9 });
    }
    
    charts['kmeans'] = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          { label: 'Cluster 0 (Iris-setosa)', data: c0Points, backgroundColor: colors.teal, pointRadius: 5 },
          { label: 'Cluster 1 (Iris-versicolor)', data: c1Points, backgroundColor: colors.purple, pointRadius: 5 },
          { label: 'Cluster 2 (Iris-virginica)', data: c2Points, backgroundColor: colors.amber, pointRadius: 5 }
        ]
      },
      options: baseOpts(colors, {
        scales: {
          x: { ...getAxesStyles(colors), title: { display: true, text: 'Petal Length (cm)', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } },
          y: { ...getAxesStyles(colors), title: { display: true, text: 'Petal Width (cm)', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } }
        }
      })
    });
  }
}

// ── CHURN CHARTS ──────────────────────────────────────────
const churnInsights = {
  model: '<strong>Model Performance Comparison</strong>: Evaluated Logistic Regression, Decision Tree, and Random Forest on Accuracy, Precision, Recall, and F1-Score. Tuning with <strong>GridSearchCV</strong> led to the <strong>Random Forest Classifier</strong> outperforming the others across all metrics, achieving a final Accuracy of <strong>96%</strong>.',
  rate: '<strong>Churn Rate Analysis</strong>: Evaluated segments prone to churn. While the baseline customer churn is <strong>14.5%</strong>, users with an active <strong>International Plan</strong> churn at a rate of <strong>42.4%</strong> (a 3× surge). Additionally, customers making <strong>4 or more service calls</strong> churn at a rate of <strong>51.7%</strong>.',
  matrix: '<strong>Random Forest Confusion Matrix</strong>: Test set results (size = 667). The model achieved high sensitivity, successfully predicting <strong>555 True Negatives (No Churn)</strong> and <strong>82 True Positives (Churn)</strong>. It only recorded <strong>12 False Positives</strong> and <strong>18 False Negatives</strong>.'
};

function churnView(view, btn) {
  updateControls(btn);
  destroyChart('churn');
  document.getElementById('churn-insight').innerHTML = churnInsights[view];
  
  const ctx = document.getElementById('chart-churn');
  if (!ctx) return;
  
  const colors = getColors();
  
  if (view === 'model') {
    charts['churn'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Accuracy', 'Precision', 'Recall', 'F1-Score'],
        datasets: [
          { label: 'Logistic Regression', data: [86.0, 73.0, 54.0, 62.0], backgroundColor: colors.purple, borderRadius: 4 },
          { label: 'Decision Tree', data: [91.0, 82.0, 80.0, 81.0], backgroundColor: colors.blue2, borderRadius: 4 },
          { label: 'Random Forest (Tuned)', data: [96.0, 94.0, 89.0, 91.5], backgroundColor: colors.green, borderRadius: 4 }
        ]
      },
      options: baseOpts(colors, {
        scales: {
          x: getAxesStyles(colors),
          y: { ...getAxesStyles(colors), max: 100, ticks: { ...getAxesStyles(colors).ticks, callback: v => v + '%' } }
        }
      })
    });
  } else if (view === 'rate') {
    charts['churn'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Baseline Rate', 'International Plan (Yes)', 'International Plan (No)', 'Voice Mail Plan (Yes)', 'Voice Mail Plan (No)', 'Service Calls >= 4'],
        datasets: [{
          label: 'Churn Percentage (%)',
          data: [14.5, 42.4, 11.5, 8.7, 16.7, 51.7],
          backgroundColor: [colors.blue2, colors.coral, colors.blue2, colors.green, colors.coral, colors.coral],
          borderRadius: 6
        }]
      },
      options: baseOpts(colors, {
        scales: {
          x: getAxesStyles(colors),
          y: { ...getAxesStyles(colors), ticks: { ...getAxesStyles(colors).ticks, callback: v => v + '%' } }
        }
      })
    });
  } else if (view === 'matrix') {
    charts['churn'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['True Negative (Predicted No Churn)', 'True Positive (Predicted Churn)', 'False Negative (Missed Churn)', 'False Positive (Incorrect Alarm)'],
        datasets: [{
          label: 'Number of Customers',
          data: [555, 82, 18, 12],
          backgroundColor: [colors.green, colors.green, colors.coral, colors.amber],
          borderRadius: 6
        }]
      },
      options: baseOpts(colors, {
        scales: {
          x: getAxesStyles(colors),
          y: getAxesStyles(colors)
        }
      })
    });
  }
}

// ── STOCK CHARTS ──────────────────────────────────────────
const stockInsights = {
  price: '<strong>AAPL Stock Close Price and Moving Average</strong>: Engineered daily returns and 30-day moving averages (MA30) from the 2017 stock prices dataset. The <strong>MA30 line (orange)</strong> effectively filters out short-term volatility, highlighting the stock’s upward growth trend from $115 in January to $170 in December.',
  volume: '<strong>Top 10 Stocks by Volume</strong>: Identified BAC (Bank of America), AMD (Advanced Micro Devices), and AAPL (Apple) as the most active stocks in the 2017 market dataset. Daily average volume reached <strong>85 Million shares</strong> for BAC, indicating highly active trading.',
  return: '<strong>Daily Returns Distribution</strong>: The daily return percentage forms a symmetric bell curve (Normal Distribution) centered at <strong>+0.08%</strong>. This indicates market stability throughout 2017, with daily price shifts staying within a stable -2.5% to +2.5% boundaries.'
};

function stockView(view, btn) {
  updateControls(btn);
  destroyChart('stock');
  document.getElementById('stock-insight').innerHTML = stockInsights[view];
  
  const ctx = document.getElementById('chart-stock');
  if (!ctx) return;
  
  const colors = getColors();
  
  if (view === 'price') {
    // Generate AAPL Close price data points for 12 months in 2017
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const priceData = [117.2, 125.4, 134.1, 140.2, 143.6, 148.9, 145.2, 152.6, 159.8, 155.4, 163.5, 171.1];
    
    // Simulate moving average with lag
    const maData = [115.0, 119.5, 126.8, 134.5, 139.8, 144.1, 145.9, 147.2, 152.0, 156.4, 158.5, 164.2];
    
    charts['stock'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          { label: 'AAPL Close Price ($)', data: priceData, borderColor: colors.teal, backgroundColor: 'transparent', borderWidth: 2, pointRadius: 4 },
          { label: '30-Day Moving Average (MA30)', data: maData, borderColor: colors.amber, backgroundColor: 'transparent', borderWidth: 1.8, borderDash: [4, 4], pointRadius: 0 }
        ]
      },
      options: baseOpts(colors, {
        scales: {
          x: getAxesStyles(colors),
          y: { ...getAxesStyles(colors), title: { display: true, text: 'Share Price ($)', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } }
        }
      })
    });
  } else if (view === 'volume') {
    charts['stock'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['BAC', 'AMD', 'AAPL', 'MSFT', 'FB', 'AMZN', 'NFLX', 'GOOGL', 'TSLA', 'NVDA'],
        datasets: [{
          label: 'Average Trading Volume (Millions/Day)',
          data: [85.2, 72.4, 28.1, 22.4, 18.2, 14.5, 11.2, 8.4, 6.5, 5.1],
          backgroundColor: colors.blue2,
          borderRadius: 5
        }]
      },
      options: baseOpts(colors, {
        indexAxis: 'y',
        scales: {
          x: { ...getAxesStyles(colors), title: { display: true, text: 'Shares (Millions)', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } },
          y: getAxesStyles(colors)
        }
      })
    });
  } else if (view === 'return') {
    // Generate normal distribution bins for daily returns
    const bins = ['<-2.5%', '-2.0%', '-1.5%', '-1.0%', '-0.5%', '0.0%', '+0.5%', '+1.0%', '+1.5%', '+2.0%', '>+2.5%'];
    const frequencies = [2, 5, 12, 28, 62, 85, 58, 25, 11, 4, 1];
    
    charts['stock'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: bins,
        datasets: [{
          label: 'Frequency (Days)',
          data: frequencies,
          backgroundColor: colors.purple,
          borderRadius: 4,
          barPercentage: 1.0,
          categoryPercentage: 1.0
        }]
      },
      options: baseOpts(colors, {
        scales: {
          x: { ...getAxesStyles(colors), title: { display: true, text: 'Daily Return Percentage', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } },
          y: getAxesStyles(colors)
        }
      })
    });
  }
}

// ── NLP / SENTIMENT CHARTS ────────────────────────────────
const nlpInsights = {
  dist: '<strong>TextBlob Sentiment Distribution</strong>: Processed 732 social media posts through our Lemmatizer, stopwords filtering, and TextBlob classifier (threshold = ±0.05). Text polarity scoring categorized <strong>42.5% (311) as Positive</strong>, <strong>35.8% (262) as Neutral</strong>, and <strong>21.7% (159) as Negative</strong>.',
  polarity: '<strong>Polarity vs Subjectivity Distribution</strong>: Each dot represents a tweet/post. The X-axis represents polarity (-1.0 to 1.0) and the Y-axis represents subjectivity (0.0 to 1.0). The positive threshold (+0.05) and negative threshold (-0.05) show how TextBlob separates sentiment, highlighting clustering at exact 0.0 neutrality.',
  compare: '<strong>Original Labels vs TextBlob Predictions</strong>: Highlights a known NLP pattern — while the original dataset contains fine-grained sentiment classifications, TextBlob polarity scoring tends to over-classify posts as <strong>Neutral</strong>, primarily due to slang, icons, or missing sarcasm context.'
};

function nlpView(view, btn) {
  updateControls(btn);
  destroyChart('nlp');
  document.getElementById('nlp-insight').innerHTML = nlpInsights[view];
  
  const ctx = document.getElementById('chart-nlp');
  if (!ctx) return;
  
  const colors = getColors();
  
  if (view === 'dist') {
    charts['nlp'] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Positive (Score > 0.05)', 'Neutral (Score -0.05 to 0.05)', 'Negative (Score < -0.05)'],
        datasets: [{
          data: [311, 262, 159],
          backgroundColor: [colors.green, colors.blue2, colors.coral],
          borderColor: colors.borderColor,
          borderWidth: 1
        }]
      },
      options: baseOpts(colors)
    });
  } else if (view === 'polarity') {
    // Generate scatter points for Polarity vs Subjectivity
    const positivePosts = [];
    const neutralPosts = [];
    const negativePosts = [];
    
    for (let i = 0; i < 50; i++) {
      positivePosts.push({ x: 0.1 + Math.random() * 0.9, y: 0.2 + Math.random() * 0.8 });
      neutralPosts.push({ x: -0.05 + Math.random() * 0.1, y: 0.0 + Math.random() * 0.5 }); // dense around neutrality
      negativePosts.push({ x: -1.0 + Math.random() * 0.9, y: 0.2 + Math.random() * 0.8 });
    }
    
    charts['nlp'] = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          { label: 'Positive Texts', data: positivePosts, backgroundColor: colors.green, pointRadius: 4.5 },
          { label: 'Neutral Texts', data: neutralPosts, backgroundColor: colors.blue2, pointRadius: 4.5 },
          { label: 'Negative Texts', data: negativePosts, backgroundColor: colors.coral, pointRadius: 4.5 }
        ]
      },
      options: baseOpts(colors, {
        scales: {
          x: { ...getAxesStyles(colors), min: -1.0, max: 1.0, title: { display: true, text: 'Polarity (-1.0 to 1.0)', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } },
          y: { ...getAxesStyles(colors), min: 0.0, max: 1.0, title: { display: true, text: 'Subjectivity (0.0 to 1.0)', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } }
        }
      })
    });
  } else if (view === 'compare') {
    charts['nlp'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [
          { label: 'Original Manual Labels', data: [335, 178, 219], backgroundColor: colors.purple, borderRadius: 5 },
          { label: 'TextBlob Predictions', data: [311, 262, 159], backgroundColor: colors.blue2, borderRadius: 5 }
        ]
      },
      options: baseOpts(colors, {
        scales: {
          x: getAxesStyles(colors),
          y: { ...getAxesStyles(colors), title: { display: true, text: 'Text Counts', color: colors.text, font: { family: "'JetBrains Mono',monospace", size: 10 } } }
        }
      })
    });
  }
}