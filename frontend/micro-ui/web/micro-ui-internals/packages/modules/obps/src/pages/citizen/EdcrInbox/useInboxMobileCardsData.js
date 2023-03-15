import { RadioButtons, SearchField } from "@egovernments/digit-ui-react-components";
import { format } from "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const useInboxMobileCardsData = ({  table }) => {
  const { t } = useTranslation();

  const dataForMobileInboxCards = table?.map(
    ({ applicationId, edcrNumber, date, planReportUrl, dxfFileurl, locality, status, owner }) => ({
      [t("EDCR_COMMON_TABLE_APPL_NO")]: applicationId,
      [t("CS_APPLICATION_DETAILS_APPLICATION_DATE")]: date ? format(new Date(date), "dd/MM/yyyy") : "NA",
      [t("EDCR_COMMON_TABLE_CITY_LABEL")]: t(locality),
      [t("EDCR_COMMON_TABLE_APPL_NAME")]: owner,
      [t("EDCR_COMMON_TABLE_SCRUTINY_NO")]: edcrNumber,
      [t("EDCR_COMMON_TABLE_COL_STATUS")]: (status === "Accepted" ? <span className="sla-cell-success " style={{background:"none",padding:"0px"}}>{status}</span> : <span className="sla-cell-error" style={{background:"none",padding:"0px"}}>{status}</span>),
      [t("BPA_UPLOADED_PLAN_DXF")]: (
        <a href={`${dxfFileurl}`}>
          <span className="link">{t("BPA_DOWNLOAD")}</span>
        </a>
      ),
      [t("EDCR_SCUTINY_REPORT")]: (
        <a href={`${planReportUrl}`}>
          <span className="link">{t("BPA_DOWNLOAD")}</span>
        </a>
      ),
    })
  );

  const MobileSortFormValues = () => {
    const sortOrderOptions = [
      {
        code: "DESC",
        i18nKey: "ES_INBOX_DATE_LATEST_FIRST",
      },
      {
        code: "ASC",
        i18nKey: "ES_INBOX_DATE_LATEST_LAST",
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
    isTwoDynamicPrefix: true,
    getRedirectionLink: () => {},
    handleClickEnabled: false,
    serviceRequestIdKey: "applicationNo",
    MobileSortFormValues,
  };
};

export default useInboxMobileCardsData;
