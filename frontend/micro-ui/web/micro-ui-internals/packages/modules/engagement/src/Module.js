import { Loader, BreadCrumb } from "@egovernments/digit-ui-react-components";
import React, {Fragment} from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, useRouteMatch, Route } from "react-router-dom";


import EngagementCard from "./components/EngagementCard";
import EngagementDocSelectULB from "./components/Documents/EngagementDocsULB";
import EngagementULBDropdown from "./components/Documents/EngagementULBDropdown";
import EnagementDocName from "./components/Documents/engagement-doc-name";
import EngagementDocCategory from "./components/Documents/engagement-doc-category";
import EngagementDocDescription from "./components/Documents/engagement-doc-description";
import EngagementDocUploadDocument from "./components/Documents/engagement-doc-documents";
import NewEvent from "./pages/employee/Events/NewEvent";
import EditEvent from "./pages/employee/Events/EditEvent";
import Response from "./pages/employee/Events/NewEvent/Response";
import Inbox from "./pages/employee/Events/Inbox";
import Messages from "./pages/employee/Messages";
import EventForm from "./components/Events/EventForm";
import MessageForm from "./components/Messages/MessageForm";
import SelectEventGeolocation from "./components/Events/SelectGeoLocation";
import SelectToDate from "./components/Events/SelectToDate";
import NotificationsAndWhatsNew from "./pages/citizen/NotificationsAndWhatsNew";
import EventsListOnGround from "./pages/citizen/EventsListOnGround";
import EmployeeEventDetails from "./pages/employee/Events/EventDetails";
import CitizenApp from "./pages/citizen";
import EventDetails from "./pages/citizen/EventsListOnGround/EventDetails";
import DocumenetCreate from "./pages/employee/Documents/documents-create";
import DocumentUpdate from './pages/employee/Documents/documents-update';
import DocumentResponse from "./pages/employee/Documents/response";
import DocUpdateResponse from "./pages/employee/Documents/update-response";
import DocDeleteResponse from "./pages/employee/Documents/delete-response";
import DocumentNotification from "./pages/employee/Documents/Inbox";
import DocumentList from './pages/citizen/Documents/DocumentList';
import SurveyList from "./pages/citizen/CitizenSurvey/SurveyList"
import DocumentDetails from "./components/Documents/DocumentDetails";
import Surveys from "./pages/employee/CitizenSurveys";
import FillSurvey from './pages/citizen/CitizenSurvey/FillSurvey'
import CitizenSurveyForm from './components/Surveys/CitizenSurveyForm';
import ShowSurvey from './pages/citizen/CitizenSurvey/ShowSurvey'
 
import SurveyResults from "./pages/employee/CitizenSurveys/SurveyResults";
const EventsBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("ES_COMMON_HOME"),
      show: true,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/event/inbox`,
      content: t("ES_EVENT_INBOX"),
      show: location.pathname.includes("event/inbox") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/event/new-event`,
      content: t("ES_EVENT_NEW_EVENT"),
      show: location.pathname.includes("event/new-event") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/event/inbox/new-event`,
      content: t("ES_EVENT_NEW_EVENT"),
      show: location.pathname.includes("event/inbox/new-event") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/event/inbox/event-details`,
      content: t("ES_EVENT_EVENT_DETAILS"),
      show: location.pathname.includes("event-details") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/event/edit-event`,
      content: t("ES_EVENT_EDIT_EVENT"),
      show: location.pathname.includes("event/edit-event") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/event/response`,
      content: t("ES_EVENT_NEW_EVENT_RESPONSE"),
      show: location.pathname.includes("event/response") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/documents/inbox`,
      content: t("ES_EVENT_INBOX"),
      show: location.pathname.includes("/documents/inbox") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/documents/new-doc`,
      content: t("NEW_DOCUMENT_TEXT"),
      show: location.pathname.includes("/documents/new-doc") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/documents/inbox/new-doc`,
      content: t("NEW_DOCUMENT_TEXT"),
      show: location.pathname.includes("/documents/inbox/new-doc") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/documents/response`,
      content: t("ES_EVENT_NEW_EVENT_RESPONSE"),
      show: location.pathname.includes("/documents/response") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/documents/delete-response`,
      content: t("ES_EVENT_NEW_EVENT_RESPONSE"),
      show: location.pathname.includes("/documents/delete-response") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/documents/update-response`,
      content: t("ES_EVENT_NEW_EVENT_RESPONSE"),
      show: location.pathname.includes("/documents/update-response") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/documents/inbox/details/:id`,
      content: t("CE_DOCUMENT_DETAILS"),
      show: location.pathname.includes("/documents/inbox/details") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/documents/inbox/update`,
      content: t("DOCUMENTS_EDIT_HEADER"),
      show: location.pathname.includes("/documents/inbox/update") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/messages/inbox`,
      content: t("ES_EVENT_INBOX"),
      show: location.pathname.includes("/messages/inbox") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/messages/create`,
      content: t("NEW_PUBLIC_BRDCST"),
      show: location.pathname.includes("/messages/create") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/messages/inbox/create`,
      content: t("NEW_PUBLIC_BRDCST"),
      show: location.pathname.includes("/messages/inbox/create") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/messages/inbox/details/:id`,
      content: t("CS_HEADER_PUBLIC_BRDCST"),
      show: location.pathname.includes("/messages/inbox/details") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/messages/inbox/edit/:id`,
      content: t("EDIT_PUBLIC_BRDCST"),
      show: location.pathname.includes("/messages/inbox/edit") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/messages/response`,
      content: t("ES_EVENT_NEW_EVENT_RESPONSE"),
      show: location.pathname.includes("/messages/response") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/messages/response?update=true`,
      content: t("ES_EVENT_NEW_EVENT_RESPONSE"),
      show: location.pathname.includes("/messages/response?update=true") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/messages/response?delete=true`,
      content: t("ES_EVENT_NEW_EVENT_RESPONSE"),
      show: location.pathname.includes("/messages/response?delete=true") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/surveys/inbox`,
      content: t("ES_EVENT_INBOX"),
      show: location.pathname.includes("/surveys/inbox") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/surveys/inbox/create`,
      content: t("CS_COMMON_SURVEYS"),
      show: location.pathname.includes("/surveys/inbox/create") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/surveys/create`,
      content: t("CS_COMMON_SURVEYS"),
      show: location.pathname.includes("/surveys/create") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/engagement/survey/create-response`,
      content: t("ES_EVENT_NEW_EVENT_RESPONSE"),
      show: location.pathname.includes("/engagement/survey/create-response") ? true : false,
    },
  ];

  return <BreadCrumb crumbs={crumbs} />;
};

