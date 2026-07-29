# NovaSyY Lab Hub

Aplikasi web mesra mudah alih untuk tiga modul operasi makmal:

- Buku Log Makmal — kehadiran dan aktiviti.
- KEW.PA-9 — permohonan pinjaman aset alih.
- MCCB Test Report — ujian pembukaan di bawah beban lampau (berdasarkan borang MCCB asal).

Ia boleh dihoskan secara percuma melalui GitHub Pages. Rekod kekal tersedia pada peranti melalui `localStorage`, lalu disegerakkan ke folder Google Drive anda apabila endpoint Apps Script disiapkan.

## Hubungkan Google Drive

1. Cipta folder baharu dalam Google Drive, contohnya `NovaSyY Lab Hub Data`, dan salin folder ID daripada URLnya.
2. Buka [Google Apps Script](https://script.google.com), cipta projek baharu dan salin kandungan `apps-script/Code.gs`.
3. Tukar `DRIVE_FOLDER_ID` kepada ID folder tadi. Tukar `ACCESS_KEY` kepada rentetan rahsia panjang.
4. Klik **Deploy → New deployment → Web app**. Pilih **Execute as: Me** dan **Who has access: Anyone**. Salin URL Web App yang berakhir dengan `/exec`.
5. Buka aplikasi yang telah diterbitkan, kemudian tekan ikon **↻** di penjuru kanan atas. Tampal URL Web App dan `ACCESS_KEY` yang sama. Konfigurasi itu disimpan hanya pada peranti/pelayar tersebut.

> Nota: Untuk aplikasi statik GitHub Pages, kunci ini dapat dilihat oleh sesiapa yang melihat kod sumber. Jangan gunakan endpoint ini bagi data sulit. Untuk kegunaan dalaman makmal, hadkan penyebaran URL GitHub Pages kepada staf yang dibenarkan; bagi kawalan akses penuh, gunakan aplikasi dengan log masuk Google OAuth / backend tersendiri.

## Terbit ke GitHub Pages

1. Cipta repositori GitHub baharu, misalnya `novasyy-lab-hub`.
2. Muat naik fail `index.html`, `style.css`, `app.js`, dan folder `apps-script` ke repositori tersebut.
3. Di GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**, kemudian pilih branch `main` dan folder `/(root)`.
4. GitHub akan memaparkan URL aplikasi anda dalam beberapa minit.

## Medan borang

Reka bentuk borang KEW.PA-9 dan MCCB mengikuti dokumen rujukan dalam folder projek. Data dihantar sebagai fail JSON berasingan dalam folder Drive, supaya mudah disandarkan dan diaudit.
