/**
 * NagarSathi - API & Data Management Service
 * 
 * Provides local-first storage using browser localStorage and simulated
 * AI classification responses for the prototype.
 * 
 * BACKEND INTEGRATION READINESS:
 * Designed to easily switch to a Python Flask backend (e.g., http://localhost:5000/api)
 * by toggling USE_BACKEND_API to true.
 */

(function () {
  const STORAGE_KEY = "nagarsathi_reports_v1";
  const USE_BACKEND_API = false; // Set to true when Python Flask backend is running
  const API_BASE_URL = "http://localhost:5000/api";

  // In-memory fallback if localStorage is disabled, restricted, or throws SecurityError
  let inMemoryStore = null;

  function isLocalStorageAvailable() {
    try {
      const testKey = "__nagarsathi_test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Initialize storage from demo data if empty
  function initStorage() {
    const demoData = (window.NagarSathiDemo && window.NagarSathiDemo.DEMO_REPORTS) ? window.NagarSathiDemo.DEMO_REPORTS : [];

    if (!isLocalStorageAvailable()) {
      if (!inMemoryStore) {
        inMemoryStore = JSON.parse(JSON.stringify(demoData));
      }
      return;
    }

    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing || existing === "[]" || existing === "null") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
      }
    } catch (e) {
      console.warn("Storage init warning:", e);
      if (!inMemoryStore) inMemoryStore = JSON.parse(JSON.stringify(demoData));
    }
  }

  // Get all reports from storage
  function getAllReportsFromStorage() {
    initStorage();

    if (!isLocalStorageAvailable()) {
      return inMemoryStore || [];
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out corrupted or null records safely
        const validList = parsed.filter(item => item && typeof item === "object" && typeof item.id === "string");
        if (validList.length > 0) {
          return validList;
        }
      }
      // Re-seed if empty or corrupted
      const demoData = (window.NagarSathiDemo && window.NagarSathiDemo.DEMO_REPORTS) ? window.NagarSathiDemo.DEMO_REPORTS : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
      return demoData;
    } catch (e) {
      console.warn("Error reading localStorage, using demo fallback:", e);
      return (window.NagarSathiDemo && window.NagarSathiDemo.DEMO_REPORTS) || [];
    }
  }

  // Save all reports to storage
  function saveReportsToStorage(reports) {
    if (!isLocalStorageAvailable()) {
      inMemoryStore = reports;
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.warn("Error writing to localStorage, keeping in-memory:", e);
      inMemoryStore = reports;
    }
  }

  // Calculate Explainable Risk Score (0 - 100)
  function computeRiskScore(category, priority, trafficEstimate = 20) {
    let severity = 20;
    if (priority === "High") severity = 38;
    else if (priority === "Medium") severity = 25;
    else severity = 12;

    const traffic = Math.min(25, Math.max(10, trafficEstimate));
    const repeatFactor = priority === "High" ? 18 : 10;
    const aging = 12;

    const total = Math.min(100, severity + traffic + repeatFactor + aging);
    return {
      total,
      breakdown: {
        severity,
        trafficVolume: traffic,
        repeatReports: repeatFactor,
        agingFactor: aging
      }
    };
  }

  // Simulated AI Classifier (Client-side simulation of YOLOv8 / ResNet classifier)
  function simulateAiClassification(category, description) {
    const confidenceMap = {
      "Pothole": { conf: 95.8, grade: "Critical (Grade 4)", area: "0.95 sq.m", cost: 35000 },
      "Road Crack": { conf: 91.2, grade: "Moderate (Grade 2)", area: "45 sq.m", cost: 42000 },
      "Waterlogging": { conf: 93.6, grade: "Severe (Grade 4)", area: "120 sq.m", cost: 95000 },
      "Surface Damage": { conf: 89.4, grade: "Moderate (Grade 3)", area: "32 sq.m", cost: 38000 },
      "Other": { conf: 84.5, grade: "Inspect Required (Grade 2)", area: "15 sq.m", cost: 25000 }
    };

    const target = confidenceMap[category] || confidenceMap["Pothole"];
    return {
      predictedType: category,
      confidence: target.conf,
      severityGrade: target.grade,
      boundingArea: target.area,
      defaultCost: target.cost,
      isSimulated: true,
      simulationLabel: "Simulated Model Estimate (AI Model Pending Connection)",
      note: "Simulated demonstration estimate. Real neural network predictions will replace this preview when Flask backend is connected."
    };
  }

  // Public API Object
  window.NagarSathiAPI = {
    isDemoMode: true,
    backendReady: true,

    /**
     * Reset database back to default demo state
     */
    resetDemoData: function () {
      if (window.NagarSathiDemo && window.NagarSathiDemo.DEMO_REPORTS) {
        const demoData = JSON.parse(JSON.stringify(window.NagarSathiDemo.DEMO_REPORTS));
        inMemoryStore = demoData;
        if (isLocalStorageAvailable()) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
          } catch (e) {
            console.warn("Error resetting localStorage:", e);
          }
        }
        return true;
      }
      return false;
    },

    /**
     * Get list of reports with optional filters
     * Corresponds to: GET /api/reports
     */
    getReports: async function (filters = {}) {
      if (USE_BACKEND_API) {
        /*
        // Flask integration code:
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE_URL}/reports?${queryParams}`);
        return await response.json();
        */
      }

      let reports = getAllReportsFromStorage();

      if (filters.search) {
        const q = filters.search.toLowerCase();
        reports = reports.filter(r => 
          r.id.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.ward && r.ward.toLowerCase().includes(q))
        );
      }

      if (filters.category && filters.category !== "All") {
        reports = reports.filter(r => r.category === filters.category);
      }

      if (filters.priority && filters.priority !== "All") {
        reports = reports.filter(r => r.priority === filters.priority);
      }

      if (filters.status && filters.status !== "All") {
        reports = reports.filter(r => r.status === filters.status);
      }

      if (filters.ward && filters.ward !== "All") {
        reports = reports.filter(r => r.ward && r.ward.includes(filters.ward));
      }

      return reports;
    },

    /**
     * Get single report by ID
     * Corresponds to: GET /api/reports/<id>
     */
    getReportById: async function (id) {
      if (USE_BACKEND_API) {
        /*
        const response = await fetch(`${API_BASE_URL}/reports/${id}`);
        return await response.json();
        */
      }
      const reports = getAllReportsFromStorage();
      const searchId = (id || "").trim().toLowerCase();
      return reports.find(r => r.id.toLowerCase() === searchId) || null;
    },

    /**
     * Submit a new citizen report
     * Corresponds to: POST /api/reports
     */
    createReport: async function (reportInput) {
      if (USE_BACKEND_API) {
        /*
        const response = await fetch(`${API_BASE_URL}/reports`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reportInput)
        });
        return await response.json();
        */
      }

      const reports = getAllReportsFromStorage();
      
      // Generate guaranteed unique sequential ID
      let newId;
      let attempts = 0;
      do {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        newId = `NS-2026-${randomNum}`;
        attempts++;
      } while (reports.some(r => r.id === newId) && attempts < 100);

      const aiSim = simulateAiClassification(reportInput.category, reportInput.description);
      const risk = computeRiskScore(reportInput.category, reportInput.priority || "Medium", 22);

      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      const timeStr = now.toTimeString().split(" ")[0].substring(0, 5);

      const newReport = {
        id: newId,
        title: reportInput.title || `${reportInput.category} reported on ${reportInput.location}`,
        category: reportInput.category || "Pothole",
        location: reportInput.location || "Sector 14, Raj Nagar, Ghaziabad",
        landmark: reportInput.landmark || "Near Main Road",
        lat: parseFloat(reportInput.lat) || (28.6700 + (Math.random() - 0.5) * 0.05),
        lng: parseFloat(reportInput.lng) || (77.4200 + (Math.random() - 0.5) * 0.05),
        priority: reportInput.priority || "Medium",
        status: "Reported",
        date: dateStr,
        reporter: reportInput.reporter || "Citizen (Web Portal)",
        description: reportInput.description || "Road damage reported by resident.",
        imageUrl: reportInput.imageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
        afterImageUrl: "",
        estimatedCost: aiSim.defaultCost,
        dimensions: reportInput.dimensions || aiSim.boundingArea,
        aiClassification: {
          predictedType: aiSim.predictedType,
          confidence: aiSim.confidence,
          severityGrade: aiSim.severityGrade,
          boundingArea: aiSim.boundingArea,
          isSimulated: true,
          simulationLabel: aiSim.simulationLabel,
          note: aiSim.note
        },
        riskScore: risk.total,
        originalRiskScore: risk.total,
        scoreBreakdown: risk.breakdown,
        verifiedByInspector: false,
        inspectorName: "Pending Assignment",
        ward: reportInput.ward || "Ward 14 (Raj Nagar)",
        contractor: "Unassigned",
        lastUpdated: `${dateStr} ${timeStr}`
      };

      // Add to front of list
      reports.unshift(newReport);
      saveReportsToStorage(reports);

      return newReport;
    },

    /**
     * Update report status (admin repair management)
     * Corresponds to: PATCH /api/reports/<id>/status
     */
    updateReportStatus: async function (id, newStatus, updateDetails = {}) {
      if (USE_BACKEND_API) {
        /*
        const response = await fetch(`${API_BASE_URL}/reports/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, ...updateDetails })
        });
        return await response.json();
        */
      }

      const reports = getAllReportsFromStorage();
      const index = reports.findIndex(r => r.id === id);
      if (index === -1) return null;

      const report = reports[index];
      const previousStatus = report.status;
      report.status = newStatus;

      if (updateDetails.contractor) report.contractor = updateDetails.contractor;
      if (updateDetails.inspectorName) report.inspectorName = updateDetails.inspectorName;
      if (typeof updateDetails.verifiedByInspector === "boolean") {
        report.verifiedByInspector = updateDetails.verifiedByInspector;
      }
      if (updateDetails.afterImageUrl) report.afterImageUrl = updateDetails.afterImageUrl;
      if (updateDetails.estimatedCost !== undefined && updateDetails.estimatedCost !== "") {
        report.estimatedCost = Number(updateDetails.estimatedCost);
      }

      const now = new Date();
      report.lastUpdated = `${now.toISOString().split("T")[0]} ${now.toTimeString().substring(0, 5)}`;

      // Save initial risk score if not saved
      if (!report.originalRiskScore && report.riskScore > 15) {
        report.originalRiskScore = report.riskScore;
      }

      // If resolved, lower the active risk score; if re-opened, restore active risk score
      if (newStatus === "Resolved") {
        report.riskScore = Math.min(15, Math.floor((report.originalRiskScore || report.riskScore) * 0.15));
      } else if (previousStatus === "Resolved" && newStatus !== "Resolved") {
        const restored = report.originalRiskScore || computeRiskScore(report.category, report.priority || "Medium", 20).total;
        report.riskScore = restored;
      }

      reports[index] = report;
      saveReportsToStorage(reports);
      return report;
    },

    /**
     * Calculate comprehensive dashboard analytics
     * Corresponds to: GET /api/analytics
     */
    getAnalytics: async function () {
      if (USE_BACKEND_API) {
        /*
        const response = await fetch(`${API_BASE_URL}/analytics`);
        return await response.json();
        */
      }

      const reports = getAllReportsFromStorage();
      const total = reports.length;
      const highPriority = reports.filter(r => r.priority === "High" && r.status !== "Resolved").length;
      const pending = reports.filter(r => r.status === "Reported" || r.status === "Under Review" || r.status === "Repair in Progress").length;
      const resolved = reports.filter(r => r.status === "Resolved").length;

      // Category breakdown
      const categories = { "Pothole": 0, "Road Crack": 0, "Waterlogging": 0, "Surface Damage": 0, "Other": 0 };
      reports.forEach(r => {
        if (categories[r.category] !== undefined) {
          categories[r.category]++;
        } else {
          categories["Other"]++;
        }
      });

      // Status breakdown
      const statuses = { "Reported": 0, "Under Review": 0, "Repair in Progress": 0, "Resolved": 0 };
      reports.forEach(r => {
        if (statuses[r.status] !== undefined) {
          statuses[r.status]++;
        }
      });

      // Priority breakdown
      const priorities = { "High": 0, "Medium": 0, "Low": 0 };
      reports.forEach(r => {
        if (priorities[r.priority] !== undefined) {
          priorities[r.priority]++;
        }
      });

      // Estimated total budget needed for pending issues
      const pendingCost = reports
        .filter(r => r.status !== "Resolved")
        .reduce((sum, r) => sum + (r.estimatedCost || 35000), 0);

      return {
        totalReports: total,
        highPriorityIssues: highPriority,
        pendingRepairs: pending,
        resolvedComplaints: resolved,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
        averageResolutionDays: 3.8, // Demo metric
        categories,
        statuses,
        priorities,
        pendingCost,
        monthlyTrends: (window.NagarSathiDemo && window.NagarSathiDemo.DEMO_CHART_TRENDS) ? 
          window.NagarSathiDemo.DEMO_CHART_TRENDS : {
            months: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
            reported: [42, 68, 124, 158, 92, 54],
            resolved: [39, 52, 98, 134, 104, 76]
          }
      };
    },

    /**
     * Budget optimization algorithm
     * Corresponds to: POST /api/budget/optimize
     */
    optimizeBudget: function (availableBudget = 500000, strategy = "priority") {
      const allReports = getAllReportsFromStorage().filter(r => r.status !== "Resolved");
      let candidateList = [...allReports];

      if (strategy === "priority") {
        // Sort primarily by Risk Score descending, then priority High -> Med -> Low
        candidateList.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
      } else if (strategy === "coverage") {
        // Lower-cost alternative: Sort by cost ascending to maximize fixed issues count
        candidateList.sort((a, b) => (a.estimatedCost || 30000) - (b.estimatedCost || 30000));
      } else if (strategy === "balanced") {
        // Value = Risk Score / Cost ratio (efficiency)
        candidateList.sort((a, b) => {
          const ratioA = (a.riskScore || 50) / (a.estimatedCost || 30000);
          const ratioB = (b.riskScore || 50) / (b.estimatedCost || 30000);
          return ratioB - ratioA;
        });
      }

      let currentSpent = 0;
      const allocatedTasks = [];
      const deferredTasks = [];

      candidateList.forEach(task => {
        const cost = task.estimatedCost || 35000;
        if (currentSpent + cost <= availableBudget) {
          allocatedTasks.push(task);
          currentSpent += cost;
        } else {
          deferredTasks.push(task);
        }
      });

      const highPriorityCovered = allocatedTasks.filter(t => t.priority === "High").length;
      const totalHighPriority = allReports.filter(t => t.priority === "High").length;

      return {
        strategy,
        availableBudget,
        allocatedCost: currentSpent,
        remainingBudget: availableBudget - currentSpent,
        totalCandidates: candidateList.length,
        coveredCount: allocatedTasks.length,
        highPriorityCovered,
        totalHighPriority,
        allocatedTasks,
        deferredTasks
      };
    }
  };

  // Run initialization
  initStorage();
})();
