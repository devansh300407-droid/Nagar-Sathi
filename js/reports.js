/**
 * NagarSathi - Citizen Road Damage Reporting Module
 * Handles file uploads, sample image selection, mini Leaflet picker map,
 * strict form validation (5MB max, photo required), and transparent AI simulation preview.
 */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("reportDamagePage")) return;

  initReportForm();
  initMiniPickerMap();
  renderSampleImages();
});

let pickerMap = null;
let pickerMarker = null;
let selectedImageDataUrl = "";
let selectedCategory = "Pothole";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

function initReportForm() {
  // Category selection tiles
  const tiles = document.querySelectorAll(".category-tile");
  tiles.forEach(tile => {
    tile.addEventListener("click", () => {
      tiles.forEach(t => t.classList.remove("selected"));
      tile.classList.add("selected");
      selectedCategory = tile.dataset.category;
      const catInput = document.getElementById("selectedCategoryInput");
      if (catInput) catInput.value = selectedCategory;

      // Clear any category error
      const catError = document.getElementById("categoryError");
      if (catError) catError.classList.remove("show");
    });
  });

  // File Upload Handling
  const fileInput = document.getElementById("damageImageFile");
  const dropzone = document.getElementById("uploadDropzone");
  const removeImgBtn = document.getElementById("removeImageBtn");

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("dragover");
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files && fileInput.files[0]) {
        handleImageFile(fileInput.files[0]);
      }
    });
  }

  // Remove Photo Button
  if (removeImgBtn) {
    removeImgBtn.addEventListener("click", () => {
      clearPhotoSelection();
      window.showToast("Road damage photo removed.", "info");
    });
  }

  // Real-time input error clearing
  const titleInput = document.getElementById("reportTitleInput");
  if (titleInput) {
    titleInput.addEventListener("input", () => {
      if (titleInput.value.trim().length >= 5) {
        titleInput.classList.remove("input-error");
        const err = document.getElementById("titleError");
        if (err) err.classList.remove("show");
      }
    });
  }

  const locationInput = document.getElementById("reportLocationInput");
  if (locationInput) {
    locationInput.addEventListener("input", () => {
      if (locationInput.value.trim().length >= 5) {
        locationInput.classList.remove("input-error");
        const err = document.getElementById("locationError");
        if (err) err.classList.remove("show");
      }
    });
  }

  const descInput = document.getElementById("reportDescInput");
  if (descInput) {
    descInput.addEventListener("input", () => {
      if (descInput.value.trim().length >= 10) {
        descInput.classList.remove("input-error");
        const err = document.getElementById("descError");
        if (err) err.classList.remove("show");
      }
    });
  }

  // Form submission
  const reportForm = document.getElementById("roadDamageForm");
  if (reportForm) {
    reportForm.addEventListener("submit", handleReportSubmit);
  }

  // Geolocation button
  const gpsBtn = document.getElementById("useGpsBtn");
  if (gpsBtn) {
    gpsBtn.addEventListener("click", handleGetGpsLocation);
  }
}

/**
 * Clear photo selection and reset upload UI
 */
function clearPhotoSelection() {
  selectedImageDataUrl = "";
  const fileInput = document.getElementById("damageImageFile");
  const previewBox = document.getElementById("imagePreviewBox");
  const previewImg = document.getElementById("previewImage");
  const dropzone = document.getElementById("uploadDropzone");

  if (fileInput) fileInput.value = "";
  if (previewImg) previewImg.src = "";
  if (previewBox) previewBox.style.display = "none";
  if (dropzone) {
    dropzone.style.display = "block";
    dropzone.classList.remove("dropzone-error");
  }

  // Clear selection highlight from sample test cards
  document.querySelectorAll(".sample-image-card").forEach(c => c.classList.remove("selected"));
}

/**
 * Validate and process selected image file (5MB limit & MIME validation)
 */
