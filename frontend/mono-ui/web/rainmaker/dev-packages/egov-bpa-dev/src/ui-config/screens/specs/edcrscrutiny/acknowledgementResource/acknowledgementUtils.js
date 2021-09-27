import {
  getCommonHeader,
  getCommonCard,
  getCommonParagraph,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import axios from "axios";
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


export const downloadReport=async(url,mode)=>{
    if (mode === 'download') {
      let downloadLink;
      if(!url.includes("https") && window.location.href.includes("https")) {
        downloadLink = url.replace(/http/g, "https");
      } else {
        downloadLink = url;
      }
      var win = window.open(downloadLink, '_blank');
      if(win){
        win.focus();
      }
    }
    else {
      var response =await axios.get(url, {
        //responseType: "blob",
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf"
        }
      });
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      var myWindow = window.open(fileURL);
      if (myWindow != undefined) {
        myWindow.addEventListener("load", event => {
          myWindow.focus();
          myWindow.print();
        });
      }
    
    }
}

const acknowledgementCard = ({
  icon = "done",
  backgroundColor = "#39CB74",
  header,
  body,
  tailText,
  number
} = {}) => {
  const tail =
    tailText && number && number !== "null"
      ? {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            text: getCommonHeader(tailText, { style: style.tailText }),
            paragraph: getCommonHeader(
              {
                labelName: number
              },
              { style: style.tailNumber }
            )
          },
          props: {
            style: style.tailBox
          }
        }
      : {};

  return getCommonCard({
    applicationSuccessContainer: getCommonContainer(
      {
        avatar: {
          componentPath: "Avatar",
          props: {
            style: {
              width: "72px",
              height: "72px",
              backgroundColor: backgroundColor
            }
          },
          children: {
            Icon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: icon,
                style: {
                  fontSize: "50px"
                },
                iconSize: "50px"
              }
            }
          }
        },
        body: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            header: getCommonHeader(header),
            paragraph: body
              ? getCommonParagraph(body, {
                  style: style.bodySub
                })
              : {}
          },
          props: {
            style: style.bodyBox
          }
        },
        tail: tail
      },
      {
        style: style.container
      }
    )
  });
};


export const downloadPrintContainer = (
  url
) => {
  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  let receiptDownloadObject = {
    label: { labelName: "scrutinyreport", labelKey: "EDCR_SCUTINY_REPORT" },
    link: () => {
      downloadReport(url,"download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "scrutinyreport", labelKey: "EDCR_SCUTINY_REPORT" },
    link: () => {
      downloadReport(url,"print");
    },
    leftIcon: "receipt"
  };
  // switch (status.toup) {
  //   case "APPROVED":
      downloadMenu = [
        receiptDownloadObject
      ];
      printMenu = [
        receiptPrintObject
      ];
 
  /** END */

  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: { textAlign: "right", display: "flex" }
    },
    children: {
      downloadMenu: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-bpa",
        componentPath: "MenuButton",
        props: {
          data: {
            label: {labelName : "DOWNLOAD" , labelKey :"BPA_DOWNLOAD"},
             leftIcon: "cloud_download",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { height: "60px", color : "#FE7A51" }, className: "tl-download-button" },
            menu: downloadMenu
          }
        }
      },
      printMenu: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-bpa",
        componentPath: "MenuButton",
        props: {
          data: {
            label: {labelName : "PRINT" , labelKey :"BPA_PRINT"},
            leftIcon: "print",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { height: "60px", color : "#FE7A51" }, className: "tl-print-button" },
            menu: printMenu
          }
        }
      }

    },
    // gridDefination: {
    //   xs: 12,
    //   sm: 6
    // }
  }
};

export default acknowledgementCard;
