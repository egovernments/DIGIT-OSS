import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import { hrCommonFooter } from "./footer";
import { getAssignmentDetailsView } from "./view-assignment-details";
import { getEmployeeDetailsView } from "./view-employee-details";
import { getJurisdictionDetailsView } from "./view-jurisdiction-details";


export const employeeReviewDetails = isReview => {
  const viewEmployeeDetails = getEmployeeDetailsView(isReview);
  const viewJurisdictionDetails = getJurisdictionDetailsView(isReview);
  const viewAssignementDetails = getAssignmentDetailsView(isReview);
  // const viewOtherDetails = getOtherDetailsView(isReview);
  // const viewServiceDetails = getServiceDetailsView(isReview);
  const footer = isReview ? hrCommonFooter() : {};
  return getCommonCard({
    viewEmployeeDetails,
    viewJurisdictionDetails,
    viewAssignementDetails,
    footer
  });
};
