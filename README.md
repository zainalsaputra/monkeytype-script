# Monkeytype Puppeteer Automation Script

A Node.js script that utilizes Puppeteer to automate typing tests on monkeytype.com.

This project was developed for educational purposes, specifically to demonstrate how Puppeteer can automate browser input at a level that is recognized as "trusted" by the browser (bypassing the `event.isTrusted` check).

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18.x or later)
* npm (which is included with Node.js)

## 🚀 Installation

1.  Clone this repository or create a new directory and place the `index.js` script inside it.
2.  Open your terminal and navigate to the project's root directory.
3.  Initialize a new Node.js project:
    ```bash
    npm init -y
    ```
4.  Install the required Puppeteer dependency:
    ```bash
    npm install puppeteer
    ```
    This command will download both the Puppeteer library and a compatible version of Chromium.

## ▶️ Usage

1.  Execute the script from your terminal:
    ```bash
    node index.js
    ```
2.  The script will launch a new Chromium browser window (in non-headless mode) and navigate to `https://monkeytype.com`.
3.  The terminal will display the following message:
    ```
    You have 5 seconds to click/setup in the browser...
    ```
4.  During this 5-second window, you **must** click inside the browser window to focus the test and ensure it is active.
5.  After the delay, the script will:
    * Scrape all visible words from the test interface.
    * Begin typing the words using `page.keyboard.type()`, simulating human-like input with a 50ms delay between keystrokes.
6.  Upon completion, the script will pause for 10 seconds to allow for result inspection before automatically closing the browser.

## ⚠️ Disclaimer

This project is provided strictly for **educational and technical demonstration purposes**. Using automation scripts to falsify results on leaderboards violates the terms of service of most platforms, including Monkeytype. This script is intended to illustrate browser automation concepts, not to facilitate cheating. Please use responsibly.