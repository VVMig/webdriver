import { By, ThenableWebDriver, WebElementPromise } from "selenium-webdriver";
import { CountryValues, PageTitles } from "../constants";
import Hotel from "../models/Hotel";
import CustomWaits from "../wait/CustomWaits";
import AbstractPage from "./AbstractPage";

export default class RoundSelectionPage extends AbstractPage {
  private URL = 'https://www.softtour.by/round-selection';
  private searchButton: WebElementPromise;
  private hotelSearchInput: WebElementPromise;
  private countrySelectInput: WebElementPromise;

  constructor(driver: ThenableWebDriver) {
    super(driver);

    this.searchButton = driver.findElement(By.id('search_button'));
    this.hotelSearchInput = driver.findElement(By.id('hotelsearch'));
    this.countrySelectInput = driver.findElement(By.className('select countries'));
  }

  async openPage() {
    await this.driver.get(this.URL);
    const title = await this.driver.findElement(By.xpath('//*[@class="title"]/h1')).getText();

    if(title !== PageTitles.ROUND_SELECTION) {
      throw new Error('Round page have not been opened');
    }

    return this;
  }

  async submitSearchForm() {
    await this.searchButton.click();

    await CustomWaits.waitUntilCondition(this.driver, async () => {
      const isDipslayed = await this.driver.findElement(By.id('progress'))?.isDisplayed();

      return !isDipslayed;
    }, 10000*60);

    return this;
  }

  async submitFilter() {
    await this.driver.findElement(By.xpath('//*[@title="Применить фильтр"]')).click();

    await CustomWaits.waitUntilCondition(this.driver, async () => {
      return !(await this.driver.findElement(By.id('loadingBar')).isDisplayed());
    });
    return this;
  }

  async getListOfHotels() {
    const hotels: Hotel[] = [];

    const hotelNames = await Promise.all((await this.driver.findElements(By.xpath('//*[@id="rezults_search"]/div[4]/table//tbody//tr[position() mod 2 = 1 and position()]/td[5]//a'))).map(hotel => hotel.getText()));
    const hotelUrls = await Promise.all((await this.driver.findElements(By.xpath('//*[@id="rezults_search"]/div[4]/table//tbody//tr[position() mod 2 = 1 and position()]/td[5]//a'))).map(hotel => hotel.getAttribute('href')));
    const hotelPrices = await Promise.all((await this.driver.findElements(By.xpath('//*[@id="rezults_search"]/div[4]/table//tbody//tr[position() mod 2 = 1 and position()]/td[10]'))).map(hotel => hotel.getText()));

    for (let i = 0; i < hotelUrls.length; i++) {
      hotels.push(new Hotel(hotelUrls[i], hotelNames[i], hotelPrices[i]))
    }

    return hotels;
  }

  async searchHotelsByName(hotelName: string) {
    await this.hotelSearchInput.clear();
    await this.hotelSearchInput.sendKeys(hotelName);

    return this;
  }

  async getResultsOfSearchInput() {
    const searchResults = await Promise.all((await this.driver.findElements(By.xpath('//*[@class="st-listbox-content"][@style="display: block;"]'))).map(name => name.getText()));

    return searchResults;
  }

  async selectCountryForTour(country: CountryValues) {
    await this.countrySelectInput.click();

    await CustomWaits.waitUntilElementIsVisible(this.driver, By.className('select countries open'));

    await this.driver.findElement(By.xpath(`//*[@data-value="${country}"]`)).click();

    await CustomWaits.waitUntilCondition(this.driver, async () => {
      await new Promise((res) => {
        setTimeout(() => {
          res('load')
        }, 2000);
      });

      return true;
    });

    return this;
  }

  async selectAllSearchResult() {
    const searchResults = await this.driver.findElements(By.xpath('//*[@class="st-listbox-content"][@style="display: block;"]'));

    for await (const searchResult of searchResults) {
      await searchResult.click();
    }

    return this;
  }

  async setFilterPrice(from?: number, to?: number) {
    const fromPrice = await this.driver.findElement(By.xpath('//*[@id="92e877321b4ae9f86d732d7e3dca594d"]/table/tbody/tr[2]/td[9]/input'));
    const toPrice = await this.driver.findElement(By.xpath('//*[@id="92e877321b4ae9f86d732d7e3dca594d"]/table/tbody/tr[2]/td[10]/input'));

    await fromPrice.clear();
    await toPrice.clear();

    await fromPrice.sendKeys(from);
    await toPrice.sendKeys(to);

    return this;
  }
}