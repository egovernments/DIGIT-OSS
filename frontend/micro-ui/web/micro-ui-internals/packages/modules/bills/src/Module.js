import React, { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EmployeeApp from "./pages/employee";
import BillsCard from "./billHomeCard";
import BillsFilter from "./components/BillsFilter";
import BillInbox from "./pages/employee/SearchBill/BillInbox";
import ActionModal from "./components/Modal";
import BillDetails from "./pages/employee/BillDetails";
import Banner from "./components/Banner";
import GroupFilter from "./pages/employee/GroupBill/GroupFilter";
import Inbox from "./pages/citizen/SearchBill/Inbox";
import ApplicationCitizenCard from "./components/citizen/ApplicationCitizenCard";
import SearchCitizen from "./components/citizen/SearchCitizen";
import SearchCitizenFilter from "./components/citizen/SearchCitizenFilter";
import CitizenInbox from "./components/citizen/inbox";
import CitizenMobileInbox from "./components/citizen/CitizenMobileInbox";
import CitizenApp from "./pages/citizen";
import { CitizenHomeCard, CollectionIcon } from "@egovernments/digit-ui-react-components";
import CancelBills from "./components/CancelBill"; 
import GroupBills from "./components/GroupBill"; 

export const BillsModule = ({ stateCode, userType, tenants }) => {
  const tenantId =  Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();
  const moduleCode = ["abg","ws", "pt", "common", tenantId, "bill-amend"];

  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  const { path, url } = useRouteMatch();

  Digit.SessionStorage.set("BILLS_TENANTS", tenants);

  if (userType === "employee") {
    return <EmployeeApp path={path} url={url} userType={"employee"} />;
  } else return <CitizenApp />;
};

export const BillsLinks = ({ matchPath }) => {
  const { t } = useTranslation();

  const links = [
    {
      link: `${matchPath}/billSearch`,
      i18nKey: t("ABG_SEARCH_BILL_COMMON_HEADER"),
    },
  ];
  return <CitizenHomeCard header={t("ACTION_TEST_BILLGENIE")} links={links} Icon={() => <CollectionIcon className="fill-path-primary-main" />} />;
};

const componentsToRegister = {
  BillsModule,
  BillsCard,
  BillInbox: BillInbox,
  BillDetails: BillDetails,
  ActionModal,
  Banner,
  CitizenInbox,
  SearchCitizen,
  ApplicationCitizenCard,
  SearchCitizenFilter,
  CitizenMobileInbox,
  BillsLinks,
  CancelBills,
  GroupBills,
  BILLS_INBOX_FILTER: (props) => <BillsFilter {...props} />,
  BILLS_GROUP_FILTER: (props) => <GroupFilter {...props} />,
  CITIZEN_SEARCH_FILTER: (props) => <SearchCitizenFilter {...props} />,
};

export const initBillsComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
