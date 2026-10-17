/**
 * NagarSathi - Overview Dashboard Module
 * Renders live analytics, interactive Chart.js charts, high-priority alert stream,
 * and recent complaints table.
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById("dashboardOverviewPage")) return;

  await loadDashboardData();
  setupFilterTabs();
});

let monthlyChartInstance = null;
let categoryChartInstance = null;
let statusBarChartInstance = null;

async function loadDashboardData() {
  if (!window.NagarSathiAPI) return;

  const analytics = await window.NagarSathiAPI.getAnalytics();
  const reports = await window.NagarSathiAPI.getReports();

  // 1. Populate KPI Cards
  const totalReportsEl = document.getElementById("statTotalReports");
  const highPriorityEl = document.getElementById("statHighPriority");
  const pendingRepairsEl = document.getElementById("statPendingRepairs");
  const resolvedEl = document.getElementById("statResolved");

  if (totalReportsEl) totalReportsEl.innerText = analytics.totalReports;
  if (highPriorityEl) highPriorityEl.innerText = analytics.highPriorityIssues;
  if (pendingRepairsEl) pendingRepairsEl.innerText = analytics.pendingRepairs;
  if (resolvedEl) resolvedEl.innerText = analytics.resolvedComplaints;

  // 2. Render High-Priority Action Panel & Recent Complaints Table First
  renderHighPriorityPanel(reports.filter(r => r.priority === "High" && r.status !== "Resolved"));
  renderRecentComplaintsTable(reports.slice(0, 7));

  // 3. Render Charts Safely
  renderChartsSafely(analytics);

  // Re-run Lucide icons
  if (window.lucide) window.lucide.createIcons();
}

function renderChartsSafely(analytics) {
  if (typeof Chart === "undefined") {
    setTimeout(() => {
      if (typeof Chart !== "undefined") {
        renderMonthlyTrendChart(analytics.monthlyTrends);
        renderCategoryDoughnutChart(analytics.categories);
        renderRepairStatusBarChart(analytics.statuses);
      }
    }, 300);
    return;
  }
  renderMonthlyTrendChart(analytics.monthlyTrends);
  renderCategoryDoughnutChart(analytics.categories);
  renderRepairStatusBarChart(analytics.statuses);
}

/**
 * Chart 1: Monthly Complaint & Resolution Trends
 */
function renderMonthlyTrendChart(trends) {
  const ctx = document.getElementById("monthlyTrendsChart");
  if (!ctx || typeof Chart === "undefined") return;

  if (monthlyChartInstance) {
    monthlyChartInstance.destroy();
  }

  monthlyChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: trends.months,
      datasets: [
        {
          label: "Reported Complaints",
          data: trends.reported,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.08)",
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: "#ef4444",
          pointRadius: 4
        },
        {
          label: "Resolved Complaints",
          data: trends.resolved,
          borderColor: "#0d9488",
          backgroundColor: "rgba(13, 148, 136, 0.08)",
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: "#0d9488",
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 12,
            font: { family: "Inter", size: 12, weight: 500 }
          }
        },
        tooltip: {
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: "Inter", size: 13, weight: 600 },
          bodyFont: { family: "Inter", size: 12 }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "Inter", size: 11 } }
        },
        y: {
          grid: { color: "#f1f5f9" },
          ticks: { font: { family: "Inter", size: 11 } },
          beginAtZero: true
        }
      }
    }
  });
}

/**
 * Chart 2: Damage Categories Breakdown
 */
function renderCategoryDoughnutChart(categories) {
  const ctx = document.getElementById("categoryDoughnutChart");
  if (!ctx || typeof Chart === "undefined") return;

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  const labels = Object.keys(categories);
  const data = Object.values(categories);

  categoryChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          "#ef4444", // Pothole - Red
          "#f59e0b", // Road Crack - Amber
          "#0284c7", // Waterlogging - Blue
          "#8b5cf6", // Surface Damage - Purple
          "#64748b"  // Other - Grey
        ],
        borderWidth: 2,
        borderColor: "#ffffff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 10,
            padding: 12,
            font: { family: "Inter", size: 11 }
          }
        }
      }
    }
  });
}

/**
 * Chart 3: Repair Status Bar Chart
 */
