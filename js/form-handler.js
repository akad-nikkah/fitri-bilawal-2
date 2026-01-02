/**
 * ===================================
 * FORM HANDLER JAVASCRIPT (VERSI BARU UNTUK APPS SCRIPT DENGAN e.parameter)
 * File: form-handler.js
 * Deskripsi: Menangani form submission, validasi, dan integrasi Google Sheets dengan redirect otomatis.
 *            Disesuaikan untuk Apps Script yang menerima data sebagai form-urlencoded (e.parameter).
 * ===================================
 */

// ===================================
// KONFIGURASI GOOGLE SHEETS
// ===================================

const GOOGLE_SHEETS_CONFIG = {
  // URL Google Apps Script Web App (PASTIKAN INI ADALAH URL DARI DEPLOYMENT ANDA)
  scriptURL:
    "https://script.google.com/macros/s/AKfycby-ZZEvpg7YMQ8TylveyyfUMXFxHMDSSEiTA-XIuaNIO37Et7R2IqmZx0jD8rsn7PSwkw/exec",

  // Timeout untuk request (ms)
  timeout: 10000,

  // Retry configuration
  maxRetries: 1, // Diatur ke 1 sesuai permintaan user sebelumnya
  retryDelay: 1000,
};

// ===================================
// KONFIGURASI REDIRECT
// ===================================
const REDIRECT_CONFIG = {
  mainPageURL: "main/main.html", // <--- GANTI DENGAN URL HALAMAN ANDA
  redirectDelay: 2000,
  useAnimation: true,
};

// ===================================
// FORM VALIDATION RULES
// ===================================
const VALIDATION_RULES = {
  nama: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s.\[\]\{\}\(\)'\-]+$/,
    errorMessages: {
      required: "Nama lengkap wajib diisi",
      minLength: "Nama minimal 2 karakter",
      maxLength: "Nama maksimal 100 karakter",
      pattern:
        "Nama hanya boleh mengandung huruf, spasi, titik, apostrof, dan tanda hubung",
    },
  },
  alamat: {
    required: false,
    maxLength: 500,
    errorMessages: {
      maxLength: "Alamat maksimal 500 karakter",
    },
  },
  kehadiran: {
    required: true,
    errorMessages: {
      required: "Silakan pilih konfirmasi kehadiran Anda",
    },
  },
};

// ===================================
// FORM HANDLER CLASS
// ===================================
class WeddingFormHandler {
  constructor() {
    this.form = document.getElementById("confirmationForm");
    this.submitBtn = document.getElementById("submitBtn");
    this.successMessage = document.getElementById("successMessage");
    this.backBtn = document.getElementById("backBtn");

    this.isSubmitting = false;
    this.retryCount = 0;

    this.initializeEventListeners();
    this.setupFormValidation();
  }

  initializeEventListeners() {
    if (this.form) {
      this.form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }

    if (this.backBtn) {
      this.backBtn.addEventListener("click", this.handleBackToMain.bind(this));
    }

    const inputs = this.form.querySelectorAll('input:not([type="radio"]), textarea');
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });

    const radioButtons = this.form.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => {
      radio.addEventListener("change", () => {
        this.validateField(radio);
        this.updateRadioButtonStyles();
      });
    });
  }

  setupFormValidation() {
    if (this.form) {
      this.form.setAttribute("novalidate", "true");
    }
  }

validateField(field) {
  const fieldName = field.name;
  const rules = VALIDATION_RULES[fieldName];

  if (!rules) return true;

  this.clearFieldError(field);

  // PERBAIKAN: Handle radio button secara khusus
  if (field.type === "radio") {
    return this.validateRadioGroup(fieldName, rules);
  }

  // Validasi field lainnya...
  const fieldValue = field.value.trim();
  // ...
}

