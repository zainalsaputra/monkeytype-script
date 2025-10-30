const puppeteer = require('puppeteer');

async function runMonkeyTyper() {
    // 1. Luncurkan browser. headless: false berarti kita BISA MELIHAT browsernya
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null, // Biarkan ukuran browser penuh
        args:['--start-maximized'] // Mulai dalam keadaan maximize
    });

    // 2. Buka tab baru
    const page = await browser.newPage();

    // 3. Pergi ke Monkeytype
    await page.goto('https://monkeytype.com');

    // Beri waktu 5 detik bagi Anda untuk mengklik 'mulai' atau setting
    console.log('Anda punya 5 detik untuk klik/setup di browser...');
    
    // --- PERBAIKAN 1 DI SINI ---
    // Mengganti page.waitForTimeout(5000) dengan Promise
    await new Promise(r => setTimeout(r, 3000));
    
    console.log('Mengambil teks...');

    // 4. Ambil semua kata (menggunakan kode di dalam konteks browser)
    const textToType = await page.evaluate(() => {
        const wordElements = document.querySelectorAll('#words .word');
        const text = Array.from(wordElements)
                         .map(word => word.textContent)
                         .join(' ') + ' ';
        return text;
    });

    if (!textToType || textToType.length <= 1) {
        console.error('Tidak bisa menemukan kata. Apakah tesnya sudah dimulai?');
        await browser.close();
        return;
    }

    console.log(`Teks ditemukan. Memulai pengetikan: "${textToType.substring(0, 20)}..."`);
    
    // 5. Ketik teksnya!
    await page.keyboard.type(textToType, { delay: 40 }); // delay 50ms antar ketukan

    console.log('Selesai!');
    
    // Biarkan browser tetap terbuka selama 10 detik untuk melihat hasil
    await new Promise(r => setTimeout(r, 10000));
    
    await browser.close();
}

runMonkeyTyper();