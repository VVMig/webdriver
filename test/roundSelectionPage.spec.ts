import { By, ThenableWebDriver } from "selenium-webdriver";

import { assert } from 'chai';
import * as webdriver from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import 'chromedriver';
import HomePage from '../page/HomePage';
import DriverManager from "../driver/Driver";
import { AlertMessages, contactPhoneNumbers, CountryValues, Currency, CurrencyValueInList, PageTitles, PageUrls } from "../constants";
import RoundSelectionPage from "../page/RoundSelectionPage";

describe('Round selection page test', () => {
  let driver: ThenableWebDriver;
  let roundSelectionPage: RoundSelectionPage;

  beforeEach(() => {
    driver = new DriverManager().getDriver();

    roundSelectionPage = new RoundSelectionPage(driver);
  });

  afterEach(async () => {
    await driver.quit();
  });

  it('Should display list of hotels', async () => {
    await roundSelectionPage.openPage();

    await roundSelectionPage.submitSearchForm();

    const hotels = await roundSelectionPage.getListOfHotels();

    assert.isTrue(!!hotels.length);
  });

  it('Should search hotels by word', async () => {
    await roundSelectionPage.openPage();

    const findByWords = ['Akas', 'eg', 'ssi', 'aladdin'];

    for await (const word of findByWords) {
      await roundSelectionPage.searchHotelsByName(word);
      const searchResults = await roundSelectionPage.getResultsOfSearchInput();

      assert.isAbove(searchResults.filter(searchResult => searchResult.match(new RegExp(word, 'i'))).length, 0);
    }
  });

  it('Should change url path when Turkey\'s tour selected', async () => {
    await roundSelectionPage.openPage();

    await roundSelectionPage.selectCountryForTour(CountryValues.TURKEY);

    const url = await roundSelectionPage.getCurrentUrl();

    assert.equal(url, PageUrls.TURKEY_SELECTION);
  });

  it('Should change url path when Maldives tour selected', async () => {
    await roundSelectionPage.openPage();

    await roundSelectionPage.selectCountryForTour(CountryValues.MALDIVES);

    const url = await roundSelectionPage.getCurrentUrl();

    assert.equal(url, PageUrls.MALDIVES_SELECTION);
  });

  it('Hotel list should contains hotels from search area', async () => {
    await roundSelectionPage.openPage();

    const searchWord = 'aka'

    await roundSelectionPage.searchHotelsByName(searchWord);
    await roundSelectionPage.selectAllSearchResult();
    await roundSelectionPage.submitSearchForm();

    const hotels = await roundSelectionPage.getListOfHotels();

    assert.isTrue(!!hotels.length);
    assert.isTrue(hotels.every(hotel => hotel.getName().match(new RegExp(searchWord, 'i'))));
  });

  it('Should correct sort up price in range', async () => {
    await roundSelectionPage.openPage();

    const [from, to] = [2500, 2700];

    await roundSelectionPage.submitSearchForm();

    await roundSelectionPage.setFilterPrice(from, to);
    await roundSelectionPage.submitFilter();

    const hotels = await roundSelectionPage.getListOfHotels();

    assert.isTrue(hotels.every(hotel => {
      const price = +hotel.getPrice().match(/.+\d (?=BYN)/g).join().split(' ').join('');

      return price >= from && price <= to;
    }));
  });
});