export default class ApplicationCreator {
  static readonly ApplicationName = 'AUTO_TESTING';
  static readonly ApplicationPhoneNumber = '+375665421269';
  static readonly ApplicationNote = 'This message from testing course please do not reply on it';
  
  public static getApplicationFormData() {
    return {
      name: this.ApplicationName,
      phoneNumber: this.ApplicationPhoneNumber,
      note: this.ApplicationNote
    }
  }
}