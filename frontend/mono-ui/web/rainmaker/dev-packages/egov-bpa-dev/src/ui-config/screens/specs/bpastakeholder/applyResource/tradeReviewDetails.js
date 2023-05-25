import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { getFeesEstimateCard, getDialogButton } from "../../utils";

import { getOrganizationDetails } from "./review-organization";
import { getReviewOwner } from "./review-owner";
import { getReviewLicenseDetails } from "./review-license";
import {
  getPermanentDetails,
  getCommunicactionDetails
} from "./review-location";
import { getReviewDocuments } from "./review-documents";
import { declarationSummary } from "./declarationDetails";

const estimate = getCommonGrayCard({
  estimateSection: getFeesEstimateCard({
    sourceJsonPath: "LicensesTemp[0].estimateCardData"
  })
});

// const reviewOrganizationDetails = getOrganizationDetails();

const reviewPermanentDetails = getPermanentDetails();
const reviewCommunicationDetails = getCommunicactionDetails();

const reviewOwnerDetails = getReviewOwner();
const reviewLicenseDetails = getReviewLicenseDetails();
const reviewDocumentDetails = getReviewDocuments();


export const tradeReviewDetails = getCommonCard({
  header: getCommonTitle({
    labelName: "Application Summary",
    labelKey: "BPA_SUMMARY_HEADER"
  }),
  estimate,
  reviewLicenseDetails,
  reviewOwnerDetails,
  // reviewOrganizationDetails,
  reviewPermanentDetails,
  reviewCommunicationDetails,
  reviewDocumentDetails,
  declarationSummary
});
