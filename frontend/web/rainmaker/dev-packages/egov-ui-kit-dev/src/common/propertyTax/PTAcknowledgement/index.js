import FloatingActionButton from "material-ui/FloatingActionButton";

import React from "react";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import DownloadPrintButton from "egov-ui-framework/ui-molecules/DownloadPrintButton";
import { Button, TimeLine, Card, Icon } from "components";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import store from "ui-redux/store";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { convertToOldPTObject } from "egov-ui-kit/utils/PTCommon/FormWizardUtils";
import { getHeaderDetails } from "egov-ui-kit/common/propertyTax/PaymentStatus/Components/createReceipt";
import { getQueryValue } from "egov-ui-kit/utils/PTCommon";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { AcknowledgementReceipt } from "../AcknowledgementReceipt";
import {generatePdfFromDiv,generatePdfAndDownload} from "../../../utils/PTCommon"
import "./index.css";
import PTHeader from "../../common/PTHeader";
class PTAcknowledgement extends React.Component {
  state = {
    propertyId: ""
  };

  componentDidMount = () => {
    const { fetchProperties, location } = this.props;
    const { search } = location;
    const propertyId = getQueryValue(search, "propertyId");
    const tenantId = getQueryValue(search, "tenantId");
    fetchProperties([
      { key: "propertyIds", value: propertyId },
      { key: "tenantId", value: tenantId },
    ]);
    this.setState({propertyId: propertyId});
  }
  onGoHomeClick=()=>{
    process.env.REACT_APP_NAME === "Employee" ?
    store.dispatch(
      setRoute(
        "/pt-mutation/propertySearch"
      )
    ):store.dispatch(
      setRoute(
        "/property-tax"
      )
    );
  }

  onAssessPayClick=()=>{
    const propertyId = getQueryArg(
      window.location.href,
      "propertyId"
    );
    const tenant = getQueryArg(window.location.href, "tenantId");
    
    store.dispatch(
      setRoute(
        `/egov-common/pay?consumerCode=${propertyId}&tenantId=${tenant}`
        
      )
    );
  }

  downloadAcknowledgementForm = () => {
    const { common, app = {}, propertiesById } = this.props;
    const { propertyId } = this.state;
    const convertedResponse = [propertiesById[propertyId]];
    const { address, propertyDetails } = convertedResponse[0];
    const { owners } = propertyDetails[0];
    const { localizationLabels } = app;
    const { cities, generalMDMSDataById } = common;
    const header = getHeaderDetails(convertedResponse[0], cities, localizationLabels, true)
    let receiptDetails = {};
    receiptDetails = {
      propertyDetails,
      address,
      owners,
      header,
      propertyId
    }
    AcknowledgementReceipt("pt-reciept-citizen", receiptDetails, generalMDMSDataById, null);
  }

