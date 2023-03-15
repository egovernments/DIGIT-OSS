class DummyBillService {

  getSupportedServicesAndMessageBundle() {
    let services = [ 'WS', 'PT', 'TL', 'FNOC', 'BPA' ];
    let messageBundle = {
      WS: {
        en_IN: 'Water and Sewerage Bill'
      },
      PT: {
        en_IN: 'Property Tax'
      },
      TL: {
        en_IN: 'Trade License Fees'
      },
      FNOC: {
        en_IN: 'Fire NOC Fees'
      },
      BPA: {
        en_IN: 'Building Plan Scrutiny Fees'
      }
    }

    return { services, messageBundle };
  }

  getSearchOptionsAndMessageBundleForService(service) {
    let messageBundle = {
      mobile: {
        en_IN: 'Search 🔎 using Mobile No.📱'
      },
      connectionNumber: {
        en_IN: 'Search 🔎 using Connection No.'
      },
      consumerNumber: {
        en_IN: 'Search 🔎 using Consumer Number'
      },
      propertyId: {
        en_IN: 'Search 🔎 using Property ID'
      },
      tlApplicationNumber: {
        en_IN: 'Search 🔎 using Trade License Application Number'
      },
      nocApplicationNumber: {
        en_IN: 'Search 🔎 using NOC Application Number'
      },
      bpaApplicationNumber: {
        en_IN: 'Search 🔎 using BPA Application Number'
      }
    }
    let searchOptions = [];
    if(service === 'WS') {
      searchOptions = [ 'mobile', 'connectionNumber', 'consumerNumber' ];
    } else if(service === 'PT') {
      searchOptions = [ 'mobile', 'propertyId', 'consumerNumber' ];
    } else if(service === 'TL') {
      searchOptions = [ 'mobile', 'tlApplicationNumber' ];
    } else if(service === 'FNOC') {
      searchOptions = [ 'mobile', 'nocApplicationNumber' ];
    } else if(service === 'BPA') {
      searchOptions = [ 'mobile', 'bpaApplicationNumber' ];
    }

    return { searchOptions, messageBundle };
  }

  getOptionAndExampleMessageBundle(service, searchParamOption) {
    let option = {
      en_IN: 'Mobile Number'
    };
    let example = {
      en_IN: 'Do not use +91 or 0 before mobile number.'
    }
    return { option, example };
  }

  validateParamInput(service, searchParamOption, paramInput) {
    if(searchParamOption === 'mobile') {
      let regexp = new RegExp('^[0-9]{10}$');
      return regexp.test(paramInput)
    }
    return true;
  }

  async fetchBillsForUser(user, locale) {
    let randomUserBehaviour = parseInt(Math.random() * 5);
    console.log(randomUserBehaviour);

    let results = [
      {
        service: 'Water & Sewerage',
        id: 'WS123456',
        secondaryInfo: 'Ajit Nagar,  Phagwara',
        dueAmount: '630',
        dueDate: '25/06/20',
        period: 'Apr-June 2020',
        paymentLink: 'https://mseva.org/pay/132'
      },
      {
        service: 'Property Tax',
        id: 'PT123456',
        secondaryInfo: 'Ajit Nagar,  Phagwara',
        dueAmount: '1500',
        dueDate: '25/06/20',
        period: 'Apr-June 2020',
        paymentLink: 'https://mseva.org/pay/132'
      },
      {
        service: 'Water & Sewerage',
        id: 'WS654321',
        secondaryInfo: 'Singh Colony,  Phagwara',
        dueAmount: '1200',
        dueDate: '25/06/20',
        period: 'Apr-June 2020',
        paymentLink: 'https://mseva.org/pay/132'
      },
      {
        service: 'Property Tax',
        id: 'PT123456',
        secondaryInfo: 'Singh Colony,  Phagwara',
        dueAmount: '1000',
        dueDate: '25/06/20',
        period: 'Apr-June 2020',
        paymentLink: 'https://mseva.org/pay/132'
      }
    ]

    if(randomUserBehaviour === 0) {     // Pending bills exist
      return {
        pendingBills: results,
        totalBills: 10
      }
    } else  if(randomUserBehaviour === 1) { 
      results = results.slice(0, 2);
      return {
        pendingBills: results,
        totalBills: 10
      }
    } else if(randomUserBehaviour === 2) {
      results = results.slice(0, 1);
      return {
        pendingBills: results,
        totalBills: 10
      }
    } else  if(randomUserBehaviour === 3) {
      return {                        // mobile number not linked with any bills
        totalBills: 0,
        pendingBills: undefined
      }
    } else {
      return {
        totalBills: 2,              // No pending, but previous bills do exist
        pendingBills: undefined     // This is so that user doesn't get message saying 'your mobile number is not linked', but rather a message saying 'No pending dues'
      }                             // Not present in PRD. To be discussed with Product Manager.
    }
  }

  async fetchBillsForParam(user, service, paramOption, paramInput) {
      console.log(`Received params: ${user}, ${service}, ${paramOption}, ${paramInput}`);
      let billsForUser = await this.fetchBillsForUser(user);
      return billsForUser.pendingBills;
  }

}

module.exports = new DummyBillService();