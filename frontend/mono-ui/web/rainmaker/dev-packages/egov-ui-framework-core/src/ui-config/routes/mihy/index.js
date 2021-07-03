import React from "react";
import Loadable from 'react-loadable';
import LinearProgress from '../../../ui-atoms/LinearSpinner';
import * as mainRouteConstants from "./route-names";

const Loading = () => <LinearProgress/>;

const ScreenInterface=Loadable({
  loader:()=>import ('ui-views/ScreenInterface'),
  loading:Loading
})

const mainRoutes = [
  {
    path:mainRouteConstants.SCREEN_INTERFACE,
    component:ScreenInterface
  }
];

export default mainRoutes;
