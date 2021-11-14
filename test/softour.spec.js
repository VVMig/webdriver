const { assert } = require('chai')
const webdriver = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const AlertText = require('../enums/AlertText');

describe('Softour test', () => {
  let driver;
  let clickWhenClickable;

  beforeEach(() => {
    driver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();

    clickWhenClickable = async (locator, timeout) => {
      await driver.wait(function () {
        return driver.findElement(locator).then(function (element) {
          return element.click().then(function () {
            return true;
          }, function () {
            return false;
          })
        }, function () {
          return false;
        });
      }, timeout, 'Timeout waiting for ' + locator.value);;
    }
  });

  it('Should display validation alert with correct text', async () => {
    try {
      await driver.get('https://www.softtour.by/hotels/turkey/larissa-blue-3');

      await driver.findElement(By.xpath('//*[@id="tour_182263288"]/td[9]/div')).click();

      await driver.wait(clickWhenClickable(By.xpath('/html/body[@class="cbp-spmenu-push modal-open"]/*[@id="submit_request"]/div/div/div[3]/button[1]'), 10000));

      const alertText = await driver.switchTo().alert().getText();

      assert.equal(alertText, AlertText.PHONE_NUMBER_REQUIRED);
    } finally {
      await driver.quit();
    }
  });
});