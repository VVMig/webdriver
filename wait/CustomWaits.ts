import { Condition, Locator, ThenableWebDriver, until, WebDriver } from "selenium-webdriver";

export default class CustomWaits {
  static readonly TIMEOUT = 10000;

  static async waitUntilElementIsVisible(driver:ThenableWebDriver, locator: Locator, timeout = CustomWaits.TIMEOUT) {
    await driver.wait(until.elementIsVisible(driver.findElement(locator)), timeout);
  }

  static async waitNewTabLoaded(driver: ThenableWebDriver, tabTitle: string, timeout = CustomWaits.TIMEOUT) {
    const originalWindow = await driver.getWindowHandle();

    await driver.wait(
    async () => (await driver.getAllWindowHandles()).length === 2,
    timeout
    );

    const windows = await driver.getAllWindowHandles();

    windows.forEach(async handle => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });

    await driver.wait(until.titleIs(tabTitle), timeout);
  }

  static async waitUntilCondition(driver: ThenableWebDriver, condition: Function | PromiseLike<boolean> | Condition<boolean> | ((driver: WebDriver) => boolean | PromiseLike<boolean>), timeout = CustomWaits.TIMEOUT) {
    await driver.wait(condition, timeout)
  }
}