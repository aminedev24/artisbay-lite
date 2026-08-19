const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000; // Change this to your desired port

// Enable CORS for all routes
app.use(cors());

// Scrape exchange rate
const scrapeExchangeRate = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Set a custom user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    // Navigate to the target website
    await page.goto('https://www.sbishinseibank.co.jp/english/gaika/exchange_rate_fx.html', {
      waitUntil: 'networkidle2',
    });

    // Wait for the specific element to load
    await page.waitForSelector('span[data-interestrate_sre="Fxrate_N_USD_sellrate"]', {
      timeout: 5000,
    });

    // Extract the content of the element
    const rate = await page.$eval(
      'span[data-interestrate_sre="Fxrate_N_USD_sellrate"]',
      (el) => el.textContent.trim()
    );

    console.log('Scraped Exchange Rate:', rate);
    return rate;
  } catch (error) {
    console.error('Error scraping exchange rate:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// API endpoint to fetch exchange rate
app.get('/api/exchange-rate', async (req, res) => {
  const rate = await scrapeExchangeRate();
  if (rate) {
    res.json({ rate });
  } else {
    res.status(500).json({ error: 'Failed to fetch exchange rate' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});