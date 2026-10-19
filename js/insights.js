/**
 * NagarSathi - AI Insights & Predictive Analytics Module
 * Demonstrates simulated computer vision classification, duplicate report clustering,
 * corridor risk hotspot identification, and explainable priority scoring (XAI).
 * 
 * NOTE: All outputs are clearly labelled as simulated demo inferences.
 */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("aiInsightsPage")) return;

  initAiClassifierDemo();
  renderRiskCorridors();
  renderDuplicateCandidates();
  initExplainableScoreSimulator();
});

/**
 * Section A: Interactive Demo Road Damage Classifier
 */
function initAiClassifierDemo() {
  const selectPhotoBtns = document.querySelectorAll(".ai-test-btn");
  const resultCategory = document.getElementById("aiDemoCategory");
  const resultConf = document.getElementById("aiDemoConf");
  const resultConfBar = document.getElementById("aiDemoConfBar");
  const resultGrade = document.getElementById("aiDemoGrade");
  const resultArea = document.getElementById("aiDemoArea");
  const resultAction = document.getElementById("aiDemoAction");
  const demoImage = document.getElementById("aiDemoDisplayImg");

  const testCases = {
    pothole: {
      type: "Severe Pothole (Structural Pit)",
      conf: "96.4%",
      confNum: 96.4,
      grade: "Critical (Grade 4 - High Accident Hazard)",
      area: "1.4m x 0.8m (~0.85 sq.m)",
      action: "Full-depth patch milling with cold/hot mix asphalt compaction",
      img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
    },
    crack: {
      type: "Fatigue Alligator Cracking Network",
      conf: "91.8%",
      confNum: 91.8,
      grade: "Moderate (Grade 2 - Moisture Vulnerable)",
      area: "42m linear run (~88 sq.m affected)",
      action: "Bituminous crack-seal slurry coat before monsoon infiltration",
      img: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80"
    },
    waterlog: {
      type: "Water Ponding & Bitumen Stripping",
      conf: "94.2%",
      confNum: 94.2,
      grade: "Severe (Grade 4 - Sub-base Saturation)",
      area: "65m drainage corridor (~140 sq.m)",
      action: "Catch-basin invert re-grading and drainage culvert unclogging",
      img: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80"
    },
    ravelling: {
      type: "Surface Ravelling & Shoulder Loss",
      conf: "89.5%",
      confNum: 89.5,
      grade: "Moderate (Grade 3 - Edge Erosion)",
      area: "18m shoulder length (~35 sq.m)",
      action: "Edge curb shoulder reconstruction and stone-matrix asphalt overlay",
      img: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80"
    }
  };

  selectPhotoBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      selectPhotoBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const key = btn.dataset.case;
      const data = testCases[key];
      if (!data) return;

      if (demoImage) demoImage.src = data.img;
      if (resultCategory) resultCategory.innerText = data.type;
      if (resultConf) resultConf.innerText = `Simulated ~${Math.round(data.confNum)}%`;
      if (resultConfBar) resultConfBar.style.width = `${data.confNum}%`;
      if (resultGrade) resultGrade.innerText = data.grade;
      if (resultArea) resultArea.innerText = data.area;
      if (resultAction) resultAction.innerText = data.action;

      window.showToast(`Simulated classification for ${key.toUpperCase()}`, "info");
    });
  });
}

/**
 * Section B: Corridor Hotspot Risk Analysis
 */
