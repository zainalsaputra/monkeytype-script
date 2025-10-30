# 🐒 Monkeytype Puppeteer Bot

Ini adalah script Node.js sederhana yang menggunakan [Puppeteer](https://pptr.dev/) untuk mengotomatiskan tes mengetik di [monkeytype.com](https://monkeytype.com).

Script ini dibuat untuk tujuan edukasi, khususnya untuk mendemonstrasikan bagaimana Puppeteer dapat mengotomatiskan input keyboard di level browser yang dianggap "terpercaya" (melewati pemeriksaan `event.isTrusted`).

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
* [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
* npm (biasanya sudah termasuk dalam Node.js)

## 🚀 Instalasi

1.  Buat folder baru untuk proyek Anda dan salin file `index.js` ke dalamnya.
    
2.  Buka terminal di direktori tersebut.
    
3.  Inisialisasi proyek Node.js (ini akan membuat file `package.json`):
    ```bash
    npm init -y
    ```
    
4.  Instal dependensi tunggal yang diperlukan, yaitu **Puppeteer**:
    ```bash
    npm install puppeteer
    ```
    (Ini akan mengunduh Puppeteer dan versi Chromium yang kompatibel).

## ▶️ Cara Menjalankan

1.  Pastikan Anda berada di direktori proyek Anda di terminal.
    
2.  Jalankan script menggunakan node:
    ```bash
    node index.js
    ```
    
3.  Tunggu sebentar. Script akan secara otomatis:
    * Membuka jendela browser Chromium baru (bukan mode *headless*).
    * Mengarahkan browser ke `https://monkeytype.com`.
    
4.  Setelah halaman dimuat, terminal akan menampilkan:
    ```
    Anda punya 5 detik untuk klik/setup di browser...
    ```
    Gunakan waktu 5 detik ini untuk mengklik di dalam jendela browser agar tesnya aktif (atau mengubah pengaturan apa pun yang Anda inginkan).
    
5.  Setelah 5 detik, script akan:
    * Mengambil semua kata yang terlihat di layar.
    * Mulai mengetik kata-kata tersebut satu per satu dengan jeda `50ms` antar ketukan.
    
6.  Setelah semua kata diketik, script akan menunggu 10 detik (untuk Anda melihat hasilnya) sebelum otomatis menutup browser.

## 📜 Kode Lengkap (`index.js`)

```javascript
const puppeteer = require('puppeteer');

/**
 * Fungsi untuk membuat jeda (pause) dalam milidetik.
 * Menggantikan page.waitForTimeout() yang sudah deprecated.
 * @param {number} ms - Jumlah milidetik untuk menunggu.
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runMonkeyTyper() {
    // 1. Luncurkan browser.
    // headless: false berarti kita BISA MELIHAT browsernya beraksi.
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null, // Biarkan ukuran browser penuh
        args:['--start-maximized'] // Mulai dalam keadaan maximize
    });

    // 2. Buka tab baru
    const page = await browser.newPage();

    // 3. Pergi ke Monkeytype
    await page.goto('[https://monkeytype.com](https://monkeytype.com)');

    // Beri waktu 5 detik bagi pengguna untuk mengklik 'mulai' atau setting
    console.log('Anda punya 5 detik untuk klik/setup di browser...');
    await wait(5000); // Menggunakan fungsi wait kustom
    
    console.log('Mengambil teks...');

    // 4. Ambil semua kata (menggunakan kode di dalam konteks browser)
    // page.evaluate() menjalankan script di dalam browser itu sendiri
    const textToType = await page.evaluate(() => {
        const wordElements = document.querySelectorAll('#words .word');
        const text = Array.from(wordElements)
                         .map(word => word.textContent)
                         .join(' ') + ' '; // Tambah spasi di akhir
        return text;
    });

    // Validasi jika teks tidak ditemukan
    if (!textToType || textToType.length <= 1) {
        console.error('Tidak bisa menemukan kata. Apakah tesnya sudah dimulai?');
        await browser.close();
        return;
    }

    console.log(`Teks ditemukan. Memulai pengetikan: "${textToType.substring(0, 20)}..."`);
    
    // 5. INI BAGIAN UTAMA: Ketik teksnya!
    // page.keyboard.type() mensimulasikan input keyboard asli (isTrusted: true)
    await page.keyboard.type(textToType, { delay: 50 }); // delay 50ms antar ketukan

    console.log('Selesai!');
    
    // Biarkan browser tetap terbuka selama 10 detik untuk melihat hasil
    await wait(10000);
    
    // 6. Tutup browser
    await browser.close();
}

// Jalankan fungsi utamanya
runMonkeyTyper().catch(err => {
    console.error("Terjadi error:", err);
});