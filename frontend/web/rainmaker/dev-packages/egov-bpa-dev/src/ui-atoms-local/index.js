import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const TestAtoms = Loadable({
  loader: () => import("./TestAtoms"),
  loading: () => <Loading />
});

const downloadFile = Loadable({
  loader: () => import("./downloadFile"),
  loading: () => <Loading />
});

const ApplicationNoContainer = Loadable({
  loader: () => import("./ApplicationNo"),
  loading: () => <Loading />
});

const Checkbox = Loadable({
  loader: () => import("./Checkbox"),
  loading: () => <Loading />
});

const MapLocation = Loadable({
  loader: () => import("./MapLocation"),
  loading: () => <Loading />
});

const AutoSuggest = Loadable({
  loader: () => import("./AutoSuggest"),
  loading: () => <Loading />
});

const Asteric = Loadable({
  loader: () => import("./Asteric"),
  loading: () => <Loading />
});

const MenuButton = Loadable({
  loader: () => import("./MenuButton"),
  loading: () => <Loading />
});

const FormIcon = Loadable({
  loader: () => import("./Icons/FormIcon"),
  loading: () => <Loading />
});

// const ApplicationNumber = Loadable({
//   loader: () => import("./ApplicationNumber"),
//   loading: () => <Loading />
// });

const TradeLicenseIcon = Loadable({
  loader: () => import("./Icons/TradeLicenseIcon"),
  loading: () => <Loading />
});

const PermitNumber = Loadable({
  loader: () => import("./PermitNumber"),
  loading: () => <Loading />
});

const MenuListCompositionForBpa = Loadable({
  loader: () => import("./MenuListCompositionForBpa"),
  loading: () => <Loading />
});

export {
  TestAtoms,
  AutoSuggest,
  downloadFile,
  FormIcon,
  //ApplicationNumber,
  ApplicationNoContainer,
  Checkbox,
  MapLocation,
  Asteric,
  MenuButton,
  TradeLicenseIcon,
  PermitNumber,
  MenuListCompositionForBpa
};
