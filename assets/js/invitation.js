/* =========================================================
   INVITATION.JS — Logika halaman isi undangan (invitation.html)
   - Menampilkan nama tamu dari parameter URL
   - Memutar / menjeda musik latar
   - Animasi reveal saat scroll
   - Tombol salin nomor rekening / e-wallet
   - RSVP & ucapan sederhana disimpan di localStorage (per perangkat)
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. Musik latar (kontrol manual via tombol) ---------- */
  var audio = document.getElementById("bgAudio");
  var musicBtn = document.getElementById("musicToggle");

  function setToggleState(playing) {
    if (!musicBtn) return;
    musicBtn.classList.toggle("paused", !playing);
    musicBtn.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
  }

  if (audio && musicBtn) {
    musicBtn.addEventListener("click", function () {
      if (audio.paused) {
        audio.play().then(function () { setToggleState(true); }).catch(function () {});
      } else {
        audio.pause();
        setToggleState(false);
      }
    });

    audio.addEventListener("pause", function () { setToggleState(false); });
    audio.addEventListener("play", function () { setToggleState(true); });
  }

  /* ---------- 2. Reveal animasi saat scroll ----------
     Diinisialisasi ulang (initReveal) setiap kali view undangan
     ditampilkan, karena IntersectionObserver butuh elemen yang
     sudah benar-benar terlihat (bukan display:none) untuk bisa
     menghitung posisinya dengan tepat. */
  var revealObserver = null;

  function initReveal() {
    var revealEls = document.querySelectorAll(".reveal:not(.in-view)");
    if (!revealEls.length) return;

    if ("IntersectionObserver" in window) {
      if (!revealObserver) {
        revealObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 }
        );
      }
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }
  }

  document.addEventListener("undangan:shown", initReveal);
  // Jaga-jaga bila view undangan sudah langsung terlihat saat load (mis. via #invitation)
  initReveal();

  /* ---------- 3. Salin nomor rekening / e-wallet ---------- */
  var copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy") || "";
      var restore = btn.textContent;

      function done(success) {
        btn.textContent = success ? "Tersalin!" : "Gagal, salin manual";
        btn.classList.toggle("copied", success);
        window.setTimeout(function () {
          btn.textContent = restore;
          btn.classList.remove("copied");
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () { done(true); }).catch(function () { done(false); });
      } else {
        try {
          var tmp = document.createElement("textarea");
          tmp.value = value;
          tmp.style.position = "fixed";
          tmp.style.opacity = "0";
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand("copy");
          document.body.removeChild(tmp);
          done(true);
        } catch (e) {
          done(false);
        }
      }
    });
  });

  /* ---------- 4. RSVP & Ucapan (disimpan di localStorage perangkat ini) ---------- */
  var STORAGE_KEY = "undangan_arsya_rsvp";
  var form = document.getElementById("rsvpForm");
  var listEl = document.getElementById("rsvpList");
  var countHadir = document.getElementById("countHadir");
  var countTidak = document.getElementById("countTidak");
  var countTotal = document.getElementById("countTotal");

  function loadEntries() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveEntries(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) { /* abaikan bila storage penuh/diblokir */ }
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderEntries() {
    var entries = loadEntries();

    if (countHadir) countHadir.textContent = entries.filter(function (e) { return e.status === "hadir"; }).length;
    if (countTidak) countTidak.textContent = entries.filter(function (e) { return e.status === "tidak"; }).length;
    if (countTotal) countTotal.textContent = entries.length;

    if (!listEl) return;

    if (!entries.length) {
      listEl.innerHTML = '<p class="rsvp-empty">Belum ada ucapan. Jadilah yang pertama mengirimkan doa &amp; ucapan!</p>';
      return;
    }

    listEl.innerHTML = entries
      .slice()
      .reverse()
      .map(function (e) {
        var statusLabel = e.status === "hadir" ? "Insya Allah Hadir" : "Belum Bisa Hadir";
        var statusClass = e.status === "hadir" ? "hadir" : "tidak";
        return (
          '<div class="rsvp-note">' +
          '<span class="rn-name">' + escapeHtml(e.name) + '</span>' +
          '<span class="rn-status ' + statusClass + '">' + statusLabel + "</span>" +
          '<p class="rn-message">' + escapeHtml(e.message) + "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  if (form) {
    form.addEventListener("submit", function (evt) {
      evt.preventDefault();

      var nameInput = document.getElementById("rsvpName");
      var statusInput = document.getElementById("rsvpStatus");
      var messageInput = document.getElementById("rsvpMessage");

      var name = (nameInput.value || "").trim();
      var status = statusInput.value;
      var message = (messageInput.value || "").trim();

      if (!name || !message) return;

      var entries = loadEntries();
      entries.push({ name: name, status: status, message: message, ts: Date.now() });
      saveEntries(entries);
      renderEntries();

      form.reset();
    });
  }

  renderEntries();
})();
