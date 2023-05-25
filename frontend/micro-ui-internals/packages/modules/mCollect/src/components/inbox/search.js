import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
// import _ from "lodash";

const SearchApplication = ({ onSearch, type, onClose, searchFields, searchParams, isInboxPage, defaultSearchParams }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, watch, control } = useForm({
    defaultValues: searchParams,
  });
  const mobileView = innerWidth <= 640;

  // console.log(_.isEqual(defaultSearchParams, searchParams), { defaultSearchParams, searchParams }, "params are defaulted");

  const onSubmitInput = (data) => {
    if (!data.mobileNumber) {
      delete data.mobileNumber;
    }

    data.delete = [];

    searchFields.forEach((field) => {
      if (!data[field.name]) data.delete.push(field.name);
    });

    onSearch(data);
    if (type === "mobile") {
      onClose();
    }
  };

  function clearSearch() {
    const resetValues = searchFields.reduce((acc, field) => ({ ...acc, [field?.name]: "" }), {});
    reset(resetValues);
    const _newParams = { ...searchParams };
    _newParams.delete = [];
    searchFields.forEach((e) => {
      _newParams.delete.push(e?.name);
    });

    onSearch({ ..._newParams });
  }

  const clearAll = (mobileView) => {
    const mobileViewStyles = mobileView ? { margin: 0 } : {};
    return (
      <LinkLabel style={{ display: "inline", ...mobileViewStyles }} onClick={clearSearch}>
        {t("UC_CLEAR_SEARCH_LABEL")}
      </LinkLabel>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmitInput)}>
      <React.Fragment>
        <div className="search-container" style={{ width: "auto", marginLeft: isInboxPage ? "24px" : "revert" }}>
          <div className="search-complaint-container">
            {(type === "mobile" || mobileView) && (
              <div className="complaint-header">
                <h2>{t("ES_COMMON_SEARCH_BY")}</h2>
                <span onClick={onClose}>
                  <CloseSvg />
                </span>
              </div>
            )}
            <div className="complaint-input-container" style={{textAlign: "start"}}>
              {searchFields
                ?.filter((e) => true)
                ?.map((input, index) => (
                  <div key={input.name} className="input-fields">
                  <span key={index} className={"complaint-input"}>  {/* //{index === 0 ? "complaint-input" : "mobile-input"} */}
                    <Label>{input.label}</Label>
                    {input.type !== "date" ? (
                      <div className="field-container">
                        {input?.componentInFront ? (
                          <span className="citizen-card-input citizen-card-input--front" style={{ flex: "none" }}>
                            {input?.componentInFront}
                          </span>
                        ) : null}
                        <TextInput {...input} inputRef={register} watch={watch} shouldUpdate={true} />
                      </div>
                    ) : (
                      <Controller
                        render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                        name={input.name}
                        control={control}
                        defaultValue={null}
                      />
                    )}{" "}
                  </span>
                  </div>
                ))}
                {type === "desktop" && !mobileView &&
              <div className="search-action-wrapper" style={{width: "100%"}}>
                <SubmitBar
                  className="submit-bar-search"
                  label={t("UC_SEARCH_LABEL")}
                  submit
                />
                {type === "desktop" && !mobileView && (
                  <span style={{ paddingTop: "9px" }} className="clear-search">
                    {clearAll()}
                  </span>
                )}
              </div>}
            </div>
          </div>
        </div>
        {(type === "mobile" || mobileView) && (
          <ActionBar className="clear-search-container">
            <button className="clear-search" style={{ flex: 1 }}>
              {clearAll(mobileView)}
            </button>
            <SubmitBar label={t("UC_SEARCH_LABEL")} style={{ flex: 1 }} submit={true} />
          </ActionBar>
        )}
      </React.Fragment>
    </form>
  );
};

export default SearchApplication;
