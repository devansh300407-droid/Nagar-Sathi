/**
 * NagarSathi - Municipal Repair Management Console
 * Manages search/filter, engineer inspection modal, before/after repair verification,
 * contractor assignment, and localStorage state persistence.
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById("repairManagementPage")) return;

  initRepairManagement();
});

let currentRepairsList = [];
let activeInspectingReport = null;

async function initRepairManagement() {
  await loadAndRenderRepairs();

  // Search and filter listeners
  const searchInput = document.getElementById("repairSearchInput");
  const statusFilter = document.getElementById("repairStatusFilter");
  const priorityFilter = document.getElementById("repairPriorityFilter");
  const wardFilter = document.getElementById("repairWardFilter");

  if (searchInput) searchInput.addEventListener("input", filterRepairsTable);
  if (statusFilter) statusFilter.addEventListener("change", filterRepairsTable);
  if (priorityFilter) priorityFilter.addEventListener("change", filterRepairsTable);
  if (wardFilter) wardFilter.addEventListener("change", filterRepairsTable);

  // Check URL query parameters for ?id=NS-2026-XXXX to open inspection modal directly
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get("id");
  if (targetId) {
    setTimeout(() => openInspectionModal(targetId), 400);
  }

  const targetPriority = urlParams.get("priority");
  if (targetPriority && priorityFilter) {
    priorityFilter.value = targetPriority;
    filterRepairsTable();
  }

  const targetStatus = urlParams.get("status");
  if (targetStatus && statusFilter) {
    statusFilter.value = targetStatus;
    filterRepairsTable();
  }

  // Setup Inspection Modal Save Button
  const saveBtn = document.getElementById("saveRepairStatusBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveRepairStatus);
  }

  // Backdrop click to close repair modal
  const repairModal = document.getElementById("repairActionModal");
  if (repairModal) {
    repairModal.addEventListener("click", (e) => {
      if (e.target === repairModal) closeInspectionModal();
    });
  }
}

async function loadAndRenderRepairs() {
  if (!window.NagarSathiAPI) return;
  currentRepairsList = await window.NagarSathiAPI.getReports();
  filterRepairsTable();
  updateRepairCounters();
}

function updateRepairCounters() {
  const countAll = currentRepairsList.length;
  const countReported = currentRepairsList.filter(r => r.status === "Reported").length;
  const countInReview = currentRepairsList.filter(r => r.status === "Under Review").length;
  const countInProgress = currentRepairsList.filter(r => r.status === "Repair in Progress").length;
  const countResolved = currentRepairsList.filter(r => r.status === "Resolved").length;

  const elAll = document.getElementById("counterAll");
  const elReported = document.getElementById("counterReported");
  const elInReview = document.getElementById("counterInReview");
  const elInProgress = document.getElementById("counterInProgress");
  const elResolved = document.getElementById("counterResolved");

  if (elAll) elAll.innerText = countAll;
  if (elReported) elReported.innerText = countReported;
  if (elInReview) elInReview.innerText = countInReview;
  if (elInProgress) elInProgress.innerText = countInProgress;
  if (elResolved) elResolved.innerText = countResolved;
}

function filterRepairsTable() {
  const query = (document.getElementById("repairSearchInput")?.value || "").toLowerCase().trim();
  const statusVal = document.getElementById("repairStatusFilter")?.value || "All";
  const prioVal = document.getElementById("repairPriorityFilter")?.value || "All";
  const wardVal = document.getElementById("repairWardFilter")?.value || "All";

  const filtered = currentRepairsList.filter(r => {
    if (statusVal !== "All" && r.status !== statusVal) return false;
    if (prioVal !== "All" && r.priority !== prioVal) return false;
    if (wardVal !== "All" && (!r.ward || !r.ward.includes(wardVal))) return false;
    if (query) {
      const match = r.id.toLowerCase().includes(query) ||
                    r.location.toLowerCase().includes(query) ||
                    r.title.toLowerCase().includes(query) ||
                    r.category.toLowerCase().includes(query) ||
                    (r.contractor && r.contractor.toLowerCase().includes(query));
      if (!match) return false;
    }
    return true;
  });

  renderRepairsTable(filtered);
}

function renderRepairsTable(reports) {
  const tbody = document.getElementById("repairsTableBody");
  if (!tbody) return;

  if (reports.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No repair complaints match the current filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = reports.map(r => {
    const priorityClass = r.priority === "High" ? "badge-high" : (r.priority === "Medium" ? "badge-medium" : "badge-low");
    let statusClass = "badge-reported";
    if (r.status === "Under Review") statusClass = "badge-under-review";
    if (r.status === "Repair in Progress") statusClass = "badge-in-progress";
    if (r.status === "Resolved") statusClass = "badge-resolved";

    const verifiedTag = r.verifiedByInspector ?
      `<span style="color: var(--success); font-size: 0.72rem; display: inline-flex; align-items: center; gap: 2px;"><i data-lucide="check-circle" style="width:12px; height:12px;"></i> Verified</span>` :
      `<span style="color: var(--text-muted); font-size: 0.72rem;">Pending Verif.</span>`;

    return `
      <tr>
        <td>
          <span class="report-id-pill">${r.id}</span>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">${r.date}</div>
        </td>
        <td class="table-location-cell">
          <div class="table-loc-title">${escapeHtml(r.title)}</div>
          <div class="table-loc-sub"><i data-lucide="map-pin" style="width:12px; height:12px;"></i> ${escapeHtml(r.location)}</div>
          <div style="font-size: 0.7rem; color: var(--accent); font-weight: 500;">${escapeHtml(r.ward || "Zone 3")}</div>
        </td>
        <td>
          <strong>${escapeHtml(r.category)}</strong>
          <div style="font-size: 0.72rem; color: var(--text-muted);">&#8377; ${(r.estimatedCost || 35000).toLocaleString('en-IN')}</div>
        </td>
        <td>
          <span class="badge ${priorityClass}">${r.priority}</span>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">Risk: <strong>${r.riskScore}/100</strong></div>
        </td>
        <td>
          <span class="badge ${statusClass}">${r.status}</span>
          <div style="margin-top: 4px;">${verifiedTag}</div>
        </td>
        <td>
          <div style="font-size: 0.8rem; font-weight: 500; color: var(--text-main);">${escapeHtml(r.contractor || "Unassigned")}</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${escapeHtml(r.inspectorName || "Pending")}</div>
        </td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="openInspectionModal('${r.id}')" title="Inspect & Update Status">
            <i data-lucide="sliders"></i> Action
          </button>
        </td>
      </tr>
    `;
  }).join("");

  if (window.lucide) window.lucide.createIcons();
}

/**
 * Open Inspection & Action Modal
 */
