import { Header, CitizenHomeCard, BPAHomeIcon, BPAIcon, HomeLink, PTIcon, EmployeeModuleCard, EDCRIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";

const BPACitizenHomeScreen = ({ parentRoute }) => {

    const userInfo = Digit.UserService.getUser();
    const userRoles = userInfo.info.roles.map((roleData) => roleData.code);

    if (!userRoles.includes("BPA_ARCHITECT")) {
        alert("Please login with Architect role");
        return true
    }

    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateCode = tenantId.split(".")[0];
    const moduleCode = "bpareg";
    const language = Digit.StoreData.getCurrentLanguage();
    const { data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

    const { t } = useTranslation();
    const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("BPA_HOME_CREATE", {});
    // const { isLoading, isError, error, data, ...rest } = Digit.Hooks.mcollect.useMCollectCount(tenantId);

    useEffect(() => {
        clearParams();
    }, []);

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
                    link: ``,
                    i18nKey: t("BPA_HOME_BUILDING_PLAN_SCRUTINY_OC_LABEL"),
                }
            ]
        },
        {
            title: t("ACTION_TEST_BPA_STAKE_HOLDER_HOME"),
            Icon: <BPAIcon className="fill-path-primary-main" />,
            links: [
                {
                    link: ``,
                    i18nKey: t("BPA_PERMIT_NEW_CONSTRUCTION_LABEL"),
                },
                {
                    link: ``,
                    i18nKey: t("BPA_OC_FOR_NEW_BUILDING_CONSTRUCTION_LABEL"),
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

    return homeScreen;
    // return <CitizenHomeCard header={t("ACTION_TEST_BPA_STAKE_HOLDER_HOME")} links={links} Icon={() => <BPAIcon className="fill-path-primary-main" />} />;
};

export default BPACitizenHomeScreen;