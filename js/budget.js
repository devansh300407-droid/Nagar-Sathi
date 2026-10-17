/**
 * NagarSathi - Interactive Municipal Budget Planner & Optimization Engine
 * Allocates repair funds across pending road defects using Priority-First,
 * Coverage-First, or Balanced optimization algorithms.
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById("budgetPlannerPage")) return;

  initBudgetPlanner();
});

let currentAllPendingTasks = [];
let activeAllocationResult = null;
let manualSelectionState = {}; // id -> boolean

async function initBudgetPlanner() {
  if (!window.NagarSathiAPI) return;

  const allReports = await window.NagarSathiAPI.getReports();
  currentAllPendingTasks = allReports.filter(r => r.status !== "Resolved");

  // Setup presets buttons
  document.querySelectorAll(".budget-preset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".budget-preset-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const amount = btn.dataset.amount;
      document.getElementById("budgetAmountInput").value = amount;
      runBudgetOptimization();
    });
  });

  // Live budget amount input listener
  const budgetInput = document.getElementById("budgetAmountInput");
  if (budgetInput) {
    budgetInput.addEventListener("input", () => {
      const currentVal = budgetInput.value;
      document.querySelectorAll(".budget-preset-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.amount === currentVal);
      });
      runBudgetOptimization();
    });
  }

  // Generate Plan button
  const genBtn = document.getElementById("generatePlanBtn");
  if (genBtn) {
    genBtn.addEventListener("click", runBudgetOptimization);
  }

  // Strategy change
  const strategySelect = document.getElementById("budgetStrategySelect");
  if (strategySelect) {
    strategySelect.addEventListener("change", runBudgetOptimization);
  }

  // Run initial plan
  runBudgetOptimization();
}

/**
 * Execute Optimization calculation
 */
function runBudgetOptimization() {
  const inputEl = document.getElementById("budgetAmountInput");
  const budget = parseInt(inputEl?.value) || 500000;
  const strategy = document.getElementById("budgetStrategySelect")?.value || "priority";

  activeAllocationResult = window.NagarSathiAPI.optimizeBudget(budget, strategy);

  // Initialize manual selection state with algorithmic recommendation
  manualSelectionState = {};
  activeAllocationResult.allocatedTasks.forEach(t => {
    manualSelectionState[t.id] = true;
  });
  activeAllocationResult.deferredTasks.forEach(t => {
    manualSelectionState[t.id] = false;
  });

  updateBudgetKPIs();
  renderTasksList();
  renderComparisonCards(budget);
}

/**
 * Update the Top KPI Metrics
 */
function updateBudgetKPIs() {
  const budget = parseInt(document.getElementById("budgetAmountInput")?.value) || 500000;

  // Compute live totals based on manualSelectionState
  let totalCost = 0;
  let coveredCount = 0;
  let highPriorityCovered = 0;

  currentAllPendingTasks.forEach(task => {
    if (manualSelectionState[task.id]) {
      totalCost += (task.estimatedCost || 35000);
      coveredCount++;
      if (task.priority === "High") highPriorityCovered++;
    }
  });

  const remaining = budget - totalCost;
  const totalHigh = currentAllPendingTasks.filter(t => t.priority === "High").length;
  const percentSpent = Math.min(100, Math.round((totalCost / budget) * 100));

  // Update DOM elements
  const elTotal = document.getElementById("metricAllocatedCost");
  const elRemain = document.getElementById("metricRemainingBudget");
  const elCovered = document.getElementById("metricCoveredCount");
  const elHigh = document.getElementById("metricHighCovered");
  const elBar = document.getElementById("budgetProgressBar");
  const elBarPercent = document.getElementById("budgetProgressPercent");

  if (elTotal) elTotal.innerText = `₹ ${totalCost.toLocaleString('en-IN')}`;
  if (elRemain) {
    elRemain.innerText = `₹ ${remaining.toLocaleString('en-IN')}`;
    if (remaining < 0) {
      elRemain.style.color = "var(--danger)";
    } else {
      elRemain.style.color = "#5eead4";
    }
  }
  if (elCovered) elCovered.innerText = `${coveredCount} of ${currentAllPendingTasks.length}`;
  if (elHigh) elHigh.innerText = `${highPriorityCovered} of ${totalHigh}`;
  if (elBar) {
    elBar.style.width = `${percentSpent}%`;
    if (percentSpent > 100) {
      elBar.style.background = "var(--danger)";
    } else {
      elBar.style.background = "linear-gradient(90deg, #10b981, #14b8a6)";
    }
  }
  if (elBarPercent) elBarPercent.innerText = `${percentSpent}% Utilized`;
}

/**
 * Render interactive tasks checklist table
 */
