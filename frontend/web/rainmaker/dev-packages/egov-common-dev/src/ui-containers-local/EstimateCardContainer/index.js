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

var addInterestToFee = (fees, billDetails) => {
  var totalInterest = 0;
  var feeContainsPtInterest = false;
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
      fee.value = totalInterest.toFixed(2);
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
      value: totalInterest,
    });
  }
  return totalInterest;
};


var addRebateToFee = (fees, billDetails) => {
  var totalRebate = 0;
  
  var feeContainsPtRebate = false;
  var currentYearRebate =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_TIME_REBATE");
  var currentYearInterest =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_TIME_INTEREST")
  var curretFinancialRebate = currentYearRebate[0].amount;
  var curretFinancialInterest = currentYearInterest[0].amount;
  var finalCurrentFinancialCal= curretFinancialRebate+curretFinancialInterest;
  console.log("====currentYearInterest=====",billDetails );
  billDetails.forEach( (billDetail) => {
    billDetail.billAccountDetails.forEach( (billAccountDetail)=> {
      if (billAccountDetail.taxHeadCode === "PT_TIME_REBATE") {
        totalRebate = totalRebate + billAccountDetail.amount;
      }
    });
  });
  
  fees.forEach( (fee)=> {
    if (fee.name.labelKey ==="PT_TIME_REBATE") {
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

  return totalRebate-finalCurrentFinancialCal;
};

var addProRebateToFee = (fees, billDetails) => {
  var totalProRebate = 0;
  
  var feeContainsPtProRebate = false;
  var currentYearRebate =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_TIME_REBATE");
  var currentYearInterest =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_TIME_INTEREST")
  var currentYearProRebate =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_PROMOTIONAL_REBATE")
  
  var curretFinancialRebate = currentYearRebate[0].amount;
  var curretFinancialInterest = currentYearInterest[0].amount;
  var curretFinancialProRebate = currentYearProRebate[0].amount;
  var finalCurrentFinancialCal= curretFinancialInterest+curretFinancialProRebate;
  console.log("====currentYearInterest=====",billDetails );
  billDetails.forEach( (billDetail) => {
    billDetail.billAccountDetails.forEach( (billAccountDetail)=> {
      if (billAccountDetail.taxHeadCode === "PT_PROMOTIONAL_REBATE") {
        totalProRebate= totalProRebate + billAccountDetail.amount;
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

  return totalProRebate-finalCurrentFinancialCal;
};

var addSwatchathaToFee = (fees, billDetails) => {
  var totalSwatchatha = 0;
  
  var feeContainsPtSwatchatha = false;
  var currentYearRebate =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_TIME_REBATE");
  var currentYearInterest =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_TIME_INTEREST");
  var currentYearProRebate =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_PROMOTIONAL_REBATE");
  var currentYearSwatchatha =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "SWATCHATHA_TAX");
  var curretFinancialRebate = currentYearRebate[0].amount;
  var curretFinancialInterest = currentYearInterest[0].amount;
  var curretFinancialProRebate = currentYearProRebate[0].amount;
  var curretFinancialSwatchatha = currentYearSwatchatha[0].amount;
  var finalCurrentFinancialCal= curretFinancialRebate+curretFinancialInterest+curretFinancialProRebate+curretFinancialSwatchatha;
  console.log("====currentYearInterest=====",billDetails );
  billDetails.forEach( (billDetail) => {
    billDetail.billAccountDetails.forEach( (billAccountDetail)=> {
      if (billAccountDetail.taxHeadCode === "SWATCHATHA_TAX") {
        totalSwatchatha = totalSwatchatha + billAccountDetail.amount;
      }
    });
  });
  
  fees.forEach( (fee)=> {
    if (fee.name.labelKey === "SWATCHATHA_TAX") {
      feeContainsPtSwatchatha = true;
      fee.value = totalSwatchatha;
    }
  });
  if (!feeContainsPtSwatchatha) {
    fees.push({
      info: {
        labelKey: "SWATCHATHA_TAX",
        labelName: "SWATCHATHA_TAX"
      },
      name: {
        labelKey: "SWATCHATHA_TAX",
        labelName: "SWATCHATHA_TAX"
      },
      value: totalSwatchatha 
    });
  }

  return totalSwatchatha - finalCurrentFinancialCal;
};
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
  for (let billDetail of billDetails) {
    if(billDetail.fromPeriod < Date.now() && Date.now() < billDetail.toPeriod) {
      current = billDetail.amount;
    }
    totalAmount += billDetail.amount;
    totalAmount = totalAmount;

  }
if(totalAmount>0){
  if(businesService=="PT")
  {
   arrears=totalAmount-current;
   arrears = arrears - addInterestToFee(fees, billDetails);
   arrears = arrears - addRebateToFee(fees, billDetails);
   arrears = arrears - addProRebateToFee(fees, billDetails);
   arrears = arrears - addSwatchathaToFee(fees, billDetails);
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
