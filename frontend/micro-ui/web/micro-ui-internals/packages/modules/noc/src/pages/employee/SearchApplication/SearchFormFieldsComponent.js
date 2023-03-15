import React, { Fragment } from "react";
import { TextInput, SubmitBar, DatePicker, SearchField, Dropdown, CardLabelError, MobileNumber, CardHeader } from "@egovernments/digit-ui-react-components";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { businessServiceList } from "../../../utils";


const SearchFormFieldsComponent = (props) => {
  const { register, control, setValue, getValues, reset, formState, trigger  } = useFormContext()
  const { t } = useTranslation();
  const nocTypeList = businessServiceList();

  function previousPage() {
    setValue("offset", getValues("offset") - getValues("limit"));
    props?.onSubmit({
      nocType: nocTypeList?.[0]?.code,
      offset: 0,
      limit: 10,
      sortBy: "commencementDate",
      sortOrder: "DESC",
    }, true);
    props?.isMobileView ? props.closeMobilePopupModal() : null;
  }
  
  
  return (
    <>
      <SearchField>
        <label>{t("NOC_APP_NO_LABEL")}</label>
        <TextInput name="applicationNo" inputRef={register({})} />
      </SearchField>
      <SearchField>
        <label>{t("NOC_SOURCE_MODULE_NUMBER")}</label>
        <TextInput name="sourceRefId" inputRef={register({})} />
      </SearchField>
      <SearchField>
        <label>{t("NOC_TYPE_LABEL")}</label>
        <Controller
          control={control}
          name="nocType"
          render={(props) => (
            <Dropdown selected={nocTypeList?.length == 1 ? nocTypeList[0] : props.value} select={props.onChange} onBlur={props.onBlur} option={nocTypeList ? nocTypeList : []} optionKey="i18nKey" t={t} disable={nocTypeList?.length == 1 ? true : false}/>
          )}
        />
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
        <label>{t("NOC_NUMBER_LABEL")}</label>
        <TextInput name="nocNo" inputRef={register({})} />
      </SearchField>
      {/* <SearchField></SearchField> */}
      <SearchField className="submit">
        <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
        <p
          style={{ marginTop: "24px" }}
          onClick={() => {
            setValue("applicationNo", null);
            setValue("sourceRefId", null);
            setValue("mobileNumber", null);
            setValue("nocType", nocTypeList?.[0]?.code);
            setValue("offset", 0);
            setValue("limit", 10);
            setValue("sortBy","commencementDate");
            setValue("sortOrder","DESC");
            setValue("isSubmitSuccessful","false");
            reset({
              applicationNo: "",
              sourceRefId: "",
              nocType: "",
              nocNo: "",
              mobileNumber: "",
              offset: 0,
              limit: 10,
              sortBy: "commencementDate",
              sortOrder: "DESC",
              "isSubmitSuccessful":false,
            });
            previousPage();
          }}
        >
          {t(`ES_COMMON_CLEAR_ALL`)}
        </p>
      </SearchField>
    </>
  );
};

export default SearchFormFieldsComponent;
