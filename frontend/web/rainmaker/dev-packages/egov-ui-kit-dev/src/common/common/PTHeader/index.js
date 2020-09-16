import DownloadPrintButton from "egov-ui-framework/ui-molecules/DownloadPrintButton";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import Label from "egov-ui-kit/utils/translationNode";
import React from "react";
import { generatePdfFromDiv } from "../../../utils/PTCommon";
import "./index.css";

const PTHeader = ({ header = '', headerValue = '', subHeaderTitle = '', subHeaderValue = '', downloadPrintButton = false ,download,print}) => {
  const locale = getLocale() || "en_IN";
  const localizationLabelsData = initLocalizationLabels(locale);
  let downloadButton;
  let printButton

  if (downloadPrintButton) {
    let applicationDownloadObject = {
      label: { labelName: "Application", labelKey: "PT_APPLICATION" },
      link: () => {
download?download():generatePdfFromDiv("download", subHeaderValue, "#property-review-form");
      },
      leftIcon: "assignment"
    };

    let tlCertificatePrintObject = {
      label: { labelName: "Application", labelKey: "PT_APPLICATION" },
      link: () => {
        print?print():generatePdfFromDiv("print", subHeaderValue, "#property-review-form");
      },
      leftIcon: "book"

    };
    let downloadMenu = [];
    let printMenu = [];
    downloadMenu.push(applicationDownloadObject);
    printMenu.push(tlCertificatePrintObject);
    downloadButton = { menu: downloadMenu, visibility: true };
    printButton = { menu: printMenu, visibility: true };
  }

  return (
    <div className="search-preview-header flex-child" style={{ display: "flex", marginBottom: downloadPrintButton ? 20 : 10, marginTop: 20, justifyContent: "space-between" }}>
      <div>
        <Label
          label={`${getTranslatedLabel(header, localizationLabelsData)} ${headerValue}`}
          containerStyle={{ padding: "10px 0px 0px 0px", marginLeft: "16px", display: "inline-block" }}
          dark={true}
          bold={true}
          labelStyle={{ letterSpacing: 0 }}
          fontSize={"20px"}
        />
        {subHeaderValue.length !== 0 && <Label
          bold={true}
          //"PT_PROPERTY_PTUID"
          label={`${getTranslatedLabel(subHeaderTitle, localizationLabelsData)} ${subHeaderValue}`}
          containerStyle={{ marginLeft: "13px", display: "inline-block" }}
          labelStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "rgba(255, 255, 255, 0.87)",
            marginLeft: "8px",
            paddingLeft: "19px",
            paddingRight: "19px",
            textAlign: "center",
            verticalAlign: "middle",
            lineHeight: "35px",
            fontSize: "16px",
            whiteSpace: "nowrap"
          }}
          fontSize={"16px"}
        />}
      </div>
      {downloadPrintButton && <div className="header-buttons" style={{ float: "right", display: "flex", marginRight: 20 }} >
        <DownloadPrintButton
          data={{
            label: {
              llabelName: "DOWNLOAD",
              labelKey: "PT_DOWNLOAD",
            },
            leftIcon: "print",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { height: 65, marginRight: 20, color: "#FE7A51" } },
            menu: downloadButton.menu,
          }}
        />
        <DownloadPrintButton
          data={{
            label: {
              llabelName: "Print",
              labelKey: "PT_PRINT",
            },
            leftIcon: "print",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { height: 65, marginLeft: 10, color: "#FE7A51" } },
            menu: printButton.menu,
          }}
        />
      </div>}
    </div>

  )
}
export default PTHeader;
