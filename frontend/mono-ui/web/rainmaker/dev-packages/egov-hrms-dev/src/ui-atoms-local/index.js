import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestAtoms = Loadable({
  loader: () => import("./TestAtoms"),
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

const UploadFile = Loadable({
  loader: () => import("./UploadFile"),
  loading: () => <Loading />
});

const UploadedDocument = Loadable({
  loader: () => import("./UploadedDocument"),
  loading: () => <Loading />
});

const MapLocation = Loadable({
  loader: () => import("./MapLocation"),
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

const Switch = Loadable({
  loader: () => import("./MenuButton"),
  loading: () => <Loading />
});

const AutoSuggest = Loadable({
  loader: () => import("./AutoSuggest"),
  loading: () => <Loading />
});
const DisableBackComponent = Loadable({
  loader:()=>import("./DisableBackComponent"),
  loading:()=><Loading/>
})
export {
  TestAtoms,
  ApplicationNoContainer,
  UploadFile,
  Checkbox,
  UploadedDocument,
  MapLocation,
  Asteric,
  MenuButton,
  Switch,
  AutoSuggest,
  DisableBackComponent
};
