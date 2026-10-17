/**
 * NagarSathi - Interactive Live Issue Map Module
 * Powered by Leaflet.js & OpenStreetMap with custom priority pins,
 * dynamic filtering, marker popups, and list-to-marker synchronization.
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById("liveMapPage")) return;

  initLiveMap();
});

let mapInstance = null;
let markersLayerGroup = null;
let allReportsCache = [];
let markerRegistry = {}; // id -> L.marker

async function initLiveMap() {
  if (!window.L || !window.NagarSathiAPI) return;

  // Center on Ghaziabad, Uttar Pradesh
  const gzbCenter = [28.6692, 77.4350];
  mapInstance = L.map("leafletMap").setView(gzbCenter, 13);

  // CartoDB Positron / OSM tiles for modern clean look
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | NagarSathi'
  }).addTo(mapInstance);

  markersLayerGroup = L.layerGroup().addTo(mapInstance);

  // Load reports
  allReportsCache = await window.NagarSathiAPI.getReports();
  applyFiltersAndRenderMarkers();

  // Filter change handlers
  const categoryFilter = document.getElementById("mapCategoryFilter");
  const priorityFilter = document.getElementById("mapPriorityFilter");
  const statusFilter = document.getElementById("mapStatusFilter");
  const searchFilter = document.getElementById("mapSearchInput");

  if (categoryFilter) categoryFilter.addEventListener("change", applyFiltersAndRenderMarkers);
  if (priorityFilter) priorityFilter.addEventListener("change", applyFiltersAndRenderMarkers);
  if (statusFilter) statusFilter.addEventListener("change", applyFiltersAndRenderMarkers);
  if (searchFilter) searchFilter.addEventListener("input", applyFiltersAndRenderMarkers);

  // Check URL query parameters for ?focus=NS-2026-XXXX
  const urlParams = new URLSearchParams(window.location.search);
  const focusId = urlParams.get("focus");
  if (focusId) {
    if (categoryFilter) categoryFilter.value = "All";
    if (priorityFilter) priorityFilter.value = "All";
    if (statusFilter) statusFilter.value = "All";
    if (searchFilter) searchFilter.value = "";
    applyFiltersAndRenderMarkers();
    setTimeout(() => focusOnReportMarker(focusId), 400);
  }

  setTimeout(() => {
    if (mapInstance) mapInstance.invalidateSize();
  }, 250);
}

/**
 * Filter data and re-render markers on the map
 */
function applyFiltersAndRenderMarkers() {
  const catVal = document.getElementById("mapCategoryFilter")?.value || "All";
  const prioVal = document.getElementById("mapPriorityFilter")?.value || "All";
  const statVal = document.getElementById("mapStatusFilter")?.value || "All";
  const searchVal = (document.getElementById("mapSearchInput")?.value || "").toLowerCase().trim();

  markersLayerGroup.clearLayers();
  markerRegistry = {};

  const filtered = allReportsCache.filter(r => {
    if (catVal !== "All" && r.category !== catVal) return false;
    if (prioVal !== "All" && r.priority !== prioVal) return false;
    if (statVal !== "All" && r.status !== statVal) return false;
    if (searchVal) {
      const match = r.id.toLowerCase().includes(searchVal) ||
                    r.title.toLowerCase().includes(searchVal) ||
                    r.location.toLowerCase().includes(searchVal);
      if (!match) return false;
    }
    return true;
  });

  // Render markers
  filtered.forEach(r => {
    const marker = createCustomMarker(r);
    marker.addTo(markersLayerGroup);
    markerRegistry[r.id] = marker;
  });

  // Update map list count & items
  const countEl = document.getElementById("mapVisibleCount");
  if (countEl) countEl.innerText = `${filtered.length} issues visible`;

  renderMapItemsList(filtered);
}

/**
 * Generate custom styled Leaflet icon based on Priority & Status
 */
