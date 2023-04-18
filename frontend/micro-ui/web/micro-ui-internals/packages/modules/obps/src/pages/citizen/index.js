// import React from "react";
import React, { useEffect, useState } from "react";
import OBPSSearchApplication from "../../components/SearchApplication";
import "bootstrap/dist/css/bootstrap.min.css";
import Search from "../employee/Search";
import { useTranslation } from "react-i18next";
import { Switch, useLocation, Route } from "react-router-dom";
import { PrivateRoute, BackButton } from "@egovernments/digit-ui-react-components";
// import NewBuildingPermit from "./NewBuildingPermit";
// import CreateEDCR from "./EDCR";
// import CreateOCEDCR from "./OCEDCR";
// import BPACitizenHomeScreen from "./home";
// import StakeholderRegistration from "./StakeholderRegistration";
// import Formcontainer from "../citizen/NewLicense/FormContainer/FormContainer";
import Step1 from "../citizen/NewLicense/Step1/Step1";
import Step2 from "../citizen/NewLicense/Step2/Step2";
import Step3 from "../citizen/NewLicense/Step3/Step3";
import Step4 from "../citizen/NewLicense/Step4/Step4";
import Step5 from "../citizen/NewLicense/Step5/Step5";
import AddInfoForm from "../citizen/DeveloperRegistration/AddInfoForm/addInfo";
import MyApplication from "./MyApplication";
import ApplicationDetails from "./ApplicationDetail";
import CommonBank from "./BankGuarantee/Common/Common";
import SubmitNew from "./BankGuarantee/Common/SubmitNew";
import RenewNew from "./BankGuarantee/Common/Renew";
import Replace from "./BankGuarantee/Common/Replace";
import ReleaseNew from "./BankGuarantee/Common/Release";

// import LicenseAddInfo from "../../pageComponents/LicenseAddInfo";
// import OCBuildingPermit from "./OCBuildingPermit";
// import BpaApplicationDetail from "./BpaApplicationDetail";
// import BPASendToArchitect from "./BPASendToArchitect";
// import OCSendToArchitect from "./OCSendToArchitect";
// import BPASendBackToCitizen from "./BPASendBackToCitizen";
// import OCSendBackToCitizen from "./OCSendBackToCitizen";
import Inbox from "./ArchitectInbox";
//import EdcrInbox from "./EdcrInbox";
import OBPSResponse from "../employee/OBPSResponse";
import CommonForm from "../citizen/NewLicense/common/index";
import ScrutinyFormcontainer from "../citizen/NewLicense/ScrutinyContainer/ScrutinyFormContainer";
import ServiceCard from "../citizen/NewLicense/AllService/Service";
import ServicePlanService from "./ServicePlan";
import electricalPlanService from "./ElectricalPlan";
import renewalClu from "./NewLicense/AllService/Module/Renewal/Renewal";
import ZoningPlan from "../citizen/NewLicense/AllService/Module/ZoningPlan/ZoningPlan";
import CardNewLicence from "./NewLicense/CardNewLicence/CadNewLicence";
import Beneficial from "./NewLicense/AllService/Module/BeneficialInterest/Beneficial";
import CompletionLic from "./NewLicense/AllService/Module/CompletionLic/CompletionLic";
import LayoutPlanClu from "./NewLicense/AllService/Module/LayoutPlan/LayoutPlan";
import TransferLicense from "./NewLicense/AllService/Module/TransferLic/TransferLicense";
import SurrenderLic from "./NewLicense/AllService/Module/SurrenderLic/SurrenderLic";
import CompositionClu from "./NewLicense/AllService/Module/CompositionClu/CompositionClu";
import Standard from "./NewLicense/AllService/Module/StandardDesign/StandardDesign";
import ExtensionCom from "./NewLicense/AllService/Module/ExtensionCommunity/ExtensionCom";
import LowMedium from "./NewLicense/AllService/Module/BuildingPlanApproval/LowMedium";
import AdditionalDocument from "./NewLicense/AllService/Module/AdditionalDocument/AdditionalDocument";
import Payment from "./NewLicense/AllService/Module/Payment/Payment";