const EmployeeApp = ({ path, url, userType, tenants }) => {
  const location = useLocation();

  return (
    // <div className="ground-container">
    <>
      <EventsBreadCrumb location={location} />
      <Switch>
       
        <Route path={`${path}/event/inbox`} exact>
          <Inbox tenants={tenants} parentRoute={path} />
        </Route>
        <Route path={`${path}/event/response`} component={(props) => <Response {...props} />} />
        <Route path={`${path}/event/inbox/new-event`}>
          <NewEvent />
        </Route>
        <Route path={`${path}/event/new-event`}>
          <NewEvent />
        </Route>
        <Route path={`${path}/event/edit-event/:id`}>
          <EditEvent />
        </Route>
        <Route path={`${path}/event/inbox/event-details/:id`}>
          <EmployeeEventDetails />
        </Route>
        <Route exact path={`${path}/documents/inbox/update`} component={(props) => <DocumentUpdate {...props} />} />
        <Route exact path={`${path}/documents/inbox/new-doc`} component={() => <DocumenetCreate {...{ path }} />} />
        <Route exact path={`${path}/documents/new-doc`} component={() => <DocumenetCreate {...{ path }} />} />
        <Route path={`${path}/documents/inbox/details/:id`} component={(props) => <DocumentDetails {...props} />} />
        <Route path={`${path}/documents/response`} component={(props) => <DocumentResponse {...props} />} />
        <Route path={`${path}/documents/update-response`} component={(props) => <DocUpdateResponse {...props} />} />
        <Route path={`${path}/documents/delete-response`} component={(props) => <DocDeleteResponse {...props} />} />
        <Route path={`${path}/documents/inbox`} component={(props) => <DocumentNotification tenants={tenants} />} />
        <Route path={`${path}/messages`} component={(props) => <Messages {...props} tenants={tenants} parentRoute={path} />} />
        <Route path={`${path}/surveys`} component={(props)=><Surveys {...props} tenants={tenants} parentRoute={path} />} />
        {/* documents/update-response */}
        {/* <Redirect to={`${path}/docs`} /> */}
      </Switch>
      </>
    // </div>
  );
};

const EngagementModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "Engagement";
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (isLoading) {
    return <Loader />;
  }
  Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);

  if (userType === "citizen") {
    return <CitizenApp path={path} url={url} userType={userType} tenants={tenants} />;
  } else {
    return <EmployeeApp path={path} url={url} userType={userType} tenants={tenants} />;
  }
};

const EngagementLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  if (userType === "citizen") {
    return null;
  } else {
    return (
      <div className="employee-app-container">
        <div className="ground-container">
          <div className="employeeCard">
            <div className="complaint-links-container">
              <div className="header">
                <span className="logo">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"
                      fill="white"
                    ></path>
                  </svg>
                </span>
                <span className="text">{t("ES_TITLE_ENGAGEMENT")}</span>
              </div>
              <div className="body">
                <h1>engagement</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const componentsToRegister = {
  EngagementModule,
  EngagementCard,
  EngagementDocSelectULB,
  EngagementULBDropdown,
  EnagementDocName,
  EngagementDocCategory,
  EngagementDocDescription,
  EngagementDocUploadDocument,
  NotificationsAndWhatsNew,
  EventsListOnGround,
  EventDetails,
  EventForm,
  MessageForm,
  DocumentList,
  SelectEventGeolocation,
  SelectToDate,
  SurveyList,
  FillSurvey,
  CitizenSurveyForm,
  ShowSurvey,
  SurveyResults
};

export const initEngagementComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
