// ===================================
// GLOBAL CONFIGURATION
// ===================================

const APP_CONFIG = {
  name: "Wedding Confirmation",
  version: "1.0.0",
  authors: "Sugeng & Shofia",

  // Feature flags
  features: {
    animations: true,
    soundEffects: false,
    analytics: false,
    darkMode: false,
  },

  // Performance settings
  performance: {
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCaching: true,
  },

  // Debug mode
  debug: false,
};

// ===================================
// MAIN APPLICATION CLASS
// ===================================

class WeddingConfirmationApp {
  constructor() {
    this.isInitialized = false;
    this.components = {};
    this.eventListeners = [];

    this.init();
  }

  /**
   * Inisialisasi aplikasi
   */
  async init() {
    try {
      console.log(`🎉 Memulai ${APP_CONFIG.name} v${APP_CONFIG.version}`);

      // Check browser compatibility
      this.checkBrowserCompatibility();

      // Initialize core components
      await this.initializeComponents();

      // Setup global event listeners
      this.setupGlobalEventListeners();

      // Setup performance optimizations
      this.setupPerformanceOptimizations();

      // Initialize features
      this.initializeFeatures();

      // Mark as initialized
      this.isInitialized = true;

      console.log("✅ Aplikasi berhasil diinisialisasi!");

      // Trigger custom event
      this.dispatchEvent("app:initialized");
    } catch (error) {
      console.error("❌ Gagal menginisialisasi aplikasi:", error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Check browser compatibility
   */
  checkBrowserCompatibility() {
    const requiredFeatures = [
      "fetch",
      "Promise",
      "addEventListener",
      "querySelector",
      "classList",
    ];

    const unsupportedFeatures = requiredFeatures.filter((feature) => {
      return (
        !(feature in window) &&
        !(feature in document) &&
        !(feature in Element.prototype)
      );
    });

    if (unsupportedFeatures.length > 0) {
      console.warn("⚠️ Browser tidak mendukung fitur:", unsupportedFeatures);
      this.showBrowserCompatibilityWarning();
    }
  }

  /**
   * Initialize core components
   */
  async initializeComponents() {
    // Initialize animations if available
    if (window.AnimationController && APP_CONFIG.features.animations) {
      this.components.animations = window.AnimationController;
      console.log("🎨 Komponen animasi diinisialisasi");
    }

    // Initialize form handler if available
    if (window.WeddingFormHandler) {
      this.components.formHandler = new window.WeddingFormHandler();
      console.log("📝 Komponen form handler diinisialisasi");
    }

    // Initialize other components as needed
    this.components.ui = new UIController();
    this.components.utils = new UtilityController();
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Window resize handler
    const resizeHandler = this.debounce(() => {
      this.handleWindowResize();
    }, 250);

    window.addEventListener("resize", resizeHandler);
    this.eventListeners.push({
      element: window,
      event: "resize",
      handler: resizeHandler,
    });

    // Scroll handler for performance
    const scrollHandler = this.throttle(() => {
      this.handleScroll();
    }, 16); // ~60fps

    window.addEventListener("scroll", scrollHandler, { passive: true });
    this.eventListeners.push({
      element: window,
      event: "scroll",
      handler: scrollHandler,
    });

    // Visibility change handler
    const visibilityHandler = () => {
      this.handleVisibilityChange();
    };

    document.addEventListener("visibilitychange", visibilityHandler);
    this.eventListeners.push({
      element: document,
      event: "visibilitychange",
      handler: visibilityHandler,
    });

    // Keyboard shortcuts
    const keyboardHandler = (event) => {
      this.handleKeyboardShortcuts(event);
    };

    document.addEventListener("keydown", keyboardHandler);
    this.eventListeners.push({
      element: document,
      event: "keydown",
      handler: keyboardHandler,
    });

    // Error handling
    window.addEventListener("error", (event) => {
      this.handleGlobalError(event);
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.handleUnhandledRejection(event);
    });
  }

  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    if (APP_CONFIG.performance.enableLazyLoading) {
      this.setupLazyLoading();
    }

    if (APP_CONFIG.performance.enableImageOptimization) {
      this.setupImageOptimization();
    }

    if (APP_CONFIG.performance.enableCaching) {
      this.setupCaching();
    }
  }

  /**
   * Initialize additional features
   */
  initializeFeatures() {
    // Initialize accessibility features
    this.initializeAccessibility();

    // Initialize responsive helpers
    this.initializeResponsiveHelpers();

    // Initialize user experience enhancements
    this.initializeUXEnhancements();
  }

  /**
   * Handle window resize
   */
  handleWindowResize() {
    // Update viewport dimensions
    this.updateViewportDimensions();

    // Adjust animations for new screen size
    if (this.components.animations) {
      this.components.animations.adjustAnimationsForDevice();
    }

    // Dispatch resize event
    this.dispatchEvent("app:resize", {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    const scrollY = window.scrollY;
    const scrollPercent =
      (scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    // Update scroll-based animations or effects
    this.dispatchEvent("app:scroll", {
      scrollY,
      scrollPercent,
    });
  }

  /**
   * Handle visibility change
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden - pause animations, etc.
      this.pauseAnimations();
    } else {
      // Page is visible - resume animations
      this.resumeAnimations();
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcuts(event) {
    // ESC key - close modals, reset form, etc.
    if (event.key === "Escape") {
      this.handleEscapeKey();
    }

    // Enter key on form elements
    if (event.key === "Enter" && event.target.tagName === "INPUT") {
      this.handleEnterKey(event);
    }

    // Debug shortcuts (only in debug mode)
    if (APP_CONFIG.debug) {
      if (event.ctrlKey && event.key === "d") {
        event.preventDefault();
        this.toggleDebugMode();
      }
    }
  }

  /**
   * Initialize accessibility features
   */
  initializeAccessibility() {
    // Add skip links
    this.addSkipLinks();

    // Enhance focus management
    this.enhanceFocusManagement();

    // Add ARIA labels where needed
    this.addAriaLabels();

    // Setup keyboard navigation
    this.setupKeyboardNavigation();
  }

  /**
   * Initialize responsive helpers
   */
  initializeResponsiveHelpers() {
    // Add viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement("meta");
      viewport.name = "viewport";
      viewport.content = "width=device-width, initial-scale=1.0";
      document.head.appendChild(viewport);
    }

    // Add responsive classes to body
    this.updateResponsiveClasses();
  }

  /**
   * Initialize UX enhancements
   */
  initializeUXEnhancements() {
    // Add loading states
    this.setupLoadingStates();

    // Add smooth scrolling
    this.setupSmoothScrolling();

    // Add form enhancements
    this.setupFormEnhancements();

    // Add touch gestures for mobile
    this.setupTouchGestures();
  }

  /**
   * Utility functions
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Dispatch custom events
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }

  /**
   * Error handling
   */
  handleGlobalError(event) {
    console.error("Global error:", event.error);

    if (APP_CONFIG.debug) {
      this.showErrorDialog(event.error);
    }
  }

  handleUnhandledRejection(event) {
    console.error("Unhandled promise rejection:", event.reason);

    if (APP_CONFIG.debug) {
      this.showErrorDialog(event.reason);
    }
  }

  /**
   * Cleanup function
   */
  destroy() {
    // Remove all event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });

    // Cleanup components
    Object.values(this.components).forEach((component) => {
      if (component && typeof component.destroy === "function") {
        component.destroy();
      }
    });

    console.log("🧹 Aplikasi berhasil dibersihkan");
  }

  // Placeholder methods (implement as needed)
  showBrowserCompatibilityWarning() {
    /* Implementation */
  }
  updateViewportDimensions() {
    /* Implementation */
  }
  pauseAnimations() {
    /* Implementation */
  }
  resumeAnimations() {
    /* Implementation */
  }
  handleEscapeKey() {
    /* Implementation */
  }
  handleEnterKey(event) {
    /* Implementation */
  }
  toggleDebugMode() {
    /* Implementation */
  }
  addSkipLinks() {
    /* Implementation */
  }
  enhanceFocusManagement() {
    /* Implementation */
  }
  addAriaLabels() {
    /* Implementation */
  }
  setupKeyboardNavigation() {
    /* Implementation */
  }
  updateResponsiveClasses() {
    /* Implementation */
  }
  setupLazyLoading() {
    /* Implementation */
  }
  setupImageOptimization() {
    /* Implementation */
  }
  setupCaching() {
    /* Implementation */
  }
  setupLoadingStates() {
    /* Implementation */
  }
  setupSmoothScrolling() {
    /* Implementation */
  }
  setupFormEnhancements() {
    /* Implementation */
  }
  setupTouchGestures() {
    /* Implementation */
  }
  showErrorDialog(error) {
    /* Implementation */
  }
  handleInitializationError(error) {
    /* Implementation */
  }
}

// ===================================
// UI CONTROLLER
// ===================================

class UIController {
  constructor() {
    this.activeModals = [];
    this.notifications = [];
  }

  showNotification(message, type = "info", duration = 5000) {
    // Implementation for showing notifications
    console.log(`Notification [${type}]: ${message}`);
  }

  showModal(content, options = {}) {
    // Implementation for showing modals
    console.log("Showing modal:", content);
  }

  hideModal(modalId) {
    // Implementation for hiding modals
    console.log("Hiding modal:", modalId);
  }
}

// ===================================
// UTILITY CONTROLLER
// ===================================

class UtilityController {
  constructor() {
    this.cache = new Map();
  }

  formatDate(date, format = "DD/MM/YYYY") {
    // Implementation for date formatting
    return new Date(date).toLocaleDateString("id-ID");
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  sanitizeInput(input) {
    // Basic input sanitization
    return input.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      "",
    );
  }

  generateId() {
    return "id_" + Math.random().toString(36).substr(2, 9);
  }
}

// ===================================
// INITIALIZATION
// ===================================

// Initialize app when DOM is ready
let app;

function initializeApp() {
  console.log("🚀 Memulai inisialisasi aplikasi...");
  app = new WeddingConfirmationApp();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (app && typeof app.destroy === "function") {
    app.destroy();
  }
});

// Export for global access
window.WeddingApp = {
  app,
  config: APP_CONFIG,
  UIController,
  UtilityController,
};

// ===================================
// GOOGLE SHEETS INTEGRATION HELPER
// ===================================

/**
 * Helper function untuk membuat Google Apps Script URL
 * Instruksi untuk user:
 * 1. Buka Google Sheets
 * 2. Buat spreadsheet baru dengan kolom: Timestamp, Nama, Alamat, Kehadiran
 * 3. Buka Extensions > Apps Script
 * 4. Paste kode berikut dan deploy sebagai web app:
 */

const GOOGLE_APPS_SCRIPT_CODE = `
function doPost(e) {
  try {
    // ID spreadsheet Anda (ganti dengan ID yang sebenarnya)
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
    
    // Buka spreadsheet
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Parse data dari request
    const data = JSON.parse(e.postData.contents);
    
    // Tambahkan data ke spreadsheet
    sheet.appendRow([
      new Date(data.timestamp),
      data.nama,
      data.alamat,
      data.kehadiran
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data berhasil disimpan'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

console.log(
  "📋 Kode Google Apps Script tersedia di window.GOOGLE_APPS_SCRIPT_CODE",
);
window.GOOGLE_APPS_SCRIPT_CODE = GOOGLE_APPS_SCRIPT_CODE;
