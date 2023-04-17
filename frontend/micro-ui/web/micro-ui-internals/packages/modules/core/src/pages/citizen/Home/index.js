import {
  Calender,
  CardBasedOptions,
  ServiceCardOptions,
  CaseIcon,
  ComplaintIcon,
  DocumentIcon,
  HomeIcon,
  BPAHomeIcon,
  BPAIco,
  Loader,
  OBPSIcon,
  PTIcon,
  StandaloneSearchBar,
  WhatsNewCard,
  BannerAllCard,
  LicencingIcon,
  ServicePlanIcon,
  ElectricPlanIcon,
  BankGuaranteeIcon,
  RenewLic,
  LabTabs,
  TransferLic,
  SurrenderLic,
  StandardDesign,
} from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
const Home = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = "hr.ambala";
  const [active, setActive] = useState("1");
  // const tenantId = Digit.ULBService.getCitizenCurrentTenant(true);
  const { data: { stateInfo } = {}, isLoading } = Digit.Hooks.useStore.getInitData();
  const [isLoaderOn, setIsLoaderOn] = useState(false);
  const conditionsToDisableNotificationCountTrigger = () => {
    if (Digit.UserService?.getUser()?.info?.type === "EMPLOYEE") return false;
    if (!Digit.UserService?.getUser()?.access_token) return false;
    return true;
  };

  const { data: EventsData, isLoading: EventsDataLoading } = Digit.Hooks.useEvents({
    tenantId,
    variant: "whats-new",
    config: {
      enabled: conditionsToDisableNotificationCountTrigger(),
    },
  });
  const redirectLoading = () => {
    setIsLoaderOn(true);
  };

  // if (tenantId) {
  //   history.push(`/digit-ui/citizen`);
  // }

  const handleBPAClick = () => {
    let user = Digit.UserService.getUser();
    console.log("role123...", user);
    const userRoles = user?.info?.roles?.map((e) => e.code);
    if (userRoles?.includes("BPA_ARCHITECT")) {
      history.push("/digit-ui/citizen/obps/home");
    } else {
      history.push("/digit-ui/citizen/obps/stakeholder/apply/provide-license-type");
    }
  };

  const handleChange = (event, newValue) => {
    console.log(event.value, newValue);
    setActive(newValue);
  };

  const allCitizenServicesProps = {
    header: t("DASHBOARD_CITIZEN_SERVICES_LABEL"),
    sideOption: {
      name: t("DASHBOARD_VIEW_ALL_LABEL"),
      onClick: () => history.push("/digit-ui/citizen/all-services"),
    },
    options: [
      {
        name: "New Licence",
        Icon: <LicencingIcon className="fill-path-primary-main" />,
        value: "one",
        links: [
          {
            link: `/digit-ui/citizen/obps/tab`,
            i18nKey: t("New Licence Application"),
          },

          {
            link: `/digit-ui/citizen/tl/tradelicence/my-application`,
            i18nKey: t("TL_MY_APPLICATIONS_HEADER"),
          },
        ],
      },
      {
        name: t("SERVICE_PLAN_CARD"),
        // name: "Service Plan",
        Icon: <ServicePlanIcon className="fill-path-primary-main" />,
        value: "two",
        links: [
          {
            link: `/digit-ui/citizen/obps/servicePlan`,
            i18nKey: t("SP_CREATE_TRADE"),
          },

          {
            link: `/digit-ui/citizen/tl/servicePlan/my-application`,
            i18nKey: t("TL_MY_APPLICATIONS_HEADER"),
          },
        ],
        // onClick: () => history.push("/digit-ui/citizen/obps/servicePlan"),
        // onClick: () => history.push("/digit-ui/citizen/tl-home"),
      },
      {
        name: t("ELECTRIC_PLAN_CARD"),
        Icon: <ElectricPlanIcon className="fill-path-primary-main" />,
        value: "three",
        links: [
          {
            link: `/digit-ui/citizen/obps/electricalPlan`,
            i18nKey: t("EP_CREATE_TRADE"),
          },

          {
            link: `/digit-ui/citizen/tl/electricPlan/my-application`,
            i18nKey: t("TL_MY_APPLICATIONS_HEADER"),
          },
        ],
        // onClick: () => history.push("/digit-ui/citizen/obps/electricalPlan"),
        // onClick: () => history.push("/digit-ui/citizen/pt-home"),
      },
      // {
      //   name: t("ACTION_TEST_BUILDING_PLAN_APPROVAL"),
      //   Icon: <BPAIco className="fill-path-primary-main" />,
      //   links: [
      //     {
      //       link: `/digit-ui/citizen/obps/my-applications`,
      //       i18nKey: t("BPA_CITIZEN_HOME_VIEW_APP_BY_CITIZEN_LABEL"),
      //     },
      //     {
      //       link: `/digit-ui/citizen/obps/stakeholder/apply/provide-license-type`,
      //       i18nKey: t("BPA_CITIZEN_HOME_STAKEHOLDER_LOGIN_LABEL"),
      //     },
      //     {
      //       link: `/digit-ui/citizen/obps/home`,
      //       i18nKey: t("BPA_CITIZEN_HOME_ARCHITECT_LOGIN_LABEL"),
      //     },
      //   ]
      // },
      {
        name: t("BANK_GUARANTEE_PLAN"),
        Icon: <BankGuaranteeIcon className="fill-path-primary-main" />,
        value: "four",
        links: [
          {
            link: `/digit-ui/citizen/obps/SubmitNew`,
            i18nKey: t("Bank Guarantee Submission"),
          },
          {
            link: `/digit-ui/citizen/obps/release`,
            i18nKey: t("Release of Bank Guarantee"),
          },
          {
            link: `/digit-ui/citizen/tl/bankGuarantee/my-application`,
            i18nKey: t("TL_MY_APPLICATIONS_HEADER"),
          },
        ],
      },
      {
        name: t("Renewal of Licence"),
        Icon: <RenewLic className="fill-path-primary-main" />,
        value: "five",
        links: [
          {
            link: `/digit-ui/citizen/obps/renewalClu`,
            i18nKey: t("Renew Licence"),
          },
        ],
      },
      {
        name: t("Transfer of License"),
        Icon: <TransferLic className="fill-path-primary-main" />,
        value: "six",
        links: [
          {
            link: `/digit-ui/citizen/obps/TransferLicense`,
            i18nKey: t("Transfer of License"),
          },
        ],
      },
      {
        name: t("Surrender of License"),
        Icon: <SurrenderLic className="fill-path-primary-main" />,
        value: "seven",
        links: [
          {
            link: `/digit-ui/citizen/obps/SurrenderLic`,
            i18nKey: t("Surrender of License"),
          },
        ],
      },
      {
        name: t("Approval of Standard Design"),
        Icon: <StandardDesign className="fill-path-primary-main" />,
        value: "eight",
        links: [
          {
            link: `/digit-ui/citizen/obps/Standard`,
            i18nKey: t("Approval of Standard Design"),
          },
        ],
      },
      {
        name: t("Demarcation cum zoning plan"),
        Icon: <StandardDesign className="fill-path-primary-main" />,
        value: "nine",
        links: [
          {
            link: `/digit-ui/citizen/obps/ZoningPlan`,
            i18nKey: t("Demarcation cum zoning plan"),
          },
        ],
      },
      {
        name: t("Revised Layout Plan"),
        Icon: <StandardDesign className="fill-path-primary-main" />,
        value: "ten",
        links: [
          {
            link: `/digit-ui/citizen/obps/LayoutPlanClu`,
            i18nKey: t("Revised Layout Plan"),
          },
        ],
      },
      {
        name: t("Extension of time"),
        Icon: <StandardDesign className="fill-path-primary-main" />,
        value: "eleven",
        links: [
          {
            link: `/digit-ui/citizen/obps/ExtensionCom`,
            i18nKey: t("Extension of time"),
          },
        ],
      },
      {
        name: t("Extension of CLU permission"),
        Icon: <StandardDesign className="fill-path-primary-main" />,
        value: "twelve",
        links: [
          {
            link: ``,
            i18nKey: t("Extension of CLU permission"),
          },
        ],
      },
      {
        name: t("Composition of urban Area Violation"),
        Icon: <StandardDesign className="fill-path-primary-main" />,
        value: "thirteen",
        links: [
          {
            link: `/digit-ui/citizen/obps/CompositionClu`,
            i18nKey: t("Composition of urban Area Violation"),
          },
        ],
      },
      {
        name: t("Completion Certificate In Licence Colony"),
        Icon: <StandardDesign className="fill-path-primary-main" />,
        value: "fourteen",
        links: [
          {
            link: ``,
            i18nKey: t("Completion Certificate In Licence Colony"),
          },
        ],
      },
      {
        name: t("Change in Beneficial Interest"),
        Icon: <StandardDesign className="fill-path-primary-main" />,
        value: "fifteen",
        links: [
          {
            link: `/digit-ui/citizen/obps/Beneficial`,
            i18nKey: t("Change in Beneficial Interest"),
          },
        ],
      },
      {
        name: t("Building Plan Approval for Low and Medium Risk"),
        Icon: <StandardDesign className="fill-path-primary-main" />,
        value: "sixteen",
        links: [
          {
            link: `/digit-ui/citizen/obps/BPALowMedium`,
            i18nKey: t("Building Plan Approval for Low and Medium Risk"),
          },
        ],
      },
    ],
    styles: { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" },
  };
  const allInfoAndUpdatesProps = {
    header: t("CS_COMMON_DASHBOARD_INFO_UPDATES"),
    sideOption: {
      name: t("DASHBOARD_VIEW_ALL_LABEL"),
      onClick: () => {},
    },
    options: [
      {
        name: t("ACTION_TEST_BUILDING_PLAN_APPROVAL"),
        Icon: <BPAIco className="fill-path-primary-main" />,
        links: [
          {
            link: `/digit-ui/citizen/obps/my-applications`,
            i18nKey: t("BPA_CITIZEN_HOME_VIEW_APP_BY_CITIZEN_LABEL"),
          },
          {
            link: `/digit-ui/citizen/obps/stakeholder/apply/provide-license-type`,
            i18nKey: t("BPA_CITIZEN_HOME_STAKEHOLDER_LOGIN_LABEL"),
          },
          {
            link: `/digit-ui/citizen/obps/home`,
            i18nKey: t("BPA_CITIZEN_HOME_ARCHITECT_LOGIN_LABEL"),
          },
        ],
      },
    ],
    styles: { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" },
  };

  const allBannerMenuProps = {
    // sideOption: {
    //   name: t("DASHBOARD_VIEW_ALL_LABEL"),
    //   onClick: () => {},
    // },
    dataoptions: [
      {
        name: t("Home"),
        Icon: <HomeIcon className="home-class" />,
        value: "1",
      },
      {
        name: "Licence",
        Icon: <LicencingIcon className="home-class" />,
        value: "2",
      },
      {
        name: t("CS_COMMON_INBOX_BPA"),
        Icon: <BPAIco />,
        value: "3",
      },
    ],
    styles: { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" },
  };

  const allCitizenServicesPropsCard = {
    // header: t("DASHBOARD_CITIZEN_SERVICES_LABEL"),
    // sideOption: {
    //   name: t("DASHBOARD_VIEW_ALL_LABEL"),
    //   onClick: () => history.push("/digit-ui/citizen/all-services"),
    // },
    options: [
      {
        name: "Licencing Services",
        Icon: <LicencingIcon className="fill-path-primary-main" />,
        value: "one",
        links: [
          {
            link: `/digit-ui/citizen/obps/tab`,
            i18nKey: t("New Licence Application"),
          },

          {
            link: `/digit-ui/citizen/tl/tradelicence/my-application`,
            i18nKey: t("TL_MY_APPLICATIONS_HEADER"),
          },
        ],
      },
      {
        name: t("SERVICE_PLAN_CARD"),
        // name: "Service Plan",
        Icon: <ServicePlanIcon className="fill-path-primary-main" />,
        value: "two",
        links: [
          {
            link: `/digit-ui/citizen/obps/servicePlan`,
            i18nKey: t("SP_CREATE_TRADE"),
          },

          {
            link: `/digit-ui/citizen/tl/servicePlan/my-application`,
            i18nKey: t("TL_MY_APPLICATIONS_HEADER"),
          },
        ],
        // onClick: () => history.push("/digit-ui/citizen/obps/servicePlan"),
        // onClick: () => history.push("/digit-ui/citizen/tl-home"),
      },
      {
        name: t("ELECTRIC_PLAN_CARD"),
        Icon: <ElectricPlanIcon className="fill-path-primary-main" />,
        value: "three",
        links: [
          {
            link: `/digit-ui/citizen/obps/electricalPlan`,
            i18nKey: t("EP_CREATE_TRADE"),
          },

          {
            link: `/digit-ui/citizen/tl/electricPlan/my-application`,
            i18nKey: t("TL_MY_APPLICATIONS_HEADER"),
          },
        ],
        // onClick: () => history.push("/digit-ui/citizen/obps/electricalPlan"),
        // onClick: () => history.push("/digit-ui/citizen/pt-home"),
      },
      {
        name: t("ACTION_TEST_BUILDING_PLAN_APPROVAL"),
        Icon: <BPAIco className="fill-path-primary-main" />,
        value: "four",
        links: [
          {
            link: `/digit-ui/citizen/obps/my-applications`,
            i18nKey: t("BPA_CITIZEN_HOME_VIEW_APP_BY_CITIZEN_LABEL"),
          },
          {
            link: `/digit-ui/citizen/obps/stakeholder/apply/provide-license-type`,
            i18nKey: t("BPA_CITIZEN_HOME_STAKEHOLDER_LOGIN_LABEL"),
          },
          {
            link: `/digit-ui/citizen/obps/home`,
            i18nKey: t("BPA_CITIZEN_HOME_ARCHITECT_LOGIN_LABEL"),
          },
        ],
      },
      {
        name: t("BANK_GUARANTEE_PLAN"),
        Icon: <BankGuaranteeIcon className="fill-path-primary-main" />,
        value: "five",
        links: [
          {
            link: `/digit-ui/citizen/obps/SubmitNew`,
            i18nKey: t("Bank Guarantee Submission"),
          },
          {
            link: `/digit-ui/citizen/obps/release`,
            i18nKey: t("Release of Bank Guarantee"),
          },
          {
            link: `/digit-ui/citizen/tl/bankGuarantee/my-application`,
            i18nKey: t("TL_MY_APPLICATIONS_HEADER"),
          },
        ],
      },
      {
        name: t("General Services"),
        Icon: <TransferLic className="fill-path-primary-main" />,
        value: "six",
        links: [
          {
            link: `/digit-ui/citizen/obps/additionalDoc`,
            i18nKey: t("Additional Documents"),
          },
          {
            link: `/digit-ui/citizen/obps/payment`,
            i18nKey: t("Payment"),
          },
        ],
      },
      // {
      //   name: t("PROVIDE_LICENSE_DETAILS"),
      //   Icon: <CaseIcon className="fill-path-primary-main" />,
      //   onClick: () => history.push("/digit-ui/citizen/obps/stakeholder/apply/license-details"),
      // },
      // {
      //   name: t("ADD_AUTHORIZED_USER"),
      //   Icon: <CaseIcon className="fill-path-primary-main" />,
      //   onClick: () => history.push("/digit-ui/citizen/obps/stakeholder/apply/add-authorized-user"),
      // },
      // {
      //   name: t("DEVELOPER_CAPACITY"),
      //   Icon: <CaseIcon className="fill-path-primary-main" />,
      //   onClick: () => history.push("/digit-ui/citizen/obps/stakeholder/apply/developer-capacity"),
      // },
      // {
      //   name: t("STAKEHOLDER_DOCUMENT_DETAILS"),
      //   Icon: <CaseIcon className="fill-path-primary-main" />,
      //   onClick: () => history.push("/digit-ui/citizen/obps/stakeholder/apply/stakeholder-document-details"),
      // },
      // {
      //   name: t("REDIRCT"),
      //   Icon: <CaseIcon className="fill-path-primary-main" />,
      //   onClick: () => redirectLoading(),
      // },
    ],
    styles: { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" },
  };

  const allServicesCardOption = {
    menuOption: [
      {
        value: "1",
        list: allCitizenServicesPropsCard,
      },
      {
        value: "2",
        list: allCitizenServicesProps,
      },
      {
        value: "3",
        list: allInfoAndUpdatesProps,
      },
    ],
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      {isLoaderOn ? (
        <div className="loader-container">
          <div className="spinners"></div>
          <div className="redirect-text">
            <h4>Redirecting</h4>
          </div>
        </div>
      ) : (
        <div className="HomePageWrapper">
          {/* <div className="BannerWithSearch">
          <BannerAllCard {...allBannerMenuProps} />
        </div> */}

          <div className="ServicesSection">
            {/* <ServiceCardOptions active="1" {...allCitizenServicesPropsCard} /> */}
            <LabTabs {...allBannerMenuProps} {...allServicesCardOption} />
            {/* <HomeTabs {...allBannerMenuProps}{...allServicesCardOption} /> */}
            {/* <CardBasedOptions {...allCitizenServicesProps} />
          <CardBasedOptions {...allInfoAndUpdatesProps} /> */}
          </div>

          {conditionsToDisableNotificationCountTrigger() ? (
            EventsDataLoading ? (
              <Loader />
            ) : (
              <div className="WhatsNewSection">
                <div className="headSection">
                  {/* <h2>{t("DASHBOARD_WHATS_NEW_LABEL")}</h2> */}
                  <h2>What's New</h2>
                  <p onClick={() => history.push("/digit-ui/citizen/engagement/whats-new")}>{t("DASHBOARD_VIEW_ALL_LABEL")}</p>
                </div>
                <WhatsNewCard {...EventsData?.[0]} />
              </div>
            )
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Home;
