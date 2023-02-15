import { Header, CitizenHomeCard, PTIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import Area from "./pageComponents/Area";
import PTLandArea from "./pageComponents/PTLandArea";
import GroundFloorDetails from "./pageComponents/GroundFloorDetails";
import IsAnyPartOfThisFloorUnOccupied from "./pageComponents/IsAnyPartOfThisFloorUnOccupied";
import IsResidential from "./pageComponents/IsResidential";
import IsThisFloorSelfOccupied from "./pageComponents/IsThisFloorSelfOccupied";
import Proof from "./pageComponents/Proof";
import PropertyBasementDetails from "./pageComponents/PropertyBasementDetails";
import PropertyFloorDetails from "./pageComponents/PropertyFloorDetails";
import PropertyTax from "./pageComponents/PropertyTax";
import PropertyType from "./pageComponents/PropertyType";
import PropertyUsageType from "./pageComponents/PropertyUsageType";
import ProvideSubUsageType from "./pageComponents/ProvideSubUsageType";
import ProvideSubUsageTypeOfRentedArea from "./pageComponents/ProvideSubUsageTypeOfRentedArea";
import PTWFApplicationTimeline from "./pageComponents/PTWFApplicationTimeline";
import PTSelectAddress from "./pageComponents/PTSelectAddress";
import PTSelectGeolocation from "./pageComponents/PTSelectGeolocation";
import PTSelectStreet from "./pageComponents/PTSelectStreet";
import PTSelectPincode from "./pageComponents/PTSelectPincode";
import RentalDetails from "./pageComponents/RentalDetails";
import SelectInistitutionOwnerDetails from "./pageComponents/SelectInistitutionOwnerDetails";
import SelectOwnerAddress from "./pageComponents/SelectOwnerAddress";
import SelectOwnerDetails from "./pageComponents/SelectOwnerDetails";
import SelectOwnerShipDetails from "./pageComponents/SelectOwnerShipDetails";
import SelectProofIdentity from "./pageComponents/SelectProofIdentity";
import SelectSpecialOwnerCategoryType from "./pageComponents/SelectSpecialOwnerCategoryType";
import SelectSpecialProofIdentity from "./pageComponents/SelectSpecialProofIdentity";
import Units from "./pageComponents/Units";
import SelectAltContactNumber from "./pageComponents/SelectAltContactNumber";
import SelectDocuments from "./pageComponents/SelectDocuments";
import UnOccupiedArea from "./pageComponents/UnOccupiedArea";
import PTEmployeeOwnershipDetails from "./pageComponents/OwnerDetailsEmployee";
import CitizenApp from "./pages/citizen";
import SearchPropertyCitizen from "./pages/citizen/SearchProperty/searchProperty";
import SearchResultCitizen from "./pages/citizen/SearchResults";
import PTCheckPage from "./pages/citizen/Create/CheckPage";
import PTAcknowledgement from "./pages/citizen/Create/PTAcknowledgement";
import PropertySearchForm from "./components/search/PropertySearchForm";
import PropertySearchResults from "./components/search/PropertySearchResults";
import { PTMyPayments } from "./pages/citizen/MyPayments";
import SelectPTUnits from "./pageComponents/SelectPTUnits";
import CreateProperty from "./pages/citizen/Create";
import { PTMyApplications } from "./pages/citizen/PTMyApplications";
import { MyProperties } from "./pages/citizen/MyProperties";
import PTApplicationDetails from "./pages/citizen/PTApplicationDetails";
import SearchPropertyComponent from "./pages/citizen/SearchProperty";
import SearchResultsComponent from "./pages/citizen/SearchResults";
import EditProperty from "./pages/citizen/EditProperty";
import MutateProperty from "./pages/citizen/Mutate";

import PropertyInformation from "./pages/citizen/MyProperties/propertyInformation";
import PTWFCaption from "./pageComponents/PTWFCaption";
import PTWFReason from "./pageComponents/PTWFReason";
import ProvideFloorNo from "./pageComponents/ProvideFloorNo";
import PropertyOwnerHistory from "./pages/citizen/MyProperties/propertyOwnerHistory";
import TransferDetails from "./pages/citizen/MyProperties/propertyOwnerHistory";
import TransfererDetails from "./pageComponents/Mutate/TransfererDetails";
import OwnerMutate from "./pageComponents/Mutate/Owner";
import PTComments from "./pageComponents/Mutate/Comments";
import IsMutationPending from "./pageComponents/Mutate/IsMutationPending";
import UnderStateAquire from "./pageComponents/Mutate/underStateAquire";
import PropertyMarketValue from "./pageComponents/Mutate/PropertyMarketValue";
import PTReasonForTransfer from "./pageComponents/Mutate/ReasonForTransfer";
import PTRegistrationDocument from "./pageComponents/Mutate/RegistrationDocument";
import TransferProof from "./pageComponents/Mutate/transferReasonDocument";
import UpdateNumber from "./pages/citizen/MyProperties/updateNumber";
import EmployeeUpdateOwnerNumber from "./pages/employee/updateNumber";

import EmployeeApp from "./pages/employee";
import PTCard from "./components/PTCard";
import InboxFilter from "./components/inbox/NewInboxFilter";
import EmptyResultInbox from "./components/empty-result";
import { TableConfig } from "./config/inbox-table-config";
import NewApplication from "./pages/employee/NewApplication";
import ApplicationDetails from "./pages/employee/ApplicationDetails";
import PropertyDetails from "./pages/employee/PropertyDetails";
import AssessmentDetails from "./pages/employee/AssessmentDetails";
import EditApplication from "./pages/employee/EditApplication";
import Response from "./pages/Response";
import TransferOwnership from "./pages/employee/PropertyMutation";
import DocsRequired from "./pages/employee/PropertyMutation/docsRequired";
import SelectOtp from "../../core/src/pages/citizen/Login/SelectOtp";

const componentsToRegister = {
  PTLandArea,
  PTCheckPage,
  PTAcknowledgement,
  PropertyTax,
  PTSelectPincode,
  PTSelectAddress,
  PTSelectStreet,
  Proof,
  SelectOwnerShipDetails,
  SelectOwnerDetails,
  SelectSpecialOwnerCategoryType,
  SelectOwnerAddress,
  SelectInistitutionOwnerDetails,
  SelectProofIdentity,
  SelectSpecialProofIdentity,
  PTSelectGeolocation,
  PTWFApplicationTimeline,
  PTWFCaption,
  PTWFReason,
  IsThisFloorSelfOccupied,
  ProvideSubUsageType,
  RentalDetails,
  ProvideSubUsageTypeOfRentedArea,
  IsAnyPartOfThisFloorUnOccupied,
  UnOccupiedArea,
  Area,
  IsResidential,
  PropertyType,
  PropertyUsageType,
  GroundFloorDetails,
  PropertyFloorDetails,
  PropertyBasementDetails,
  PropertyInformation,
  ProvideFloorNo,
  PropertyOwnerHistory,
  TransferDetails,
  Units,
  SelectAltContactNumber,
  SelectDocuments,
  PTEmployeeOwnershipDetails,
  SearchPropertyCitizen,
  SearchResultCitizen,
  TransfererDetails,
  OwnerMutate,
  PTComments,
  IsMutationPending,
  PropertyMarketValue,
  PTReasonForTransfer,
  PTRegistrationDocument,
  UnderStateAquire,
  TransferProof,
  UpdateNumber,
  EmployeeUpdateOwnerNumber,
  PropertySearchForm,
  PropertySearchResults,
  PTMyPayments,
  SelectPTUnits,
  PTNewApplication: NewApplication,
  ApplicationDetails: ApplicationDetails,
  PTPropertyDetails: PropertyDetails,
  PTAssessmentDetails: AssessmentDetails,
  PTEditApplication: EditApplication,
  PTResponse: Response,
  PTTransferOwnership: TransferOwnership,
  PTDocsRequired: DocsRequired,
  PTCreateProperty: CreateProperty,
  PTMyApplications: PTMyApplications,
  PTMyProperties: MyProperties,
  PTApplicationDetails: PTApplicationDetails,
  PTSearchPropertyComponent: SearchPropertyComponent,
  PTSearchResultsComponent: SearchResultsComponent,
  PTEditProperty: EditProperty,
  PTMutateProperty: MutateProperty,
  SelectOtp, // To-do: Temp fix, Need to check why not working if selectOtp module is already imported from core module
};

const addComponentsToRegistry = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export const PTModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();

  const moduleCode = "PT";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  addComponentsToRegistry();

  Digit.SessionStorage.set("PT_TENANTS", tenants);
  useEffect(
    () =>
      userType === "employee" &&
      Digit.LocalizationService.getLocale({
        modules: [`rainmaker-${Digit.ULBService.getCurrentTenantId()}`],
        locale: Digit.StoreData.getCurrentLanguage(),
        tenantId: Digit.ULBService.getCurrentTenantId(),
      }),
    []
  );

  if (userType === "employee") {
    return <EmployeeApp path={path} url={url} userType={userType} />;
  } else return <CitizenApp />;
};

