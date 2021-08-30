import {
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { basicSummary } from "./summaryResource/basicSummary";
import { scrutinySummary } from './summaryResource/scrutinySummary';
import { applicantSummary } from "./summaryResource/applicantSummary";
import { documentsSummary } from "./summaryResource/documentsSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";

export const bpaSummaryDetails = getCommonCard({
  header: getCommonTitle({
    labelName: "Please review your Application and Submit",
    labelKey: "TL_SUMMARY_HEADER"
  }),
  estimateSummary: estimateSummary,
  basicSummary: basicSummary,
  scrutinySummary: scrutinySummary,
  applicantSummary: applicantSummary,
  documentsSummary: documentsSummary
});
  