function renderRepairStatusBarChart(statuses) {
  const ctx = document.getElementById("statusBarChart");
  if (!ctx || typeof Chart === "undefined") return;

  if (statusBarChartInstance) {
    statusBarChartInstance.destroy();
  }

  const labels = ["Reported", "Under Review", "In Progress", "Resolved"];
  const counts = [
    statuses["Reported"] || 0,
    statuses["Under Review"] || 0,
    statuses["Repair in Progress"] || 0,
    statuses["Resolved"] || 0
  ];

  statusBarChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Issues Count",
        data: counts,
        backgroundColor: [
          "#3b82f6", // Reported (Blue)
          "#8b5cf6", // Under Review (Purple)
          "#f59e0b", // In Progress (Amber)
          "#10b981"  // Resolved (Green)
        ],
        borderRadius: 6,
        barThickness: 28
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "Inter", size: 11 } }
        },
        y: {
          grid: { color: "#f1f5f9" },
          ticks: { font: { family: "Inter", size: 11 }, stepSize: 1 },
          beginAtZero: true
        }
      }
    }
  });
}

/**
 * High Priority Urgent Hazards Panel
 */
function renderHighPriorityPanel(highIssues) {
  const container = document.getElementById("highPriorityPanelList");
  if (!container) return;

  if (highIssues.length === 0) {
    container.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        <i data-lucide="check-circle" style="color: var(--success); width: 32px; height: 32px; margin-bottom: 0.5rem;"></i>
        <p>No active high-priority hazards currently open in Ghaziabad Zone.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = highIssues.slice(0, 4).map(issue => `
    <div style="padding: 0.85rem 1rem; border-bottom: 1px solid var(--border-light); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--danger-bg); color: var(--danger); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <i data-lucide="alert-octagon"></i>
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="report-id-pill">${issue.id}</span>
            <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-main);">${escapeHtml(issue.title)}</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem;">
            ${escapeHtml(issue.location)} &bull; Risk Score: <strong style="color: var(--danger);">${issue.riskScore}/100</strong>
          </div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
        <a href="map.html?focus=${issue.id}" class="btn btn-outline btn-sm" title="View on Map">
          <i data-lucide="map-pin"></i> Map
        </a>
        <a href="repairs.html?id=${issue.id}" class="btn btn-primary btn-sm" title="Dispatch / Inspect">
          Dispatch
        </a>
      </div>
    </div>
  `).join("");
}

/**
 * Recent Complaints Table
 */
function renderRecentComplaintsTable(reports) {
  const tbody = document.getElementById("recentComplaintsTbody");
  if (!tbody) return;

  if (reports.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No complaints match the criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = reports.map(r => {
    const priorityClass = r.priority === "High" ? "badge-high" : (r.priority === "Medium" ? "badge-medium" : "badge-low");
    let statusClass = "badge-reported";
    if (r.status === "Under Review") statusClass = "badge-under-review";
    if (r.status === "Repair in Progress") statusClass = "badge-in-progress";
    if (r.status === "Resolved") statusClass = "badge-resolved";

    return `
      <tr>
        <td><span class="report-id-pill">${r.id}</span></td>
        <td class="table-location-cell">
          <div class="table-loc-title">${escapeHtml(r.title)}</div>
          <div class="table-loc-sub">${escapeHtml(r.location)}</div>
        </td>
        <td><strong>${escapeHtml(r.category)}</strong></td>
        <td><span class="badge ${priorityClass}">${r.priority}</span></td>
        <td style="font-size: 0.78rem; color: var(--text-muted);">${r.date}</td>
        <td><span class="badge ${statusClass}">${r.status}</span></td>
        <td>
          <a href="repairs.html?id=${r.id}" class="btn btn-outline btn-sm" title="Inspect & Update">
            <i data-lucide="edit-3"></i> Inspect
          </a>
        </td>
      </tr>
    `;
  }).join("");
}

/**
 * Filter tabs on dashboard (All / High Priority / Pending)
 */
function setupFilterTabs() {
  const tabs = document.querySelectorAll(".table-tab-btn");
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", async () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filterType = tab.dataset.filter;
      const allReports = await window.NagarSathiAPI.getReports();

      let filtered = allReports;
      if (filterType === "high") {
        filtered = allReports.filter(r => r.priority === "High");
      } else if (filterType === "pending") {
        filtered = allReports.filter(r => r.status !== "Resolved");
      }

      renderRecentComplaintsTable(filtered.slice(0, 7));
      if (window.lucide) window.lucide.createIcons();
    });
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[m]);
}
