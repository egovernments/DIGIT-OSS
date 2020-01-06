import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestMolecules = Loadable({
  loader: () => import("./TestMolecules"),
  loading: () => <Loading />
});
const RadioButtonsGroup = Loadable({
  loader: () => import("./RadioGroup"),
  loading: () => <Loading />
});

const Tooltip = Loadable({
  loader: () => import("./Tooltip"),
  loading: () => <Loading />
});

const CustomTab = Loadable({
  loader: () => import("./CustomTab"),
  loading: () => <Loading />
});

const UploadSingleFile = Loadable({
  loader: () => import("./UploadSingleFile"),
  loading: () => <Loading />
});

const DocumentList = Loadable({
  loader: () => import("./DocumentList"),
  loading: () => <Loading />
});

// const AutoSelector = Loadable({
//   loader: () => import("./AutoSelector"),
//   loading: () => <Loading />
// });

const MapLocator = Loadable({
  loader: () => import("./MapLocator"),
  loading: () => <Loading />
});

const FeesEstimateCard = Loadable({
  loader: () => import("./FeesEstimateCard"),
  loading: () => <Loading />
});

const HowItWorks = Loadable({
  loader: () => import("./HowItWorks"),
  loading: () => <Loading />
});

const MyConnections = Loadable({
  loader: () => import("./MyConnections"),
  loading: () => <Loading />
});

const MeterReading = Loadable({
  loader: () => import("./MeterReading"),
  loading: () => <Loading />
});

const PastPayments = Loadable({
  loader: () => import("./PastPayments"),
  loading: () => <Loading />
});

const PastPaymentsDetails = Loadable({
  loader: () => import("./PastPaymentsDetails"),
  loading: () => <Loading />
});

const DividerWithLabel = Loadable({
  loader: () => import("./DividerWithLabel"),
  loading: () => <Loading />
});

const MeterReadingEditable = Loadable({
  loader: () => import("./MeterReadingEditable"),
  loading: () => <Loading />
})

// const PropertyTaxDetails = Loadable({
//   loader: () => import("./PropertyTaxDetails"),
//   loading: () => <Loading />
// })

export {
  TestMolecules,
  RadioButtonsGroup,
  Tooltip,
  CustomTab,
  UploadSingleFile,
  DocumentList,
  MapLocator,
  FeesEstimateCard,
  HowItWorks,
  PastPayments,
  DividerWithLabel,
  MyConnections,
  PastPaymentsDetails,
  MeterReading,
  MeterReadingEditable,
  // PropertyTaxDetails
};
