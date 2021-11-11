import { CardLabelError, SearchField, SearchForm, SubmitBar, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import { convertEpochToDateDMY, stringReplaceAll } from "../utils";

// city{
//   PT_ULB_CITY
//   PT_ULB_CITY_PLACEHOLDER
//   tenantId
// }

const SwitchComponent = (props) => {
  return (
    <div className="w-fullwidth PropertySearchFormSwitcher">
      {props.keys.map((key) => (
        <span className={props.searchBy === key ? "selected" : "non-selected"} onClick={() => props.onSwitch(key)}>
          {key}
        </span>
      ))}
    </div>
  );
};
const SearchPTID = ({ tenantId, t, onSubmit, data, count, searchBy, PTSearchFields, setSearchBy }) => {
  const { register, control, handleSubmit, setValue, getValues, reset, formState } = useForm({
    defaultValues: {
      propertyIds: "",
      mobileNumber: "",
      locality: "",
      oldPropertyId: "",
      name: "",
      doorNo: ""
    },
  });

  const fields = PTSearchFields?.[searchBy] || {};
  return (
    <div className="PropertySearchForm">
      <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
        <SwitchComponent keys={Object.keys(PTSearchFields || {})} searchBy={searchBy} onSwitch={setSearchBy} />
        {fields &&
          Object.keys(fields).map((key) => {
            let field = fields[key];
            let validation = field?.validation || {};
            return (
              <SearchField>
                <label>{t(field?.label)}</label>
                <TextInput
                  name={key}
                  type={field?.type}
                  inputRef={register({
                    value: getValues(key),
                    shouldUnregister: true,
                    ...validation,
                  })}
                />
                <CardLabelError style={{ marginTop: "-10px", marginBottom: "-10px" }}>{t(formState?.errors?.[key]?.message)}</CardLabelError>
              </SearchField>
            );
          })}

       <div className="pt-search-action" >
         <SearchField  className="pt-search-action-reset">
         <p
            onClick={() => {
              reset({
                propertyIds: "",
                mobileNumber: "",
                locality: "",
                oldPropertyId: "",
                name: "",
                doorNo: ""
              });
            }}
          >
            {t(`ES_COMMON_CLEAR_ALL`)}
          </p>
           </SearchField>
       <SearchField className="pt-search-action-submit">
          <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
        </SearchField>
       </div>
      </SearchForm>
    </div>
  );
};

export default SearchPTID;
