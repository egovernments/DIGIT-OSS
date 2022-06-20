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
   DownloadIcon 
} from "@egovernments/digit-ui-react-components";

const SearchFields = ({ register, control, reset, tenantId, t, previousPage ,formState, setShowToast , keys}) => {


  const { isLoading, data, data: generateServiceType } = Digit.Hooks.useCommonMDMS(tenantId, "BillingService", "BillsGenieKey");
  
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
        <SearchField className="pt-form-field">
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
      <SearchField className="pt-form-field">
        <label>{t("ABG_INBOX_LOCALITY_MOHALLA")}</label>
        <TextInput name="billNumber" inputRef={register({})} />
      </SearchField>
      <SearchField className="pt-form-field">
        <label>{t("ABG_CONSUMER_ID_LABEL")}</label>
        <TextInput name="consumerCode" inputRef={register({})} />
      </SearchField>

      <SearchField className="submit">
        <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
        <p 
          onClick={() => {
            reset({
              serviceCategory: "",
              consumerCode: "",
              billNumber: "",
              offset: 0,
              limit: 10,
              sortBy: "commencementDate",
              sortOrder: "DESC",
            });
            setShowToast(null);
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
