import { ThenableWebDriver } from "selenium-webdriver";
import * as webdriver from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import 'chromedriver';

export default class DriverManager {
  private driver: ThenableWebDriver;

  getDriver(): ThenableWebDriver {
    const options = new chrome.Options();

    options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage")

    this.driver = new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    this.driver.manage().window().maximize();

    return this.driver;
  }

  closeDriver(): void {
    this.driver.quit();
  }
}