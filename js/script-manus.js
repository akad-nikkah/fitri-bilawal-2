// Mendaftarkan plugin ScrollTrigger ke GSAP
gsap.registerPlugin(ScrollTrigger);

// ===== KONFIGURASI GLOBAL =====
// Mengatur refresh ScrollTrigger saat window resize untuk responsivitas
ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
});

// ===== FUNGSI UTILITAS =====
/**
 * Fungsi untuk mendeteksi apakah device adalah mobile
 * @returns {boolean} true jika mobile, false jika desktop
 */
function isMobile() {
  return window.innerWidth <= 768;
}

/**
 * Fungsi untuk memuat gambar dan menambahkan class 'loaded'
 * Meningkatkan performa dengan lazy loading
 */
function initImageLoading() {
  const images = document.querySelectorAll(".card img");

  images.forEach((img) => {
    // Jika gambar sudah dimuat
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      // Event listener untuk saat gambar selesai dimuat
      img.addEventListener("load", function() {
        this.classList.add("loaded");
      });
    }
  });
}

// ===== ANIMASI HEADER =====
/**
 * Animasi untuk elemen header saat halaman dimuat
 * Memberikan efek fade-in dan slide-up yang smooth
 */
function initHeaderAnimation() {
  const headerTimeline = gsap.timeline();

  // Set initial state - elemen tersembunyi dan bergeser ke bawah
  gsap.set([".main-title", ".subtitle"], {
    opacity: 0,
    y: 50,
  });

  // Animasi masuk dengan delay bertingkat
  headerTimeline
    .to(".main-title", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
    })
    .to(
      ".subtitle",
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.8",
    ); // Mulai 0.8 detik sebelum animasi sebelumnya selesai
}

// ===== ANIMASI SCROLL 3D UTAMA =====
/**
 * Membuat animasi 3D untuk setiap card saat di-scroll
 * Efek berbeda untuk desktop dan mobile untuk optimasi performa
 */
