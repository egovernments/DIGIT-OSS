import React, { Component } from "react";
import { FeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import {getFinalData} from "egov-ui-kit/utils/localStorageUtils";
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
      value: ((fromPeriod < Date.now() && Date.now() < toPeriod) || businesService!="PT") ? billDetail.amount!==0 ? taxHead.amount : 0 :0
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
    if(billDetail.amount!==0)
    {
    billDetail.billAccountDetails.forEach( (billAccountDetail)=> {
      if (billAccountDetail.taxHeadCode === "PT_TIME_INTEREST") {
        totalInterest = totalInterest + billAccountDetail.amount;
      }
    });
  }
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
  return totalInterest -currentYearInterest.length === 0 ? 0 :  currentYearInterest[0] && currentYearInterest[0].amount;
}; 

const addRoundOffToFee = (fees, billDetails) => {
  let totalRoundOff = 0;
  let feeContainsRoundOff = false;
  
  billDetails.forEach( (billDetail) => {
    if(billDetail.amount!==0)
    {
    billDetail.billAccountDetails.forEach( (billAccountDetail)=> {
      if (billAccountDetail.taxHeadCode === "PT_ROUNDOFF") {
        totalRoundOff = totalRoundOff + billAccountDetail.amount;
      }
    });
  }
  });
  fees.forEach( (fee)=> {
    if (fee.name.labelKey === "PT_ROUNDOFF") {
      feeContainsRoundOff = true;
      fee.value = totalRoundOff;
    }
  });
  if (!feeContainsRoundOff) {
    fees.push({
      info: {
        labelKey: "PT_ROUNDOFF",
        labelName: "PT_ROUNDOFF"
      },
      name: {
        labelKey: "PT_ROUNDOFF",
        labelName: "PT_ROUNDOFF"
      },
      value: totalRoundOff
    });
  }
};

 const addRebateToFee = (fees, billDetails) => {
  let totalRebate = 0;
  let feeContainsPtRebate = false;
  let currentYearRebate =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_TIME_REBATE");
  billDetails.forEach( (billDetail) => {
    if(billDetail.amount!==0)
    {
    billDetail.billAccountDetails.forEach( (billAccountDetail)=> {
      if (billAccountDetail.taxHeadCode === "PT_TIME_REBATE") {
        totalRebate = totalRebate + billAccountDetail.amount;
      }
    });
   }
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
  
  return totalRebate-currentYearRebate.length === 0 ? 0 : currentYearRebate[0] && currentYearRebate[0].amount;
}; 
 const addProRebateToFee = (fees, billDetails) => {
  let totalProRebate = 0;
  let feeContainsPtProRebate = false;
  let currentYearProRebate =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "PT_PROMOTIONAL_REBATE");
   billDetails.forEach( (billDetail) => {
    if(billDetail.amount!==0)
    {
    billDetail.billAccountDetails.forEach( (billAccountDetail)=> {
      if (billAccountDetail.taxHeadCode === "PT_PROMOTIONAL_REBATE") {
        totalProRebate = totalProRebate + billAccountDetail.amount;
      }
    });
   }
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

   return totalProRebate-currentYearProRebate.length === 0 ? 0 : currentYearProRebate[0] && currentYearProRebate[0].amount;
} 
 const addSwatToFee = (fees, billDetails) => {
  let totalSwat = 0;
  let feeContainsPtSwat= false;
  let currentYearSwat =billDetails[0].billAccountDetails && billDetails[0].billAccountDetails.filter(item => item.taxHeadCode === "SWATCHATHA_TAX");
   billDetails.forEach( (billDetail) => {
    if(billDetail.amount!==0)
    {
    billDetail.billAccountDetails.forEach( (billAccountDetail)=> {
      if (billAccountDetail.taxHeadCode === "SWATCHATHA_TAX") {
        totalSwat = totalSwat + billAccountDetail.amount;
      }
    });
   }
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

  return totalSwat-currentYearSwat.length === 0 ? 0 :currentYearSwat[0] && currentYearSwat[0].amount;
} 

const calcTax = (fees, billDetails) => {
  let finalTaxamount = 0;
  let curretYearTax = 0
  let curretYearRebate = 0
  let curretYearPromotionalRebate = 0  

    if(billDetails[0] && billDetails[0].amount!==0)
    {
      billDetails[0].billAccountDetails.forEach( (billAccountDetail)=> {
   
        if (billAccountDetail.taxHeadCode === "PT_PROMOTIONAL_REBATE") {
          curretYearRebate = billAccountDetail.amount;
        }
        if (billAccountDetail.taxHeadCode === "PT_TIME_REBATE") {
          curretYearPromotionalRebate = billAccountDetail.amount;
        }
        if (billAccountDetail.taxHeadCode === "PT_TAX") {
          curretYearTax = billAccountDetail.amount;
        }
      });
    }

  
  finalTaxamount = curretYearTax+curretYearRebate+curretYearPromotionalRebate;

  fees.forEach( (fee)=> {

    if (fee.name.labelKey === "PT_TAX" && finalTaxamount===0 ) {
      fee.value = 0;
    }
    if (fee.name.labelKey === "PT_TIME_REBATE" && finalTaxamount===0 ) {
      fee.value = 0;
    }
    if (fee.name.labelKey === "PT_PROMOTIONAL_REBATE" && finalTaxamount===0 ) {
      fee.value = 0;
    }
  });

  return fees;
}; 

const mapStateToProps = (state, ownProps) => {

  const { screenConfiguration } = state;
  const { cities } = state.common;
  const tenantId = get(screenConfiguration, "preparedFinalObject.ReceiptTemp[0].instrument.tenantId")

  let tenantInfo = cities && cities.filter(e => e.key === tenantId );  


  let contactNumber = get(tenantInfo[0], "contactNumber");  
 
  let email =  get(tenantInfo[0], "emailId");  

  const businesService=get(screenConfiguration, "preparedFinalObject.ReceiptTemp[0].Bill[0].businessService");
  let fees = formatTaxHeaders(sortBillDetails(get(screenConfiguration, "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails", []))[0],businesService);  // const fees = get(screenConfiguration, "preparedFinalObject.applyScreenMdmsData.estimateCardData", []);

  const billDetails = get(screenConfiguration, "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails", []);
  let totalAmount = 0;
  let current = 0;
  let arrears=0;
  let Rebate = 0
  let PromotionalRebate = 0  
  let finalarrears = 0

  const finalData=getFinalData();

  const latestYear = finalData[0].fromDate;
  if(businesService=="PT")
  {

  /* for (let i = 0; billDetails && i<billDetails.length;i++) {
      for (let j = 0; billDetails[i].billAccountDetails && j<billDetails[i].billAccountDetails.length;j++)
      {
        if(billDetails[i].billAccountDetails[j].taxHeadCode=== "PT_TAX")
        {      
          if(billDetails[i].fromPeriod!==latestYear)
            {
              arrears = arrears+ billDetails[i].billAccountDetails[j].amount;  
            }
        } 
    }  
   
    
  } */
  for (let i = 0; billDetails && i<billDetails.length;i++) {
    totalAmount = totalAmount + billDetails[i].amount;   
  }

   
  
  for (let i = 0; billDetails && i<billDetails.length;i++) {

    let totalAmountBill = billDetails[i].amount;
    if(totalAmountBill===0)
    {
      arrears = 0
    }
    else 
    {
    for (let j = 0; billDetails[i].billAccountDetails && j<billDetails[i].billAccountDetails.length;j++)
    {
      if(billDetails[i].billAccountDetails[j].taxHeadCode=== "PT_TAX" )   {     
        if(billDetails[i].fromPeriod!==latestYear)
            {        
            arrears = arrears+ billDetails[i].billAccountDetails[j].amount; 
            }
        }
   /*      if(billDetails[i].billAccountDetails[j].taxHeadCode=== "PT_TIME_REBATE" )   {     
          if(billDetails[i].fromPeriod!==latestYear)
              {        
                Rebate = Rebate+ billDetails[i].billAccountDetails[j].amount; 
              }
          }
          if(billDetails[i].billAccountDetails[j].taxHeadCode=== "PT_PROMOTIONAL_REBATE" )   {     
            if(billDetails[i].fromPeriod!==latestYear)
                {        
                  PromotionalRebate = PromotionalRebate+ billDetails[i].billAccountDetails[j].amount; 
                }
            
              } */
              finalarrears = arrears;

      } 
    }
  }  

  
   addInterestToFee(fees, billDetails);
   addRoundOffToFee(fees, billDetails);
   addRebateToFee(fees, billDetails);
   addProRebateToFee(fees, billDetails);
   addSwatToFee(fees, billDetails);
   calcTax(fees, billDetails);

  if (fees&&fees.length>0) {

    for(let i=0;i<fees.length;i++)
    {
      if (fees[i].info.labelKey !== "COMMON_ARREARS") 
      {
        fees[i].value = fees[i].value.toFixed(2)
      }      
    }
  }
   
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
    arrears : finalarrears.toFixed(2),
    businesService, contactNumber, email
  };
  return { estimate};
};

export default connect(
  mapStateToProps,
  null
)(EstimateCardContainer);