// METODE BARU: Validasi khusus untuk grup radio
validateRadioGroup(fieldName, rules) {
  const radioGroup = this.form.querySelectorAll(`input[name="${fieldName}"]`);
  const isChecked = Array.from(radioGroup).some((radio) => radio.checked);
  
  if (rules.required && !isChecked) {
    // Tampilkan error pada elemen yang mewakili grup
    const firstRadio = radioGroup[0];
    this.showFieldError(firstRadio, rules.errorMessages.required);
    return false;
  }
  
  return true;
}

validateForm() {
  let isValid = true;
  
  // Validasi field regular
  const fields = this.form.querySelectorAll('input:not([type="radio"]):not([type="submit"]), textarea');
  fields.forEach((field) => {
    if (!this.validateField(field)) {
      isValid = false;
    }
  });

  // PERBAIKAN: Validasi khusus untuk grup radio
  const radioGroups = {};
  const allRadios = this.form.querySelectorAll('input[type="radio"]');
  
  allRadios.forEach(radio => {
    if (!radioGroups[radio.name]) {
      radioGroups[radio.name] = radio.name;
    }
  });

  // Validasi setiap grup radio
  Object.keys(radioGroups).forEach(groupName => {
    const rules = VALIDATION_RULES[groupName];
    if (rules && !this.validateRadioGroup(groupName, rules)) {
      isValid = false;
    }
  });

  return isValid;
}

  showFieldError(field, message) {
    const errorElement = document.getElementById(field.name + "Error");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove("hidden");
    }
    field.classList.add("border-red-500", "focus:ring-red-500");
    field.classList.remove("border-white/50", "focus:ring-wedding-rose");
  }

  clearFieldError(field) {
    const errorElement = document.getElementById(field.name + "Error");
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.classList.add("hidden");
    }
    field.classList.remove("border-red-500", "focus:ring-red-500");
    field.classList.add("border-white/50", "focus:ring-wedding-rose");
  }

  updateRadioButtonStyles() {
    const radioButtons = this.form.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => {
      const customRadio = radio.nextElementSibling;
      const innerCircle = customRadio?.querySelector(".w-2\\.5");
      if (innerCircle) {
        innerCircle.style.opacity = radio.checked ? "1" : "0";
      }
    });
  }

   async handleFormSubmit(event) { 
    event.preventDefault();

    if (this.isSubmitting) return;

    /* if (!this.validateForm()) {
      this.showNotification();
      return;
    } */

    this.isSubmitting = true;
    this.setLoadingState(true);

    try {
      const formData = this.collectFormData();
      await this.submitToGoogleSheets(formData);

      this.showSuccessMessageWithRedirect();
      this.retryCount = 0;
    } catch (error) {
      console.error("Error submitting form:", error);

      if (this.retryCount < GOOGLE_SHEETS_CONFIG.maxRetries) {
        this.retryCount++;

        setTimeout(() => {
          this.handleFormSubmit(event);
        }, GOOGLE_SHEETS_CONFIG.retryDelay * this.retryCount);

        return;
      }

      this.showNotification(
        "Mohon isi semua formulir dgn benar.",
        "error",
      );
    } finally {
      this.isSubmitting = false;
      this.setLoadingState(false);
    }
  }

