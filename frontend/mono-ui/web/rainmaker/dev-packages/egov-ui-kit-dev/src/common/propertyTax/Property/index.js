import React, { Component } from "react";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import { getCommaSeperatedAddress, getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLatestPropertyDetails } from "egov-ui-kit/utils/PTCommon";
import AssessmentList from "../AssessmentList";
import YearDialogue from "../YearDialogue";
import Screen from "egov-ui-kit/common/common/Screen";
import { Icon, BreadCrumbs } from "egov-ui-kit/components";
import { fetchGeneralMDMSData } from "egov-ui-kit/redux/common/actions";
import { addBreadCrumbs, toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { formWizardConstants, getPropertyLink, PROPERTY_FORM_PURPOSE } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";

import PropertyInformation from "./components/PropertyInformation";
import {
  fetchProperties,
  getSingleAssesmentandStatus,
  fetchTotalBillAmount,
  fetchReceipt,
  fetchAssessments,
} from "egov-ui-kit/redux/properties/actions";
import { getCompletedTransformedItems } from "egov-ui-kit/common/propertyTax/TransformedAssessments";
import isEqual from "lodash/isEqual";
import orderby from "lodash/orderBy";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getLocale, localStorageGet,getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import commonConfig from "config/common.js";
import { Button, Card } from "components";
import "./index.css";
import PTHeader from "../../common/PTHeader";
import { setRoute } from "egov-ui-kit/redux/app/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { loadUlbLogo } from "egov-ui-kit/utils/pdfUtils/generatePDF";
import { generatePTAcknowledgment } from "egov-ui-kit/utils/pdfUtils/generatePTAcknowledgment";
import { ifUserRoleExists } from "../../../utils/commons";

const innerDivStyle = {
  padding: "0",
  // borderBottom: "1px solid #e0e0e0",
  marginLeft: 0,
};

const IconStyle = {
  margin: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  height: "inherit",
};

const listItemStyle = {
  padding: "0px 20px",
  borderWidth: "10px 10px 0px",
};

const appName = process.env.REACT_APP_NAME;

const locale = getLocale() || "en_IN";
const localizationLabelsData = initLocalizationLabels(locale);

class Property extends Component {
  constructor(props) {
    super(props);

    this.state = {
      billFetched: false,
      pathName: null,
      dialogueOpen: false,
      urlToAppend: "",
      showAssessmentHistory: false,
    };
  }

  componentDidMount = async () => {
    const {
      location,
      addBreadCrumbs,
      fetchGeneralMDMSData,
      renderCustomTitleForPt,
      customTitle,
      fetchProperties,
      fetchReceipt,
      fetchAssessments,
      fetchLocalizationLabel
    } = this.props;
    const requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "PropertyTax",
            masterDetails: [
              {
                name: "Floor",
              },
              {
                name: "UsageCategoryMajor",
              },
              {
                name: "UsageCategoryMinor",
              },
              {
                name: "UsageCategorySubMinor",
              },
              {
                name: "OccupancyType",
              },
              {
                name: "PropertyType",
              },
              {
                name: "PropertySubType",
              },
              {
                name: "OwnerType",
              },
              {
                name: "UsageCategoryDetail",
              },
              {
                name: "SubOwnerShipCategory",
              },
            ],
          },
        ],
      },
    };
    const tenantRequestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "citywiseconfig",
                filter: "[?(@.config=='ptCitizenPayButton')]"
              }
            ]
          }
        ]
      },
    };
    let citywiseconfig = httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        tenantRequestBody
    ).then(res => {
      this.setState({citywiseconfig: res.MdmsRes.tenant.citywiseconfig});
    });
    fetchGeneralMDMSData(requestBody, "PropertyTax", [
      "Floor",
      "UsageCategoryMajor",
      "UsageCategoryMinor",
      "UsageCategorySubMinor",
      "OccupancyType",
      "PropertyType",
      "PropertySubType",
      "OwnerType",
      "UsageCategoryDetail",
      "SubOwnerShipCategory",
    ]);
    fetchProperties([
      { key: "propertyIds", value: decodeURIComponent(this.props.match.params.propertyId) },
      { key: "tenantId", value: this.props.match.params.tenantId },
    ]);
    const { pathname } = location;
    if (appName === "Citizen" && !(localStorageGet("path") === pathname)) {
      customTitle && addBreadCrumbs({ title: customTitle, path: window.location.pathname });
    }
    renderCustomTitleForPt(customTitle);

    fetchAssessments([
      { key: "propertyIds", value: decodeURIComponent(this.props.match.params.propertyId) },
      { key: "tenantId", value: this.props.match.params.tenantId },
    ]);

    fetchReceipt([
      { key: "consumerCodes", value: decodeURIComponent(this.props.match.params.propertyId) },
      { key: "tenantId", value: this.props.match.params.tenantId },
    ]);

    loadUlbLogo(this.props.match.params.tenantId);
    let locFinalData = localStorage.getItem("finalData");
    locFinalData = JSON.parse(locFinalData);
    if(!locFinalData){
      let mdmsBody = {
        MdmsCriteria: {
          tenantId: "uk",
          moduleDetails: [
           {
              moduleName: "BillingService",
              masterDetails: [
                {
                  name: "TaxPeriod",
                },
                {
                  name: "TaxHeadMaster",
                }
              ]
            },     
          ]
        }
      };
      try {
        const payload =  await httpRequest(
          "post",
          "/egov-mdms-service/v1/_search",
          "_search",
          [],
          mdmsBody
        );
    
        const MdmsData = payload.MdmsRes;
        const yeardataInfo =
        (MdmsData && MdmsData.BillingService.TaxPeriod) || {};
  
        const taxDataInfo =
        (MdmsData && MdmsData.BillingService.TaxHeadMaster) || {};
        let yeardata = [];
        let taxData = [];
        const data = Object.keys(yeardataInfo).map((key, index) => {
        yeardata.push(yeardataInfo[key]);
        });
        const data2 = Object.keys(taxDataInfo).map((key, index) => {
        taxData.push(taxDataInfo[key]);
        });
        let yeardata1 = yeardata.filter(yearKey => yearKey.service === "PT");
        let taxdata1 =
        taxData.filter(tax => tax.service === "PT" && tax.legacy == true) || [];
        taxdata1.length > 0 &&
        taxdata1.sort(function(a, b) {
            return a.order - b.order;
        });
        const finalData = Object.keys(yeardata1).map((data, key) => {
        yeardata1[data]["taxHead"] = [...taxdata1];
        return yeardata[data];
        });
        {
        finalData && finalData.length
            ? localStorage.setItem("finalData", JSON.stringify(finalData))
            : "error";
        }
  
      } catch (e) {
        console.log(e);
      }
    }   
    fetchLocalizationLabel(getLocale(), getTenantId(), getTenantId());
    const ptqueryObject = [
      { key: "propertyIds", value: this.props.match.params.propertyId },
      { key: "tenantId", value: getTenantId()  },
    ];
    try {
      const payload = await httpRequest("post","property-services/property/_search", "", ptqueryObject);
      this.setState({businessIds: payload && payload.Properties[0].acknowldgementNumber}); 
    }
    catch (e)
    {
      console.log("error",e );
    }


    const queryObject = [
       {  
        key: "tenantId", 
        value: getTenantId()      
       },     
       {      
        key: "businessService",   
        value: "PT.MUTATION" 
       },
       { 
         key: "businessIds", 
         value: this.state.businessIds
       },
     ];         

   try {
    const payload = await httpRequest(
      "post",
      "egov-workflow-v2/egov-wf/process/_search",
      "",
      queryObject
    );   

     this.setState({workflowStatus: payload && payload}); 

    } catch (e) {
      console.log(" workflow call error",e);
    }
 
  };


  onListItemClick = (item, index) => {
    const { getSingleAssesmentandStatus } = this.props;
    const { route } = item;
    const { showAssessmentHistory } = this.state;
    if (index === 0 && item.initiallyOpen) {
      this.setState({
        showAssessmentHistory: !showAssessmentHistory,
      });
    }

    route && getSingleAssesmentandStatus(route);
  };

  onAssessPayClick = () => {
    const { latestPropertyDetails, propertyId, tenantId, selPropertyDetails } = this.props;
    const assessmentNo = latestPropertyDetails && latestPropertyDetails.assessmentNumber;
    let fY = localStorage.getItem('finalData')
    fY = fY && JSON.parse(fY);
    fY = fY && fY[0].financialYear
    if (selPropertyDetails.status != "ACTIVE") {
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: "Property in Workflow", labelKey: "ERROR_PROPERTY_IN_WORKFLOW" },
        "error"
      );
    } else {

      this.setState({
        // dialogueOpen: true,
        urlToAppend: getPropertyLink(propertyId, tenantId, PROPERTY_FORM_PURPOSE.ASSESS, -1, assessmentNo),
      },function(){
        this.props.history && this.props.history.push(`${this.state.urlToAppend}&FY=${fY}`)
      });
    }
  };
  editDemand= () =>{
    const {  propertyId, tenantId } = this.props;

    if(process.env.REACT_APP_NAME !='citizen'){  
      let redirectTo = `/property-tax/demand-and-collection?propertyId=${propertyId}&edit=true`;
      if (ifUserRoleExists("PTADMIN")) {
        redirectTo = redirectTo + "&assessment=true";
      }
      this.props.history.push(redirectTo);
    }
    // this.setState({
    //   dialogueOpen: true,
    //   urlToAppend: `/property-tax/assessment-form?assessmentId=${assessmentNo}&isReassesment=true&isAssesment=true&propertyId=${propertyId}&tenantId=${tenantId}`,
    // }); 
  }
  onEditPropertyClick = () => {
    const { latestPropertyDetails, propertyId, tenantId, selPropertyDetails } = this.props;
    const assessmentNo = latestPropertyDetails && latestPropertyDetails.assessmentNumber;
    if (selPropertyDetails.status != "ACTIVE") {
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: "Property in Workflow", labelKey: "ERROR_PROPERTY_IN_WORKFLOW" },
        "error"
      );
    } else if(selPropertyDetails.source === "LEGACY_RECORD"){

      let redirectTo = `/property-tax/assessment-form-dataentry?assessmentId=0&purpose=update&propertyId=${propertyId}&tenantId=${tenantId}`;
      if (ifUserRoleExists("PTADMIN")) {
        redirectTo = redirectTo + "&assessment=true";
      }
      this.props.history.push(redirectTo);
      }
    else {
      this.props.history.push(getPropertyLink(propertyId, tenantId, PROPERTY_FORM_PURPOSE.UPDATE, -1, assessmentNo));
      // this.setState({
      //   dialogueOpen: true,
      //   urlToAppend: getPropertyLink(propertyId, tenantId, "assess", -1, assessmentNo),
      // });
    }
  };

  getAssessmentHistory = (selPropertyDetails, receiptsByYr = []) => {
    let assessmentList = [];
    const { propertyDetails = [] } = selPropertyDetails;
    propertyDetails.map((propertyDetail) => {
      let bool = true;
      for (let receipts of receiptsByYr) {
        if (propertyDetail.financialYear == receipts[0].financialYear) {
          let receiptInfo = {};
          let receiptTotalAmount = 0;
          let paidAmount = 0;
          for (let receipt of receipts) {
            receiptTotalAmount = receipt.totalAmount < receiptTotalAmount ? receiptTotalAmount : receipt.totalAmount;
            paidAmount += receipt.amountPaid;
          }
          if (receiptTotalAmount > paidAmount) {
            receiptInfo["status"] = "Pending";
            if (paidAmount > 0) {
              receiptInfo["status"] = "Partially Paid";
            }
          } else {
            receiptInfo["status"] = "Paid";
          }
          receiptInfo = {
            ...receiptInfo,
            ...receipts[0],
            totalAmount: paidAmount,
          };
          if (propertyDetail.assessmentDate < receiptInfo.receiptDate) {
            let assessment = {
              ...propertyDetail,
              receiptInfo,
            };
            assessmentList.push(assessment);
          } else {
            let assessment = {
              ...propertyDetail,
              receiptInfo,
            };
            let assessment1 = {
              ...propertyDetail,
              receiptInfo: {
                ...receiptInfo,
                status: "Pending",
              },
            };
            assessmentList.push(assessment);
            assessmentList.push(assessment1);
          }
          bool = false;
        }
      }
      if (bool) {
        let receiptInfo = {};
        receiptInfo["status"] = "Pending";
        let assessment = {
          ...propertyDetail,
          receiptInfo,
        };
        assessmentList.push(assessment);
      }
    });
    return assessmentList;
  };
  getAssessmentListItems = (props, showAssessmentHistory, assessmentHistory) => {
    const { propertyItems, propertyId, history, sortedAssessments, selPropertyDetails, tenantId, localization } = props;
    const { cities, localizationLabels } = localization;
    const assessments = orderby(
      getCompletedTransformedItems(assessmentHistory, cities, localizationLabels, propertyId, selPropertyDetails),
      ["epocDate"],
      ["desc"]
    );
    return [
      {
        primaryText: (
          <PropertyInformation
            items={propertyItems}
            propertyTaxAssessmentID={propertyId}
            history={history}
            tenantId={tenantId}
            onButtonClick={this.onAssessPayClick}
          />
        ),
        initiallyOpen: true,
      },
      {
        primaryText: <Label label="PT_PROPERTY_ASSESSMENT_HISTORY" labelClassName="property-info-title" />,
        route: selPropertyDetails,
        nestedItems: showAssessmentHistory && assessments && assessments,
        rightIcon: (
          <div style={IconStyle}>
            <Icon action="hardware" name="keyboard-arrow-down" color="#484848" />
          </div>
        ),
        initiallyOpen: true,
      },
    ];
  };
  componentDidUpdate = (prevProps) => {
    // Typical usage (don't forget to compare props):
    // if (this.props.userID !== prevProps.userID) {
    //   this.fetchData(this.props.userID);
    // }
    const propertyId = decodeURIComponent(this.props.match.params.propertyId);
    const { totalBillAmountDue, Assessments } = this.props;
    if (Assessments && Assessments.length > 0 && Assessments[0].propertyId == propertyId && !this.state.billFetched) {
      this.setState({ billFetched: true })
      this.props.fetchTotalBillAmount([
        { key: "consumerCode", value: propertyId },
        { key: "tenantId", value: this.props.match.params.tenantId },
        { key: "businessService", value: 'PT' }
      ]);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { customTitle, renderCustomTitleForPt } = this.props;
    if (!isEqual(customTitle, nextProps.customTitle)) {
      renderCustomTitleForPt(nextProps.customTitle);
    }
  };

  closeYearRangeDialogue = () => {
    this.setState({ dialogueOpen: false });
  };
  download() {
    const { UlbLogoForPdf, selPropertyDetails, generalMDMSDataById } = this.props;
    generatePTAcknowledgment(selPropertyDetails, generalMDMSDataById, UlbLogoForPdf, `pt-acknowledgement-${selPropertyDetails.propertyId}.pdf`);
  }
  print() {
    const { UlbLogoForPdf, selPropertyDetails, generalMDMSDataById } = this.props;
    generatePTAcknowledgment(selPropertyDetails, generalMDMSDataById, UlbLogoForPdf, 'print');
  }

  render() {
    const {
      urls,
      location,
      history,
      generalMDMSDataById,
      latestPropertyDetails,
      propertyId,
      selPropertyDetails,
      receiptsByYr,
      totalBillAmountDue,
      documentsUploaded,
      Payments = []
    } = this.props;
    const { closeYearRangeDialogue } = this;
    const { dialogueOpen, urlToAppend, showAssessmentHistory, workflowStatus } = this.state;
    let urlArray = [];
    let assessmentHistory = [];
    const { pathname } = location;
    if (urls.length === 0 && localStorageGet("path") === pathname) {
      urlArray = JSON.parse(localStorageGet("breadCrumbObject"));
    }
    let clsName = appName === "Citizen" ? "screen-with-bredcrumb" : "";
    if (receiptsByYr) {
      assessmentHistory = this.getAssessmentHistory(selPropertyDetails, receiptsByYr.receiptDetailsArray);
    }
    let isMigratedProperty =false;

    if(selPropertyDetails.source!=="MUNICIPAL_RECORDS")
    {
      isMigratedProperty =true;
    }

    let isCitizen = process.env.REACT_APP_NAME === "Citizen";

 /*    let button;
    if(process.env.REACT_APP_NAME !='Citizen' && propertyDetails && propertyDetails[0] && propertyDetails[0].source ==='LEGACY_RECORD' && Payments.length <= 0){
    button =
    <Button
      onClick={() => this.editDemand()}
      label={<Label buttonLabel={true} label="PT_EDIT_DEMAND" fontSize="16px" />}
      primary={true}
      style={{ lineHeight: "auto", minWidth: "inherit" }}
    />
    } */
    let payLen = Payments && Payments.find(item =>{
          return item && item.instrumentStatus === "APPROVED" || item.instrumentStatus === "REMITTED"
        });   
    var isRoleAdmin = () => {
      let userInfo = JSON.parse(localStorageGet("user-info"));
      let flag = false;
      userInfo.roles.forEach((role) => {
        {
          if (role.code == "PTADMIN") {
            flag = true;
          }
        }
      });
      console.log("latestPropertyDetails", latestPropertyDetails && latestPropertyDetails.status);
      console.log("propertyItems", this.props.propertyItems);
      return flag;
    };

    return (
      <Screen className={clsName}>
        <PTHeader header="PT_PROPERTY_INFORMATION" subHeaderTitle="PT_PROPERTY_PTUID" subHeaderValue={propertyId} downloadPrintButton={true} download={() => this.download()} print={() => this.print()} />
        {
          <AssessmentList
            onItemClick={this.onListItemClick}
            items={this.getAssessmentListItems(this.props, showAssessmentHistory, assessmentHistory)}
            innerDivStyle={innerDivStyle}
            listItemStyle={listItemStyle}
            history={history}
            hoverColor="#fff"
            properties={selPropertyDetails}
            generalMDMSDataById={generalMDMSDataById && generalMDMSDataById}
            totalBillAmountDue={totalBillAmountDue}
            documentsUploaded={documentsUploaded}
            toggleSnackbarAndSetText={this.props.toggleSnackbarAndSetText}
            citywiseconfig={this.state.citywiseconfig}
            workflowStatus={this.state.workflowStatus && this.state.workflowStatus}
          />
        }
        <div id="tax-wizard-buttons" className="wizard-footer col-sm-12" style={{ textAlign: "right" }}>
        {!isMigratedProperty && 

         <Button
              onClick={() => this.onAssessPayClick()}
              label={<Label buttonLabel={true} label="PT_ASSESS_PROPERTY" fontSize="16px" />}
              primary={true}
              style={{ lineHeight: "auto", minWidth: "inherit", marginLeft:"10px" }}
            />  
        }        

                      
        {((isMigratedProperty && !isCitizen) && (isRoleAdmin() || (Payments.length<=0 || Payments && Payments.length === 1 && Payments[0].instrumentStatus === "CANCELLED"  
              || !payLen )) ||  ifUserRoleExists("PTADMIN") ) && (latestPropertyDetails && latestPropertyDetails.status !== "INWORKFLOW") &&
           <Button
              label={
                <Label buttonLabel={true}
                  label={formWizardConstants[PROPERTY_FORM_PURPOSE.UPDATE].parentButton} 
                  fontSize="16px"
                  color="#fe7a51" />
              }
              onClick={() => this.onEditPropertyClick()}
              //labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fe7a51" }}
             // buttonStyle={{ border: "1px solid #fe7a51" }}
             style={{ lineHeight: "auto", minWidth: "inherit" }}
             />   
            }
              {isMigratedProperty && !isCitizen && (Payments.length<=0 || Payments && Payments.length === 1 && Payments[0].instrumentStatus === "CANCELLED"  
              || !payLen || ifUserRoleExists("PTADMIN")) && (latestPropertyDetails && latestPropertyDetails.status !== "INWORKFLOW") &&
                
              <Button
              onClick={() => this.editDemand()}
              label={<Label buttonLabel={true} label="PT_EDIT_DATAENTRY_DEMAND" fontSize="16px" />}
              primary={true}
              style={{ lineHeight: "auto", minWidth: "inherit" }}
            />
          }
        </div>
        {dialogueOpen && <YearDialogue open={dialogueOpen} history={history} urlToAppend={urlToAppend} closeDialogue={closeYearRangeDialogue} />}
      </Screen>
    );
  }
}
const getYearlyAssessments = (propertiesArray = []) => {
  let yearlyAssessments = [];
  return yearlyAssessments;
  // propertiesArray.map((property) => {
  //   if (yearlyAssessments.length == 0) {
  //     yearlyAssessments[0] = [property];
  //   } else {
  //     let bool = true;
  //     for (let pty of yearlyAssessments) {
  //       if (pty[0].financialYear == property.financialYear) {
  //         pty.push(property)
  //         bool = false;
  //       }
  //     }
  //     if (bool) {
  //       yearlyAssessments.push([property]);
  //     }
  //   }
  // })
  // for (let eachYrAssessments of yearlyAssessments) {
  //   eachYrAssessments.sort((x, y) => y.assessmentDate - x.assessmentDate);
  // }
  // yearlyAssessments.sort((x, y) => x[0].financialYear.localeCompare(y[0].financialYear));
  // return yearlyAssessments;
};
const getPendingAssessments = (selPropertyDetails, singleAssessmentByStatus = []) => {
  let pendingAssessments = [];
  // let propertiesArray = selPropertyDetails.propertyDetails || [];
  // let yearlyAssessments = [];
  // yearlyAssessments = getYearlyAssessments(propertiesArray);
  // let paidAssessments = [];
  // paidAssessments = getYearlyAssessments(singleAssessmentByStatus);
  // for (let eachYrAssessments of yearlyAssessments) {
  //   let bol = true;
  //   for (let paidAssessment of paidAssessments) {
  //     if (eachYrAssessments[0].financialYear === paidAssessment[0].financialYear) {
  //       bol = false;
  //       pendingAssessments.push(paidAssessment[0]);
  //       if (eachYrAssessments[0].assessmentNumber !== paidAssessment[0].assessmentNumber) {
  //         pendingAssessments.push(eachYrAssessments[0]);
  //       }
  //     }
  //   }
  //   if (bol) {
  //     pendingAssessments.push(eachYrAssessments[0]);
  //   }
  // }
  return pendingAssessments;
};
const checkPaid = (property, ptList = []) => {
  let status = true;
  for (let pt of ptList) {
    if (pt.assessmentNumber == property.assessmentNumber) {
      status = false;
    }
  }
  return status;
};
const getAddressInfo = (addressObj, extraItems) => {
  return (
    addressObj && [
      {
        heading: getTranslatedLabel("PT_PROPERTY_ADDRESS_SUB_HEADER", localizationLabelsData),
        // iconAction: "action",
        iconName: "home",
        items: [
          {
            key: getTranslatedLabel("PT_PROPERTY_ADDRESS_CITY", localizationLabelsData),
            value: addressObj.city || "NA",
          },
          {
            key: getTranslatedLabel("PT_PROPERTY_ADDRESS_HOUSE_NO", localizationLabelsData),
            value: addressObj.doorNo || "NA",
          },
          {
            key: getTranslatedLabel("PT_PROPERTY_ADDRESS_COLONY_NAME", localizationLabelsData),
            value: addressObj.buildingName || "NA",
          },
          {
            key: getTranslatedLabel("PT_PROPERTY_ADDRESS_STREET_NAME", localizationLabelsData),
            value: addressObj.street || "NA",
          },
          {
            key: getTranslatedLabel("PT_PROPERTY_ADDRESS_MOHALLA", localizationLabelsData),
            value: addressObj.locality.name || "NA",
          },
          {
            key: getTranslatedLabel("PT_PROPERTY_ADDRESS_PINCODE", localizationLabelsData),
            value: addressObj.pincode || "NA",
          },
          ...extraItems,
        ],
      },
    ]
  );
};

