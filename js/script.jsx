// JavaScript untuk Wedding Website
// Berisi semua fungsi interaktif

document.addEventListener("DOMContentLoaded", function() {
  // ===== NAVBAR FUNCTIONALITY =====

  // Sticky Navbar - Menambahkan class sticky saat scroll
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", function() {
    if (window.scrollY > 50) {
      navbar.classList.add("sticky-navbar");
    } else {
      navbar.classList.remove("sticky-navbar");
    }
  });

  // Mobile Menu Toggle - Hamburger menu untuk mobile
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  mobileMenuButton.addEventListener("click", function() {
    mobileMenu.classList.toggle("open");
  });

  // Close mobile menu when clicking on a link
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function() {
      mobileMenu.classList.remove("open");
    });
  });

  // ===== COUNTDOWN FUNCTIONALITY =====

  // Countdown Timer - Menghitung mundur ke tanggal pernikahan
  const countdownElement = document.getElementById("countdown");
  const weddingDate = new Date("2026-08-23T09:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownElement.innerHTML = `
                <div class="flex justify-center space-x-4">
                    <div class="text-center">
                        <div class="text-3xl font-bold">${days}</div>
                        <div class="text-sm">Hari</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold">${hours}</div>
                        <div class="text-sm">Jam</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold">${minutes}</div>
                        <div class="text-sm">Menit</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold">${seconds}</div>
                        <div class="text-sm">Detik</div>
                    </div>
                </div>
            `;
    } else {
      countdownElement.innerHTML =
        '<div class="text-2xl font-bold">Hari Bahagia Telah Tiba!</div>';
    }
  }

  // Update countdown setiap detik
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===== CALENDAR FUNCTIONALITY =====

  // Add to Calendar - Menambahkan event ke kalender
  const calendarButton = document.getElementById("add-to-calendar");
  if (calendarButton) {
    calendarButton.addEventListener("click", function() {
      const eventDetails = {
        title: "Pernikahan Anya & Bima",
        start: "20250823T090000",
        end: "20250823T140000",
        description: "Akad Nikah dan Resepsi Pernikahan Anya & Bima",
        location: "Masjid Agung & Gedung Serba Guna",
      };

      // Generate Google Calendar URL
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;

      window.open(googleCalendarUrl, "_blank");
    });
  }

  // ===== GALLERY LIGHTBOX =====

  // Simple Lightbox untuk gallery
  const galleryImages = document.querySelectorAll("#gallery img");

  galleryImages.forEach((img) => {
    img.addEventListener("click", function() {
      // Buat lightbox overlay
      const lightbox = document.createElement("div");
      lightbox.className =
        "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50";
      lightbox.innerHTML = `
                <div class="relative max-w-4xl max-h-full p-4">
                    <img src="${this.src}" alt="${this.alt}" class="max-w-full max-h-full object-contain">
                    <button class="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300">&times;</button>
                </div>
            `;

      document.body.appendChild(lightbox);

      // Close lightbox
      lightbox.addEventListener("click", function(e) {
        if (e.target === lightbox || e.target.tagName === "BUTTON") {
          document.body.removeChild(lightbox);
        }
      });
    });
  });

  // ===== AUDIO CONTROL =====

  // Audio Background Control
  const audioControl = document.getElementById("audio-control");
  const playIcon = document.getElementById("play-icon");
  const pauseIcon = document.getElementById("pause-icon");
  const backgroundAudio = document.getElementById("background-audio");
  let isPlaying = false;

  // Set volume
  backgroundAudio.volume = 0.3; // Volume 30%

  // Audio control click handler
  audioControl.addEventListener("click", function() {
    if (isPlaying) {
      // Pause audio
      backgroundAudio.pause();
      playIcon.classList.remove("hidden");
      pauseIcon.classList.add("hidden");
      isPlaying = false;
    } else {
      // Play audio
      backgroundAudio
        .play()
        .then(() => {
          playIcon.classList.add("hidden");
          pauseIcon.classList.remove("hidden");
          isPlaying = true;
        })
        .catch((e) => {
          console.log("Audio play failed:", e);
          // Jika autoplay gagal, tampilkan pesan atau biarkan user klik manual
        });
    }
  });

  // Handle audio events
  backgroundAudio.addEventListener("play", function() {
    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");
    isPlaying = true;
  });

  backgroundAudio.addEventListener("pause", function() {
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    isPlaying = false;
  });

  // Try autoplay (might be blocked by browser)
  backgroundAudio
    .play()
    .then(() => {
      // Autoplay berhasil
      isPlaying = true;
    })
    .catch((e) => {
      // Autoplay diblokir browser
      console.log("Autoplay prevented by browser");
      isPlaying = false;
    });

  // ===== FORM SUBMISSION =====

  // RSVP Form Handler
  const rsvpForm = document.querySelector("#rsvp form");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", function(e) {
      // Form akan submit ke Google Forms
      // Tambahkan loading state atau konfirmasi jika diperlukan

      // Optional: Show success message
      setTimeout(() => {
        alert("Terima kasih! Konfirmasi kehadiran Anda telah dikirim.");
      }, 1000);
    });
  }

  // ===== SMOOTH SCROLLING =====

  // Smooth scroll untuk semua anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ===== PARALLAX EFFECT =====

  // Simple parallax untuk background images
  window.addEventListener("scroll", function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll("[data-parallax]");

    parallaxElements.forEach((element) => {
      const speed = element.dataset.parallax || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });

  // ===== LOCATION BUTTONS =====

  // Google Maps buttons functionality
  const mapButtons = document.querySelectorAll(
    'button[class*="Google Maps"], button[class*="Petunjuk Arah"]',
  );
  mapButtons.forEach((button) => {
    button.addEventListener("click", function() {
      // Placeholder URLs - ganti dengan koordinat yang sebenarnya
      const locations = {
        masjid: "https://maps.google.com/?q=Masjid+Agung",
        gedung: "https://maps.google.com/?q=Gedung+Serba+Guna",
      };

      // Tentukan lokasi berdasarkan konteks button
      const isAkadNikah = this.closest(".bg-gradient-to-br")
        .querySelector("h3")
        .textContent.includes("Akad");
      const locationKey = isAkadNikah ? "masjid" : "gedung";

      if (this.textContent.includes("Google Maps")) {
        window.open(locations[locationKey], "_blank");
      } else if (this.textContent.includes("Petunjuk Arah")) {
        // Buka Google Maps dengan directions
        window.open(locations[locationKey] + "&dir=1", "_blank");
      }
    });
  });
});

// ===== UTILITY FUNCTIONS =====

// Function untuk format tanggal Indonesia
function formatDateIndonesian(date) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const day = days[date.getDay()];
  const dateNum = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}, ${dateNum} ${month} ${year}`;
}

// Function untuk validasi form
function validateForm(formData) {
  const errors = [];

  if (!formData.name || formData.name.trim() === "") {
    errors.push("Nama harus diisi");
  }

  if (!formData.attendance) {
    errors.push("Pilihan kehadiran harus dipilih");
  }

  return errors;
}

// Function untuk menampilkan loading state
function showLoading(element) {
  const originalText = element.textContent;
  element.textContent = "Loading...";
  element.disabled = true;

  return function hideLoading() {
    element.textContent = originalText;
    element.disabled = false;
  };
}

// Function untuk menampilkan notifikasi
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}