  render() {
    const { acknowledgeType = "success", messageHeader = "", message = "", receiptHeader = "PT_APPLICATION_NO_LABEL", receiptNo = "" } = this.props;
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const financialYear = getQueryArg(window.location.href, "FY");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const propertyId = getQueryArg(
      window.location.href,
      "propertyId"
    )||'';
    const secondNumber = getQueryArg(
      window.location.href,
      "secondNumber"
    )||'';
    let downloadMenu=[];
    let printMenu=[];
    
    let applicationDownloadObject = {
      label: { labelName: "Application", labelKey: "PT_APPLICATION" },
      link: () => {

        generatePdfAndDownload("download",propertyId,tenantId);

        //this.downloadAcknowledgementForm();
        console.log("Download");
      },
      leftIcon: "assignment"
    };

    let tlCertificatePrintObject = {
      label: { labelName: "Application", labelKey: "PT_APPLICATION" },
       link: () => {
        generatePdfAndDownload("print",propertyId,tenantId);
      //console.log("Print");
    },
       leftIcon: "book"
      
    };

    downloadMenu.push(applicationDownloadObject);
    printMenu.push(tlCertificatePrintObject);
    let icon;
    let iconColor;
    if (acknowledgeType == "success") {
      icon = "done";
      iconColor = "#39CB74";
    } else if (acknowledgeType == "failed") {
      icon = "close";
      iconColor = "#E54D42";
    } else {
      icon = "done";
      iconColor = "#39CB74";
    }
    let ptHeader = {};
    let ptMsg={};
    let ptSubMsg={};
    let Button1={name:"",onClick:"",visibility:false};
    let Button2={name:"",onClick:"",visibility:false};
    let downloadButton={menu:[],onClick:"",visibility:false};
    let printButton={menu:[],onClick:"",visibility:false};
    let statusIcon={};
    let  ptIDLabel={};
    if (purpose === "apply" && status === "success") {
      
        ptHeader = {
        // labelName: `Application for New Trade License (${financialYearText})`,
        labelName: "New Property",
        labelKey: "PT_NEW_PROPERTY",
        dynamicArray: [financialYear],
        subheader:'propertyId',
        subHeaderValue:'propertyId'
      };
     
      ptMsg={
        labelName: "New Property Application Submitted Successfully",
        labelKey: "PT_NEW_PROPERTY_SUCCESS_MSG",
      };
      ptSubMsg={
        labelName: "A notification regarding new property application has been sent to property owner at registered Mobile No.",
        labelKey: "PT_NEW_PROPERTY_SUCCESS_SUB_MSG",
      };
      statusIcon={
        icon :"done",
        iconColor :"#39CB74",
      };
      ptIDLabel={labelName: "Poperty ID",
      labelKey: "PT_ACKNOWLEDGEMENT_ID",
      visibility:true};
      Button1={name:"PT_GOHOME",buttonClick:this.onGoHomeClick,visibility:true} ;
      Button2={name:"PT_PROCEED_PAYMENT",buttonClick:this.onAssessPayClick,visibility:false} ;
      // downloadButton={menu:downloadMenu,visibility:true} ;
      // printButton={menu:printMenu,visibility:true} ;
    }else if (purpose === "update" && status === "success") {
      
      ptHeader = {
      // labelName: `Application for New Trade License (${financialYearText})`,
      labelName: "New Property",
      labelKey: "PT_UPDATE_PROPERTY",
      dynamicArray: [financialYear],
      subheader:'propertyId',
      subHeaderValue:'propertyId'
    };
   
    ptMsg={
      labelName: "New Property Application Submitted Successfully",
      labelKey: "PT_UPDATE_PROPERTY_SUCCESS_MSG",
    };
    ptSubMsg={
      labelName: "A notification regarding new property application has been sent to property owner at registered Mobile No.",
      labelKey: "PT_UPDATE_PROPERTY_SUCCESS_SUB_MSG",
    };
    statusIcon={
      icon :"done",
      iconColor :"#39CB74",
    };
    ptIDLabel={labelName: "Poperty ID",
    labelKey: "PT_ACKNOWLEDGEMENT_ID",
    visibility:true};
    Button1={name:"PT_GOHOME",buttonClick:this.onGoHomeClick,visibility:true} ;
    Button2={name:"PT_PROCEED_PAYMENT",buttonClick:this.onAssessPayClick,visibility:false} ;
    // downloadButton={menu:downloadMenu,visibility:true} ;
    // printButton={menu:printMenu,visibility:true} ;
  }
    else if (purpose === "apply" && status === "failure") {
      ptHeader = {
        // labelName: `Application for New Trade License (${financialYearText})`,
        labelName: "New Property",
        labelKey: "PT_NEW_PROPERTY",
        dynamicArray: [financialYear]
      };
      ptMsg={
        labelName: "New Property Application Submission Failed",
        labelKey: "PT_NEW_PROPERTY_FAILURE_MSG",
      };
      ptIDLabel={labelName: "Poperty ID",
      labelKey: "PT_PROPERTY_ID",
      visibility:false};
      statusIcon={
        icon :"close",
        iconColor :"#E54D42",
      };
      ptSubMsg={
        labelName: "A notification regarding new property application has been sent to property owner at registered Mobile No.",
        labelKey: "PT_NEW_PROPERTY_FAILURE_SUB_MSG",
      };

      Button1={name:"PT_GOHOME",buttonClick:this.onGoHomeClick,visibility:true} ;
      Button2={name:"PT_PROCEED_PAYMENT",buttonClick:this.onAssessPayClick,visibility:false} ;
      // downloadButton={menu:downloadMenu,visibility:false} ;
      // printButton={menu:printMenu,visibility:false} ;
    }
    else if (purpose === "assessment" && status === "success") {
      ptHeader = {
        // labelName: `Application for New Trade License (${financialYearText})`,
        labelName: "Property Assessment",
        labelKey: "PT_PROPERTY_ASSESSMENT",
        dynamicArray: [financialYear]
      };
      ptIDLabel={labelName: "Poperty ID",
      labelKey: "PT_ASSESSMENT_NUMBER",
      visibility:true};
      statusIcon={
        icon :"done",
        iconColor :"#39CB74",
      };
      ptMsg={
        labelName: "Property Assessed Successfully",
        labelKey: "PT_PROPERTY_ASSESSMENT_SUCCESS_MSG",
      };
      ptSubMsg={
        labelName: "A notification regarding property assessment has been sent to property owner at registered Mobile No.",
        labelKey: "PT_PROPERTY_ASSESSMENT_SUCCESS_SUB_MSG",
      };
      Button1={name:"PT_PROCEED_PAYMENT",buttonClick:this.onAssessPayClick,visibility:true} ;
      Button2={name:"PT_GOHOME",buttonClick:this.onGoHomeClick,visibility:true} ;
      // downloadButton={menu:downloadMenu,visibility:true} ;
      // printButton={menu:printMenu,visibility:true} ;
    }
    else if (purpose === "assessment" && status === "failure") {
      ptHeader = {
        // labelName: `Application for New Trade License (${financialYearText})`,
        labelName: "Property Assessment",
        labelKey: "PT_PROPERTY_ASSESSMENT",
        dynamicArray: [financialYear]
      };
      ptIDLabel={labelName: "Poperty ID",
      labelKey: "PT_PROPERTY_ID",
      visibility:true};
      statusIcon={
        icon :"close",
        iconColor :"#E54D42",
      };
      ptMsg={
        labelName: "Property Assessment Failed",
        labelKey: "PT_PROPERTY_ASSESSMENT_Failure_MSG",
      };
      ptSubMsg={
        labelName: "A notification regarding property assessment has been sent to property owner at registered Mobile No.",
        labelKey: "PT_PROPERTY_ASSESSMENT_FAILURE_SUB_MSG",
      };
      Button1={name:"PT_GOHOME",buttonClick:this.onGoHomeClick,visibility:true} ;
      Button2={name:"PT_PROCEED_PAYMENT",buttonClick:this.onAssessPayClick,visibility:false} ;
      // downloadButton={menu:downloadMenu,visibility:false} ;
      // printButton={menu:printMenu,visibility:false} ;
    }
    else if (purpose === "reassessment" && status === "success") {
      ptHeader = {
        // labelName: `Application for New Trade License (${financialYearText})`,
        labelName: "Re-Assess Property",
        labelKey: "PT_PROPERTY_RE_ASSESSMENT",
        dynamicArray: [financialYear]
      };
      ptIDLabel={labelName: "Poperty ID",
      labelKey: "PT_ASSESSMENT_NUMBER",
      visibility:true};
      statusIcon={
        icon :"done",
        iconColor :"#39CB74",
      };
      ptMsg={
        labelName: "Assessment Updated Successfully",
        labelKey: "PT_PROPERTY_RE_ASSESSMENT_SUCCESS_MSG",
      };
      ptSubMsg={
        labelName: "A notification regarding property assessment has been sent to property owner at registered Mobile No.",
        labelKey: "PT_PROPERTY_RE_ASSESSMENT_SUCCESS_SUB_MSG",
      };
      Button1={name:"PT_PROCEED_PAYMENT",buttonClick:this.onAssessPayClick,visibility:true} ;
      Button2={name:"PT_GOHOME",buttonClick:this.onGoHomeClick,visibility:true} ;
      // downloadButton={menu:downloadMenu,visibility:false} ;
      // printButton={menu:printMenu,visibility:false} ;
    }
    else if (purpose === "reassessment" && status === "failure") {
      ptHeader = {
        // labelName: `Application for New Trade License (${financialYearText})`,
        labelName: "Re-Assess Property",
        labelKey: "PT_PROPERTY_RE_ASSESSMENT",
        dynamicArray: [financialYear]
      };
      ptIDLabel={labelName: "Poperty ID",
      labelKey: "PT_PROPERTY_ID",
      visibility:true};
      statusIcon={
        icon :"close",
        iconColor :"#E54D42",
      };
      ptMsg={
        labelName: "Property Assessment Failed",
        labelKey: "PT_PROPERTY_RE_ASSESSMENT_FAILED_MSG",
      };
      ptSubMsg={
        labelName: "A notification regarding property reassessment has been sent to property owner at registered Mobile No.",
        labelKey: "PT_PROPERTY_RE_ASSESSMENT_FAILURE_SUB_MSG",
      };
      Button1={name:"PT_GOHOME",buttonClick:this.onGoHomeClick,visibility:true} ;
      Button2={name:"PT_PROCEED_PAYMENT",buttonClick:this.onAssessPayClick,visibility:false} ;
      // downloadButton={menu:downloadMenu,visibility:false} ;
      // printButton={menu:printMenu,visibility:false} ;
    }
    return (
      <div >
        <div className="mainContainer ">
        <PTHeader header={ptHeader&&ptHeader.labelKey} subHeaderTitle='PT_PROPERTY_ID' subHeaderValue={propertyId} />
        {/* <Label
          label={ptHeader&&ptHeader.labelKey}
          color="rgba(0, 0, 0, 0.87)"
          fontSize="22px"
          fontWeight="400"
          fontFamily="Roboto"
          dynamicArray={ptHeader.dynamicArray}
          lineHeight="1.35417em"
          className="ptHeader"
          
        /> */}
        <div className="printDownloadButton">
       {downloadButton&&downloadButton.visibility&& <DownloadPrintButton data={{label: {
                    labelName:"Download",labelKey:"PT_DOWNLOAD"},
                  leftIcon: "cloud_download",
                  rightIcon: "arrow_drop_down",
                  props: { variant: "outlined", style: { marginLeft: 10,color:"#FE7A51" } },
                  menu: downloadButton.menu
                }}/>}
       {printButton&&printButton.visibility&& <DownloadPrintButton data={{label: {
                    llabelName:"Print",labelKey:"PT_PRINT"},
                    leftIcon: "print",
                    rightIcon: "arrow_drop_down",
                    props: { variant: "outlined", style: { marginLeft: 10 ,color:"#FE7A51"} },
                    menu: printButton.menu
                }}/>  }      
        </div>
        </div>
        <div className="ptCards">
        <Card
          style={{ backgroundColor: "white"}}
          textChildren={
            <div className="MuiCardContent-root-97">
              <div className="ack-header MuiGrid-container-98" id="material-ui-applicationSuccessContainer">
                <div
                  className="MuiAvatar-root-195 MuiAvatar-colorDefault-196"
                  id="material-ui-avatar"
                  style={{ width: "72px", height: "72px", backgroundColor: statusIcon.iconColor }}
                >
                  <FloatingActionButton className="floating-button" style={{ boxShadow: 0 }} backgroundColor={statusIcon.iconColor}>
                    <i id="custom-atoms-body" className="material-icons" style={{ fontSize: "50px" }}>
                      {statusIcon.icon}
                    </i>
                  </FloatingActionButton>
                </div>
                {/* <div>Property Assessed Successfully</div>
              <div>A notification regarding property assessment has been sent to property owner at registered mobile No.</div> */}
                <div className="ack-body" id="custom-atoms-body">
                  <h1 className="MuiTypography-root-8 MuiTypography-headline-13" id="material-ui-header">
                    <span id="custom-containers-key">
                      {" "}
                      <Label
                        className="ptMsg"
                        label={ptMsg.labelKey}
                        color="rgba(0, 0, 0, 0.87)"
                        fontSize="24px"
                        fontWeight="400"
                        fontFamily="Roboto"
                        lineHeight="1.35417em"
                      />
                    </span>
                  </h1>
                  <div className="ack-sub-body" id="custom-atoms-paragraph">
                    <span>
                      {" "}
                      <Label
                        label={ptSubMsg.labelKey}
                        color="rgba(0, 0, 0, 0.6)"
                        fontFamily="Roboto"
                      />
                    </span>
                  </div>
                </div>
                <div className="ack-text" id="custom-atoms-tail">
                  {/* {receiptNo&&<h1  className="MuiTypography-root-8 MuiTypography-headline-13" id="material-ui-text" style={{fontSize: '16px' ,fontWeight:"400" ,color: 'rgba(0, 0, 0, 0.6)'}}  > */}
                  <h1
                    className="MuiTypography-root-8 MuiTypography-headline-13"
                    id="material-ui-text"
                    style={{ fontSize: "16px", fontWeight: "400", color: "rgba(0, 0, 0, 0.6)" }}
                  >
                   {ptIDLabel.visibility && <span>
                      <Label label={ptIDLabel.labelKey} fontSize="16px" fontWeight="400" color="rgba(0, 0, 0, 0.6)" />
                    </span>}
                  </h1>
                  <h1
                    className="MuiTypography-root-8 MuiTypography-headline-13"
                    id="material-ui-paragraph"
                    style={{ fontSize: "24px", fontWeight: "500" }}
                  >
                    <span>
                      <Label label={secondNumber} fontSize="24px" color="rgba(0, 0, 0, 0.87)" fontWeight="500" />
                    </span>
                  </h1>
                </div>
                <div id="tax-wizard-buttons" className="wizard-footer col-sm-12" style={{ textAlign: "right" }}>
                  
                  <div className="button-container col-xs-12 col-md-4 col-lg-2 property-info-access-btn first-button" style={{ float: "right",right:"20px",width:"auto" }}>
                   {Button1&&Button1.visibility&& <Button
                      onClick={Button1.buttonClick}
                      label={<Label buttonLabel={true} label={Button1.name}fontSize="16px" />}
                      primary={true}
                      style={{ lineHeight: "auto", minWidth: "inherit", width:"200px", }}
                    />}
                  </div>
                  <div className="button-container col-xs-12 col-md-4 col-lg-2 property-info-access-btn" style={{ float: "right",right:"30px" }}>
                  {Button2&&Button2.visibility&&  <Button
                      onClick={Button2.buttonClick}
                      label={<Label buttonLabel={true} label={Button2.name} fontSize="16px" />}
                      primary={true}
                      style={{ lineHeight: "auto", minWidth: "inherit",width:"200px",backgroundColor:"white" }}
                    />}
                  </div>
                </div>
              </div>
            </div>
          }
        />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration, common, app, properties } = state || {};
  const { propertiesById } = properties;
  
  return {
    propertiesById,
    common, 
    app
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProperties: (queryObjectProperty) => dispatch(fetchProperties(queryObjectProperty))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PTAcknowledgement);
