import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonApplyFooter } from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";

export const connectionDetailsFooter = getCommonApplyFooter("BOTTOM",{
  takeAction: {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-wns",
    componentPath: "ActionFooter",
    props: {      
    	connectionNumber:getQueryArg(window.location.href, "connectionNumber"),
    	tenantId: getQueryArg(window.location.href, "tenantId")  
    }
  }
});