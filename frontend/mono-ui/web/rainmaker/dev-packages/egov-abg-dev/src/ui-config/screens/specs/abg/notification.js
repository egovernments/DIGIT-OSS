import {
  getCommonHeader,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {NotificationSearchCard} from "./notificationResource/notificationSearch";
import { searchResults } from "./notificationResource/searchResults";

const header = getCommonHeader({
  labelName: "Notification",
  labelKey: "ABG_COMMON_NOC"
});

const notificationSearchAndResult = {
  uiFramework: "material-ui",
  name: "notification",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "notification"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            }
          }
        },
        NotificationSearchCard,
        breakAfterSearch: getBreak(),
        // progressStatus,
        searchResults,
        
      }
    },
  }
};

export default notificationSearchAndResult;