function renderTasksList() {
  const container = document.getElementById("budgetTasksTableBody");
  if (!container) return;

  if (currentAllPendingTasks.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">No pending repair tasks to allocate.</td></tr>`;
    return;
  }

  // Sort tasks: Selected tasks on top, then by risk score
  const sorted = [...currentAllPendingTasks].sort((a, b) => {
    const selA = manualSelectionState[a.id] ? 1 : 0;
    const selB = manualSelectionState[b.id] ? 1 : 0;
    if (selA !== selB) return selB - selA;
    return (b.riskScore || 0) - (a.riskScore || 0);
  });

  container.innerHTML = sorted.map(t => {
    const isSelected = !!manualSelectionState[t.id];
    const prioClass = t.priority === "High" ? "badge-high" : (t.priority === "Medium" ? "badge-medium" : "badge-low");
    const cost = t.estimatedCost || 35000;

    return `
      <tr style="${isSelected ? 'background: #f0fdfa;' : ''}">
        <td style="text-align: center;">
          <input type="checkbox" class="task-select-checkbox" data-id="${t.id}" ${isSelected ? "checked" : ""} style="width: 16px; height: 16px; cursor: pointer;">
        </td>
        <td>
          <span class="report-id-pill">${t.id}</span>
          <div style="font-weight: 600; font-size: 0.82rem; color: var(--text-main); margin-top: 2px;">${escapeHtml(t.title)}</div>
        </td>
        <td style="font-size: 0.78rem; color: var(--text-secondary);">${escapeHtml(t.location)}</td>
        <td><span class="badge ${prioClass}">${t.priority}</span></td>
        <td style="font-size: 0.8rem; font-weight: 700; color: var(--primary);">
          ${t.riskScore}/100
        </td>
        <td style="font-weight: 700; color: var(--text-main); white-space: nowrap;">
          ₹ ${cost.toLocaleString('en-IN')}
        </td>
      </tr>
    `;
  }).join("");

  // Attach checkbox listeners
  container.querySelectorAll(".task-select-checkbox").forEach(box => {
    box.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      manualSelectionState[id] = e.target.checked;
      updateBudgetKPIs();
      const row = e.target.closest("tr");
      if (row) {
        row.style.background = e.target.checked ? "#f0fdfa" : "";
      }
    });
  });
}

/**
 * Compare Strategy Cards: Priority vs Lower-Cost alternative
 */
function renderComparisonCards(budget) {
  const prioResult = window.NagarSathiAPI.optimizeBudget(budget, "priority");
  const costResult = window.NagarSathiAPI.optimizeBudget(budget, "coverage");

  const container = document.getElementById("budgetComparisonGrid");
  if (!container) return;

  container.innerHTML = `
    <div style="border: 2px solid var(--accent); border-radius: var(--radius); padding: 1.25rem; background: var(--bg-card); position: relative;">
      <div style="position: absolute; top: -10px; right: 15px; background: var(--accent); color: #fff; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px;">
        RECOMMENDED BY NAGARSATHI AI
      </div>
      <h4 style="font-size: 1rem; font-weight: 700; color: var(--primary); margin-bottom: 0.35rem;">
        Priority-First Optimization (Safety Critical)
      </h4>
      <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1rem;">
        Greedy allocation by Risk Score. Eliminates high-speed arterial hazards and accident-prone craters first.
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.82rem; margin-bottom: 1rem;">
        <div><strong>Allocated Cost:</strong> ₹ ${prioResult.allocatedCost.toLocaleString('en-IN')}</div>
        <div><strong>Remaining:</strong> ₹ ${prioResult.remainingBudget.toLocaleString('en-IN')}</div>
        <div><strong>Issues Fixed:</strong> <span style="font-weight: 700; color: var(--accent);">${prioResult.coveredCount} roads</span></div>
        <div><strong>Critical Hazards:</strong> <span style="font-weight: 700; color: var(--danger);">${prioResult.highPriorityCovered} / ${prioResult.totalHighPriority}</span></div>
      </div>
      <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="applyStrategyPreset('priority')">
        Apply Priority Plan
      </button>
    </div>

    <div style="border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; background: var(--bg-card);">
      <h4 style="font-size: 1rem; font-weight: 700; color: var(--primary); margin-bottom: 0.35rem;">
        Lower-Cost Alternative (Max Coverage)
      </h4>
      <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1rem;">
        Greedy allocation by lowest cost. Resolves the maximum volume of localized complaints within budget.
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.82rem; margin-bottom: 1rem;">
        <div><strong>Allocated Cost:</strong> ₹ ${costResult.allocatedCost.toLocaleString('en-IN')}</div>
        <div><strong>Remaining:</strong> ₹ ${costResult.remainingBudget.toLocaleString('en-IN')}</div>
        <div><strong>Issues Fixed:</strong> <span style="font-weight: 700; color: var(--accent);">${costResult.coveredCount} roads</span></div>
        <div><strong>Critical Hazards:</strong> <span style="font-weight: 700; color: var(--text-muted);">${costResult.highPriorityCovered} / ${costResult.totalHighPriority}</span></div>
      </div>
      <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="applyStrategyPreset('coverage')">
        Apply Coverage Plan
      </button>
    </div>
  `;
}

window.applyStrategyPreset = function (strat) {
  const select = document.getElementById("budgetStrategySelect");
  if (select) {
    select.value = strat;
    runBudgetOptimization();
    window.showToast(`Applied ${strat === 'priority' ? 'Priority-First' : 'Lower-Cost'} strategy`, "info");
  }
};

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
