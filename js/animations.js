// ===================================
// KONFIGURASI ANIMASI
// ===================================

const ANIMATION_CONFIG = {
  // Konfigurasi kelopak bunga
  petals: {
    count: 60, // Jumlah kelopak yang akan dibuat
    minDuration: 5, // Durasi minimum animasi (detik)
    maxDuration: 9, // Durasi maksimum animasi (detik)
    minDelay: 0.1, // Delay minimum sebelum animasi dimulai
    maxDelay: 1, // Delay maksimum sebelum animasi dimulai
    sizes: ["small", "medium", "large"],
    colors: ["pink", "rose", "white", "cream"],
  },

  // Konfigurasi bintang
  stars: {
    twinkleInterval: 1000, // Interval berkedip bintang (ms)
    maxOpacity: 1, // Opacity maksimum
    minOpacity: 0.3, // Opacity minimum
  },
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Menghasilkan angka random dalam rentang tertentu
 * @param {number} min - Nilai minimum
 * @param {number} max - Nilai maksimum
 * @returns {number} Angka random
 */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Memilih elemen random dari array
 * @param {Array} array - Array untuk dipilih
 * @returns {*} Elemen yang dipilih
 */
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// ===================================
// FLOWER PETALS ANIMATION
// ===================================

/**
 * Membuat satu kelopak bunga dengan properti random
 * @returns {HTMLElement} Element kelopak bunga
 */
function createPetal() {
  const petal = document.createElement("div");
  petal.className = "petal";

  // Tambahkan class ukuran dan warna random
  const size = randomChoice(ANIMATION_CONFIG.petals.sizes);
  const color = randomChoice(ANIMATION_CONFIG.petals.colors);
  petal.classList.add(size, color);

  // Set posisi horizontal random
  const leftPosition = randomBetween(-10, 110); // Sedikit di luar viewport
  petal.style.left = leftPosition + "%";

  // Set durasi animasi random
  const duration = randomBetween(
    ANIMATION_CONFIG.petals.minDuration,
    ANIMATION_CONFIG.petals.maxDuration,
  );
  petal.style.animationDuration = duration + "s";

  // Set delay random
  const delay = randomBetween(
    ANIMATION_CONFIG.petals.minDelay,
    ANIMATION_CONFIG.petals.maxDelay,
  );
  petal.style.animationDelay = delay + "s";

  // Tambahkan variasi rotasi
  const rotationSpeed = randomBetween(0.5, 2);
  petal.style.setProperty("--rotation-speed", rotationSpeed);

  return petal;
}

/**
 * Menginisialisasi animasi kelopak bunga
 */
function initializePetals() {
  const petalsContainer = document.querySelector(".petals-container");

  if (!petalsContainer) {
    console.warn("Petals container tidak ditemukan");
    return;
  }

  // Buat kelopak bunga sesuai konfigurasi
  for (let i = 0; i < ANIMATION_CONFIG.petals.count; i++) {
    const petal = createPetal();
    petalsContainer.appendChild(petal);

    // Tambahkan event listener untuk menghapus dan membuat ulang kelopak
    // setelah animasi selesai
    petal.addEventListener("animationend", () => {
      petal.remove();

      // Buat kelopak baru setelah delay random
      setTimeout(
        () => {
          const newPetal = createPetal();
          petalsContainer.appendChild(newPetal);
        },
        randomBetween(1000, 5000),
      );
    });
  }
}

// ===================================
// STARS ANIMATION ENHANCEMENT
// ===================================

/**
 * Menambahkan efek berkedip random pada bintang
 */
function enhanceStarsAnimation() {
  const starsElements = document.querySelectorAll(".stars, .stars2, .stars3");

  starsElements.forEach((starsElement, index) => {
    // Tambahkan variasi kecepatan berkedip untuk setiap layer
    const twinkleSpeed = 2 + index * 0.5; // 2s, 2.5s, 3s
    starsElement.style.setProperty("--twinkle-duration", twinkleSpeed + "s");

    // Tambahkan efek opacity random
    setInterval(
      () => {
        const randomOpacity = randomBetween(
          ANIMATION_CONFIG.stars.minOpacity,
          ANIMATION_CONFIG.stars.maxOpacity,
        );
        starsElement.style.opacity = randomOpacity;
      },
      ANIMATION_CONFIG.stars.twinkleInterval + index * 500,
    );
  });
}

// ===================================
// GSAP ANIMATIONS
// ===================================

/**
 * Inisialisasi animasi GSAP untuk elemen halaman
 */
function initializeGSAPAnimations() {
  // Pastikan GSAP sudah dimuat
  if (typeof gsap === "undefined") {
    console.warn(
      "GSAP belum dimuat, menggunakan CSS animations sebagai fallback",
    );
    return;
  }

  // Animasi untuk header section
  gsap.from(".header-section h3", {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: "power2.out",
    delay: 0.2,
  });

  gsap.from(".header-section h2", {
    duration: 1.2,
    y: -30,
    opacity: 0,
    ease: "power2.out",
    delay: 0.4,
  });

  gsap.from(".header-section .divider", {
    duration: 0.8,
    scale: 0,
    opacity: 0,
    ease: "back.out(1.7)",
    delay: 0.8,
  });

  // Animasi untuk form section
  gsap.from(".form-section", {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: "power2.out",
    delay: 1,
  });

  // Animasi untuk footer
  gsap.from(".footer-section", {
    duration: 0.8,
    y: 30,
    opacity: 0,
    ease: "power2.out",
    delay: 1.4,
  });

  // Animasi hover untuk form inputs
  const formInputs = document.querySelectorAll(".form-input, .form-textarea");
  formInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      gsap.to(input, {
        duration: 0.3,
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(233, 30, 99, 0.2)",
        ease: "power2.out",
      });
    });

    input.addEventListener("blur", () => {
      gsap.to(input, {
        duration: 0.3,
        scale: 1,
        boxShadow: "0 0 0 rgba(233, 30, 99, 0)",
        ease: "power2.out",
      });
    });
  });
}