const transform = (floor, key, generalMDMSDataById, propertyDetails) => {
  const { propertySubType, usageCategoryMajor } = propertyDetails;
  const { masterName, dataKey } = key;
  if (!masterName) {
    return floor["occupancyType"] === "RENTED" ? `INR ${floor["arv"]}` : `${Math.round(floor[dataKey] * 100) / 100} sq yards`;
  } else {
    if (floor[dataKey]) {
      if (dataKey === "usageCategoryDetail") {
        return generalMDMSDataById["UsageCategoryDetail"]
          ? generalMDMSDataById["UsageCategoryDetail"][floor[dataKey]].name
          : generalMDMSDataById["UsageCategorySubMinor"]
            ? generalMDMSDataById["UsageCategorySubMinor"][floor["usageCategorySubMinor"]].name
            : "NA";
      }
      // if (usageCategoryMajor === "RESIDENTIAL" && propertySubType === "BUILTUP.SHAREDPROPERTY" && dataKey === "floorNo") {
      //   return "NA";
      // }
     /*  if (floor[dataKey] === "NONRESIDENTIAL") {
        return generalMDMSDataById["UsageCategoryMinor"] ? generalMDMSDataById["UsageCategoryMinor"][floor["usageCategoryMinor"]].name : "NA";
      } else {
        return generalMDMSDataById[masterName] ? generalMDMSDataById[masterName][floor[dataKey]].name : "NA";
      } */
      if (floor[dataKey] === "NONRESIDENTIAL") {
        return generalMDMSDataById["UsageCategoryMinor"]&& generalMDMSDataById["UsageCategoryMinor"][floor["usageCategoryMinor"]]&& generalMDMSDataById["UsageCategoryMinor"][floor["usageCategoryMinor"]].name ? generalMDMSDataById["UsageCategoryMinor"][floor["usageCategoryMinor"]].name : "NA";
      } else {
        return generalMDMSDataById[masterName] ? generalMDMSDataById[masterName][floor[dataKey]].name : "NA";
      }
    } else {
      return "NA";
    }
  }
};

