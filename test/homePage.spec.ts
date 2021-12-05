import { By, ThenableWebDriver } from "selenium-webdriver";

import { assert } from 'chai';
import * as webdriver from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import 'chromedriver';
import HomePage from '../page/HomePage';
import DriverManager from "../driver/Driver";
import { AlertMessages, contactPhoneNumbers, CountryValues, Currency, CurrencyValueInList, PageTitles, PageUrls } from "../constants";

describe('Home page test', () => {
  let driver: ThenableWebDriver;
  let homePage: HomePage;

  beforeEach(() => {
    driver = new DriverManager().getDriver();

    homePage = new HomePage(driver);
  });

  it('Should display correct phone numbers in contact information modal window', async () => {   
    await homePage.openPage();

    const phoneNumbers = await homePage.getPhoneNumbersFromContactInformationModal();

    assert.deepEqual(phoneNumbers, contactPhoneNumbers);

    await driver.quit();
  });

  it('Should correct send application information', async () => {
    await homePage.openPage();

    await homePage.openApplicationModal();
    await homePage.fillApplicationFormInfo();
    await homePage.submitApplicationFormModal();

    const alertText = await homePage.getTextFromAlert();

    await homePage.dismissAlert();

    await homePage.fillApplicationFormInfo(true);

    await homePage.submitApplicationFormModal();

    
    const url = await homePage.getUrlOfNewTab(PageTitles.CLIENT_REQUEST);

    assert.equal(alertText, AlertMessages.AGREE_CHECK);
    assert.equal(url, PageUrls.CLIENT_REQUEST);

    await driver.quit();
  });

  it('Should have BYN currency by default', async () => {
    await homePage.openPage();

    const hotels = await homePage.getListOfHotels();

    assert.isTrue(hotels.every(hotel => hotel.getPrice().split(' ').reverse()[0] === Currency.BYN));

    await driver.quit();
  });

  it('Should correct change currency to RUB', async () => {
    await homePage.openPage();

    await homePage.changeCurrencyDisplay(CurrencyValueInList.RUB);

    const hotels = await homePage.getListOfHotels();

    assert.isTrue(hotels.every(hotel => hotel.getPrice().split(' ').reverse()[0] === Currency.RUB));

    await driver.quit();
  });

  it('Should redirect to the correct country round selection for Turkey', async () => {
    await homePage.openPage();

    await homePage.fillFormForTour(CountryValues.TURKEY);

    await homePage.submitFormForTour();

    const url = await homePage.getUrlOfNewTab(PageTitles.TURKEY_SELECTION);

    assert.equal(url, PageUrls.TURKEY_SELECTION);

    await driver.quit();
  });

  it('Should redirect to the correct country round selection for Maldive', async () => {
    await homePage.openPage();

    await homePage.fillFormForTour(CountryValues.MALDIVES);

    await homePage.submitFormForTour();

    const url = await homePage.getUrlOfNewTab(PageTitles.MALDIVES_SELECTION);

    assert.equal(url, PageUrls.MALDIVES_SELECTION);

    await driver.quit();
  });
});