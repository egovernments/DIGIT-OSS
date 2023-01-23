import React, { Fragment } from "react";
import { Controller, useWatch } from "react-hook-form";
import {
  TextInput,
  SubmitBar,
  CardLabelError,
  SearchField,
  Dropdown,
  MobileNumber,
  Loader
} from "@egovernments/digit-ui-react-components";

const SearchFields = ({register, control, reset, tenantId, t, previousPage ,formState}) => {


  const { isLoading, data: generateServiceType } = Digit.Hooks.useCommonMDMS(tenantId, "BillingService", "BillsGenieKey");
  
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
    const propsForMobileNumber = {
        maxlength: 10,
        pattern: "[6-9][0-9]{9}",
        title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
        componentInFront: "+91",
    };
    const propsForOldConnectionNumberNpropertyId = {
      pattern: "[A-Za-z]{2}\-[A-Za-z]{2}\-[0-9]{4}\-[0-9]{2}\-[0-9]{2}\-[0-9]{6}",
      title: t("ERR_DEFAULT_INPUT_FIELD_MSG"),
  };
  const serviceCategory = useWatch({ control: control, name: "serviceCategory", defaultValue: "" });
    const getLabel = () => {
      const service = serviceCategory?.businesService
      if (service === "WS" || service === "SW" || !service)
          return <label>{t("ABG_COMMON_TABLE_COL_CONSUMER_ID")}</label>
      else
          return <label>{t("ABG_COMMON_TABLE_COL_PROPERTY_ID")}</label>
  }

  const getInputBasedOnServiceCategory = () => {
      const service = serviceCategory?.businesService
      if(service==="WS" || service==="SW" || !service){
          return <SearchField>
              <label>{t("ABG_COMMON_TABLE_COL_CONSUMER_ID")}</label>
              <TextInput name="consumerCode"
                  inputRef={register({})}
              />
          </SearchField>
      }else {
          return <SearchField>
              <label>{t("ABG_COMMON_TABLE_COL_PROPERTY_ID")}</label>
              <TextInput name="consumerCode"
                  inputRef={register({})}
              />
          </SearchField>
      }
  }
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (  
        <SearchField>
           <label>{t("ABG_SERVICE_CATEGORY_LABEL")+ " *"}</label>
          <Controller
            control={control}
            rules={{ required: t("REQUIRED_FIELD") }}
            name="serviceCategory"
            render={(props) => (
              <Dropdown name="serviceCategory" t={t} option={serviceTypeList} onBlur={props.onBlur} selected={props.value}  select={props.onChange} optionKey={"name"} optionCardStyles={{zIndex:"20"}}  />
            )}
          />
           {formErrors && formErrors?.serviceCategory && formErrors?.serviceCategory?.type === "required" && (
                    <CardLabelError>{t(`CS_COMMON_REQUIRED`)}</CardLabelError>)}
        </SearchField>
      )}
      <SearchField>
        <label>{t("ABG_BILL_NUMBER_LABEL")}</label>
        <TextInput name="billNo" inputRef={register({})} />
      </SearchField>
      <SearchField>
                {getLabel()}
                <TextInput name="consumerCode"
                    inputRef={register({})}
                />
            </SearchField>
      <SearchField>
                <label>{t("ABG_MOBILE_NO_LABEL")}</label>
                <MobileNumber name="mobileNumber" inputRef={register({})} {...propsForMobileNumber} />
            </SearchField>

      <SearchField className="submit">
        <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
        <p 
          onClick={() => {
            reset({
              serviceCategory: "",
              consumerCode: "",
              billNo: "",
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
