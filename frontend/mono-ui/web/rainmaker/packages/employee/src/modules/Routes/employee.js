// User related routes
import Login from "modules/employee/User/Login";
import OTP from "modules/employee/User/OTP";
import LanguageSelection from "modules/employee/User/LanguageSelection";
import ChangePassword from "modules/employee/User/ChangePassword";
import Profile from "modules/employee/User/Profile";
import ForgotPassword from "modules/employee/User/ForgotPassword";
import PushLocalization from "modules/employee/PushLocalization";

// Employee specific routes
import { TrackLocation } from "modules/common";
import { ImageModalDisplay } from "modules/common";
import { PrivacyPolicy } from "modules/common";
import LandingPage from "modules/employee/LandingPage";
import Inbox from "modules/employee/Inbox";
import MDMS from "modules/common/MDMS";
import Home from "modules/employee/Home";
import Report from "modules/employee/reports/report";
import EGFFinance from "modules/employee/Erp/EGF";
import Notifications from "modules/employee/Notifications";

import pgrRoutes from "pgr-employee/Routes/pgr-routes";
import ptRoutes from "pt-employee/Routes/pt-routes";
import frameworkScreens from "./frameworkScreens";
import externalRoutes from "./exterenalURL";

// import PTHome from "modules/employee/PropertyTax/PTHome";

//Redirection Url
const redirectionUrl = "/user/login";

const routes = [
  {
    path: "user/login",
    component: Login,
    needsAuthentication: false,
    redirectionUrl: "/inbox",
  },
  {
    path: "user/otp",
    component: OTP,
    needsAuthentication: false,
    redirectionUrl: "/inbox",
  },
  {
    path: "forgot-password",
    component: ForgotPassword,
    needsAuthentication: false,
    // redirectionUrl: "/inbox",
  },
  {
    path: "language-selection",
    component: LanguageSelection,
    needsAuthentication: false,
    redirectionUrl: "/user/login",
  },
  {
    path: "privacy-policy",
    component: PrivacyPolicy,
    needsAuthentication: false,
    redirectionUrl: "/",
  },
  {
    path: "user/change-password",
    component: ChangePassword,
    needsAuthentication: true,
    options: { hideFooter: true, title: "CORE_COMMON_CHANGE_PASSWORD" },
  },
  {
    path: "user/profile",
    component: Profile,
    needsAuthentication: true,
    options: { hideFooter: true, title: "CS_HOME_HEADER_PROFILE" },
  },
  {
    path: "notifications",
    component: Notifications,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideTitle: true,
      isHomeScreen: true,
      hideFor: "ao",
      customFor: "csr",
    },
  },
  {
    path: "services/*",
    component: EGFFinance,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideTitle: true,
      isHomeScreen: true,
      hideFor: "ao",
      customFor: "csr",
    },
  },
  {
    path: "landing-page",
    component: LandingPage,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      redirectionUrl,
      title: "Home",
      hideTitle: true,
      isHomeScreen: true,
    },
  },
  {
    path: "inbox",
    component: Inbox,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      redirectionUrl,
      title: "Inbox",
      hideTitle: true,
      isHomeScreen: true,
    },
  },
  {
    path: "image",
    component: ImageModalDisplay,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideTitle: true,
      hideHeader: true,
    },
  },
  {
    path: "mdms/:moduleName/:masterName",
    component: MDMS,
    needsAuthentication: true,
    options: {
      title: "CS_HEADER_MDMS_COMMON",
      hideFooter: true,
      redirectionUrl,
    },
  },
  {
    path: "/",
    component: Home,
    needsAuthentication: true,
    options: {
      title: "COMMON_BOTTOM_NAVIGATION_HOME",
      hideFooter: false,
      redirectionUrl: "/user/login",
      //isHomeScreen: true,
    },
  },
  {
    path: "map",
    component: TrackLocation,
    needsAuthentication: true,
    options: { hideHeader: true, hideFooter: true, title: "CS_HEADER_TRACK_LOCATION", hideTitle: true, hideActionMenu: true },
  },
  {
    path: "report/:moduleName/:reportName",
    component: Report,
    needsAuthentication: true,

    options: {
      hideFooter: true,
      title: "CS_PGR_REPORTS_HEADER",
      hideTitle: true,
      redirectionUrl,
    },
  },
  {
    path: "push-localization",
    component: PushLocalization,
    needsAuthentication: true,

    options: {
      hideFooter: true,
      title: "CS_PUSH_LOCALIZATION",
      hideTitle: true,
      redirectionUrl,
    },
  },
  ...pgrRoutes,
  ...ptRoutes,
  ...frameworkScreens,
  ...externalRoutes,
];

export default routes;
