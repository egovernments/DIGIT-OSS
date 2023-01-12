import React from "react";
import { useTranslation } from "react-i18next";
import { SearchField, RadioButtons } from "@egovernments/digit-ui-react-components";
import { Controller, useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";

const useInboxMobileCardsData = ({ parentRoute, table }) => {
  const { t } = useTranslation();
  const GetStatusCell = (value) =>
    value === "Active" || value > 0 ? <span className="sla-cell-success">{value}</span> : <span className="sla-cell-error">{value}</span>;

  const GetStatusLinkCell = (value, tenantId, applicationType) => {
    let service = value?.includes("WS")?"WATER":"SEWERAGE";
    let application = "application";
    if (applicationType?.toUpperCase()?.includes("DISCONNECT")) {
      application = "disconnection"
    } else if (applicationType?.toUpperCase()?.includes("MODIFY")) {
      application = "modify"
    }
    return (
      <div>
        <Link to={`/digit-ui/employee/ws/${application}-details?applicationNumber=${value}&tenantId=${tenantId}&service=${service}`}>
          {" "}
          <span className="link">{value}</span>
        </Link>
      </div>
    );
  };
  const dataForMobileInboxCards = table?.map(({ applicationNo, status, owner, sla, businessService, connectionNo, applicationType, tenantId }) => ({
    [t("WS_ACK_COMMON_APP_NO_LABEL")]: GetStatusLinkCell(applicationNo, tenantId, applicationType),
    [t("WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL")]: connectionNo,
    [t("WS_COMMON_TABLE_COL_OWN_NAME_LABEL")]: owner,
    [t("WS_COMMON_TABLE_COL_APP_TYPE_LABEL")]: t(`WS_${applicationType?.toUpperCase()}`),
    [t("WS_COMMON_TABLE_COL_SERVICE_LABEL")]: businessService?t(`WS_COMMON_INBOX_${businessService?.toUpperCase()}`):"NA",
    [t("WS_COMMON_TABLE_COL_APPLICATION_STATUS")]: t(`CS_${status}`),
    [t("ES_INBOX_SLA_DAYS_REMAINING")]: GetStatusCell(sla),
  }));

  const MobileSortFormValues = () => {
    const sortOrderOptions = [
      {
        code: "DESC",
        i18nKey: "ES_COMMON_SORT_BY_DESC",
      },
      {
        code: "ASC",
        i18nKey: "ES_COMMON_SORT_BY_ASC",
      },
    ];
    const { control: controlSortForm } = useFormContext();
    return (
      <SearchField>
        <Controller
          name="sortOrder"
          control={controlSortForm}
          render={({ onChange, value }) => (
            <RadioButtons
              onSelect={(e) => {
                onChange(e.code);
              }}
              selectedOption={sortOrderOptions.filter((option) => option.code === value)[0]}
              optionsKey="i18nKey"
              name="sortOrder"
              options={sortOrderOptions}
            />
          )}
        />
      </SearchField>
    );
  };

  return {
    data: dataForMobileInboxCards,
    //linkPrefix: `${parentRoute}/application-details?applicationNumber=${value}`,
    serviceRequestIdKey: t("NOC_APP_NO_LABEL"),
    MobileSortFormValues,
  };
};

export default useInboxMobileCardsData;
