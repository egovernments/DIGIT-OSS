import { Dropdown, FilterFormField, Loader, RadioButtons } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const FilterFormFieldsComponent = ({ controlFilterForm,applicationStatus, setApplicationStatus, serviceType, setServiceType}) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: applicationTypesOfBPA, isLoading: loadingApplicationTypesOfBPA } = Digit.Hooks.obps.SearchMdmsTypes.useApplicationTypes(tenantId);

  const availableOptions = [
    { code: "Accepted", name: `${t("EDCR_ACCEPTED")}` },
    { code: "Not Accepted", name: `${t("EDCR_NOT_ACCEPTED")}` },
  ];




  return (
    <>

      <div className="filter-label sub-filter-label" style={{ fontWeight: "400", fontSize: "16px" }}>
        {t("BPA_COMMON_TABLE_COL_APP_STATUS_LABEL")}
      </div>
      <RadioButtons
        onSelect={(e) => {
          setApplicationStatus(e.code);
          Digit.SessionStorage.set("EDCR_BACK", "");
        }}
        selectedOption={availableOptions.filter((option) => option.code === applicationStatus)?.[0]}
        optionsKey="name"
        options={availableOptions}
      />


      <div className="filter-label sub-filter-label" style={{ fontWeight: "400", fontSize: "16px" }}>
        {t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")}
      </div>
      <Dropdown
        t={t}
        option={applicationTypesOfBPA}
        selected={applicationTypesOfBPA?.filter((option) => option.code === serviceType)?.[0]}
        optionKey={"i18nKey"}
        select={(e) => {
          setServiceType(e.code);
          Digit.SessionStorage.set("EDCR_BACK", "");
        }}
      />


      {/* <FilterFormField>
        <Controller
          name="status"
          control={controlFilterForm}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => {
            return (
              <>
                <div className="filter-label sub-filter-label" style={{ fontWeight: "400", fontSize: "16px" }}>
                  {t("BPA_COMMON_TABLE_COL_APP_STATUS_LABEL")}
                </div>
                <RadioButtons
                  onSelect={(e) => {
                    onChange(e.code);
                    Digit.SessionStorage.set("EDCR_BACK", "");
                  }}
                  selectedOption={availableOptions.filter((option) => option.code === value)?.[0]}
                  optionsKey="name"
                  options={availableOptions}
                  inputRef={ref}
                />
              </>
            );
          }}
        />
      </FilterFormField> */}
      {/* <FilterFormField>
        <Controller
          name="appliactionType"
          control={controlFilterForm}
          render={(props) => {
            return loadingApplicationTypesOfBPA ? (
              <Loader />
            ) : (
              <>
                <div className="filter-label sub-filter-label" style={{ fontWeight: "400", fontSize: "16px" }}>
                  {t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")}
                </div>
                <Dropdown
                  t={t}
                  option={applicationTypesOfBPA}
                  selected={applicationTypesOfBPA.filter((option) => option.code === props.value)[0]}
                  optionKey={"i18nKey"}
                  select={(e) => {
                    props.onChange(e.code);
                    Digit.SessionStorage.set("EDCR_BACK", "");
                  }}
                />
              </>
            );
          }}
        />
      </FilterFormField> */}
    </>
  );
};

export default FilterFormFieldsComponent;
