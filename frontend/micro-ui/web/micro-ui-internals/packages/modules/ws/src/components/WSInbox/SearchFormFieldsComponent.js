import React, { Fragment } from "react";
import { CardLabelError, SearchField, TextInput, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SearchFormFieldsComponents = ({ registerRef, searchFormState }) => {
  const { t } = useTranslation();
  const propsForMobileNumber = {
    maxlength: 10,
    pattern: "[6-9][0-9]{9}",
    title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
    componentInFront: "+91",
  };
  return (
    <>
      <SearchField className="wns-search-field">
        <label>{t("WS_ACK_COMMON_APP_NO_LABEL")}</label>
        <TextInput name="applicationNumber" inputRef={registerRef({})} />
      </SearchField>
      <SearchField className="wns-search-field">
        <label>{t("WS_MYCONNECTIONS_CONSUMER_NO")}</label>
        <TextInput name="consumerNo" inputRef={registerRef({})} />
      </SearchField>
      <SearchField className="wns-search-field">
        <label>{t("CORE_COMMON_MOBILE_NUMBER")}</label>
        <MobileNumber name="mobileNumber" type="number" inputRef={registerRef({})} {...propsForMobileNumber} />
        {searchFormState?.errors?.["mobileNumber"]?.message ? (
          <CardLabelError>{searchFormState?.errors?.["mobileNumber"]?.message}</CardLabelError>
        ) : null}
      </SearchField>
    </>
  );
};

export default SearchFormFieldsComponents;