function renderRiskCorridors() {
  const container = document.getElementById("riskCorridorsList");
  if (!container || !window.NagarSathiDemo) return;

  const corridors = window.NagarSathiDemo.DEMO_RISK_CORRIDORS || [];
  container.innerHTML = corridors.map(c => {
    let badgeClass = "badge-high";
    if (c.riskClass === "warning") badgeClass = "badge-medium";
    if (c.riskClass === "success") badgeClass = "badge-resolved";

    return `
      <div style="padding: 1.1rem; border: 1px solid var(--border); border-radius: var(--radius); background: var(--bg-card); margin-bottom: 0.85rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main);">${escapeHtml(c.corridor)}</h4>
          <span class="badge ${badgeClass}">${c.riskLevel}</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.4rem;">
          <strong>Historical Recurrence:</strong> ${c.repeatCount}
        </div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.4rem;">
          <strong>Root Cause:</strong> ${c.rootCause}
        </div>
        <div style="font-size: 0.78rem; background: var(--bg-main); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--accent); color: var(--text-main);">
          <strong>Suggested Preventive Action:</strong> ${c.suggestedAction}
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Section C: Duplicate Report Clustering
 */
function renderDuplicateCandidates() {
  const container = document.getElementById("duplicateReportsContainer");
  if (!container || !window.NagarSathiDemo) return;

  const duplicates = window.NagarSathiDemo.DEMO_DUPLICATES || [];
  container.innerHTML = duplicates.map((item, idx) => `
    <div id="duplicate-card-${idx}" style="border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; background: var(--bg-card); margin-bottom: 1rem; transition: var(--transition);">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="report-id-pill">${item.primaryId}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">&harr;</span>
          <span class="report-id-pill" style="background: #fef3c7; color: #92400e;">${item.duplicateId}</span>
        </div>
        <span class="badge badge-under-review" id="duplicate-badge-${idx}">${item.status}</span>
      </div>
      <div style="font-size: 0.82rem; color: var(--text-main); font-weight: 600; margin-bottom: 0.35rem;">
        ${escapeHtml(item.location)}
      </div>
      <div style="display: flex; gap: 1.5rem; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
        <span><strong>Proximity:</strong> ${item.distanceMeters} meters</span>
        <span><strong>Visual Similarity:</strong> <span style="color: var(--accent); font-weight: 700;">${item.visualSimilarity}%</span></span>
        <span><strong>Citizen Upvotes:</strong> ${item.reporterCount} citizens</span>
      </div>
      <div style="font-size: 0.75rem; color: var(--text-muted); background: #f8fafc; padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); margin-bottom: 0.85rem;">
        <i data-lucide="info" style="width:12px; height:12px;"></i> ${escapeHtml(item.recommendation)}
      </div>
      <div id="duplicate-actions-${idx}" style="display: flex; gap: 0.5rem;">
        <button class="btn btn-primary btn-sm" onclick="handleMergeDuplicate(${idx})">
          <i data-lucide="git-merge"></i> Confirm & Merge Tickets
        </button>
        <button class="btn btn-outline btn-sm" onclick="handleDismissDuplicate(${idx})">
          Keep Separate
        </button>
      </div>
    </div>
  `).join("");

  if (window.lucide) window.lucide.createIcons();
}

window.handleMergeDuplicate = function (idx) {
  const card = document.getElementById(`duplicate-card-${idx}`);
  const actions = document.getElementById(`duplicate-actions-${idx}`);
  const badge = document.getElementById(`duplicate-badge-${idx}`);
  if (badge) {
    badge.className = "badge badge-resolved";
    badge.innerText = "Merged";
  }
  if (actions) {
    actions.innerHTML = `<span style="font-size: 0.8rem; color: var(--success); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="check-circle" style="width:14px; height:14px;"></i> Merged into Primary Reference</span>`;
    if (window.lucide) window.lucide.createIcons();
  }
  if (card) {
    card.style.borderColor = "var(--success)";
    card.style.backgroundColor = "rgba(16, 185, 129, 0.04)";
  }
  window.showToast("Tickets merged successfully into primary reference. Duplicate flag cleared.", "success");
};

window.handleDismissDuplicate = function (idx) {
  const card = document.getElementById(`duplicate-card-${idx}`);
  const actions = document.getElementById(`duplicate-actions-${idx}`);
  const badge = document.getElementById(`duplicate-badge-${idx}`);
  if (badge) {
    badge.className = "badge badge-low";
    badge.innerText = "Independent";
  }
  if (actions) {
    actions.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="shield-check" style="width:14px; height:14px;"></i> Retained as Independent Defect</span>`;
    if (window.lucide) window.lucide.createIcons();
  }
  if (card) {
    card.style.opacity = "0.75";
  }
  window.showToast("Candidate marked as independent defect. Ticket retained.", "info");
};

/**
 * Section E: Interactive Explainable Priority Score Simulator (XAI)
 */
function initExplainableScoreSimulator() {
  const sliderSeverity = document.getElementById("simSeveritySlider");
  const sliderTraffic = document.getElementById("simTrafficSlider");
  const sliderRepeat = document.getElementById("simRepeatSlider");
  const sliderAging = document.getElementById("simAgingSlider");

  if (!sliderSeverity) return;

  function calculateSimulatedScore() {
    const sev = parseInt(sliderSeverity.value) || 0;
    const tra = parseInt(sliderTraffic.value) || 0;
    const rep = parseInt(sliderRepeat.value) || 0;
    const age = parseInt(sliderAging.value) || 0;

    const total = sev + tra + rep + age;

    document.getElementById("valSeverity").innerText = `${sev} / 40`;
    document.getElementById("valTraffic").innerText = `${tra} / 25`;
    document.getElementById("valRepeat").innerText = `${rep} / 20`;
    document.getElementById("valAging").innerText = `${age} / 15`;

    const totalEl = document.getElementById("simTotalScore");
    const badgeEl = document.getElementById("simPriorityBadge");
    const fillEl = document.getElementById("simScoreFill");

    if (totalEl) totalEl.innerText = `${total} / 100`;

    if (fillEl) {
      fillEl.style.width = `${total}%`;
      if (total >= 75) {
        fillEl.style.backgroundColor = "var(--danger)";
      } else if (total >= 45) {
        fillEl.style.backgroundColor = "var(--warning)";
      } else {
        fillEl.style.backgroundColor = "var(--info)";
      }
    }

    if (badgeEl) {
      if (total >= 75) {
        badgeEl.className = "badge badge-high";
        badgeEl.innerText = "HIGH PRIORITY (SLA: 24h)";
      } else if (total >= 45) {
        badgeEl.className = "badge badge-medium";
        badgeEl.innerText = "MEDIUM PRIORITY (SLA: 72h)";
      } else {
        badgeEl.className = "badge badge-low";
        badgeEl.innerText = "LOW PRIORITY (SLA: 7 Days)";
      }
    }
  }

  [sliderSeverity, sliderTraffic, sliderRepeat, sliderAging].forEach(slider => {
    slider.addEventListener("input", calculateSimulatedScore);
  });

  calculateSimulatedScore();
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
