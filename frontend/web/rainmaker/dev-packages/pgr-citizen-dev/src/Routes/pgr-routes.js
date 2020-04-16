import React from "react";
import Loadable from "react-loadable";
// user routes
import Register from "../Screens/User/Register";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import Login from "../Screens/User/Login";
import OTP from "../Screens/User/OTP";
import {
  ReOpenComplaint,
  ReopenAcknowledgement,
  ComplaintType
} from "modules/common";

const Loading = () => <div />;

// pgr citizen specific screens
const MyComplaints = Loadable({
  loader: () => import("../Screens/MyComplaints"),
  loading: Loading
});
const ComplaintDetails = Loadable({
  loader: () => import("../Screens/ComplaintDetails"),
  loading: Loading
});
const ComplaintCreated = Loadable({
  loader: () => import("../Screens/ComplaintCreated"),
  loading: Loading
});
const Feedback = Loadable({
  loader: () => import("../Screens/Feedback"),
  loading: Loading
});
const PGRHome = Loadable({
  loader: () => import("../Screens/Home"),
  loading: Loading
});
const AddComplaint = Loadable({
  loader: () => import("../Screens/AddComplaint"),
  loading: Loading
});
const FeedbackAcknowledge = Loadable({
  loader: () => import("../Screens/FeedbackAcknowledgement"),
  loading: Loading
});

const routes = [
  {
    path: "user/register",
    component: Register,
    needsAuthentication: false,
    redirectionUrl: "/"
  },
  {
    path: "user/login",
    component: Login,
    needsAuthentication: false,
    redirectionUrl: "/"
  },
  {
    path: "user/otp",
    component: OTP,
    needsAuthentication: false,
    redirectionUrl: "/"
  },
  {
    path: "my-complaints",
    component: MyComplaints,
    needsAuthentication: true,
    options: { title: "CS_HOME_MY_COMPLAINTS", hideBackButton:(getQueryArg(window.location.href,"smsLink") === "true"||getQueryArg(window.location.href,"source") === "whatsapp")? true:false }
  },
  {
    path: "complaint-details/:serviceRequestId?",
    component: ComplaintDetails,
    needsAuthentication: true,
    options: { hideFooter: true, title: "CS_HEADER_COMPLAINT_SUMMARY",hideBackButton:(getQueryArg(window.location.href,"smsLink") === "true"||getQueryArg(window.location.href,"source") === "whatsapp")? true:false }
  },
  {
    path: "complaint-submitted",
    component: ComplaintCreated,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_COMPLAINT_SUBMITTED",
      hideTitle: true,
      hideBackButton: true
    }
  },
  {
    path: "feedback/:serviceRequestId?",
    component: Feedback,
    needsAuthentication: true,
    options: {
      title: "CS_HEADER_FEEDBACK",
      titleBackground: true // Use this if you need white background for title in web version
    }
  },
  {
    path: "feedback-acknowledgement",
    component: FeedbackAcknowledge,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideBackButton: true,
      title: "CS_HEADER_FEEDBACK_ACKNOWLEDGEMENT",
      hideTitle: true
    }
  },
  {
    path: "add-complaint",
    component: AddComplaint,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_ADD_COMPLAINT_COMPLAINT_SUBMISSION"
    }
  },
  {
    path: "pgr-home",
    component: PGRHome,
    needsAuthentication: true,
    options: {
      // isHomeScreen: true,
      title: "COMMON_BOTTOM_NAVIGATION_COMPLAINTS",
      hideTitle: true,
      redirectionUrl: "/user/register",
      helpButton: true
    }
  },
  {
    path: "reopen-complaint/:serviceRequestId?",
    component: ReOpenComplaint,
    needsAuthentication: true,
    options: {
      title: "CS_HEADER_REOPEN_COMPLAINT",
      titleBackground: true // Use this if you need white background for title in web version
    }
  },
  {
    path: "reopen-acknowledgement",
    component: ReopenAcknowledgement,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideBackButton: true,
      title: "CS_COMMON_COMPLAINT_REOPENED",
      hideTitle: true
    }
  },
  {
    path: "complaint-type",
    component: ComplaintType,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_ADDCOMPLAINT_COMPLAINT_TYPE",
      hideTitle: true
    }
  }
];

export default routes;