collectFormData() {
  const formData = new FormData(this.form);
  const data = {};
  
  data.nama = formData.get("nama").trim();
  data.alamat = formData.get("alamat").trim();
  
  // PERBAIKAN: Validasi tambahan untuk kehadiran
  const kehadiran = formData.get("kehadiran");
  if (!kehadiran || (kehadiran !== "hadir" && kehadiran !== "tidak-hadir")) {
    throw new Error("Pilihan kehadiran tidak valid");
  }
  data.kehadiran = kehadiran;
  
  data.timestamp = new Date().toISOString();
  data.useragent = navigator.userAgent;

  return data;
}

  async submitToGoogleSheets(data) {
    const formData = new URLSearchParams();
    for (const key in data) {
      formData.append(key.toLowerCase(), data[key]);
    }

    const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptURL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.result !== "success") {
      throw new Error(result.error || "Gagal mengirim data ke Google Sheets");
    }

    return result;
  }

  setLoadingState(isLoading) {
    if (!this.submitBtn) return;

    const btnText = this.submitBtn.querySelector(".btn-text");
    const btnLoading = this.submitBtn.querySelector(".btn-loading");

    this.submitBtn.disabled = isLoading;
    this.submitBtn.classList.toggle("loading", isLoading);
    btnText.style.display = isLoading ? "none" : "inline";
    btnLoading.style.display = isLoading ? "flex" : "none";
  }

  showSuccessMessageWithRedirect() {
    if (!this.form || !this.successMessage) return;

    const transitionComplete = () => {
      this.form.style.display = "none";
      this.successMessage.classList.remove("hidden");

      if (this.backBtn) {
        this.backBtn.style.display = "none";
      }

      if (typeof gsap !== "undefined" && REDIRECT_CONFIG.useAnimation) {
        gsap.from(this.successMessage, {
          duration: 0.8,
          opacity: 0,
          y: 20,
          ease: "power2.out",
          onComplete: () => {
            this.startRedirectCountdown();
          },
        });
      } else {
        this.startRedirectCountdown();
      }
    };

    if (typeof gsap !== "undefined" && REDIRECT_CONFIG.useAnimation) {
      gsap.to(this.form, {
        duration: 0.5,
        opacity: 0,
        y: -20,
        ease: "power2.out",
        onComplete: transitionComplete,
      });
    } else {
      transitionComplete();
    }
  }

  startRedirectCountdown() {
    const countdownElement = document.createElement("p");
    countdownElement.className = "text-sm text-gray-600 mt-4";
    countdownElement.id = "redirectCountdown";
    this.successMessage.appendChild(countdownElement);

    let countdown = Math.ceil(REDIRECT_CONFIG.redirectDelay / 1000);

    const updateCountdown = () => {
      countdownElement.textContent = `Anda akan diarahkan ke halaman utama dalam ${countdown} detik...`;
      if (countdown <= 0) {
        this.performRedirect();
      } else {
        countdown--;
        setTimeout(updateCountdown, 1000);
      }
    };

    updateCountdown();
  }

  performRedirect() {
    if (typeof gsap !== "undefined" && REDIRECT_CONFIG.useAnimation) {
      gsap.to(document.body, {
        duration: 0.5,
        opacity: 0,
        ease: "power2.out",
        onComplete: () => {
          window.location.href = REDIRECT_CONFIG.mainPageURL;
        },
      });
    } else {
      window.location.href = REDIRECT_CONFIG.mainPageURL;
    }
  }

  handleBackToMain() {
    this.performRedirect();
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;

    const typeClasses = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-black",
      info: "bg-blue-500 text-white",
    };

    notification.classList.add(...typeClasses[type].split(" "));
    notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === "success" ? "check" : type === "error" ? "times" : type === "warning" ? "exclamation" : "info"}-circle"></i>
                <span>${message}</span>
            </div>`;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove("translate-x-full"), 100);

    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
}

// ===================================
// INITIALIZATION
// ===================================
let formHandler;

function initializeFormHandler() {
  console.log("📝 Menginisialisasi form handler dengan redirect otomatis...");
  formHandler = new WeddingFormHandler();
  console.log("✅ Form handler berhasil diinisialisasi!");
  console.log(`🔗 Redirect akan menuju: ${REDIRECT_CONFIG.mainPageURL}`);
  console.log(`⏱️ Delay redirect: ${REDIRECT_CONFIG.redirectDelay}ms`);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeFormHandler);
} else {
  initializeFormHandler();
}

window.WeddingFormHandler = WeddingFormHandler;
window.REDIRECT_CONFIG = REDIRECT_CONFIG;