function handleImageFile(file) {
  const photoError = document.getElementById("photoError");
  const photoErrorText = document.getElementById("photoErrorText");
  const dropzone = document.getElementById("uploadDropzone");

  if (!file) return;

  // 1. Validate file type
  const isImageMime = file.type && (file.type.startsWith("image/") || ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()));
  if (!isImageMime) {
    clearPhotoSelection();
    if (photoError && photoErrorText) {
      photoErrorText.innerText = "Invalid file type. Please upload a JPG, PNG, or WebP photo.";
      photoError.classList.add("show");
    }
    if (dropzone) dropzone.classList.add("dropzone-error");
    window.showToast("Invalid file type. Only JPG, PNG, and WebP are allowed.", "error");
    return;
  }

  // 2. Validate file size (Max 5 MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    clearPhotoSelection();
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    if (photoError && photoErrorText) {
      photoErrorText.innerText = `File is too large (${sizeInMb} MB). Maximum allowed size is 5 MB.`;
      photoError.classList.add("show");
    }
    if (dropzone) dropzone.classList.add("dropzone-error");
    window.showToast(`File size (${sizeInMb} MB) exceeds 5 MB limit.`, "error");
    return;
  }

  // Clear previous photo errors
  if (photoError) photoError.classList.remove("show");
  if (dropzone) dropzone.classList.remove("dropzone-error");

  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImageDataUrl = e.target.result;
    showImagePreview(selectedImageDataUrl);
    window.showToast(`Photo "${file.name}" attached successfully (${(file.size / 1024).toFixed(0)} KB)`, "success");
  };
  reader.onerror = () => {
    clearPhotoSelection();
    window.showToast("Failed to read image file. Please try another.", "error");
  };
  reader.readAsDataURL(file);
}

function showImagePreview(url) {
  const dropzone = document.getElementById("uploadDropzone");
  const previewBox = document.getElementById("imagePreviewBox");
  const previewImg = document.getElementById("previewImage");

  if (previewImg && previewBox && dropzone) {
    previewImg.src = url;
    previewBox.style.display = "block";
    dropzone.style.display = "none";
  }
}

/**
 * Preloaded Sample Road Damage Photos for effortless hackathon demo testing
 */
function renderSampleImages() {
  const container = document.getElementById("sampleImagesGrid");
  if (!container || !window.NagarSathiDemo) return;

  const samples = window.NagarSathiDemo.SAMPLE_TEST_IMAGES || [];
  container.innerHTML = samples.map((sample, idx) => `
    <div class="sample-image-card" data-idx="${idx}" title="${sample.description}">
      <img src="${sample.url}" alt="${sample.name}">
      <div class="sample-image-caption">${sample.name}</div>
    </div>
  `).join("");

  container.querySelectorAll(".sample-image-card").forEach(card => {
    card.addEventListener("click", () => {
      container.querySelectorAll(".sample-image-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");

      const idx = card.dataset.idx;
      const chosen = samples[idx];
      selectedImageDataUrl = chosen.url;

      // Clear any previous photo error
      const photoError = document.getElementById("photoError");
      const dropzone = document.getElementById("uploadDropzone");
      if (photoError) photoError.classList.remove("show");
      if (dropzone) dropzone.classList.remove("dropzone-error");

      // Reset file input element since a sample image is chosen
      const fileInput = document.getElementById("damageImageFile");
      if (fileInput) fileInput.value = "";

      showImagePreview(chosen.url);

      // Auto-select corresponding category
      if (chosen.category) {
        const matchingTile = document.querySelector(`.category-tile[data-category="${chosen.category}"]`);
        if (matchingTile) matchingTile.click();
      }

      window.showToast(`Loaded sample photo: ${chosen.name}`, "info");
    });
  });
}

/**
 * Mini Leaflet map for interactive location pinpointing
 */
