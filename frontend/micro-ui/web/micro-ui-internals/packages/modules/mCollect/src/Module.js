import { CitizenHomeCard, Loader, PTIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import InboxFilter from "./components/inbox/NewInboxFilter";
import MCollectCard from "./components/MCollectCard";
import EmployeeChallan from "./EmployeeChallan";
import AddressDetails from "./pageComponents/AddressDetails";
import ConsumerDetails from "./pageComponents/ConsumerDetails";
import ServiceDetails from "./pageComponents/ServiceDetails";
import CitizenApp from "./pages/citizen";
import MyChallanResultsComponent from "./pages/citizen/MyChallan";
import SearchChallanComponent from "./pages/citizen/SearchChallan";
import SearchResultsComponent from "./pages/citizen/SearchResults";
import EmployeeApp from "./pages/employee";
import EditChallan from "./pages/employee/EditChallan";
import MCollectAcknowledgement from "./pages/employee/EmployeeChallanAcknowledgement";
import NewChallan from "./pages/employee/NewChallan";

export const MCollectModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "UC";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  Digit.SessionStorage.set("MCollect_TENANTS", tenants);
  if (isLoading) {
    return <Loader />;
  }
  const { path, url } = useRouteMatch();

  if (userType === "employee") {
    return <EmployeeApp path={path} url={url} userType={userType} />;
  } else return <CitizenApp />;
};

export const MCollectLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("PT_CREATE_PROPERTY112", {});

  useEffect(() => {
    clearParams();
  }, []);

  const links = [
    {
      link: `${matchPath}/search`,
      i18nKey: t("UC_SEARCH_AND_PAY"),
    },
    {
      link: `${matchPath}/My-Challans`,
      i18nKey: t("UC_MY_CHALLANS"),
    },
  ];

  return <CitizenHomeCard header={t("ACTION_TEST_MCOLLECT")} links={links} Icon={() => <PTIcon className="fill-path-primary-main" />} />;
};

const componentsToRegister = {
  ConsumerDetails,
  ServiceDetails,
  AddressDetails,
  MCollectCard,
  MCollectModule,
  MCollectLinks,
  MCollectEmployeeChallan: EmployeeChallan,
  MCollectAcknowledgement: MCollectAcknowledgement,
  MCollectEditChallan: EditChallan,
  MCollectNewChallan: NewChallan,
  MCollectSearchChallanComponent: SearchChallanComponent,
  MCollectSearchResultsComponent: SearchResultsComponent,
  MCollectMyChallanResultsComponent: MyChallanResultsComponent,

  MCOLLECT_INBOX_FILTER: (props) => <InboxFilter {...props} />,
};

export const initMCollectComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
