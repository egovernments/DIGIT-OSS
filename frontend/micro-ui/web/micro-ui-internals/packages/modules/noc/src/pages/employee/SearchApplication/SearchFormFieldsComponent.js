import React, { Fragment } from "react";
import { TextInput, SubmitBar, DatePicker, SearchField, Dropdown, CardLabelError, MobileNumber } from "@egovernments/digit-ui-react-components";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const SearchFormFieldsComponent = () => {
  const { register, control, handleSubmit, setValue, getValues, reset, formState  } = useFormContext()
  const { t } = useTranslation();

  function previousPage() {
    setValue("offset", getValues("offset") - getValues("limit"));
    handleSubmit(onSubmit)();
  }

  const applicationTypes = [{code: "AIRPORT_AUTHORITY", i18nKey: "NOC_APPLICATION_TYPE_AIRPORT_AUTHORITY"}]
  
  return (
    <>
      <SearchField>
        <label>{t("NOC_FIRE_NOC_APPLICATION_LABEL")}</label>
        <TextInput name="applicationNo" inputRef={register({})} />
      </SearchField>
      <SearchField>
        <label>{t("NOC_FIRE_NOC_SOURCE_MODULE_APPLICATION_LABEL")}</label>
        <TextInput name="sourceRefId" inputRef={register({})} />
      </SearchField>
      <SearchField>
        <label>{t("NOC_APP_MOBILE_NO_SEARCH_PARAM")}</label>
        <MobileNumber
          name="mobileNumber"
          inputRef={register({
            minLength: {
              value: 10,
              message: t("CORE_COMMON_MOBILE_ERROR"),
            },
            maxLength: {
              value: 10,
              message: t("CORE_COMMON_MOBILE_ERROR"),
            },
            pattern: {
              value: /[6789][0-9]{9}/,
              //type: "tel",
              message: t("CORE_COMMON_MOBILE_ERROR"),
            },
          })}
          type="number"
          componentInFront={<div className="employee-card-input employee-card-input--front">+91</div>}
          //maxlength={10}
        />
        <CardLabelError>{formState?.errors?.["mobileNumber"]?.message}</CardLabelError>
      </SearchField>
      <SearchField>
        <label>{t("BPA_SEARCH_APPLICATION_TYPE_LABEL")}</label>
        <Controller
          control={control}
          name="nocType"
          render={(props) => (
            <Dropdown selected={props.value} select={props.onChange} onBlur={props.onBlur} option={applicationTypes} optionKey="i18nKey" t={t} />
          )}
        />
      </SearchField>
      <SearchField>
        <label>{t("NOC_FIRE_NOC_SOURCE_MODULE_APPLICATION_LABEL")}</label>
        <TextInput name="sourceRefId" inputRef={register({})} />
      </SearchField>
      <SearchField className="submit">
        <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
        <p
          style={{ marginTop: "24px" }}
          onClick={() => {
            reset({
              applicationNo: "",
              mobileNumber: "",
              fromDate: "",
              toDate: "",
              status: "",
              offset: 0,
              limit: 10,
              sortBy: "commencementDate",
              sortOrder: "DESC",
              applicationType: {
                code: "BUILDING_PLAN_SCRUTINY",
                i18nKey: "WF_BPA_BUILDING_PLAN_SCRUTINY",
              },
              serviceType: {
                applicationType: ["BUILDING_PLAN_SCRUTINY", "BUILDING_OC_PLAN_SCRUTINY"],
                code: "NEW_CONSTRUCTION",
                i18nKey: "BPA_SERVICETYPE_NEW_CONSTRUCTION",
              },
              "isSubmitSuccessful":false,
            });
            previousPage();
            // closeMobilePopupModal()
          }}
        >
          {t(`ES_COMMON_CLEAR_ALL`)}
        </p>
      </SearchField>
    </>
  );
};

export default SearchFormFieldsComponent;
