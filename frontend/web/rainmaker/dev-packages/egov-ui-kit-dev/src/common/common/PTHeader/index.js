import React from "react";
import Label from "egov-ui-kit/utils/translationNode";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
const PTHeader = ({header = '',headerValue='', subHeaderTitle = '', subHeaderValue = ''}) => {
    const locale = getLocale() || "en_IN";
    const localizationLabelsData = initLocalizationLabels(locale);
   
    
    return (
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
    )
}
export default PTHeader;


