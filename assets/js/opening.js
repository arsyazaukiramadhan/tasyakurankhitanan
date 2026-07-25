/* =========================================================
   OPENING.JS — Logika cover & perpindahan ke isi undangan
   Sekarang cover & undangan ada dalam SATU dokumen (index.html),
   berpindah dengan show/hide, BUKAN reload halaman.
   Ini penting supaya audio.play() dianggap browser sebagai hasil
   gesture klik user secara langsung, sehingga musik latar
   diizinkan untuk auto-play tanpa perlu tombol musik ditekan lagi.
   ========================================================= */

(function () {
  "use strict";

  var nameGateView = document.getElementById("nameGateView");
  var coverView = document.getElementById("coverView");
  var invitationView = document.getElementById("invitationView");
  var guestNameForm = document.getElementById("guestNameForm");
  var guestNameInput = document.getElementById("guestNameInput");
  var openBtn = document.getElementById("openInvitationBtn");
  var audio = document.getElementById("bgAudio");
  var musicBtn = document.getElementById("musicToggle");

  /* ---- Nama tamu: dari parameter URL (?to=Nama) ATAU dari form input ---- */
  var params = new URLSearchParams(window.location.search);
  var guestNameFromUrl = params.get("to");

  function applyGuestName(rawName) {
    var trimmed = rawName ? decodeURIComponent(rawName).trim() : "";
    var guestDisplay = trimmed ? trimmed : "Bapak/Ibu/Saudara/i";
    document.querySelectorAll("[data-guest-name]").forEach(function (el) {
      el.textContent = guestDisplay;
    });
  }

  function showCover() {
    if (nameGateView) nameGateView.hidden = true;
    if (coverView) coverView.hidden = false;
  }

  if (guestNameFromUrl) {
    // Link sudah membawa nama (kompatibilitas format lama) → langsung ke cover
    applyGuestName(guestNameFromUrl);
    showCover();
  } else if (guestNameForm) {
    // Belum ada nama → minta diisi dulu lewat form
    guestNameForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var typedName = guestNameInput ? guestNameInput.value : "";
      if (guestNameInput && !typedName.trim()) {
        guestNameInput.focus();
        return;
      }
      applyGuestName(encodeURIComponent(typedName));
      showCover();
    });
  } else {
    showCover();
  }

  function setMusicIcon(playing) {
    if (!musicBtn) return;
    musicBtn.classList.toggle("paused", !playing);
    musicBtn.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
  }

  function goToInvitation(playMusic) {
    if (!coverView || !invitationView) return;

    if (nameGateView) nameGateView.hidden = true;
    coverView.hidden = true;
    invitationView.hidden = false;
    window.scrollTo(0, 0);

    // Beri tahu invitation.js supaya animasi reveal & elemen lain
    // yang butuh element sudah "terlihat" bisa mulai dihitung.
    document.dispatchEvent(new CustomEvent("undangan:shown"));

    if (playMusic && audio) {
      var playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(function () { setMusicIcon(true); })
          .catch(function () {
            // Kalau tetap diblokir browser, tombol musik manual tetap tersedia
            setMusicIcon(false);
          });
      }
    }
  }

  if (openBtn) {
    openBtn.addEventListener("click", function () {
      // PENTING: audio.play() dipanggil di sini, di dalam handler klik
      // yang sama — inilah yang membuat browser mengizinkan auto-play.
      openBtn.disabled = true;
      openBtn.textContent = "Membuka...";

      if (coverView) coverView.classList.add("leaving");

      // beri jeda singkat untuk animasi keluar, lalu tampilkan + putar musik
      window.setTimeout(function () {
        goToInvitation(true);
      }, 450);
    });
  }

  // Dukungan tautan langsung ke isi undangan, misal dari invitation.html
  // yang lama (kompatibilitas link lama): index.html?to=Nama#invitation
  if (window.location.hash === "#invitation") {
    goToInvitation(false); // tanpa auto-play karena bukan hasil klik langsung
  }
})();
