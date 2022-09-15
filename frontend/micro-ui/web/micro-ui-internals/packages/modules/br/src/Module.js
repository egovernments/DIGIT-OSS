import {  CitizenHomeCard, PTIcon , Loader} from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import CitizenApp from "./pages/citizen";
import Create from "./pages/citizen/create/index";
import EmployeeApp from "./pages/employee";
import BrSelectName from "./pagecomponents/BrSelectName";
import BrSelectPhoneNumber from "./pagecomponents/BrSelectPhoneNumber";
import BRSelectGender from "./pagecomponents/BRSelectGender";
import BRSelectEmailId from "./pagecomponents/SelectEmailId";
import BRSelectPincode from "./pagecomponents/BRSelectPincode";
import BrSelectAddress from "./pagecomponents/BrSelectAddress";
import SelectCorrespondenceAddress from "./pagecomponents/SelectCorrespondenceAddress";
import SelectDocuments from "./pagecomponents/SelectDocuments";
import BRCard from "./components/config/BRCard";
import BRManageApplication from "./pages/employee/BRManageApplication";
import RegisterDetails from "./pages/employee/RegisterDetails";
import Response from "./pages/citizen/create/Response";
import Inbox from "./pages/employee/Inbox/Inbox";
import DesktopInbox from "./pages/employee/Inbox/DesktopInbox";
import ResponseEmployee from "./pages/employee/ResponseEmployee";
import BrSelectFather from "./pagecomponents/BrSelectFather";
import BrSelectMother from "./pagecomponents/BrSelectMother";
import BrSelectMotherPhone from "./pagecomponents/BrSelectMotherPhone";

const componentsToRegister = {
  BrSelectMotherPhone,
  ResponseEmployee,
  DesktopInbox,
  Inbox,
  Response,
  RegisterDetails,
  BRManageApplication,
  BRCard,
  SelectDocuments,
  SelectCorrespondenceAddress,
  BrSelectAddress,
  BRSelectPincode,
  BRSelectEmailId,
  BRSelectGender,
  BrSelectPhoneNumber,
  BrSelectName,
  BrSelectFather,
  BrSelectMother,
  BRCreate : Create,
};

export const BRModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();

  const moduleCode = "BR";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (isLoading) {
    return <Loader />;
  }
  Digit.SessionStorage.set("BR_TENANTS", tenants);

  if (userType === "citizen") {
    return <CitizenApp path={path} stateCode={stateCode}  userType={userType} tenants={tenants} />;
  }

  return <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} />;
};

export const BRLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();


  const links = [
  
    {
      link: `${matchPath}/birth`,
      i18nKey: t("Create BirthRegistration"),
    },
 

   
  ];

  return <CitizenHomeCard header={t("BirthRegistration")} links={links} Icon={() => <PTIcon className="fill-path-primary-main" />} />;
};

export const initBRComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

