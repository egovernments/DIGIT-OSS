import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError } from "@egovernments/digit-ui-react-components";
import DropdownStatus from "./DropdownStatus";
import { useTranslation } from "react-i18next";

const SearchApplication = ({ onSearch, type, onClose, isFstpOperator, searchFields, searchParams, isInboxPage }) => {
  const storedSearchParams = isInboxPage ? Digit.SessionStorage.get("fsm/inbox/searchParams") : Digit.SessionStorage.get("fsm/search/searchParams");

  const { data: applicationStatuses, isFetched: areApplicationStatus } = Digit.Hooks.fsm.useApplicationStatus();

  const { t } = useTranslation();
  const { register, handleSubmit, reset, watch, control } = useForm({
    defaultValues: storedSearchParams || searchParams,
  });
  const [error, setError] = useState(false);
  const mobileView = innerWidth <= 640;
  const FSTP = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;
  const watchSearch = watch(["applicationNos", "mobileNumber", "fromDate", "toDate"]);

  const onSubmitInput = (data) => {
    if (!data.mobileNumber) {
      delete data.mobileNumber;
    }
    onSearch(data);
    if (type === "mobile") {
      onClose();
    }
  };

  function clearSearch() {
    const resetValues = searchFields.reduce((acc, field) => ({ ...acc, [field?.name]: "" }), {});
    reset(resetValues);
    if (isInboxPage) {
      Digit.SessionStorage.del("fsm/inbox/searchParams");
    } else {
      Digit.SessionStorage.del("fsm/search/searchParams");
    }
    onSearch({});
  }

  const clearAll = (mobileView) => {
    const mobileViewStyles = mobileView ? { margin: 0 } : {};
    return (
      <LinkLabel style={{ display: "inline", ...mobileViewStyles }} onClick={clearSearch}>
        {t("ES_COMMON_CLEAR_SEARCH")}
      </LinkLabel>
    );
  };

  const searchValidation = (data) => {
    if (FSTP) return null;

    watchSearch.applicationNos || watchSearch.mobileNumber || (watchSearch.fromDate && watchSearch.toDate) ? setError(false) : setError(true);
    return watchSearch.applicationNos || watchSearch.mobileNumber || (watchSearch.fromDate && watchSearch.toDate) ? true : false;
  };

  const getFields = (input) => {
    switch (input.type) {
      case "date":
        return (
          <Controller
            render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
            name={input.name}
            control={control}
            defaultValue={null}
          />
        );
      case "status":
        return (
          <Controller
            render={(props) => (
              <DropdownStatus
                onAssignmentChange={props.onChange}
                value={props.value}
                applicationStatuses={applicationStatuses}
                areApplicationStatus={areApplicationStatus}
              />
            )}
            name={input.name}
            control={control}
            defaultValue={null}
          />
        );
      default:
        return (
          <TextInput
            {...input}
            inputRef={register}
            {...register(input.name, {
              validate: searchValidation,
            })}
            watch={watch}
            shouldUpdate={true}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitInput)}>
      <React.Fragment>
        <div className="search-container" style={{ width: "auto", marginLeft: FSTP ? "" : isInboxPage ? "24px" : "revert" }}>
          <div className="search-complaint-container">
            {(type === "mobile" || mobileView) && (
              <div className="complaint-header">
                <h2>{t("ES_COMMON_SEARCH_BY")}</h2>
                <span
                  style={{
                    position: "absolute",
                    top: "2%",
                    right: "8px",
                  }}
                  onClick={onClose}
                >
                  <CloseSvg />
                </span>
              </div>
            )}
            <div className={FSTP ? "complaint-input-container for-pt for-search" : "complaint-input-container"} style={{ width: "100%" }}>
              {searchFields?.map((input, index) => (
                <span key={index} className={index === 0 ? "complaint-input" : "mobile-input"}>
                  <Label>{input.label}</Label>
                  {getFields(input)}{" "}
                </span>
              ))}
              {type === "desktop" && !mobileView && <SubmitBar className="submit-bar-search" label={t("ES_COMMON_SEARCH")} submit />}
            </div>
            {error ? <CardLabelError className="search-error-label">{t("ES_SEARCH_APPLICATION_ERROR")}</CardLabelError> : null}
            {type === "desktop" && !mobileView && <span className="clear-search">{clearAll()}</span>}
          </div>
        </div>
        {(type === "mobile" || mobileView) && (
          <ActionBar className="clear-search-container">
            <button className="clear-search" style={{ flex: 1 }}>
              {clearAll(mobileView)}
            </button>
            <SubmitBar label={t("ES_COMMON_SEARCH")} style={{ flex: 1 }} submit={true} />
          </ActionBar>
        )}
      </React.Fragment>
    </form>
  );
};

export default SearchApplication;
