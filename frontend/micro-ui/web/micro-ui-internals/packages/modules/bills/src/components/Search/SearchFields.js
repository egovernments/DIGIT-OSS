import React, { Fragment } from "react";
import { Controller, useWatch } from "react-hook-form";
import {
  TextInput,
  SubmitBar,
  LinkLabel,
  ActionBar,
  CloseSvg,
  DatePicker,
  CardLabelError,
  SearchForm,
  SearchField,
  Dropdown,
  Table,
  Card,
  MobileNumber,
  Loader,
  CardText,
  Header,
} from "@egovernments/digit-ui-react-components";

const SearchFields = ({ register, control, reset, tenantId, t, previousPage ,formState}) => {


  const { isLoading, data: generateServiceType } = Digit.Hooks.useCommonMDMS(tenantId, "BillingService", "BillsGenieKey");
  
    const filterServiceType = generateServiceType?.BillingService?.BusinessService?.filter((element) => element.billGineiURL);
  
    const getUlbLists = generateServiceType?.tenant?.tenants?.filter((element) => element.code === tenantId);
    let serviceTypeList = [];
    if (filterServiceType) {
      serviceTypeList = filterServiceType.map((element) => {
        return {
          name: Digit.Utils.locale.getTransformedLocale(`BILLINGSERVICE_BUSINESSSERVICE_${element.code}`),
          url: element.billGineiURL,
          businesService: element.code,
        };
      });
    }


  return (
    <>
     
      {isLoading ? (
        <Loader />
      ) : (
        <SearchField>
          <label>{t("ABG_SERVICE_CATEGORY_LABEL")}</label>
          <Controller
            control={control}
            name="serviceCategory"
            render={(props) => (
              <Dropdown name="serviceCategory" t={t} option={serviceTypeList} onBlur={props.onBlur} selected={props.value}  select={props.onChange} optionKey={"name"} />
            )}
          />
        </SearchField>
      )}
      <SearchField>
        <label>{t("ABG_BILL_NUMBER_LABEL")}</label>
        <TextInput name="billNumber" inputRef={register({})} />
      </SearchField>
      <SearchField>
        <label>{t("ABG_PT_CONSUMER_CODE_LABEL")}</label>
        <TextInput name="consumerCode" inputRef={register({})} />
      </SearchField>
      <SearchField>
        <label>{t("ABG_MOBILE_NO_LABEL")}</label>
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

      <SearchField className="submit">
        <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
        <p
          onClick={() => {
            reset({
              serviceCategory: "",
              consumerCode: "",
              billNumber: "",
              mobileNumber: "",
              offset: 0,
              limit: 10,
              sortBy: "commencementDate",
              sortOrder: "DESC",
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
export default SearchFields;
