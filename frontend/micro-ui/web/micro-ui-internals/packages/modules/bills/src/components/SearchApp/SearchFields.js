import React, { useState, Fragment} from "react";
import { Controller } from "react-hook-form";
import {
  TextInput,
  SubmitBar,
  SearchField,
  Dropdown,
  Loader,
  Localities,
  CardLabelError
} from "@egovernments/digit-ui-react-components";

const SearchFields = ({ searchParams,register, control, reset, tenantId, t, previousPage ,formState, setShowToast , keys, formData}) => {


  const { isLoading, data, data: generateServiceType } = Digit.Hooks.useCommonMDMS(tenantId, "BillingService", "BillsGenieKey");
  
    const filterServiceType = generateServiceType?.BillingService?.BusinessService?.filter((element) => element.billGineiURL);

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
    const formErrors = formState?.errors
    const [_searchParams, setSearchParams] = useState(() => searchParams);
    const selectLocality = (d) => {
      localParamChange({ locality: [...(_searchParams?.locality || []), d] });
    };
    const localParamChange = (filterParam) => {
      let keys_to_delete = filterParam.delete;
      let _new = { ..._searchParams, ...filterParam };
  
      if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
      delete filterParam.delete;
      setSearchParams({ ..._new });
    };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (  
        <SearchField className="pt-form-field">
          <label>{t("ABG_SERVICE_CATEGORY_LABEL")+ " *"}</label>
          <Controller
            control={control}
            rules={{ required: t("REQUIRED_FIELD") }}
            name="serviceCategory"
            render={(props) => (
              <Dropdown name="serviceCategory" t={t} option={serviceTypeList} onBlur={props.onBlur} selected={props.value}  select={props.onChange} optionKey={"name"} />
            )}
          />
          {formErrors && formErrors?.serviceCategory && formErrors?.serviceCategory?.type === "required" && (
                    <CardLabelError>{t(`CS_COMMON_REQUIRED`)}</CardLabelError>)}
        </SearchField>
      )}
        <SearchField className="pt-form-field">
        <label>{t("ABG_INBOX_LOCALITY_MOHALLA")+"*"}</label>
        <Controller
            control={control}
            rules={{ required: t("REQUIRED_FIELD") }}
            name="locality"
            render={(props) => (
              <Localities selectLocality={selectLocality} onBlur={props.onBlur} selected={props.value}  select={props.onChange} tenantId={tenantId} boundaryType="revenue" optionKey={"name"} />
            )}
          />
           {formErrors && formErrors?.locality && formErrors?.locality?.type === "required" && (
                    <CardLabelError>{t(`CS_COMMON_REQUIRED`)}</CardLabelError>)}
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
              locality:"",
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
