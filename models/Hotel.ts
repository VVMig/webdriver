export default class Hotel {
  private url: string;
  private name: string;
  private price: string;

  constructor(url: string, name: string, price: string){
    this.name = name;
    this.price = price;
    this.url = url;
  }

  getUrl() {
    return this.url;
  }
  
  getName() {
    return this.name;
  }

  getPrice() {
    return this.price;
  }

  setUrl(url: string) {
    this.url = url;
  }
  
  setName(name: string) {
    this.name = name;
  }

  setPrice(price: string) {
    this.price = price;
  }
}