// ===================================
// RESPONSIVE ANIMATION ADJUSTMENTS
// ===================================

/**
 * Menyesuaikan animasi berdasarkan ukuran layar
 */
function adjustAnimationsForDevice() {
  const isMobile = window.innerWidth <= 768;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    // Nonaktifkan animasi untuk pengguna yang prefer reduced motion
    document.body.classList.add("reduce-motion");
    return;
  }

  if (isMobile) {
    // Kurangi jumlah kelopak untuk performa mobile
    ANIMATION_CONFIG.petals.count = Math.floor(
      ANIMATION_CONFIG.petals.count * 0.6,
    );

    // Perlambat animasi bintang
    const starsElements = document.querySelectorAll(".stars, .stars2, .stars3");
    starsElements.forEach((element) => {
      const currentDuration = parseFloat(
        getComputedStyle(element).animationDuration,
      );
      element.style.animationDuration = currentDuration * 1.5 + "s";
    });
  }
}

// ===================================
// INTERSECTION OBSERVER FOR PERFORMANCE
// ===================================

/**
 * Menggunakan Intersection Observer untuk mengoptimalkan performa animasi
 */
function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "50px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  }, observerOptions);

  // Observe elemen yang memerlukan animasi
  const animatedElements = document.querySelectorAll(
    ".form-section, .header-section, .footer-section",
  );
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

// ===================================
// INITIALIZATION
// ===================================

/**
 * Inisialisasi semua animasi
 */
function initializeAnimations() {
  console.log("🎨 Menginisialisasi animasi...");

  // Sesuaikan animasi berdasarkan device
  adjustAnimationsForDevice();

  // Inisialisasi kelopak bunga
  initializePetals();

  // Enhance animasi bintang
  enhanceStarsAnimation();

  // Inisialisasi GSAP animations
  initializeGSAPAnimations();

  // Setup intersection observer
  setupIntersectionObserver();

  console.log("✨ Animasi berhasil diinisialisasi!");
}

// ===================================
// EVENT LISTENERS
// ===================================

// Inisialisasi ketika DOM sudah siap
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAnimations);
} else {
  initializeAnimations();
}

// Re-adjust animasi ketika window di-resize
window.addEventListener("resize", () => {
  adjustAnimationsForDevice();
});

// Export functions untuk digunakan di file lain
window.AnimationController = {
  initializePetals,
  enhanceStarsAnimation,
  initializeGSAPAnimations,
  adjustAnimationsForDevice,
};
//=== Dark mode - light ===
