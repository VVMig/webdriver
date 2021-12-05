import { By, ThenableWebDriver, until, WebElementPromise } from 'selenium-webdriver';
import { CountryValues, Currency, CurrencyValueInList } from '../constants';
import Hotel from '../models/Hotel';
import ApplicationCreator from '../service/ApplicationCreator';
import CustomWaits from '../wait/CustomWaits';
import BasePage from './AbstractPage';

export default class HomePage extends BasePage  { 
  private URL = 'https://www.softtour.by/';
  private lineUpButton: WebElementPromise;
  private yourApplicationButton: WebElementPromise;
  private contactInformationButton: WebElementPromise;
  private showButton: WebElementPromise;
  private selectCurrencyOptions: WebElementPromise;
  
  constructor (driver: ThenableWebDriver) {
    super(driver);

    this.contactInformationButton = driver.findElement(By.className('button submit_phone'));
    this.yourApplicationButton = driver.findElement(By.className('button submit_request'));
    this.showButton = driver.findElement(By.id('search_button'));
    this.selectCurrencyOptions = driver.findElement(By.xpath('//*[@id="show-mobile-filter"]/div[2]/div[3]/div[1]/div[4]/div'));
    this.lineUpButton = driver.findElement(By.xpath('//*[@id="formpoisk"]//input[@value="ПОДОБРАТЬ"]'));
  }

  async openPage() {
    await this.driver.get(this.URL);

    if(!(await this.driver.findElement(By.id('slider')))) {
      throw new Error('Home page have not been opened');
    }

    return this;
  }

  async openContactInformationModal() {
    await this.contactInformationButton.click();

    await CustomWaits.waitUntilElementIsVisible(this.driver, By.id('submit_phone'));

    return this;
  }

  async getPhoneNumbersFromContactInformationModal() {
    let phoneNumbers: string[] = [];

    await this.openContactInformationModal();
    
    const phoneNumbersBlock = await this.driver.findElements(By.xpath('//*[@id="submit_phone"]//*[@class="form-group"]//a'));

    for await (const phoneNumber of phoneNumbersBlock) {
      phoneNumbers.push((await phoneNumber.getText()));
    }

    await this.closeContactInformationModal();


    return phoneNumbers.filter(elPhoneNumber => !!elPhoneNumber).map(el => el.trim());
  }

  async closeContactInformationModal() {
    await this.driver.findElement(By.xpath('//*[@id="submit_phone"]//*[@class="button"]')).click();

    return this;
  }

  async openApplicationModal() {
    await this.yourApplicationButton.click();

    await CustomWaits.waitUntilElementIsVisible(this.driver, By.id('submit_request'));

    return this;
  }

  async submitApplicationFormModal() {
   await this.driver.findElement(By.xpath('//*[@id="submit_request"]//*[@class="modal-footer"]/button')).click();
   
   return this;
  }

  async fillApplicationFormInfo(withAgree: boolean = false) {
    const nameInput = await this.driver.findElement(By.id('contact-name'));
    const phoneInput =  await this.driver.findElement(By.id('contact-phone'));
    const noteInput = await this.driver.findElement(By.id('note'));
    const agreeCheckbox = await this.driver.findElement(By.xpath('//label[@for="contact-personal-data"]'));

    await nameInput.clear();
    await phoneInput.clear();
    await noteInput.clear();

    await nameInput.sendKeys(ApplicationCreator.ApplicationName);
    await phoneInput.sendKeys(ApplicationCreator.ApplicationPhoneNumber);
    await noteInput.sendKeys(ApplicationCreator.ApplicationNote);

    if(withAgree) {
      await agreeCheckbox.click();
    }

    return this;
  }


  async getListOfHotels() {
    const hotels: Hotel[] = [];

    const hotelUrls = await Promise.all((await this.driver.findElements(By.xpath('//*[@class="tour-title"]//a'))).map(hotelUrl => hotelUrl.getAttribute('href')));
    const hotelNames = await Promise.all((await this.driver.findElements(By.xpath('//*[@class="tour-title"]//a'))).map(hotelName => hotelName.getText()));
    const hotelPrices = await Promise.all((await this.driver.findElements(By.xpath('//*[@class="price-block"]//*[@class="new"]'))).map(hotelPrice => hotelPrice.getText()));

    for (let i = 0; i < hotelUrls.length; i++) {
      hotels.push(new Hotel(hotelUrls[i], hotelNames[i], hotelPrices[i]))
    }

    return hotels;
  }

  async changeCurrencyDisplay(currencyIndex: CurrencyValueInList) {
    await this.selectCurrencyOptions.click();

    await CustomWaits.waitUntilElementIsVisible(this.driver, By.className('select open'));

    const option = await this.driver.findElement(By.xpath(`//*[@class="search-section"]//*[@data-value="${currencyIndex}"]`));

    await option.click();

    await this.showButton.click();

    await CustomWaits.waitUntilCondition(this.driver, async () => {
      const element = await this.driver.findElement(By.id('loadingBar')).isDisplayed();

      return !element;
    });

    return this;
  }

  async fillFormForTour(destination: CountryValues) {
    await this.driver.findElement(By.xpath('//*[@id="formpoisk"]/div[1]/div/div[2]/div/span')).click();

    await CustomWaits.waitUntilElementIsVisible(this.driver, By.xpath('//*[@id="formpoisk"]//*[@class="select open"]'));

    await this.driver.findElement(By.xpath(`//*[@data-value="${destination}"]`)).click();

    return this;
  }

  async submitFormForTour() {
    await this.lineUpButton.click();

    return this;
  }
}

