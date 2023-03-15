import {
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { basicSummary } from "./summaryResource/basicSummary";
import { scrutinySummary } from './summaryResource/scrutinySummary';
import { applicantSummary } from "./summaryResource/applicantSummary";
import { applyDocSummary } from "./summaryResource/applyDocSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { nocDetailsApply } from "./noc";

export const bpaSummaryDetails = getCommonCard({
  header: getCommonTitle({
    labelName: "Please review your Application and Submit",
    labelKey: "BPA_SUMMARY_HEADER"
  }),
  estimateSummary: estimateSummary,
  basicSummary: basicSummary,
  scrutinySummary: scrutinySummary,
  applicantSummary: applicantSummary,
  applyDocSummary: applyDocSummary,
  nocDetailsApply: nocDetailsApply
});
  