function initMiniPickerMap() {
  const mapEl = document.getElementById("reportPickerMap");
  if (!mapEl || !window.L) return;

  // Center on Ghaziabad by default
  const defaultLat = 28.6720;
  const defaultLng = 77.4485;

  pickerMap = L.map("reportPickerMap").setView([defaultLat, defaultLng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(pickerMap);

  const pickerPinIcon = L.divIcon({
    html: `
      <div style="
        background-color: #0d9488;
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #ffffff;
        box-shadow: 0 3px 8px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 10px; height: 10px; background: #ffffff; border-radius: 50%; transform: rotate(45deg);"></div>
      </div>
    `,
    className: "custom-picker-pin",
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  pickerMarker = L.marker([defaultLat, defaultLng], { draggable: true, icon: pickerPinIcon }).addTo(pickerMap);

  pickerMarker.on("dragend", (e) => {
    const pos = e.target.getLatLng();
    updateCoordinatesInput(pos.lat, pos.lng);
  });

  pickerMap.on("click", (e) => {
    pickerMarker.setLatLng(e.latlng);
    updateCoordinatesInput(e.latlng.lat, e.latlng.lng);
  });

  updateCoordinatesInput(defaultLat, defaultLng);

  setTimeout(() => {
    if (pickerMap) pickerMap.invalidateSize();
  }, 250);
}

function updateCoordinatesInput(lat, lng) {
  const latEl = document.getElementById("latitudeInput");
  const lngEl = document.getElementById("longitudeInput");
  const coordDisplay = document.getElementById("coordinatesDisplay");

  if (latEl) latEl.value = lat.toFixed(5);
  if (lngEl) lngEl.value = lng.toFixed(5);
  if (coordDisplay) {
    coordDisplay.innerText = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
  }
}

function handleGetGpsLocation() {
  if (!navigator.geolocation) {
    window.showToast("Geolocation is not supported by your browser.", "error");
    return;
  }

  const gpsBtn = document.getElementById("useGpsBtn");
  gpsBtn.innerHTML = `<i data-lucide="loader" class="spin"></i> Locating...`;
  if (window.lucide) window.lucide.createIcons();

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      if (pickerMap && pickerMarker) {
        pickerMap.setView([lat, lng], 15);
        pickerMarker.setLatLng([lat, lng]);
      }
      updateCoordinatesInput(lat, lng);
      gpsBtn.innerHTML = `<i data-lucide="check"></i> Location Set`;
      if (window.lucide) window.lucide.createIcons();
      window.showToast("GPS coordinates acquired!", "success");
    },
    (err) => {
      console.warn("GPS error, defaulting to Ghaziabad center:", err);
      window.showToast("GPS unavailable or permission denied. Pinned to Ghaziabad center.", "info");
      gpsBtn.innerHTML = `<i data-lucide="crosshair"></i> Use My GPS`;
      if (window.lucide) window.lucide.createIcons();
    },
    { timeout: 7000 }
  );
}

/**
 * Handle Report Submission with Complete Form Validation
 */
async function handleReportSubmit(e) {
  e.preventDefault();

  // Reset existing error feedback
  document.querySelectorAll(".form-error-feedback").forEach(el => el.classList.remove("show"));
  document.querySelectorAll(".form-input, .form-select, .form-textarea").forEach(el => el.classList.remove("input-error"));
  const dropzone = document.getElementById("uploadDropzone");
  if (dropzone) dropzone.classList.remove("dropzone-error");

  let isValid = true;
  let firstErrorElement = null;

  // 1. Incident Title (min 5 chars)
  const titleInput = document.getElementById("reportTitleInput");
  const title = (titleInput?.value || "").trim();
  if (!title || title.length < 5) {
    isValid = false;
    if (titleInput) titleInput.classList.add("input-error");
    const err = document.getElementById("titleError");
    if (err) err.classList.add("show");
    if (!firstErrorElement) firstErrorElement = titleInput;
  }

  // 2. Damage Category
  if (!selectedCategory) {
    isValid = false;
    const err = document.getElementById("categoryError");
    if (err) err.classList.add("show");
    if (!firstErrorElement) firstErrorElement = document.getElementById("categoryTilesContainer");
  }

  // 3. Photo is Required (5MB limit enforced upon selection)
  if (!selectedImageDataUrl) {
    isValid = false;
    const photoErr = document.getElementById("photoError");
    const photoErrText = document.getElementById("photoErrorText");
    if (photoErr && photoErrText) {
      photoErrText.innerText = "A road damage photo is required (max 5 MB). Please upload a photo or select a sample.";
      photoErr.classList.add("show");
    }
    if (dropzone) dropzone.classList.add("dropzone-error");
    if (!firstErrorElement) firstErrorElement = dropzone;
  }

  // 4. Location & Street Address (min 5 chars)
  const locInput = document.getElementById("reportLocationInput");
  const location = (locInput?.value || "").trim();
  if (!location || location.length < 5) {
    isValid = false;
    if (locInput) locInput.classList.add("input-error");
    const err = document.getElementById("locationError");
    if (err) err.classList.add("show");
    if (!firstErrorElement) firstErrorElement = locInput;
  }

  // 5. Ward & Priority
  const ward = document.getElementById("reportWardSelect")?.value || "Ward 14 (Raj Nagar)";
  const priority = document.getElementById("reportPrioritySelect")?.value || "Medium";
  const landmark = (document.getElementById("reportLandmarkInput")?.value || "").trim();

  // 6. Coordinates (Must be valid numbers)
  const latVal = parseFloat(document.getElementById("latitudeInput")?.value);
  const lngVal = parseFloat(document.getElementById("longitudeInput")?.value);
  if (isNaN(latVal) || isNaN(lngVal) || latVal < -90 || latVal > 90 || lngVal < -180 || lngVal > 180) {
    isValid = false;
    window.showToast("Please select valid coordinates on the map.", "error");
  }

  // 7. Description (min 10 chars)
  const descInput = document.getElementById("reportDescInput");
  const description = (descInput?.value || "").trim();
  if (!description || description.length < 10) {
    isValid = false;
    if (descInput) descInput.classList.add("input-error");
    const err = document.getElementById("descError");
    if (err) err.classList.add("show");
    if (!firstErrorElement) firstErrorElement = descInput;
  }

  // Stop if invalid and scroll to first error
  if (!isValid) {
    window.showToast("Please complete all required fields and provide a road damage photo.", "error");
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      if (firstErrorElement.focus) firstErrorElement.focus();
    }
    return;
  }

  // Proceed with Submission
  const submitBtn = document.getElementById("submitReportBtn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i data-lucide="loader" class="spin"></i> Registering Grievance...`;
  if (window.lucide) window.lucide.createIcons();

  try {
    const reportData = {
      title,
      category: selectedCategory,
      location,
      landmark,
      ward,
      description,
      priority,
      lat: latVal,
      lng: lngVal,
      imageUrl: selectedImageDataUrl,
      reporter: "Citizen (Direct Portal)"
    };

    const newReport = await window.NagarSathiAPI.createReport(reportData);

    // Show Success Modal
    showSuccessModal(newReport);
    window.showToast(`Report ${newReport.id} registered successfully!`, "success");
  } catch (err) {
    console.error("Submission failed:", err);
    window.showToast("An error occurred while saving the report. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i data-lucide="send"></i> Submit Road Damage Report`;
    if (window.lucide) window.lucide.createIcons();
  }
}

/**
 * Render success modal with generated report ID and transparent demo classifier note
 */
function showSuccessModal(report) {
  const modal = document.getElementById("reportSuccessModal");
  if (!modal) return;

  const idEl = document.getElementById("modalReportId");
  const aiClassEl = document.getElementById("modalAiCategory");
  const aiConfEl = document.getElementById("modalAiConfidence");
  const locEl = document.getElementById("modalReportLocation");
  const mapLink = document.getElementById("modalViewOnMapLink");
  const repairLink = document.getElementById("modalViewRepairLink");

  if (idEl) idEl.innerText = report.id;
  if (aiClassEl) aiClassEl.innerText = report.aiClassification?.predictedType || report.category;
  if (aiConfEl) {
    const confVal = report.aiClassification?.confidence ? Math.round(report.aiClassification.confidence) : 95;
    aiConfEl.innerText = `Simulated Estimate (~${confVal}%)`;
  }
  if (locEl) locEl.innerText = report.location;

  if (mapLink) mapLink.href = `map.html?focus=${report.id}`;
  if (repairLink) repairLink.href = `repairs.html?id=${report.id}`;

  modal.classList.add("show");
  if (window.lucide) window.lucide.createIcons();

  // Attach backdrop click once
  if (!modal.dataset.hasBackdropListener) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeSuccessModal();
    });
    modal.dataset.hasBackdropListener = "true";
  }

  // Reset form and clear uploaded photo
  const form = document.getElementById("roadDamageForm");
  if (form) form.reset();
  clearPhotoSelection();

  // Reset coordinate display to default Ghaziabad
  updateCoordinatesInput(28.6720, 77.4485);
  if (pickerMap && pickerMarker) {
    pickerMarker.setLatLng([28.6720, 77.4485]);
    pickerMap.setView([28.6720, 77.4485], 13);
  }
}

window.closeSuccessModal = function () {
  const modal = document.getElementById("reportSuccessModal");
  if (modal) modal.classList.remove("show");
};
