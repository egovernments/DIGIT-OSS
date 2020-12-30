import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "../ui-atoms/LinearSpinner";
const Loading = () => <LinearProgress />;
const RenderRoutes = Loadable({
  loader: () => import("./RenderRoutes"),
  loading: () => <Loading />
});
const Map = Loadable({
  loader: () => import("./Map"),
  loading: () => <Loading />
});
const ComponentInterface = Loadable({
  loader: () => import("./ComponentInterface"),
  loading: () => <Loading />
});
const StepperNonLinearWithoutAction = Loadable({
  loader: () => import("./StepperNonLinearWithoutAction"),
  loading: () => <Loading />
});
const CardWithMedia = Loadable({
  loader: () => import("./CardWithMedia"),
  loading: () => <Loading />
});
const RenderScreen = Loadable({
  loader: () => import("./RenderScreen"),
  loading: () => <Loading />
});
const AppliedRoute = Loadable({
  loader: () => import("./AppliedRoute"),
  loading: () => <Loading />
});
const LoadingIndicator = Loadable({
  loader: () => import("./LoadingIndicator"),
  loading: () => <Loading />
});
const CommonView = Loadable({
  loader: () => import("./CommonView"),
  loading: () => <Loading />
});

const AppCard = Loadable({
  loader: () => import("./AppCard"),
  loading: () => <Loading />
});

const AppCards = Loadable({
  loader: () => import("./AppCards"),
  loading: () => <Loading />
});

const AppCarosel = Loadable({
  loader: () => import("./AppCarosel"),
  loading: () => <Loading />
});

const AppSubOption = Loadable({
  loader: () => import("./AppSubOption"),
  loading: () => <Loading />
});

const Stepper = Loadable({
  loader: () => import("./Stepper"),
  loading: () => <Loading />
});

// const Carousel = Loadable({
//   loader: () => import("./Carousel"),
//   loading: () => <Loading />
// });

const StepperStaticVertical = Loadable({
  loader: () => import("./StepperStaticVertical"),
  loading: () => <Loading />
});

const TextfieldWithIcon = Loadable({
  loader: () => import("./TextfieldWithIcon"),
  loading: () => <Loading />
});

const StepperStaticVerticalWithTab = Loadable({
  loader: () => import("./StepperStaticVerticalWithTab"),
  loading: () => <Loading />
});

const TooltipWithChildren = Loadable({
  loader: () => import("./TooltipWithChildren"),
  loading: () => <Loading />
});

const DocumentList = Loadable({
  loader: () => import("./DocumentList"),
  loading: () => <Loading />
});

const FeesEstimateCard = Loadable({
  loader: () => import("./FeesEstimateCard"),
  loading: () => <Loading />
});

const MultiDownloadCard = Loadable({
  loader: () => import("./MultiDownloadCard"),
  loading: () => <Loading />
});

const RadioGroup = Loadable({
  loader: () => import("./RadioGroup"),
  loading: () => <Loading />
});

const CustomTab = Loadable({
  loader: () => import("./CustomTab"),
  loading: () => <Loading />
});

const Tooltip = Loadable({
  loader: () => import("./Tooltip"),
  loading: () => <Loading />
});

const TaskDialog = Loadable({
  loader: () => import("./TaskDialog"),
  loading: () => <Loading />
});

const TaskStatusComponents = Loadable({
  loader: () => import("./TaskStatusComponents"),
  loading: () => <Loading />
});
const UploadMultipleFiles = Loadable({
  loader: () => import("./UploadMultipleFiles"),
  loading: () => <Loading />
});

const Table = Loadable({
  loader: () => import("./Table"),
  loading: () => <Loading />
});

const LandingPage = Loadable({
  loader: () => import("./LandingPage"),
  loading: () => <Loading />
});

const SingleApplication = Loadable({
  loader: () => import("./SingleApplication"),
  loading: () => <Loading />
});

const MenuButton = Loadable({
  loader: () => import("./MenuButton"),
  loading: () => <Loading />
});

const DownloadPrintButton = Loadable({
  loader: () => import("./DownloadPrintButton"),
  loading: () => <Loading />
});



export {
  RenderRoutes,
  Map,
  ComponentInterface,
  StepperNonLinearWithoutAction,
  CardWithMedia,
  RenderScreen,
  AppliedRoute,
  LoadingIndicator,
  CommonView,
  AppCard,
  AppCards,
  AppCarosel,
  AppSubOption,
  Stepper,
  // Carousel,
  StepperStaticVertical,
  TextfieldWithIcon,
  StepperStaticVerticalWithTab,
  TooltipWithChildren,
  DocumentList,
  FeesEstimateCard,
  MultiDownloadCard,
  RadioGroup,
  CustomTab,
  Tooltip,
  Table,
  TaskDialog,
  TaskStatusComponents,
  UploadMultipleFiles,
  LandingPage,
  SingleApplication,
  MenuButton,
  DownloadPrintButton
};
