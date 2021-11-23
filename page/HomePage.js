const { By, until } = require('selenium-webdriver');

class HomePage {
  constructor(driver) {
    this.HOMEPAGE_URL = "https://www.softtour.by/";

    this.driver = driver;

    this.leftApplicationButton = By.xpath('//*[@id="tour_182512792"]/div[2]/div[10]/div[2]/button[1]');

    this.dialogWindowSendRequestButton = By.xpath('//*[@id="submit_request"]/div/div/div[3]/button[1]');

    this.homePageSlider = By.xpath('//*[@id="slider"]');
  }

  async openHomePage() {
    await this.driver.get(this.HOMEPAGE_URL);

    await this.driver.wait(until.elementLocated(this.homePageSlider), 10000);

    return this;
  }

  async clickWhenClickable(locator, timeout) {
    await this.driver.wait(() => {
      return this.driver.findElement(locator).then(element => {
        return element.click().then(() => true, () => false)
      }, () => false);
    }, timeout, 'Timeout waiting for ' + locator.value);

    return this;
  }

  async findElementByLocatorAndClick(locator) {
    await this.driver.findElement(locator).click();

    return this;
  }

  async getAlertText() {
    const alertText = await this.driver.switchTo().alert().getText();

    return alertText;
  }
};

module.exports = HomePage;