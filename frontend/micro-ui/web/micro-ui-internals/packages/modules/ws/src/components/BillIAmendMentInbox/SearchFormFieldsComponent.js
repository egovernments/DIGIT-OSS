import React, { Fragment } from "react";
import { SearchField, TextInput } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SearchFormFieldsComponents = ({ registerRef, searchFormState }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <SearchField>
        <label>{t("BILLAMEND_APPLICATIONNO")}</label>
        <TextInput name="applicationNo" inputRef={registerRef({})} />
      </SearchField>
      <SearchField>
        <label>{t("CORE_COMMON_MOBILE_NUMBER")}</label>
        <TextInput name="mobileNumber" inputRef={registerRef({})} />
      </SearchField>
    </React.Fragment>
  );
};

export default SearchFormFieldsComponents;