const getAssessmentInfo = (propertyDetails, keys, generalMDMSDataById) => {
  const { units } = propertyDetails || {};
  return (
    propertyDetails && [
      {
        heading: getTranslatedLabel("PT_ASSESMENT_INFO_SUB_HEADER", localizationLabelsData),
        iconAction: "action",
        iconName: "assignment",
        showTable: true,
        tableHeaderItems: [
          {
            key: getTranslatedLabel("PT_ASSESMENT_INFO_USAGE_TYPE", localizationLabelsData),
            value: propertyDetails.usageCategoryMajor ? propertyDetails.usageCategoryMajor : "NA", //noOfFloors
          },
          {
            key: getTranslatedLabel("PT_ASSESMENT_INFO_TYPE_OF_BUILDING", localizationLabelsData),
            value: generalMDMSDataById
                ? generalMDMSDataById["PropertyType"]
                  ? generalMDMSDataById["PropertyType"][propertyDetails.propertyType].name
                  : "NA"
              : "NA",
          },
          {
            key: getTranslatedLabel("PT_ASSESMENT_INFO_PLOT_SIZE", localizationLabelsData),
            value:
              propertyDetails.propertySubType === "BUILTUP.SHAREDPROPERTY"
                ? "NA"
                : propertyDetails.uom
                  ? `${propertyDetails.landArea} ${propertyDetails.uom}`
                  : `${Math.round(propertyDetails.landArea * 100) / 100} sq yards`,
          },
          {
            key: getTranslatedLabel("PT_ASSESMENT_INFO_NO_OF_FLOOR", localizationLabelsData),
            value: propertyDetails.noOfFloors ? `${propertyDetails.noOfFloors}` : "NA", //noOfFloors
          },
        ],
        items: {
          header: units
            ? [
              getTranslatedLabel("PT_ASSESMENT_INFO_FLOOR", localizationLabelsData),
              getTranslatedLabel("PT_ASSESMENT_INFO_USAGE_TYPE", localizationLabelsData),
              // getTranslatedLabel("PT_ASSESMENT_INFO_SUB_USAGE_TYPE", localizationLabelsData),
              getTranslatedLabel("PT_ASSESMENT_INFO_OCCUPLANCY", localizationLabelsData),
              getTranslatedLabel("PT_ASSESMENT_INFO_AREA_RENT", localizationLabelsData),
            ]
            : [],
          values: units
            ? units.map((floor) => {
              return {
                value: keys.map((key) => {
                  return transform(floor, key, generalMDMSDataById, propertyDetails);
                }),
              };
            })
            : [],
        },
      },
    ]
  );
};