function initScrollAnimations() {
  // Ambil semua elemen card
  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {
    // ===== ANIMASI UNTUK DESKTOP =====
    ScrollTrigger.matchMedia({
      // Media query untuk desktop (di atas 768px)
      "(min-width: 769px)": function() {
        // Animasi utama: efek 3D masuk ke dalam saat scroll
        gsap.to(card, {
          scrollTrigger: {
            trigger: card.closest(".scene"), // Trigger berdasarkan section scene
            start: "top 80%", // Mulai saat top scene mencapai 80% viewport
            end: "bottom 20%", // Selesai saat bottom scene mencapai 20% viewport
            scrub: 1, // Smooth scrubbing dengan delay 1 detik
            // markers: true, // Uncomment untuk debugging
          },
          // Transformasi 3D
          scale: 1.1, // Perbesar sedikit
          z: 200, // Bergerak maju ke arah viewer
          rotateX: 10, // Rotasi sumbu X untuk efek perspektif
          rotateY: index % 2 === 0 ? 5 : -5, // Rotasi bergantian kiri-kanan
          ease: "none", // Linear easing untuk scroll yang smooth
        });

        // Animasi tambahan untuk gambar di dalam card
        gsap.to(card.querySelector("img"), {
          scrollTrigger: {
            trigger: card.closest(".scene"),
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1.5, // Sedikit lebih lambat dari card
          },
          scale: 1.05, // Perbesar gambar sedikit
          ease: "none",
        });

        // Efek parallax untuk card dengan class 'large'
        if (card.classList.contains("large")) {
          gsap.to(card, {
            scrollTrigger: {
              trigger: card.closest(".scene"),
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
            y: -50, // Bergerak ke atas dengan kecepatan berbeda
            ease: "none",
          });
        }
      },

      // ===== ANIMASI UNTUK MOBILE =====
      // Media query untuk mobile (768px ke bawah)
      "(max-width: 768px)": function() {
        // Animasi yang lebih ringan untuk mobile
        gsap.to(card, {
          scrollTrigger: {
            trigger: card.closest(".scene"),
            start: "top 85%", // Start point sedikit berbeda untuk mobile
            end: "bottom 15%",
            scrub: 0.5, // Scrubbing lebih cepat untuk responsivitas
          },
          // Transformasi yang lebih subtle untuk performa mobile
          scale: 1.05, // Scale lebih kecil
          z: 100, // Z-transform lebih kecil
          rotateX: 5, // Rotasi lebih kecil
          ease: "none",
        });

        // Animasi fade-in untuk teks pada mobile
        gsap.to(card.closest(".scene").querySelector(".text-content"), {
          scrollTrigger: {
            trigger: card.closest(".scene"),
            start: "top 90%",
            end: "top 50%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
          ease: "none",
        });
      },
    });
  });
}

// ===== ANIMASI TEKS DAN KONTEN =====
/**
 * Animasi untuk elemen teks yang muncul saat scroll
 * Memberikan efek staggered animation
 */
function initTextAnimations() {
  // Animasi untuk judul section
  gsap.utils.toArray(".section-title").forEach((title) => {
    gsap.fromTo(
      title,
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // Animasi untuk deskripsi section
  gsap.utils.toArray(".section-description").forEach((desc) => {
    gsap.fromTo(
      desc,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: desc,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // Animasi staggered untuk feature items
  gsap.utils.toArray(".features-list").forEach((list) => {
    const items = list.querySelectorAll(".feature-item");

    gsap.fromTo(
      items,
      {
        opacity: 0,
        x: -30,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.2, // Delay 0.2 detik antar item
        scrollTrigger: {
          trigger: list,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
}

// ===== ANIMASI FOOTER =====
/**
 * Animasi untuk elemen footer
 */
function initFooterAnimation() {
  const footerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".footer",
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
  });

  // Animasi tech stack items
  footerTimeline
    .fromTo(
      ".footer-content h3, .footer-content p",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
    )
    .fromTo(
      ".tech-item",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.1,
      },
      "-=0.4",
    );
}

// ===== OPTIMASI PERFORMA =====
/**
 * Fungsi untuk mengoptimalkan performa ScrollTrigger
 */
function optimizePerformance() {
  // Refresh ScrollTrigger saat window resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

  // Pause animasi saat tab tidak aktif untuk menghemat resource
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });
}

// ===== EVENT LISTENERS DAN INISIALISASI =====
/**
 * Fungsi utama yang dijalankan saat DOM sudah siap
 */
function init() {
  // Inisialisasi loading gambar
  initImageLoading();

  // Inisialisasi semua animasi
  initHeaderAnimation();
  initScrollAnimations();
  initTextAnimations();
  initFooterAnimation();

  // Optimasi performa
  optimizePerformance();

  // Set initial state untuk elemen yang akan dianimasi
  gsap.set(".text-content", { opacity: 0.8, y: 20 });

  console.log("🎬 3D Scroll Interactive Website initialized successfully!");
}

// ===== EKSEKUSI =====
// Jalankan inisialisasi saat DOM sudah siap
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ===== DEBUGGING DAN DEVELOPMENT =====
// Uncomment baris di bawah untuk debugging ScrollTrigger
// ScrollTrigger.batch(".card", {
//   onEnter: (elements) => console.log("Cards entered:", elements),
//   onLeave: (elements) => console.log("Cards left:", elements),
// });

// ===== SMOOTH SCROLL ENHANCEMENT =====
/**
 * Enhancement untuk smooth scroll yang lebih baik
 * Opsional: dapat diaktifkan untuk pengalaman scroll yang lebih halus
 */
function initSmoothScroll() {
  // Hanya aktifkan pada desktop untuk performa optimal
  if (!isMobile()) {
    gsap.registerPlugin(ScrollTrigger);

    // Smooth scroll dengan GSAP (opsional)
    // Uncomment jika ingin menggunakan smooth scroll GSAP
    /*
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 0.3,
      ease: "power2.out"
    });
    */
  }
}

// Panggil smooth scroll jika diperlukan
// initSmoothScroll();
