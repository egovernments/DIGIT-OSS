import { Enums } from "@egovernments/digit-ui-libraries";
import newComplaintConfig from "./new-complaint.json";
import searchComplaint from "./search-complaint.json";

const defaultConfig = {
  [Enums.Pages.PGR_LIST]: {
    resultTable: [
      {
        key: "address.locality.code",
        title: "Address",
        translate: true,
        i18nPrefix: "{cityCode}_revenue_",
      },
      {
        key: "status",
        title: "Status",
        type: "workflow-status",
      },
      {
        key: "auditDetails.createdTime",
        modify: "Math.round((value + 25 * 24 * 60 * 60 * 1000 - Date.now())/ (24 * 60 * 60 * 1000))",
        title: "SLA (days)",
        style: "badge",
        sort: {
          enabled: true,
          default: true,
          sortBy: "desc",
        },
      },
    ],
  },
  [Enums.Pages.PGR_NEW_COMPLAINT]: newComplaintConfig,
  [Enums.Pages.PGR_SEARCH]: searchComplaint,
};

export default defaultConfig;
