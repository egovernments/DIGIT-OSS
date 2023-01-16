import React from "react";
import { useTranslation } from "react-i18next";
import { SearchField, RadioButtons } from "@egovernments/digit-ui-react-components";
import { Controller, useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";

const useInboxMobileCardsData = ({ parentRoute, table }) => {
  const { t } = useTranslation();
  const GetCell = (value) => <span className="cell-text styled-cell">{value}</span>;

  const getApplicationNumberCell = (value, amendmentReason) => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to={`/digit-ui/employee/ws/generate-note-bill-amendment?applicationNumber=${value}`}>
          <span className="link">{value}</span>
        </Link>
        {GetCell(t(`BILLAMENDMENT_${amendmentReason}_HEADING`))}
      </div>
    );
  };

  const dataForMobileInboxCards = table?.map(({ applicationNo, address, status, owner, service, tenantId, amendmentReason, taskOwner }) => ({
    [t("WS_COMMON_TABLE_COL_SERVICE_LABEL")]: t(`ACTION_TEST_${service}`),
    [t("WS_MYCONNECTIONS_APPLICATION_NO")]: getApplicationNumberCell(applicationNo, amendmentReason, tenantId, service),
    [t("CORE_COMMON_NAME")]: owner,
    [t("WS_COMMON_TABLE_COL_ADDRESS")]: t(Digit.Utils.locale.getRevenueLocalityCode(address, tenantId)),
    [t("WS_COMMON_TABLE_COL_APPLICATION_STATUS")]: t(status),
    [t("WS_COMMON_TABLE_COL_TASK_OWNER")]: taskOwner,
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
