import React, { Fragment } from "react";
import { SearchField, TextInput, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SearchFormFieldsComponents = ({ registerRef, searchFormState, searchFieldComponents }) => {
  const { t } = useTranslation();
  const isMobile = window.Digit.Utils.browser.isMobile();
  const propsForMobileNumber = {
    maxlength: 10,
    pattern: "[6-9][0-9]{9}",
    title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
    componentInFront: "+91",
  };
  if (!isMobile) {
    return (
      <React.Fragment>
        <div className="search-container" style={{ width: "auto", marginLeft: "24px" }}>
          <div className="search-complaint-container">
            <div className="complaint-input-container" style={{ textAlign: "start" }}>
              <SearchField>
                <label>{t("BILLAMEND_APPLICATIONNO")}</label>
                <TextInput name="applicationNumber" inputRef={registerRef({})} />
              </SearchField>
              <SearchField>
                <label>{t("CORE_COMMON_MOBILE_NUMBER")}</label>
                <MobileNumber name="mobileNumber" type="number" inputRef={registerRef({})} {...propsForMobileNumber} />
              </SearchField>
              <div className="search-action-wrapper" style={{ width: "100%" }}>
                {searchFieldComponents}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <SearchField>
        <label>{t("BILLAMEND_APPLICATIONNO")}</label>
        <TextInput name="applicationNumber" inputRef={registerRef({})} />
      </SearchField>
      <SearchField>
        <label>{t("CORE_COMMON_MOBILE_NUMBER")}</label>
        <MobileNumber name="mobileNumber" type="number" inputRef={registerRef({})} {...propsForMobileNumber} />
      </SearchField>
    </React.Fragment>
  );
};

export default SearchFormFieldsComponents;
