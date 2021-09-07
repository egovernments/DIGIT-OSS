import { Header, CitizenHomeCard, BPAHomeIcon, BPAIcon, HomeLink, PTIcon, EmployeeModuleCard, EDCRIcon, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";

const BPACitizenHomeScreen = ({ parentRoute }) => {

    const userInfo = Digit.UserService.getUser();
    const userRoles = userInfo.info.roles.map((roleData) => roleData.code);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateCode = tenantId.split(".")[0];
    const [stakeHolderRoles, setStakeholderRoles] = useState(false);
    const { data, isLoading } = Digit.Hooks.obps.useMDMS(stateCode, "StakeholderRegistraition", "TradeTypetoRoleMapping");
    const moduleCode = "bpareg";
    const language = Digit.StoreData.getCurrentLanguage();
    const { data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
    const { t } = useTranslation();
    const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("BPA_HOME_CREATE", {});

    useEffect(() => {
        if (!isLoading) {
            let roles = [];
            data?.StakeholderRegistraition?.TradeTypetoRoleMapping?.map(type => {
                type?.role?.map(role => {roles.push(role);});
            });
            const uniqueRoles = roles.filter((item, i, ar) => ar.indexOf(item) === i);
            let isRoute = false;
            uniqueRoles?.map(unRole => {
                if (userRoles.includes(unRole) && !isRoute) {
                    isRoute = true;
                }
            });
            if(!isRoute) {
                setStakeholderRoles(false);
                window.location.replace("/digit-ui/citizen/all-services");
                alert(t("BPA_LOGIN_HOME_VALIDATION_MESSAGE_LABEL"));
            } else {
                setStakeholderRoles(true);
            }
        }
    }, [isLoading]);

    useEffect(() => {
        clearParams();
    }, []);

    if (isLoading || !stakeHolderRoles) { return ( <Loader /> ); }

    const homeDetails = [
        {
            Icon: <BPAHomeIcon />,
            moduleName: t("ACTION_TEST_BPA_STAKE_HOLDER_HOME"),
            name: "employeeCard",
            kpis: [
                {
                    count: 0, //isLoading ? "-" : data?.ChallanCount?.totalChallan,
                    label: t("BPA_PDF_TOTAL")
                },
                {
                    count: 0, //isLoading ? "-" : data?.ChallanCount?.totalChallan,
                    label: t("TOTAL_NEARING_SLA")
                }
            ],
            links: [
                {
                    label: t("ES_COMMON_INBOX"),
                    link: ``
                }
            ]
        },
        {
            title: t("ACTION_TEST_EDCR_SCRUTINY"),
            Icon: <EDCRIcon className="fill-path-primary-main" />,
            links: [
                {
                    link: `edcrscrutiny/apply`,
                    i18nKey: t("BPA_SCRUTINY_TITLE"),
                },
                {
                    link: `edcrscrutiny/oc-apply`,
                    i18nKey: t("BPA_HOME_BUILDING_PLAN_SCRUTINY_OC_LABEL"),
                }
            ]
        },
        {
            title: t("ACTION_TEST_BPA_STAKE_HOLDER_HOME"),
            Icon: <BPAIcon className="fill-path-primary-main" />,
            links: [
                {
                    link: `new-building-permit`,
                    i18nKey: t("BPA_PERMIT_NEW_CONSTRUCTION_LABEL"),
                },
                {
                    link: ``,
                    i18nKey: t("BPA_OC_NEW_BUILDING_CONSTRUCTION_LABEL"),
                }
            ]
        }
    ]

    const homeScreen = homeDetails.map(data => {
        if (data.name == "employeeCard") {
            return <EmployeeModuleCard {...data} />
        } else {
            return <CitizenHomeCard header={data.title} links={data.links} Icon={() => data.Icon} />;
        }
    });
    sessionStorage.setItem("isPermitApplication", true);
    return homeScreen;
    // return <CitizenHomeCard header={t("ACTION_TEST_BPA_STAKE_HOLDER_HOME")} links={links} Icon={() => <BPAIcon className="fill-path-primary-main" />} />;
};

export default BPACitizenHomeScreen;