const App = ({ path }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const BPACitizenHomeScreen = Digit?.ComponentRegistryService?.getComponent("BPACitizenHomeScreen");
  const CreateEDCR = Digit?.ComponentRegistryService?.getComponent("ObpsCreateEDCR");
  const CreateOCEDCR = Digit?.ComponentRegistryService?.getComponent("ObpsCreateOCEDCR");
  const NewBuildingPermit = Digit?.ComponentRegistryService?.getComponent("ObpsNewBuildingPermit");
  const OCBuildingPermit = Digit?.ComponentRegistryService?.getComponent("ObpsOCBuildingPermit");
  const StakeholderRegistration = Digit?.ComponentRegistryService?.getComponent("ObpsStakeholderRegistration");
  // const AddInfoForm = Digit?.ComponentRegistryService?.getComponent('ObpsAddInfoForm');
  const EdcrInbox = Digit?.ComponentRegistryService?.getComponent("ObpsEdcrInbox");
  const BpaApplicationDetail = Digit?.ComponentRegistryService?.getComponent("ObpsCitizenBpaApplicationDetail");
  const BPASendToArchitect = Digit?.ComponentRegistryService?.getComponent("ObpsBPASendToArchitect");
  const OCSendToArchitect = Digit?.ComponentRegistryService?.getComponent("ObpsOCSendToArchitect");
  const BPASendBackToCitizen = Digit?.ComponentRegistryService?.getComponent("ObpsBPASendBackToCitizen");
  const OCSendBackToCitizen = Digit?.ComponentRegistryService?.getComponent("ObpsOCSendBackToCitizen");

  return (
    <React.Fragment>
      {!location.pathname.includes("response") &&
        !location.pathname.includes("openlink/stakeholder") &&
        !location.pathname.includes("/acknowledgement") &&
        !location.pathname.includes("/obps/tab") && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
      <Switch>
        <PrivateRoute path={`${path}/home`} component={BPACitizenHomeScreen} />
        <PrivateRoute path={`${path}/search/application`} component={(props) => <Search {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/edcrscrutiny/apply`} component={CreateEDCR} />
        <PrivateRoute path={`${path}/edcrscrutiny/oc-apply`} component={CreateOCEDCR} />
        <PrivateRoute path={`${path}/bpa/:applicationType/:serviceType`} component={NewBuildingPermit} />
        <PrivateRoute path={`${path}/ocbpa/:applicationType/:serviceType`} component={OCBuildingPermit} />
        <PrivateRoute path={`${path}/stakeholder/apply`} component={StakeholderRegistration} />
        <Route path={`${path}/openlink/stakeholder/apply`} component={StakeholderRegistration} />
        <PrivateRoute path={`${path}/add-info`} component={AddInfoForm} />
        {/* <PrivateRoute path={`${path}/common`} component={Common} /> */}
        <PrivateRoute path={`${path}/tab`} component={CommonForm} />
        <PrivateRoute path={`${path}/bank`} component={CommonBank} />
        <PrivateRoute path={`${path}/electricalPlan`} component={electricalPlanService} />
        <Route path={`${path}/card`} component={CardNewLicence} />
        <PrivateRoute path={`${path}/servicePlan`} component={ServicePlanService} />
        <PrivateRoute path={`${path}/submitNew`} component={SubmitNew} />
        <PrivateRoute path={`${path}/renew`} component={RenewNew} />
        <PrivateRoute path={`${path}/replace`} component={Replace} />
        <PrivateRoute path={`${path}/release`} component={ReleaseNew} />
        <PrivateRoute path={`${path}/step-one`} component={Step1} />
        <PrivateRoute path={`${path}/step-two`} component={Step2} />
        <PrivateRoute path={`${path}/step-three`} component={Step3} />
        <PrivateRoute path={`${path}/step-four`} component={Step4} />
        <PrivateRoute path={`${path}/step-five`} component={Step5} />
        <PrivateRoute path={`${path}/my-applications`} component={MyApplication} />
        <PrivateRoute path={`${path}/add-info`} component={AddInfoForm} />
        {/* <PrivateRoute path={`${path}/license-add-info`} component={LicenseAddInfo} /> */}
        <PrivateRoute path={`${path}/bpa/inbox`} component={Inbox} />
        <PrivateRoute path={`${path}/edcr/inbox`} component={(props) => <EdcrInbox {...props} parentRoute={path} />} />
        <PrivateRoute path={`${path}/stakeholder/:id`} component={ApplicationDetails} />
        <PrivateRoute path={`${path}/bpa/:id`} component={BpaApplicationDetail} />
        <PrivateRoute path={`${path}/editApplication/bpa/:tenantId/:applicationNo`} component={BPASendToArchitect} />
        <PrivateRoute path={`${path}/editApplication/ocbpa/:tenantId/:applicationNo`} component={OCSendToArchitect} />
        <PrivateRoute path={`${path}/sendbacktocitizen/bpa/:tenantId/:applicationNo`} component={BPASendBackToCitizen} />
        <PrivateRoute path={`${path}/sendbacktocitizen/ocbpa/:tenantId/:applicationNo`} component={OCSendBackToCitizen} />
        <PrivateRoute path={`${path}/response`} component={OBPSResponse} />
        <PrivateRoute path={`${path}/scrutiny`} component={ScrutinyFormcontainer} />
        <PrivateRoute path={`${path}/service`} component={ServiceCard} />
        <PrivateRoute path={`${path}/Beneficial`} component={Beneficial} />
        <PrivateRoute path={`${path}/CompletionLic`} component={CompletionLic} />
        <PrivateRoute path={`${path}/zoningPlan`} component={ZoningPlan} />
        <PrivateRoute path={`${path}/LayoutPlanClu`} component={LayoutPlanClu} />
        <PrivateRoute path={`${path}/renewalClu`} component={renewalClu} />
        <PrivateRoute path={`${path}/TransferLicense`} component={TransferLicense} />
        <PrivateRoute path={`${path}/SurrenderLic`} component={SurrenderLic} />
        <PrivateRoute path={`${path}/CompositionClu`} component={CompositionClu} />
        <PrivateRoute path={`${path}/Standard`} component={Standard} />
        <PrivateRoute path={`${path}/ExtensionCom`} component={ExtensionCom} />
        <PrivateRoute path={`${path}/BPALowMedium`} component={LowMedium} />
        <PrivateRoute path={`${path}/additionalDoc`} component={AdditionalDocument} />
        <PrivateRoute path={`${path}/payment`} component={Payment} />
        {/* .............................................................................. */}

        {/* <PrivateRoute path={`${path}/Beneficialscrutiny`} component={Beneficialscrutiny} />
        <PrivateRoute path={`${path}/Completionscrutiny`} component={Completionscrutiny} />
        <PrivateRoute path={`${path}/CompositionClu`} component={CompositionClu} />
        <PrivateRoute path={`${path}/ExtensionClu`} component={ExtensionClu} />
        <PrivateRoute path={`${path}/ExtensionCom`} component={ExtensionCom} />
        <PrivateRoute path={`${path}/LayoutPlanClu`} component={LayoutPlanClu} />
        <PrivateRoute path={`${path}/Standard`} component={Standard} />
        <PrivateRoute path={`${path}/TransferLic`} component={TransferLic} />
        <PrivateRoute path={`${path}/SurrenderLic`} component={SurrenderLic} />
        <PrivateRoute path={`${path}/Standard`} component={Standard} />
        <PrivateRoute path={`${path}/Loi`} component={Loi} /> */}
      </Switch>
    </React.Fragment>
  );
};

export default App;