const getOwnerInfo = (latestPropertyDetails, generalMDMSDataById) => {
  const isInstitution =
    latestPropertyDetails.ownershipCategory === "INSTITUTIONALPRIVATE" || latestPropertyDetails.ownershipCategory === "INSTITUTIONALGOVERNMENT";
  const { institution, owners: ownerDetails } = latestPropertyDetails || {};
  return (
    ownerDetails && [
      {
        heading: getTranslatedLabel("PT_OWNERSHIP_INFO_SUB_HEADER", localizationLabelsData),
        iconAction: "social",
        iconName: "person",
        nestedItems: true,
        items: ownerDetails.map((owner) => {
          return {
            items: [
              isInstitution
                ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME_INSTI", localizationLabelsData),
                  value: (institution && institution.name) || "NA",
                }
                : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME", localizationLabelsData),
                  value: owner.name || "NA",
                },
              isInstitution
                ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_DESIGNATION", localizationLabelsData),
                  value: institution.designation || "NA",
                }
                : {
                  key: getTranslatedLabel("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME", localizationLabelsData),
                  value: owner.fatherOrHusbandName || "NA",
                },
              isInstitution
                ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_TYPE_INSTI", localizationLabelsData),
                  value:
                    (institution &&
                      institution.type &&
                      generalMDMSDataById &&
                      generalMDMSDataById["SubOwnerShipCategory"] &&
                      generalMDMSDataById["SubOwnerShipCategory"][institution.type] &&
                      generalMDMSDataById["SubOwnerShipCategory"][institution.type].name) ||
                    "NA",
                }
                : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_GENDER", localizationLabelsData),
                  value: owner.gender || "NA",
                },
              isInstitution
                ? {
                  // key: getTranslatedLabel("PT_OWNERSHIP_INFO_TYPE_INSTI", localizationLabelsData),
                  // value:
                  //   (institution &&
                  //     institution.type &&
                  //     generalMDMSDataById &&
                  //     generalMDMSDataById["SubOwnerShipCategory"] &&
                  //     generalMDMSDataById["SubOwnerShipCategory"][institution.type].name) ||
                  //   "NA",
                }
                : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_DOB", localizationLabelsData),
                  value: owner.dob || "NA",
                },
              isInstitution
                ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME_OF_AUTH", localizationLabelsData),
                  value: owner.name || "NA",
                }
                : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData),
                  value: owner.mobileNumber || "NA",
                },
              isInstitution
                ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_TEL_NO", localizationLabelsData),
                  value: owner.altContactNumber || "NA",
                }
                : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_EMAIL_ID", localizationLabelsData),
                  value: owner.emailId || "NA",
                },
              isInstitution
                ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData),
                  value: owner.mobileNumber || "NA",
                }
                : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_USER_CATEGORY", localizationLabelsData),
                  value:
                    (owner &&
                      owner.ownerType &&
                      generalMDMSDataById &&
                      generalMDMSDataById["OwnerType"] &&
                      generalMDMSDataById["OwnerType"][owner.ownerType].name) ||
                    "NA",
                },
              {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_CORR_ADDR", localizationLabelsData),
                value: owner.permanentAddress || "NA",
              },
            ],
          };
        }),
      },
    ]
  );
};