window.openInspectionModal = async function (id) {
  if (!window.NagarSathiAPI) return;
  activeInspectingReport = await window.NagarSathiAPI.getReportById(id);
  if (!activeInspectingReport) return;

  const modal = document.getElementById("repairActionModal");
  if (!modal) return;

  // Fill modal fields
  document.getElementById("modalTicketId").innerText = activeInspectingReport.id;
  document.getElementById("modalTicketTitle").innerText = activeInspectingReport.title;
  document.getElementById("modalTicketLocation").innerText = activeInspectingReport.location;
  document.getElementById("modalTicketCategory").innerText = activeInspectingReport.category;
  document.getElementById("modalTicketCost").innerText = `₹ ${(activeInspectingReport.estimatedCost || 35000).toLocaleString('en-IN')}`;
  document.getElementById("modalTicketDesc").innerText = activeInspectingReport.description;

  // Form Controls
  document.getElementById("modalStatusSelect").value = activeInspectingReport.status;
  const contractorSelect = document.getElementById("modalContractorSelect");
  if (contractorSelect) {
    const contractorVal = activeInspectingReport.contractor || "Unassigned";
    const optionExists = Array.from(contractorSelect.options).some(o => o.value === contractorVal);
    if (!optionExists && contractorVal) {
      const opt = document.createElement("option");
      opt.value = contractorVal;
      opt.text = contractorVal;
      contractorSelect.appendChild(opt);
    }
    contractorSelect.value = contractorVal;
  }
  document.getElementById("modalInspectorInput").value = activeInspectingReport.inspectorName || "Er. Alok Verma (AE)";
  document.getElementById("modalVerifiedCheck").checked = !!activeInspectingReport.verifiedByInspector;
  document.getElementById("modalCostInput").value = activeInspectingReport.estimatedCost || 35000;

  // Before image
  const beforeImg = document.getElementById("modalBeforeImg");
  if (beforeImg) {
    beforeImg.src = activeInspectingReport.imageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80";
  }

  // After image
  const afterImg = document.getElementById("modalAfterImg");
  const afterPlaceholder = document.getElementById("modalAfterPlaceholder");
  if (activeInspectingReport.afterImageUrl) {
    if (afterImg) {
      afterImg.src = activeInspectingReport.afterImageUrl;
      afterImg.style.display = "block";
    }
    if (afterPlaceholder) afterPlaceholder.style.display = "none";
  } else {
    if (afterImg) afterImg.style.display = "none";
    if (afterPlaceholder) afterPlaceholder.style.display = "flex";
  }

  // Risk Score Breakdown
  const b = activeInspectingReport.scoreBreakdown || { severity: 30, trafficVolume: 20, repeatReports: 15, agingFactor: 10 };
  document.getElementById("scoreSeverity").innerText = `${b.severity}/40`;
  document.getElementById("scoreTraffic").innerText = `${b.trafficVolume}/25`;
  document.getElementById("scoreRepeat").innerText = `${b.repeatReports}/20`;
  document.getElementById("scoreAging").innerText = `${b.agingFactor}/15`;
  document.getElementById("scoreTotal").innerText = `${activeInspectingReport.riskScore}/100`;

  modal.classList.add("show");
  if (window.lucide) window.lucide.createIcons();
};

