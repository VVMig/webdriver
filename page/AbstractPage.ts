import { ThenableWebDriver, until } from "selenium-webdriver";
import CustomWaits from "../wait/CustomWaits";

export default abstract class AbstractPage {
  protected driver: ThenableWebDriver;

  constructor(driver: ThenableWebDriver) {
    this.driver = driver;
  }

  abstract openPage(): Promise<this>;

  async getTextFromAlert() {
    const alertText = await this.driver.switchTo().alert().getText();

    return alertText;
  }

  async dismissAlert() {
    await this.driver.switchTo().alert().dismiss();

    return this;
  }

  async getUrlOfNewTab(tabTitle: string) {
    await CustomWaits.waitNewTabLoaded(this.driver, tabTitle);

    return (await this.driver.getCurrentUrl());
  }

  async getCurrentUrl(){
    return (await this.driver.getCurrentUrl());
  }
}