export const PTLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("PT_CREATE_PROPERTY", {});

  useEffect(() => {
    clearParams();
  }, []);

  const links = [
    {
      link: `${matchPath}/property/citizen-search`,
      i18nKey: t("PT_SEARCH_AND_PAY"),
    },
    {
      link: `/digit-ui/citizen/payment/my-bills/PT`,
      i18nKey: t("CS_TITLE_MY_BILLS"),
    },
    {
      link: `${matchPath}/property/my-payments`,
      i18nKey: t("PT_MY_PAYMENTS_HEADER"),
    },
    {
      link: `${matchPath}/property/new-application`,
      i18nKey: t("PT_CREATE_PROPERTY"),
    },
    {
      link: `${matchPath}/property/my-properties`,
      i18nKey: t("PT_MY_PROPERTIES"),
    },
    {
      link: `${matchPath}/property/my-applications`,
      i18nKey: t("PT_MY_APPLICATION"),
    },
    {
      link: `${matchPath}/property/property-mutation`,
      i18nKey: t("PT_PROPERTY_MUTATION"),
    },
    {
      link: `${matchPath}/howItWorks`,
      i18nKey: t("PT_HOW_IT_WORKS"),
    },
    {
      link: `${matchPath}/faqs`,
      i18nKey: t("PT_FAQ_S"),
    },
  ];

  return <CitizenHomeCard header={t("ACTION_TEST_PROPERTY_TAX")} links={links} Icon={() => <PTIcon className="fill-path-primary-main" />} />;
};

export const PTComponents = {
  PTCard,
  PTModule,
  PTLinks,
  PT_INBOX_FILTER: (props) => <InboxFilter {...props} />,
  PTEmptyResultInbox: EmptyResultInbox,
  PTInboxTableConfig: TableConfig,
};
