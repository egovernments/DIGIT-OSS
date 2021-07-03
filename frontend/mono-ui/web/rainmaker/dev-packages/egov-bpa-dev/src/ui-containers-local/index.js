import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const CustomTabContainer = Loadable({
  loader: () => import("./CustomTabContainer"),
  loading: () => <Loading />
});

const TestContainer = Loadable({
  loader: () => import("./TestContainer"),
  loading: () => <Loading />
});

const DocumentListContainer = Loadable({
  loader: () => import("./DocumentListContainer"),
  loading: () => <Loading />
});

const BpaDocumentListContainer = Loadable({
  loader: () => import("./BpaDocumentListContainer"),
  loading: () => <Loading />
});

const NocListContainer = Loadable({
  loader: () => import("./NocListContainer"),
  loading: () => <Loading />
});

const LabelContainer = Loadable({
  loader: () => import("./LabelContainer"),
  loading: () => <Loading />
});

const CheckboxContainer = Loadable({
  loader: () => import("./CheckboxContainer"),
  loading: () => <Loading />
});

const DownloadFileContainer = Loadable({
  loader: () => import("./DownloadFileContainer"),
  loading: () => <Loading />
});
const DocumentSummaryContainer = Loadable({
  loader: () => import("./DocumentSummaryContainer"),
  loading: () => <Loading />
});
const PreviewContainer = Loadable({
  loader: () => import("./PreviewContainer"),
  loading: () => <Loading />
});

const EstimateCardContainer = Loadable({
  loader: () => import("./EstimateCardContainer"),
  loading: () => <Loading />
});

const AutosuggestContainer = Loadable({
  loader: () => import("./AutosuggestContainer"),
  loading: () => <Loading />
});

const PaymentRedirectPage = Loadable({
  loader: () => import("./PaymentRedirectPage"),
  loading: () => <Loading />
});

const DialogContainer = Loadable({
  loader: () => import("./DialogContainer"),
  loading: () => <Loading />
});

const ViewBreakupContainer = Loadable({
  loader: () => import("./ViewbreakupDialogContainer"),
  loading: () => <Loading />
});

const RadioGroupWithLabelContainer = Loadable({
  loader: () => import("./RadioGroupWithLabelContainer"),
  loading: () => <Loading />
});

const EDCRUploadCard = Loadable({
  loader: () => import("./EDCRUploadCard"),
  loading: () => <Loading />
});

const BpaEstimateCardContainer = Loadable({
  loader: () => import("./BpaEstimateCardContainer"),
  loading: () => <Loading />
});

const BpaCheckboxContainer =  Loadable({
  loader: () => import("./BpaCheckboxContainer"),
  loading: () => <Loading />
});

const CheckListContainer =  Loadable({
  loader: () => import("./CheckListContainer"),
  loading: () => <Loading />
});

const FeildInspectionCards = Loadable({
  loader: () => import("./FeildInspectionCards"),
  loading: () => <Loading />
});

const FieldInspectionContainer = Loadable({
  loader: () => import("./FieldInspectionContainer"),
  loading: () => <Loading />
});

const BpaConditionsContainer = Loadable({
  loader: () => import("./BpaConditionsContainer"),
  loading: () => <Loading />
});

const DownloadFileContainerForFI = Loadable({
  loader: () => import("./DownloadFileContainerForFI"),
  loading: () => <Loading />
});

export {
  CustomTabContainer,
  LabelContainer,
  CheckboxContainer,
  DownloadFileContainer,
  DocumentSummaryContainer,
  EstimateCardContainer,
  AutosuggestContainer,
  DocumentListContainer,
  BpaDocumentListContainer,
  PaymentRedirectPage,
  ViewBreakupContainer,
  DialogContainer,
  RadioGroupWithLabelContainer,
  EDCRUploadCard,
  NocListContainer,
  BpaEstimateCardContainer,
  BpaCheckboxContainer,
  CheckListContainer,
  FeildInspectionCards,
  FieldInspectionContainer,
  BpaConditionsContainer,
  DownloadFileContainerForFI,
  PreviewContainer
};
