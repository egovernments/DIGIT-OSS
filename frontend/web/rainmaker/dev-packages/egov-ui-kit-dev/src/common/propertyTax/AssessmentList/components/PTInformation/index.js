import React from "react";
import { Image, Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { connect } from "react-redux";
import AssessmentInfo from "../../../Property/components/AssessmentInfo";
import PropertyAddressInfo from "../../../Property/components/PropertyAddressInfo";
import OwnerInfo from "../../../Property/components/OwnerInfo";
import TotalDues from "../../../Property/components/TotalDues";
import AssessmentHistory from "./components/AssessmentHistory";
import PaymentHistory from "./components/PaymentHistory";
import ApplicationHistory from "./components/ApplicationHistory";
import DocumentsInfo from "../../../Property/components/DocumentsInfo";
import get from "lodash/get";
import "./index.css"

// const PTInformation = ({
//   items,
//   label,
//   onItemClick,
//   innerDivStyle,
//   hoverColor,
//   properties,
//   style,
//   generalMDMSDataById,
//   totalBillAmountDue,
//   history,
//   documentsUploaded,
//   toggleSnackbarAndSetText
// }) => {
//   const items2 = [items[1]];
//   return (
//     <div className="form-without-button-cont-generic">
//       {label && (
//         <Label
//           label={label}
//           containerStyle={{ padding: "24px 0px 24px 0", marginLeft: "16px" }}
//           dark={true}
//           bold={true}
//           labelStyle={{ letterSpacing: 0 }}
//           fontSize={"20px"}
//         />
//       )}
//       <div >
//         <Card
//           textChildren={
//             <div id="property-review-form" className="col-sm-12 col-xs-12" style={{ alignItems: "center" }}>
//               {totalBillAmountDue > 0 && (
//                 <Card
//                   textChildren={
//                     <TotalDues history tenantId={properties.tenantId} consumerCode={properties.propertyId} totalBillAmountDue={totalBillAmountDue} />
//                   }
//                   style={{ backgroundColor: "rgb(242,242,242)", boxShadow: "none" }}
//                 />
//               )}
//               {/* className="pdf-header" */}
//               <Card textChildren={
//                 <div>

//                 <Label label={"AMRITSAR MUNICIPAL CORPORATION"} fontSize="16px" fontWeight="500"/>
//                 <Label label={"Property Tax Assessment Confirmation"} fontSize="14px" fontWeight="500"/>
//                 </div>
//               } />
//               <PropertyAddressInfo properties={properties} generalMDMSDataById={generalMDMSDataById}></PropertyAddressInfo>
//               <AssessmentInfo properties={properties} generalMDMSDataById={generalMDMSDataById}></AssessmentInfo>
//               <OwnerInfo
//               toggleSnackbarAndSetText={toggleSnackbarAndSetText}
//                 properties={properties}
//                 generalMDMSDataById={generalMDMSDataById}
//                 totalBillAmountDue={totalBillAmountDue}
//                 ownershipTransfer={true}
//                 viewHistory={true}
//               ></OwnerInfo>
//               <DocumentsInfo documentsUploaded={documentsUploaded}></DocumentsInfo>
//               <div id="property-assess-form">
//                 <AssessmentHistory></AssessmentHistory>
//                 <PaymentHistory></PaymentHistory>
//                 <ApplicationHistory></ApplicationHistory>
//               </div>
//             </div>
//           }
//         />
//       </div>
//     </div>
//   );
// };


const logoStyle = {
  height: "61px",
  width: "60px",
};

class PTInformation extends React.Component {

  getLogoUrl = (tenantId) => {
    const {cities} = this.props
    const filteredCity = cities && cities.length > 0 && cities.filter(item => item.code === tenantId);
    return filteredCity ? get(filteredCity[0] , "logoId") : "" ; 
  }

  render() {
    const {
      label,
      properties,
      generalMDMSDataById,
      totalBillAmountDue,
      documentsUploaded,
      toggleSnackbarAndSetText,
      cities
    } = this.props;
    let logoUrl = ""; 
    let corpCity = "";
    let ulbGrade = "";
    if(get(properties,"tenantId")) {
      logoUrl =get(properties,"tenantId") ?  this.getLogoUrl(get(properties,"tenantId")) : "";
      corpCity = `TENANT_TENANTS_${get(properties,"tenantId").toUpperCase().replace(/[.:-\s\/]/g, "_")}`;
      const selectedCityObject = cities && cities.length > 0 && cities.filter(item => item.code === get(properties,"tenantId"));
      ulbGrade = selectedCityObject ? `ULBGRADE_${get(selectedCityObject[0] ,"city.ulbGrade")}` : "MUNICIPAL CORPORATION";
    }
   
    return (
      <div className="form-without-button-cont-generic">
        {label && (
          <Label
            label={label}
            containerStyle={{ padding: "24px 0px 24px 0", marginLeft: "16px" }}
            dark={true}
            bold={true}
            labelStyle={{ letterSpacing: 0 }}
            fontSize={"20px"}
          />
        )}
        <div>
          <Card
            textChildren={
              <div id="property-review-form" className="col-sm-12 col-xs-12" style={{ alignItems: "center" }}>
                {totalBillAmountDue > 0 && (
                  <Card
                    textChildren={
                      <TotalDues
                        history
                        tenantId={properties.tenantId}
                        consumerCode={properties.propertyId}
                        totalBillAmountDue={totalBillAmountDue}
                      />
                    }
                    style={{ backgroundColor: "rgb(242,242,242)", boxShadow: "none" }}
                  />
                )}
                <div className="pdf-header" id="pdf-header">
                  <Card
                    style={{ display : "flex" , backgroundColor : "rgb(242, 242, 242)" , minHeight: "120px" , alignItems: "center" ,paddingLeft :"10px"}}
                    textChildren={
                      <div style={{display : "flex" }}>
                        {/* <Image  id="image-id" style={logoStyle} source={logoUrl} /> */}
                        <div style={{marginLeft : 30}}> 
                          <div style={{display:"flex" , marginBottom : 5}}>
                            <Label label={corpCity} fontSize="20px" fontWeight="500" color="rgba(0, 0, 0, 0.87)" containerStyle={{marginRight : 10 ,textTransform: "uppercase"}}/>
                            <Label label={ulbGrade} fontSize="20px" fontWeight="500" color="rgba(0, 0, 0, 0.87)" />
                          </div>
                          <Label label={"PT_PDF_SUBHEADER"} fontSize="16px" fontWeight="500" />
                        </div>
                      </div>
                    }
                  />
                  <div style={{display : "flex" , justifyContent : "space-between"}}>
                    <div style={{display : "flex"}}>
                      <Label label="PT_PROPERTY_ID" color="rgba(0, 0, 0, 0.87)" fontSize="20px" containerStyle={{marginRight : 10}}/>
                      <Label label={`: ${get(properties,"propertyId")}`} fontSize="20px"/>
                    </div>
                    {/* <div style={{display : "flex"}}>
                      <Label label="Property ID :" color="rgba(0, 0, 0, 0.87)" fontSize="20px"/>
                      <Label label="PT-JLD-2018-09-145323" fontSize="20px"/>
                    </div> */}
                    {/* <div style={{display : "flex"}}>
                      <Label label="PDF_STATIC_LABEL_CONSOLIDATED_BILL_DATE" color="rgba(0, 0, 0, 0.87)" fontSize="20px"/>
                      <Label label="PT-JLD-2018-09-145323" fontSize="20px"/>
                    </div> */}
                  </div>
                </div>
                
                <PropertyAddressInfo properties={properties} generalMDMSDataById={generalMDMSDataById}></PropertyAddressInfo>
                <AssessmentInfo properties={properties} generalMDMSDataById={generalMDMSDataById}></AssessmentInfo>
                <OwnerInfo
                  toggleSnackbarAndSetText={toggleSnackbarAndSetText}
                  properties={properties}
                  generalMDMSDataById={generalMDMSDataById}
                  totalBillAmountDue={totalBillAmountDue}
                  ownershipTransfer={true}
                  viewHistory={true}
                ></OwnerInfo>
                <DocumentsInfo documentsUploaded={documentsUploaded}></DocumentsInfo>
                <div id="property-assess-form">
                  <AssessmentHistory></AssessmentHistory>
                  <PaymentHistory></PaymentHistory>
                  <ApplicationHistory></ApplicationHistory>
                </div>
              </div>
            }
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { cities } = state.common || [];
  return { cities  };
}


export default connect(
  mapStateToProps,
  null
)(PTInformation);