window.closeInspectionModal = function () {
  const modal = document.getElementById("repairActionModal");
  if (modal) modal.classList.remove("show");
  activeInspectingReport = null;
};

/**
 * Handle Save Status in Modal
 */
async function handleSaveRepairStatus() {
  if (!activeInspectingReport || !window.NagarSathiAPI) return;

  const newStatus = document.getElementById("modalStatusSelect").value;
  const contractor = document.getElementById("modalContractorSelect").value;
  const inspectorName = document.getElementById("modalInspectorInput").value.trim();
  const verified = document.getElementById("modalVerifiedCheck").checked;
  const cost = document.getElementById("modalCostInput").value;

  // Sample after repair image if status is resolved and no after image exists
  let afterImageUrl = activeInspectingReport.afterImageUrl;
  if (newStatus === "Resolved" && !afterImageUrl) {
    afterImageUrl = "https://images.unsplash.com/photo-1584463699042-4943f60505a7?auto=format&fit=crop&w=600&q=80";
  }

  const updatePayload = {
    contractor,
    inspectorName,
    verifiedByInspector: verified,
    estimatedCost: cost,
    afterImageUrl
  };

  const updated = await window.NagarSathiAPI.updateReportStatus(activeInspectingReport.id, newStatus, updatePayload);

  if (updated) {
    window.showToast(`Report ${updated.id} status updated to ${newStatus}`, "success");
    closeInspectionModal();
    await loadAndRenderRepairs();
  }
}

/**
 * Quick load sample "after-repair" verification image in modal
 */
window.loadSampleAfterImage = function () {
  const afterImg = document.getElementById("modalAfterImg");
  const afterPlaceholder = document.getElementById("modalAfterPlaceholder");
  const sampleResolvedUrl = "https://images.unsplash.com/photo-1584463699042-4943f60505a7?auto=format&fit=crop&w=600&q=80";

  if (afterImg) {
    afterImg.src = sampleResolvedUrl;
    afterImg.style.display = "block";
  }
  if (afterPlaceholder) afterPlaceholder.style.display = "none";
  if (activeInspectingReport) {
    activeInspectingReport.afterImageUrl = sampleResolvedUrl;
  }
  window.showToast("Loaded sample post-repair inspection photo", "info");
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
