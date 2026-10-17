/**
 * NagarSathi - Core Application & Global UI Script
 * Manages responsive navigation, global notifications, toast alerts,
 * and demo data state management across all pages.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Set active nav link
  highlightActiveNavLink();

  // Mobile menu drawer toggle
  setupMobileNavigation();

  // Notification dropdown
  setupNotificationDropdown();

  // Demo reset button
  setupDemoResetButton();
});

/**
 * Highlights current active page in the sidebar
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-item");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/**
 * Responsive Mobile Sidebar Drawer Toggle
 */
function setupMobileNavigation() {
  const menuToggleBtn = document.getElementById("menuToggleBtn");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");

  function openSidebar() {
    if (sidebar) sidebar.classList.add("open");
    if (sidebarOverlay) sidebarOverlay.classList.add("open");
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("open");
    if (sidebarOverlay) sidebarOverlay.classList.remove("open");
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener("click", openSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener("click", closeSidebar);
  }
}

/**
 * Topbar Notification Popover
 */
function setupNotificationDropdown() {
  const notifBtn = document.getElementById("notificationBtn");
  const notifDropdown = document.getElementById("notificationDropdown");

  if (!notifBtn || !notifDropdown) return;

  notifBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
      notifDropdown.classList.remove("show");
    }
  });
}

/**
 * Reset Demo Data Button in Sidebar
 */
function setupDemoResetButton() {
  const resetBtn = document.getElementById("resetDemoBtn");
  if (!resetBtn) return;

  resetBtn.addEventListener("click", () => {
    if (confirm("Reset demo database back to default sample records?")) {
      if (window.NagarSathiAPI && window.NagarSathiAPI.resetDemoData) {
        window.NagarSathiAPI.resetDemoData();
        showToast("Demo database reset successfully!", "success");
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    }
  });
}

/**
 * Global Toast Notification Generator
 */
window.showToast = function (message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let iconName = "info";
  if (type === "success") iconName = "check-circle";
  if (type === "error") iconName = "alert-triangle";

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
};
