# Undangan Sunatan — Arsya

Website undangan digital statis (tanpa backend/database), siap dibuka
di browser atau di-hosting gratis (GitHub Pages / Netlify / Vercel / Firebase Hosting).

## Struktur Folder
```
undangan-arsya/
├── index.html          Cover + Isi Undangan (1 dokumen, berpindah tanpa reload)
├── invitation.html     Halaman pengalih otomatis ke index.html (kompatibilitas link lama)
└── assets/
    ├── css/
    │   ├── variables.css     Token warna, font, spasi
    │   ├── components.css    Komponen UI (tombol, kartu, dsb)
    │   ├── opening.css        Khusus index.html
    │   ├── invitation.css     Khusus invitation.html
    │   └── responsive.css     Penyesuaian tablet/desktop
    ├── js/
    │   ├── opening.js         Logika tombol "Buka Undangan"
    │   ├── invitation.js      Musik, RSVP, salin rekening, animasi
    │   └── countdown.js       Hitung mundur
    ├── images/  → taruh arsya.jpg di sini
    └── audio/   → taruh backsound.mp3 di sini
```

## Yang perlu Anda lengkapi
1. **Foto**: simpan sebagai `assets/images/arsya.jpg`.
2. **Musik latar**: simpan sebagai `assets/audio/backsound.mp3`
   (pilih musik instrumental/islami yang bebas hak cipta).
3. **Tanggal acara**: sudah diset ke *Sabtu, 15 Agustus 2026, 09.00 WIB*
   di `assets/js/countdown.js` (variabel `EVENT_DATE_ISO`) dan di
   `invitation.html` bagian Detail Acara. Ubah keduanya bila tanggal berubah.
4. **Nomor rekening / e-wallet**: masih contoh, ganti di `invitation.html`
   bagian "Amplop Digital" (`ei-bank`, `ei-number`, dan atribut `data-copy`).

## Fitur
- Cover & isi undangan digabung dalam **satu dokumen** (`index.html`) yang
  berpindah tampilan lewat show/hide JavaScript (bukan reload halaman).
  Ini penting supaya `audio.play()` untuk musik latar dipanggil **di dalam
  event klik tombol "Buka Undangan" itu sendiri** — sehingga dianggap
  browser sebagai hasil interaksi user langsung, dan musik bisa auto-play
  dengan andal di hampir semua browser (termasuk Safari iPhone yang paling
  ketat soal autoplay). Tombol musik manual tetap disediakan sebagai
  cadangan jika ada browser yang tetap memblokirnya.
- `invitation.html` tetap ada sebagai halaman pengalih otomatis (redirect)
  ke `index.html`, untuk berjaga-jaga bila ada tautan lama yang mengarah
  langsung ke file tersebut.
- Nama tamu personal lewat parameter URL, contoh:
  `index.html?to=Bapak%20Budi` akan menampilkan "Bapak Budi" di cover
  dan halaman undangan.
- Hitung mundur otomatis menuju hari-H.
- Tombol salin nomor rekening/e-wallet satu klik.
- Ucapan & konfirmasi kehadiran (RSVP) tersimpan di `localStorage`
  browser pengunjung (tanpa server/database). Karena tanpa backend,
  data ucapan hanya tersimpan di perangkat masing-masing pengunjung,
  bukan terpusat — cocok untuk demo/tampilan, namun bila ingin ucapan
  terkumpul dari semua tamu, perlu ditambahkan backend sederhana
  (misalnya Google Sheets API, Firebase, atau Supabase) di kemudian hari.
- Mobile-first & fully responsive (HP, tablet, laptop).

## Cara menjalankan
Cukup buka `index.html` langsung di browser, atau upload seluruh folder
ke hosting statis (GitHub Pages, Netlify, Vercel, dsb).
