// user routes
import Register from "modules/citizen/User/Register";
import Login from "modules/citizen/User/Login";
import OTP from "modules/citizen/User/OTP";
import LanguageSelection from "modules/citizen/User/LanguageSelection";
import Profile from "modules/citizen/User/Profile";

// common screens

//import LandingPage from "modules/citizen/LandingPage";
import CitizenDashboard from "modules/citizen/CitizenDashboard";
import HowItWorks from "modules/citizen/HowItWorks";
import ContactUs from "modules/citizen/ContactUs";
import MyNotifications from "modules/citizen/MyNotifications";
import WhatsNew from "modules/citizen/WhatsNew";
import { EventDetails } from "modules/common";
import Events from "modules/citizen/Events";
import MyCity from "modules/citizen/MyCity";
import { ImageModalDisplay } from "modules/common";

// pgr specific screens

import { TrackLocation } from "modules/common";
import frameworkScreens from "./frameworkScreens";
import { PrivacyPolicy } from "modules/common";
import TLHowItWorks from "../../ui-views/HowItWorks";
import pgrRoutes from "pgr-citizen/Routes/pgr-routes";
import ptRoutes from "pt-citizen/Routes/pt-routes";

//Whatsapp Screen 
import  WhatsAppCity from "modules/citizen/WhatsAppScreen/City";
import  WhatsAppLocality from "modules/citizen/WhatsAppScreen/Locality";

const routes = [
  {
    path: "user/register",
    component: Register,
    needsAuthentication: false,
    redirectionUrl: "/",
  },
  {
    path: "user/login",
    component: Login,
    needsAuthentication: false,
    redirectionUrl: "/",
  },
  {
    path: "user/otp",
    component: OTP,
    needsAuthentication: false,
    redirectionUrl: "/",
  },
  {
    path: "language-selection",
    component: LanguageSelection,
    needsAuthentication: false,
    redirectionUrl: "/user/register",
  },

  {
    path: "privacy-policy",
    component: PrivacyPolicy,
    needsAuthentication: false,
    redirectionUrl: "/",
  },
  {
    path: "user/profile",
    component: Profile,
    needsAuthentication: true,
    options: { hideFooter: true, title: "CS_HOME_HEADER_PROFILE" },
  },
  // {
  //   path: "pgr-home",
  //   component: PGRHome,
  //   needsAuthentication: true,
  //   options: { isHomeScreen: true, title: "Home", hideTitle: true, redirectionUrl: "/user/register" },
  // },
  {
    path: "/",
    component: CitizenDashboard,
    needsAuthentication: true,
    options: {
      isHomeScreen: true,
      title: "CS_HOME_HEADER_HOME",
      hideTitle: true,
      redirectionUrl: "/user/login",
      notificationButton: true,
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
    path: "contact-us",
    component: ContactUs,
    needsAuthentication: true,
    options: { title: "CS_HOME_HEADER_CONTACT_US", hideFooter: true },
  },
  {
    path: "map",
    component: TrackLocation,
    needsAuthentication: true,
    options: { hideHeader: true, hideFooter: true, title: "CS_HEADER_TRACK_LOCATION", hideTitle: true, hideActionMenu: true },
  },
  {
    path: "how-it-works",
    component: HowItWorks,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HOME_HEADER_HOW_IT_WORKS",
      titleBackground: true, // Use this if you need white background for title in web version
    },
  },
  {
    path: "trade-license/how-it-works",
    component: TLHowItWorks,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideBackButton: true,
      title: "TL_HOW_IT_WORKS",
    },
  },
  {
    path: "notifications",
    component: MyNotifications,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_NOTIFICATIONS",
      helpButton: true,
    },
  },
  {
    path: "my-city",
    component: MyCity,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_MYCITY",
      helpButton: true,
    },
  },
  {
    path: "whats-new",
    component: WhatsNew,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_WHATSNEW",
      helpButton: true,
    },
  },
  {
    path: "events",
    component: Events,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_EVENTS",
      helpButton: true,
    },
  },
  {
    path: "event-details",
    component: EventDetails,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_EVENT_DETAILS",
    },
  },
  {
    path: "openlink/whatsapp/city",
    component:  WhatsAppCity ,
    needsAuthentication: false,
    options: {
      hideFooter: true,
      title: "",
    },
  },
  {
    path: "openlink/whatsapp/locality",
    component:  WhatsAppLocality ,
    needsAuthentication: false,
    options: {
      hideFooter: true,
      title: "",
    },
  },
  ...pgrRoutes,
  ...ptRoutes,
  ...frameworkScreens,
];

export default routes;
