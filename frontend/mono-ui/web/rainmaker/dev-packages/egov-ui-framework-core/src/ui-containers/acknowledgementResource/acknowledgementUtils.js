import {
  getCommonHeader,
  getCommonCard,
  getCommonParagraph,
  getCommonContainer,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {  getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { construtCardCongtentObj } from "./cardCoontentConstants";
import "./index.css";

const style = {
  bodyBox: {
    marginLeft: 16,
    flex: 2
  },
  tailText: {
    color: "rgba(0, 0, 0, 0.6000000238418579)",
    fontSize: 16,
    fontWeight: 400
  },
  tailNumber: {
    fontSize: 24,
    fontWeight: 500
  },
  tailBox: {
    textAlign: "right",
    justifyContent: "center",
    flex: 1
  },
  bodySub: {
    marginTop: "8px",
    marginBottom: "0px",
    color: "rgba(0, 0, 0, 0.60)",
    fontFamily: "Roboto"
  },
  container: {
    display: "flex",
    minHeight: "106px",
    justifyContent: "center",
    alignItems: "center"
  }
};

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

const constructFooterObj = (footerUrlConfig)=>{
  const footerObj={}
  for(let key in footerUrlConfig){
    footerObj[key] = {
      props: {
        className: "apply-wizard-footer1",
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
          color: "#fff",
          backgroundolor:" #FE7A51"
        }
      },
      ButtonLabel:{
          labelName: footerUrlConfig[key].labelName,
          labelKey: footerUrlConfig[key].labelKey
      },
    onClickDefination: {
      action: "page_change",
      path: `${footerUrlConfig[key].url}`
    }
  }
  }
  return footerObj;
}


 const getCurrentFinancialYear = () => {
  let today = new Date();
  let curMonth = today.getMonth();
  let fiscalYr = "";
  if (curMonth > 3) {
    let nextYr1 = (today.getFullYear() + 1).toString();
    fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
  } else {
    let nextYr2 = today.getFullYear().toString();
    fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
  }
  return fiscalYr;
};

const downloadprintMenu = ( downloadMenu, printMenu) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "downloadprint-commonmenu",
      style: { textAlign: "right", display: "flex" }
    },
    children: {
      downloadMenu: {
        uiFramework: "custom-molecules",
        componentPath: "DownloadPrintButton",
        props: {
          data: {
            label: { labelName: "DOWNLOAD", labelKey: "TL_DOWNLOAD" },
            leftIcon: "cloud_download",
            rightIcon: "arrow_drop_down",
            props: {
              variant: "outlined", style: { height: "60px", color: "#FE7A51", marginRight: "5px" }, className:
                "tl-download-button"
            },
            menu: downloadMenu
          }
        }
      },
      printMenu: {
        uiFramework: "custom-molecules",
        componentPath: "DownloadPrintButton",
        props: {
          data: {
            label: { labelName: "PRINT", labelKey: "TL_PRINT" },
            leftIcon: "print",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-print-button" },
            menu: printMenu
          }
        }
      }

    },
  }

}


const getHeader = (applicationNumber, moduleName) => {
  return getCommonContainer({
    header: getCommonHeader({
      labelName: `Application for ${ moduleName } (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
      labelKey: getTransformedLocale(`${moduleName}_COMMON_APPLY_HEADER_LABEL`)
    }),
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-firenoc",
      componentPath: "ApplicationNoContainer",
      props: {
        number: applicationNumber
      },
      visible: true
    }
  })
}

const getAcknowledgementCardContent = (purpose, status, applicationNumber,moduleName,secondNumber) => {
  const ackCardContentObj = {
    "icon" : status === "success" ? "done" : "close",
    "backgroundColor": status === "success" ? "#39CB74" : "#d32f2f",
  };
  let ackObj = construtCardCongtentObj(moduleName, purpose, status);
  for (let key in ackObj) {
    ackCardContentObj[key]={
      labelName: ackObj[key].labelName,
      labelKey: ackObj[key].labelKey
    }
  }
  ackCardContentObj["number"] = applicationNumber
  if(secondNumber&&purpose=="approve" && status=="success"){
    ackCardContentObj["number"] = secondNumber;
  }
  return ackCardContentObj
}

export const getAcknowledgementCard = ({
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant,
  moduleName,
  footerUrlConfig,
  downloadMenu,
  printMenu
}) => {
    return {
      header: {
        labelName: `Application for ${moduleName} (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
        labelKey: getTransformedLocale(`${moduleName}_COMMON_APPLY_HEADER_LABEL`),
        downloadButton: downloadMenu ? true : false,
        printButton: printMenu ? true : false,
        applicationNumber,
        downloadPrintContainerClass: "downloadprint-commonmenu",
        downloadButtonProps : {
            label: { labelName: "DOWNLOAD", labelKey: "TL_DOWNLOAD" },
            leftIcon: "cloud_download",
            rightIcon: "arrow_drop_down",
            props: {
              variant: "outlined", style: { height: "60px", color: "#FE7A51", marginRight: "5px" }, className:
                "tl-download-button"
            },
            menu: downloadMenu
        },
        printButtonProps: {
            label: { labelName: "PRINT", labelKey: "TL_PRINT" },
            leftIcon: "print",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-print-button" },
            menu: printMenu
        }
      },
      body: {
        ...acknowledgementCard(getAcknowledgementCardContent(purpose, status, applicationNumber, moduleName,secondNumber))
      },
      footer: [...footerUrlConfig]
    };
  }

const acknowledgementCard = ({
  icon = "done",
  backgroundColor = "#39CB74",
  header,
  body,
  tailText,
  number
} = {}) => {
  return {
      avatarStyle: {
        width: "72px",
          height: "72px",
            backgroundColor: backgroundColor
      },
      iconStyle: { fontSize: "50px"},
      iconName: icon,
      iconSize: "50px",
      headerLabelName:header.labelName,
      headerLabelKey:header.labelKey,
      paragraphStyle: style.bodySub,
      paragraphLableName: body.labelName,
      paragraphLabelKey:body.labelKey,
      tailText,
      tailNumber:number
  }
};
 
// export default getAcknowledgementCard;
