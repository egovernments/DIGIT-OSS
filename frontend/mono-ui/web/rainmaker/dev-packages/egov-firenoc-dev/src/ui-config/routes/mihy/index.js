import React from "react";
import Loadable from 'react-loadable';
import * as mainRouteConstants from "./route-names";
import LoadingIndicator from 'egov-ui-framework/ui-molecules/LoadingIndicator';

const Loading = () => <LoadingIndicator/>;


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
