/* =========================================================
   COUNTDOWN.JS — Hitung mundur menuju hari acara
   Ubah nilai EVENT_DATE_ISO sesuai tanggal & jam acara.
   Format ISO: "YYYY-MM-DDTHH:mm:ss+07:00" (WIB = +07:00)
   ========================================================= */

(function () {
  "use strict";

  // Sabtu, 15 Agustus 2026, 09.00 WIB
  var EVENT_DATE_ISO = "2026-08-15T09:00:00+07:00";

  var elDays = document.getElementById("cdDays");
  var elHours = document.getElementById("cdHours");
  var elMinutes = document.getElementById("cdMinutes");
  var elSeconds = document.getElementById("cdSeconds");
  var elCaption = document.getElementById("cdCaption");

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  var target = new Date(EVENT_DATE_ISO).getTime();

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    var now = Date.now();
    var diff = target - now;

    if (diff <= 0) {
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMinutes.textContent = "00";
      elSeconds.textContent = "00";
      if (elCaption) elCaption.textContent = "Acara sedang / telah berlangsung. Terima kasih atas doanya!";
      window.clearInterval(timer);
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((diff / (1000 * 60)) % 60);
    var seconds = Math.floor((diff / 1000) % 60);

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  tick();
  var timer = window.setInterval(tick, 1000);
})();