const mapStateToProps = (state, ownProps) => {
  const { app, common } = state;
  const { urls, localizationLabels } = app;
  const { cities } = common;
  const { generalMDMSDataById } = state.common || {};
  let { propertiesById, singleAssessmentByStatus = [], loading, receiptsByYr, totalBillAmountDue = 0, Assessments = [],Payments = [] } = state.properties || {};  
  const tenantId = ownProps.match.params.tenantId;
  const propertyId = decodeURIComponent(ownProps.match.params.propertyId);
  const selPropertyDetails = propertiesById[propertyId] || {};
  const { documentsUploaded } = selPropertyDetails || [];
  const latestPropertyDetails = getLatestPropertyDetails(selPropertyDetails.propertyDetails);
  const pendingAssessments = getPendingAssessments(selPropertyDetails, singleAssessmentByStatus);
  const localization = {
    localizationLabels,
    cities,
  };
  const addressInfo =
    getAddressInfo(selPropertyDetails.address, [
      { key: getTranslatedLabel("PT_PROPERTY_ADDRESS_PROPERTY_ID", localizationLabels), value: selPropertyDetails.propertyId },
    ]) || [];
  const assessmentInfoKeys = [
    { masterName: "Floor", dataKey: "floorNo" },
    { masterName: "UsageCategoryMajor", dataKey: "usageCategoryMajor" },
    // { masterName: "UsageCategoryDetail", dataKey: "usageCategoryDetail" },
    { masterName: "OccupancyType", dataKey: "occupancyType" },
    { masterName: "", dataKey: "unitArea" },
  ];
  const assessmentInfo = generalMDMSDataById
    ? latestPropertyDetails
      ? getAssessmentInfo(latestPropertyDetails, assessmentInfoKeys, generalMDMSDataById)
      : []
    : [];
  const ownerInfo = (latestPropertyDetails && getOwnerInfo(latestPropertyDetails, generalMDMSDataById)) || [];
  const propertyItems = [...addressInfo, ...assessmentInfo, ...ownerInfo];
  const customTitle = selPropertyDetails && selPropertyDetails.address && getCommaSeperatedAddress(selPropertyDetails.address, cities);
  const completedAssessments = getCompletedTransformedItems(pendingAssessments, cities, localizationLabels, propertyId);
  // const completedAssessments = getCompletedTransformedItems(singleAssessmentByStatus, cities, localizationLabels);
  const sortedAssessments = completedAssessments && orderby(completedAssessments, ["epocDate"], ["desc"]);
  if (Assessments.length == 0) {
    totalBillAmountDue = 0
  }


  return {
    urls,
    propertyItems,
    propertyId,
    tenantId,
    customTitle,
    latestPropertyDetails,
    selPropertyDetails,
    sortedAssessments,
    generalMDMSDataById,
    receiptsByYr,
    localization,
    totalBillAmountDue,
    documentsUploaded,
    Assessments,
    Payments
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addBreadCrumbs: (url) => dispatch(addBreadCrumbs(url)),
    fetchGeneralMDMSData: (requestBody, moduleName, masterName) => dispatch(fetchGeneralMDMSData(requestBody, moduleName, masterName)),
    fetchProperties: (queryObjectProperty) => dispatch(fetchProperties(queryObjectProperty)),
    getSingleAssesmentandStatus: (queryObj) => dispatch(getSingleAssesmentandStatus(queryObj)),
    fetchTotalBillAmount: (fetchBillQueryObject) => dispatch(fetchTotalBillAmount(fetchBillQueryObject)),
    fetchReceipt: (fetchReceiptQueryObject) => dispatch(fetchReceipt(fetchReceiptQueryObject)),
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchLocalizationLabel: (locale, tenantId, tenatId) =>dispatch(fetchLocalizationLabel(locale, tenantId,tenatId)),
    fetchAssessments: (fetchAssessmentsQueryObject) => dispatch(fetchAssessments(fetchAssessmentsQueryObject)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Property);