function createCustomMarker(report) {
  let color = "#ef4444"; // Red for High
  if (report.status === "Resolved") {
    color = "#10b981"; // Green
  } else if (report.priority === "Medium") {
    color = "#f59e0b"; // Amber
  } else if (report.priority === "Low") {
    color = "#3b82f6"; // Blue
  }

  const customHtml = `
    <div style="
      background-color: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid #ffffff;
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background-color: #ffffff;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `;

  const customIcon = L.divIcon({
    html: customHtml,
    className: "custom-map-pin",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  const marker = L.marker([report.lat, report.lng], { icon: customIcon });

  // Popup Content
  const popupHtml = `
    <div style="min-width: 220px; font-family: 'Inter', sans-serif; padding: 4px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <span style="font-family: monospace; font-size: 11px; font-weight: 700; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${report.id}</span>
        <span style="font-size: 11px; font-weight: 600; color: ${color};">${report.priority} Priority</span>
      </div>
      <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">${escapeHtml(report.title)}</div>
      <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
        <i data-lucide="map-pin" style="width:12px; height:12px;"></i> ${escapeHtml(report.location)}
      </div>
      ${report.imageUrl ? `
        <div style="margin-bottom: 8px; border-radius: 6px; overflow: hidden; height: 90px; background: #e2e8f0;">
          <img src="${report.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="Road Defect" onerror="this.parentElement.style.display='none';">
        </div>
      ` : ""}
      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
        <span style="font-weight: 600; color: #334155;">Status: ${report.status}</span>
        <a href="repairs.html?id=${report.id}" style="color: #0d9488; font-weight: 600; text-decoration: none;">Inspect &rarr;</a>
      </div>
    </div>
  `;

  marker.bindPopup(popupHtml);
  marker.on("popupopen", () => {
    if (window.lucide) window.lucide.createIcons();
  });

  return marker;
}

/**
 * Render list beside/below map with click-to-focus
 */
function renderMapItemsList(reports) {
  const container = document.getElementById("mapItemsList");
  if (!container) return;

  if (reports.length === 0) {
    container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">No road damage issues match the active filter.</div>`;
    return;
  }

  container.innerHTML = reports.map(r => {
    const prioColor = r.priority === "High" ? "var(--danger)" : (r.priority === "Medium" ? "var(--warning)" : "var(--info)");
    return `
      <div class="map-issue-row" onclick="focusOnReportMarker('${r.id}')" style="
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--border-light);
        cursor: pointer;
        transition: background 0.15s ease;
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.2rem;">
          <span class="report-id-pill">${r.id}</span>
          <span style="font-size: 0.7rem; font-weight: 600; color: ${prioColor};">${r.priority}</span>
        </div>
        <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${escapeHtml(r.title)}
        </div>
        <div style="font-size: 0.72rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${escapeHtml(r.location)}
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Focus smoothly on a marker and trigger its popup
 */
window.focusOnReportMarker = function (id) {
  const marker = markerRegistry[id];
  if (!marker || !mapInstance) return;

  const latlng = marker.getLatLng();
  mapInstance.flyTo(latlng, 15, {
    animate: true,
    duration: 0.8
  });

  setTimeout(() => {
    marker.openPopup();
  }, 850);
};

/**
 * Quick button: Focus on All High Priority Hazards
 */
window.focusHighPriorityHazards = function () {
  const prioSelect = document.getElementById("mapPriorityFilter");
  if (prioSelect) {
    prioSelect.value = "High";
    applyFiltersAndRenderMarkers();
  }
};

/**
 * Reset map center to Ghaziabad
 */
window.resetMapToGhaziabad = function () {
  if (mapInstance) {
    mapInstance.setView([28.6692, 77.4350], 13);
  }
  const categoryFilter = document.getElementById("mapCategoryFilter");
  const priorityFilter = document.getElementById("mapPriorityFilter");
  const statusFilter = document.getElementById("mapStatusFilter");
  const searchFilter = document.getElementById("mapSearchInput");
  if (categoryFilter) categoryFilter.value = "All";
  if (priorityFilter) priorityFilter.value = "All";
  if (statusFilter) statusFilter.value = "All";
  if (searchFilter) searchFilter.value = "";
  applyFiltersAndRenderMarkers();
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
