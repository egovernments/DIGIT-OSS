import {
  DatePicker, SearchField, SearchForm, SubmitBar, TextInput
} from "@egovernments/digit-ui-react-components";
import React from "react";
import { Controller, useForm } from "react-hook-form";
// import { convertEpochToDateDMY, stringReplaceAll } from "../utils";

const SearchPTID = ({ tenantId, t, onSubmit, data, count }) => {
  const { register, control, handleSubmit, setValue, getValues, reset, formState } = useForm({
    defaultValues: {
      offset: 0,
      limit: 10,
      sortBy: "commencementDate",
      sortOrder: "DESC",
    },
  });
  // useEffect(() => {
  //   register("offset", 0)
  //   register("limit", 10)
  //   register("sortBy", "commencementDate")
  //   register("sortOrder", "DESC")
  //   // register("status", "")
  //   // register("RenewalPending", true)
  // },[register])

  return (
    <React.Fragment>
      <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
        <SearchField>
          <label>{t("TL_TRADE_LICENSE_LABEL")}</label>
          <TextInput name="licenseNumbers" inputRef={register("licenseNumbers", {})} maxLength={4} title={t("PT_BUILT_AREA_ERROR_MESSAGE")} />
        </SearchField>
        <SearchField>
          <label>{t("TL_TRADE_OWNER_S_NUMBER_LABEL")}</label>
          <TextInput
            name="mobileNumber"
            inputRef={register({})}
            type="mobileNumber"
            componentInFront={<div className="employee-card-input employee-card-input--front">+91</div>}

            //  pattern={"^([0-9]){0,8}$"} title={ t("PT_BUILT_AREA_ERROR_MESSAGE")}
          />
        </SearchField>
        <SearchField>
          <label>{t("TL_SEARCH_TRADE_LICENSE_ISSUED_FROM")}</label>
          <Controller render={(props) => <DatePicker date={props.value} onChange={props.onChange} />} name="fromDate" control={control} />
        </SearchField>
        <SearchField>
          <label>{t("TL_SEARCH_TRADE_LICENSE_ISSUED_TO")}</label>
          <Controller render={(props) => <DatePicker date={props.value} onChange={props.onChange} />} name="toDate" control={control} />
        </SearchField>
        <SearchField>
          <label>{t("TL_LOCALIZATION_TRADE_NAME")}</label>
          <TextInput name="tradeName" inputRef={register({})} />
        </SearchField>
        <SearchField className="submit">
          <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
          <p
            onClick={() => {
              reset({
                licenseNumbers: "",
                mobileNumber: "",
                fromDate: "",
                toDate: "",
                offset: 0,
                limit: 10,
                sortBy: "commencementDate",
                sortOrder: "DESC",
                status: "",
                RenewalPending: true,
              });
            }}
          >
            {t(`ES_COMMON_CLEAR_ALL`)}
          </p>
        </SearchField>
      </SearchForm>
    </React.Fragment>
  );
};

export default SearchPTID;
