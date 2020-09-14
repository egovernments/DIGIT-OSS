import React, { Component } from "react";
import { FeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

class EstimateCardContainer extends Component {

  render() { 

    return <FeesEstimateCard estimate={this.props.estimate} />;
  }
}

const sortBillDetails = (billDetails = []) => {
  let sortedBillDetails = [];
  sortedBillDetails = billDetails.sort((x, y) => y.fromPeriod - x.fromPeriod);
  return sortedBillDetails;
}
const formatTaxHeaders = (billDetail = {},businesService) => {

  let formattedFees = []
  const { billAccountDetails = [], fromPeriod, toPeriod } = billDetail;
  formattedFees = billAccountDetails.map((taxHead) => {
    return {
      info: {
        labelKey: taxHead.taxHeadCode,
        labelName: taxHead.taxHeadCode
      },
      name: {
        labelKey: taxHead.taxHeadCode,
        labelName: taxHead.taxHeadCode
      },
      value: ((fromPeriod < Date.now() && Date.now() < toPeriod) || businesService!="PT") ? taxHead.amount : 0
    }
  })
  formattedFees.reverse();
  return formattedFees;
}

 const addInterestToFee = (fees, billDetails) => {
  let totalInterest = 0;
  let feeContainsPtInterest = false;
  let currentYearInterest =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_TIME_INTEREST");
  
  billDetails.forEach( (billDetail) => {
    billDetail.billAccountDetails.forEach( (billAccountDetail)=> {
      if (billAccountDetail.taxHeadCode === "PT_TIME_INTEREST") {
        totalInterest = totalInterest + billAccountDetail.amount;
      }
    });
  });
  fees.forEach( (fee)=> {
    if (fee.name.labelKey === "PT_TIME_INTEREST") {
      feeContainsPtInterest = true;
      fee.value = totalInterest;
    }
  });
  if (!feeContainsPtInterest) {
    fees.push({
      info: {
        labelKey: "PT_TIME_INTEREST",
        labelName: "PT_TIME_INTEREST"
      },
      name: {
        labelKey: "PT_TIME_INTEREST",
        labelName: "PT_TIME_INTEREST"
      },
      value: totalInterest
    });
  }
  return totalInterest -currentYearInterest.length === 0 ? 0 : currentYearInterest[0].amount;
}; 

 const addRebateToFee = (fees, billDetails) => {
  let totalRebate = 0;
  let feeContainsPtRebate = false;
  let currentYearRebate =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_TIME_REBATE");
  billDetails.forEach( (billDetail) => {
    billDetail.billAccountDetails.forEach( (billAccountDetail)=> {
      if (billAccountDetail.taxHeadCode === "PT_TIME_REBATE") {
        totalRebate = totalRebate + billAccountDetail.amount;
      }
    });
  });
  fees.forEach( (fee)=> {
    if (fee.name.labelKey === "PT_TIME_REBATE") {
      feeContainsPtRebate = true;
      fee.value = totalRebate;
    }
  });
  if (!feeContainsPtRebate) {
    fees.push({
      info: {
        labelKey: "PT_TIME_REBATE",
        labelName: "PT_TIME_REBATE"
      },
      name: {
        labelKey: "PT_TIME_REBATE",
        labelName: "PT_TIME_REBATE"
      },
      value: totalRebate
    });
  }
  
  return totalRebate-currentYearRebate.length === 0 ? 0 :currentYearRebate[0].amount;
}; 
 const addProRebateToFee = (fees, billDetails) => {
  let totalProRebate = 0;
  let feeContainsPtProRebate = false;
  let currentYearProRebate =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_PROMOTIONAL_REBATE");
   billDetails.forEach( (billDetail) => {
    billDetail.billAccountDetails.forEach( (billAccountDetail)=> {
      if (billAccountDetail.taxHeadCode === "PT_PROMOTIONAL_REBATE") {
        totalProRebate = totalProRebate + billAccountDetail.amount;
      }
    });
  });
  fees.forEach( (fee)=> {
    if (fee.name.labelKey === "PT_PROMOTIONAL_REBATE") {
      feeContainsPtProRebate = true;
      fee.value = totalProRebate;
    }
  });
  if (!feeContainsPtProRebate) {
    fees.push({
      info: {
        labelKey: "PT_PROMOTIONAL_REBATE",
        labelName: "PT_PROMOTIONAL_REBATE"
      },
      name: {
        labelKey: "PT_PROMOTIONAL_REBATE",
        labelName: "PT_PROMOTIONAL_REBATE"
      },
      value: totalProRebate
    });
  }

  return totalProRebate-currentYearProRebate.length === 0 ? 0 :currentYearProRebate[0].amount;
} 
 const addSwatToFee = (fees, billDetails) => {
  let totalSwat = 0;
  let feeContainsPtSwat= false;
  let currentYearSwat =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "SWATCHATHA_TAX");
   billDetails.forEach( (billDetail) => {
    billDetail.billAccountDetails.forEach( (billAccountDetail)=> {
      if (billAccountDetail.taxHeadCode === "SWATCHATHA_TAX") {
        totalSwat = totalSwat + billAccountDetail.amount;
      }
    });
  });
  fees.forEach( (fee)=> {
    if (fee.name.labelKey === "SWATCHATHA_TAX") {
      feeContainsPtSwat = true;
      fee.value = totalSwat;
    }
  });
  if (!feeContainsPtSwat) {
    fees.push({
      info: {
        labelKey: "SWATCHATHA_TAX",
        labelName: "SWATCHATHA_TAX"
      },
      name: {
        labelKey: "SWATCHATHA_TAX",
        labelName: "SWATCHATHA_TAX"
      },
      value: totalSwat
    });
  }

  return totalSwat-currentYearSwat.length === 0 ? 0 :currentYearSwat[0].amount;
} 
const mapStateToProps = (state, ownProps) => {

  const { screenConfiguration } = state;
  const { cities } = state.common;
  const tenantId = get(screenConfiguration, "preparedFinalObject.ReceiptTemp[0].instrument.tenantId")

  let tenantInfo = cities && cities.filter(e => e.key === tenantId );  


  let contactNumber = get(tenantInfo[0], "contactNumber");  
 
  let email =  get(tenantInfo[0], "emailId");  

  const businesService=get(screenConfiguration, "preparedFinalObject.ReceiptTemp[0].Bill[0].businessService");
  const fees = formatTaxHeaders(sortBillDetails(get(screenConfiguration, "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails", []))[0],businesService);  // const fees = get(screenConfiguration, "preparedFinalObject.applyScreenMdmsData.estimateCardData", []);
  const billDetails = get(screenConfiguration, "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails", []);
  let totalAmount = 0;
  let current = 0;
  let arrears=0;
  if(businesService=="PT")
  {
  for (let i = 1; i<billDetails.length;i++) {
      for (let j = 0; j<billDetails[i].billAccountDetails.length;j++)
      {
        if(billDetails[i].billAccountDetails[j].taxHeadCode=== "PT_TAX")
        {      
          arrears = arrears+ billDetails[i].billAccountDetails[j].amount;                  
        } 
    }
    
  }
  for (let i = 0; i<billDetails.length;i++) {
    totalAmount = totalAmount + billDetails[i].amount;   
  }
   addInterestToFee(fees, billDetails);
   addRebateToFee(fees, billDetails);
   addProRebateToFee(fees, billDetails);
   addSwatToFee(fees, billDetails);
   
}
else
{ 
 for (let billDetail of billDetails) {
  if(billDetail.fromPeriod < Date.now() && Date.now() < billDetail.toPeriod) {
    current = billDetail.amount; 
    }
    totalAmount += billDetail.amount;
  }
} 




  const estimate = {
    header: { labelName: "Fee Estimate", labelKey: "NOC_FEE_ESTIMATE_HEADER" },
    fees,
    totalAmount: totalAmount.toFixed(2),
    arrears : arrears.toFixed(2),
    businesService, contactNumber, email
  };
  return { estimate};
};

export default connect(
  mapStateToProps,
  null
)(EstimateCardContainer);
