import {
    getCommonCard,
    getCommonTitle
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { scrutinySummary } from './summaryResource/scrutinySummary';
import { applyDocSummary } from "./summaryResource/applyDocSummary";
import { estimateSummary } from "../egov-bpa/summaryResource/estimateSummary";

export const summaryDetails = getCommonCard({
  header: getCommonTitle({
    labelName: "Please review your Application and Submit",
    labelKey: "BPA_SUMMARY_HEADER"
  }),
  estimateSummary: estimateSummary,
  scrutinySummary: scrutinySummary,
  applyDocSummary: applyDocSummary
});
  