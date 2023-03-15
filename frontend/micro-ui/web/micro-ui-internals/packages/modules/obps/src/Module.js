import React from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { Loader, CitizenHomeCard, OBPSIcon, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";
import CitizenApp from "./pages/citizen";
import Inbox from "./pages/employee/Inbox";
import stakeholderInbox from "./pages/employee/stakeholderInbox";

import BPACitizenHomeScreen from "./pages/citizen/home";
import EDCRForm from "./pageComponents/EDCRForm";
import BasicDetails from "./pageComponents/BasicDetails";
import DocsRequired from "./pageComponents/DocsRequired";
import PlotDetails from "./pageComponents/PlotDetails";
import ScrutinyDetails from "./pageComponents/ScrutinyDetails";
import OwnerDetails from "./pageComponents/OwnerDetails";
import DocumentDetails from "./pageComponents/DocumentDetails";
import NOCDetails from "./pageComponents/NOCDetails";
import LocationDetails from "./pageComponents/LocationDetails";
import StakeholderDocsRequired  from "./pageComponents/StakeholderDocsRequired";
import GIS from "./pageComponents/GIS";
import OCEDCRDocsRequired from "./pageComponents/OCEDCRDocsRequired";
import OCeDCRScrutiny from "./pageComponents/OCeDCRScrutiny";
import OCUploadPlanDiagram from "./pageComponents/OCUploadPlanDiagram";
import OCBasicDetails from "./pageComponents/OCBasicDetails";
import CreateEDCR from "./pages/citizen/EDCR";
import CreateOCEDCR from "./pages/citizen/OCEDCR";
import NewBuildingPermit from "./pages/citizen/NewBuildingPermit";
import OCBuildingPermit from "./pages/citizen/OCBuildingPermit";
import StakeholderRegistration from "./pages/citizen/StakeholderRegistration";
import CitizenBpaApplicationDetail from "./pages/citizen/BpaApplicationDetail";
import BPASendToArchitect from "./pages/citizen/BPASendToArchitect";
import OCSendToArchitect from "./pages/citizen/OCSendToArchitect";
import BPASendBackToCitizen from "./pages/citizen/BPASendBackToCitizen";
import OCSendBackToCitizen from "./pages/citizen/OCSendBackToCitizen";
import EdcrInbox from "./pages/citizen/EdcrInbox";

import LicenseType from "./pageComponents/LicenseType";
import LicenseDetails from "./pageComponents/LicenseDetails";
import CorrospondenceAddress from "./pageComponents/CorrospondenceAddress";
import PermanentAddress from "./pageComponents/PermanentAddress";
import StakeholderDocuments from "./pageComponents/StakeholderDocuments";
import EmployeeApp from "./pages/employee";
import OBPSSearchApplication from "./components/SearchApplication";
import InspectionReport from "./pageComponents/InspectionReport";
import OBPSEmployeeHomeCard from "./pages/employee/EmployeeCard";
import EmpApplicationDetail from "./pages/employee/ApplicationDetail";
import EmployeeBpaApplicationDetail from "./pages/employee/BpaApplicationDetails";

import BPACheckPage from "./pages/citizen/NewBuildingPermit/CheckPage";
import OCBPACheckPage from "./pages/citizen/OCBuildingPermit/CheckPage";
import OCBPASendBackCheckPage from "./pages/citizen/OCSendBackToCitizen/CheckPage";
import StakeholderCheckPage from "./pages/citizen/StakeholderRegistration/CheckPage";
import EDCRAcknowledgement from "./pages/citizen/EDCR/EDCRAcknowledgement";
import OCEDCRAcknowledgement from "./pages/citizen/OCEDCR/EDCRAcknowledgement";
import BPAAcknowledgement from "./pages/citizen/NewBuildingPermit/OBPSAcknowledgement";
import OCBPAAcknowledgement from "./pages/citizen/OCBuildingPermit/OBPSAcknowledgement";
import OCSendBackAcknowledgement from "./pages/citizen/OCSendBackToCitizen/Acknowledgement";
import StakeholderAcknowledgement from "./pages/citizen/StakeholderRegistration/StakeholderAcknowledgement";
 

const OBPSModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = ["bpa", "bpareg", "common"]; //"bpa";
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  Digit.SessionStorage.set("OBPS_TENANTS", tenants);

  if (isLoading) {
    return <Loader />;
  }

  if (userType === "citizen") {
    return <CitizenApp path={path} stateCode={stateCode} />;
  }

  return <EmployeeApp path={path} stateCode={stateCode} />
}

const OBPSLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();

  const links = [
    {
      link: `${matchPath}/my-applications`,
      i18nKey: t("BPA_CITIZEN_HOME_VIEW_APP_BY_CITIZEN_LABEL"),
    },
    {
      link: `${matchPath}/stakeholder/apply/stakeholder-docs-required`,
      i18nKey: t("BPA_CITIZEN_HOME_STAKEHOLDER_LOGIN_LABEL"),
    },
    {
      link: `${matchPath}/home`,
      i18nKey: t("BPA_CITIZEN_HOME_ARCHITECT_LOGIN_LABEL"),
    },
  ];

  return (
    <CitizenHomeCard header={t("ACTION_TEST_BUILDING_PLAN_APPROVAL")} links={links} Icon={() => <OBPSIcon />}
      Info={() => <CitizenInfoLabel style={{margin: "0px", padding: "10px"}} info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t(`BPA_CITIZEN_HOME_STAKEHOLDER_INCLUDES_INFO_LABEL`)} />} isInfo={true}
    />
  );
} 

const componentsToRegister = {
  OBPSModule,
  OBPSLinks,
  OBPSCard:OBPSEmployeeHomeCard,
  BPACitizenHomeScreen,
  EDCRForm,
  BasicDetails,
  DocsRequired,
  PlotDetails,
  ScrutinyDetails,
  OwnerDetails,
  DocumentDetails,
  NOCDetails,
  LocationDetails,
  GIS,
  OCEDCRDocsRequired,
  OCeDCRScrutiny,
  OCUploadPlanDiagram,
  StakeholderDocsRequired,
  LicenseType,
  LicenseDetails,
  CorrospondenceAddress,
  PermanentAddress,
  StakeholderDocuments,
  OCBasicDetails,
  OBPSSearchApplication,
  InspectionReport,
  BPAInbox: Inbox,
  StakeholderInbox: stakeholderInbox,
  StakeholderCheckPage,
  BPACheckPage,
  OCBPACheckPage,
  OCBPASendBackCheckPage,
  EDCRAcknowledgement,
  OCEDCRAcknowledgement,
  BPAAcknowledgement,
  OCBPAAcknowledgement,
  OCSendBackAcknowledgement,
  StakeholderAcknowledgement,
  ObpsCreateEDCR : CreateEDCR,
  ObpsCreateOCEDCR : CreateOCEDCR,
  ObpsNewBuildingPermit : NewBuildingPermit,
  ObpsOCBuildingPermit : OCBuildingPermit,
  ObpsStakeholderRegistration : StakeholderRegistration,
  ObpsCitizenBpaApplicationDetail : CitizenBpaApplicationDetail,
  ObpsBPASendToArchitect : BPASendToArchitect,
  ObpsOCSendToArchitect : OCSendToArchitect,
  ObpsBPASendBackToCitizen : BPASendBackToCitizen,
  ObpsOCSendBackToCitizen : OCSendBackToCitizen,
  ObpsEdcrInbox : EdcrInbox,
  ObpsEmpApplicationDetail : EmpApplicationDetail,
  ObpsEmployeeBpaApplicationDetail : EmployeeBpaApplicationDetail
}

export const initOBPSComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};