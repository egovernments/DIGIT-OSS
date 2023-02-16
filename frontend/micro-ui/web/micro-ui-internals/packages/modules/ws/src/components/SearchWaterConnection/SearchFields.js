import React, { Fragment } from "react";
import { Controller, useWatch } from "react-hook-form";
import { TextInput, SubmitBar, DatePicker, SearchField, Dropdown, Loader, MobileNumber } from "@egovernments/digit-ui-react-components";

const SearchFields = ({ register, control, reset, tenantId, t }) => {
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
  let validation = {}
  return (
    <>
      <SearchField>
        <label>{t("WS_MYCONNECTIONS_CONSUMER_NO")}</label>
        <TextInput 
          name="connectionNumber" 
          inputRef={register({})} 
          {...(validation = {
            isRequired: false,
            pattern: "^[a-zA-Z0-9\/-]*$",
            type: "text",
            title: t("ERR_INVALID_CONSUMER_NO"),
          })}
          />
      </SearchField>
      <SearchField>
        <label>{t("WS_SEARCH_CONNNECTION_OLD_CONSUMER_LABEL")}</label>
        <TextInput name="oldConnectionNumber" inputRef={register({})} {...propsForOldConnectionNumberNpropertyId} />
      </SearchField>
      <SearchField>
        <label>{t("WS_PROPERTY_ID_LABEL")}</label>
        <TextInput name="propertyId" inputRef={register({})} {...propsForOldConnectionNumberNpropertyId} />
      </SearchField>
      <SearchField>
        <label>{t("WS_HOME_SEARCH_RESULTS_OWN_MOB_LABEL")}</label>
        <MobileNumber name="mobileNumber" inputRef={register({})} {...propsForMobileNumber} />
      </SearchField>
      <SearchField className="submit">
        <SubmitBar label={t("WS_SEARCH_CONNECTION_SEARCH_BUTTON")} submit />
        <p
          onClick={() => {
            reset({
              searchType:"CONNECTION",
              mobileNumber: "",
              offset: 0,
              limit: 10,
              sortBy: "commencementDate",
              sortOrder: "DESC",
              propertyId: "",
              connectionNumber: "",
              oldConnectionNumber: "",
            });
          }}
        >
          {t("WS_SEARCH_CONNECTION_RESET_BUTTON")}
        </p>
      </SearchField>
    </>
  );
};
export default SearchFields;
