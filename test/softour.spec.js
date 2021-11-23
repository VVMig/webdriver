const { assert } = require('chai')
const webdriver = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const AlertText = require('../enums/AlertText');
const HomePage = require('../page/HomePage');

describe('Softour test', () => {
  let driver;

  beforeEach(() => {
    const options = new chrome.Options();

    options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage")

    driver = new webdriver.Builder()
      .forBrowser('chrome')
      // .setChromeOptions(options)
      .build();

    driver.manage().window().maximize();
  });

  it('Should open home page', async () => {
    try {
      const homePage = new HomePage(driver);

      await homePage.openHomePage();
    } finally {
      await driver.quit();
    }
  });

  it('Should display correct alert message when phone number have not provided', async () => {
    try {
      const homePage = new HomePage(driver);

      await homePage.openHomePage();

      await homePage.findElementByLocatorAndClick(homePage.leftApplicationButton);

      await homePage.clickWhenClickable(homePage.dialogWindowSendRequestButton, 10000);

      const alertText = await homePage.getAlertText();

      assert.equal(`${alertText}`, AlertText.PHONE_NUMBER_REQUIRED);
    } finally {
      await driver.quit();
    }
  });
});