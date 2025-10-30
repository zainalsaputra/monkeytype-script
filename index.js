/**
 * @file index.js
 * @description Puppeteer script to automate Monkeytype.com typing tests.
 * This script launches a visible browser, navigates to the site,
 * scrapes the words, and simulates human keyboard input.
 */

// Import the Puppeteer library, which provides the high-level API
// to control Chrome/Chromium over the DevTools Protocol.
const puppeteer = require('puppeteer');

/**
 * Main asynchronous function to run the automation logic.
 * Encapsulating in an async function allows us to use 'await'.
 */
async function runMonkeyTyper() {
    
    // 1. Launch a new browser instance.
    const browser = await puppeteer.launch({ 
        /** * headless: false
         * Runs a "headful" browser (i.e., a visible window). 
         * Required for this script so the user can interact.
         */
        headless: false,
        /**
         * defaultViewport: null
         * Sets the browser viewport to null, which forces it to
         * adapt to the window size instead of a fixed default (e.g., 800x600).
         */
        defaultViewport: null,
        /**
         * args: ['--start-maximized']
         * A Chromium-specific flag to ensure the window opens maximized.
         */
        args:['--start-maximized']
    });

    // 2. Open a new browser tab (Page object).
    const page = await browser.newPage();

    // 3. Navigate the page to the target URL.
    await page.goto('https://monkeytype.com');

    // 4. Provide a 5-second manual delay.
    // This is crucial because Monkeytype pauses the test when the window
    // loses focus (e.g., when the console is open). This delay gives
    // the user time to click back onto the browser window to focus it.
    console.log('You have 5 seconds to click/setup in the browser...');
    await new Promise(r => setTimeout(r, 5000));
    
    console.log('Scraping text from the page...');

    // 5. Scrape the words from the test.
    // page.evaluate() runs the provided function *within* the
    // browser's context (i.e., it can access the DOM).
    const textToType = await page.evaluate(() => {
        // Select all elements with class 'word' inside the '#words' container.
        const wordElements = document.querySelectorAll('#words .word');
        
        // Convert the NodeList to an Array, map over it to get
        // the text content of each word, and join them with spaces.
        // A final space is added to ensure the last word is also submitted.
        const text = Array.from(wordElements)
                         .map(word => word.textContent)
                         .join(' ') + ' ';
        return text;
    });

    // 6. Guard clause: Check if text was successfully scraped.
    // If textToType is null, empty, or just a single space, something went wrong.
    if (!textToType || textToType.length <= 1) {
        console.error('Could not find text to type. Did the test start?');
        await browser.close(); // Close browser to prevent hanging
        return; // Exit the function
    }

    // Log a snippet of the found text for confirmation.
    console.log(`Text found. Starting type: "${textToType.substring(0, 20)}..."`);
    
    // 7. Simulate trusted keyboard input.
    // page.keyboard.type() is the key. It simulates real key presses,
    // which generates 'isTrusted: true' events that bypass anti-cheat checks.
    // { delay: 50 } adds a 50ms delay between each keystroke for realism.
    await page.keyboard.type(textToType, { delay: 50 });

    console.log('Typing complete!');
    
    // 8. Pause for 10 seconds.
    // This allows the user to see the final WPM results on the screen
    // before the browser automatically closes.
    await new Promise(r => setTimeout(r, 10000));
    
    // 9. Clean up and close the browser instance.
    await browser.close();
}

// 10. Execute the main function.
// .catch() is added to handle any unhandled promise rejections
// or unexpected errors during the async execution.
runMonkeyTyper().catch(err => {
    console.error("An unexpected error occurred:", err);
});