import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker } from "@egovernments/digit-ui-react-components";

const Search = ({ onSearch, searchParams, searchFields, type, onClose, isInboxPage, t }) => {
  const { register, handleSubmit, formState, reset, watch, control } = useForm({
    defaultValues: searchParams,
  });
  const mobileView = innerWidth <= 640;
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const getFields = (input) => {
    switch(input.type) {
      default:
        return (
          <Controller
            render={(props) => <TextInput onChange={props.onChange} value={props.value} />}
            name={input.name}
            control={control}
            defaultValue={null}
          />
        )
    }
  }

  const clearSearch = () => {
    reset({});
    onSearch({})
  };

  const clearAll = (mobileView) => {
    const mobileViewStyles = mobileView ? { margin: 0 } : {};
    return (
      <LinkLabel style={{ display: "inline", ...mobileViewStyles }} onClick={clearSearch}>
        {t("ES_COMMON_CLEAR_SEARCH")}
      </LinkLabel>
    );
  };

  return (
    <form>
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
          <div className={"complaint-input-container for-pt " + (!isInboxPage ? "for-search" : "")} style={{ width: "100%" }}>
            {searchFields?.map((input, index) => (
              <div key={input.name} className="input-fields">
                {/* <span className={index === 0 ? "complaint-input" : "mobile-input"}> */}
                <span className={"mobile-input"}>
                  <Label>{t(input.label) + ` ${input.isMendatory ? "*" : ""}`}</Label>
                  {getFields(input)}
                </span>
                {formState?.dirtyFields?.[input.name] ? (
                  <span
                    style={{ fontWeight: "700", color: "rgba(212, 53, 28)", paddingLeft: "8px", marginTop: "-20px", fontSize: "12px" }}
                    className="inbox-search-form-error"
                  >
                    {formState?.errors?.[input.name]?.message}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
      {(type === "mobile" || mobileView) && (
        <ActionBar className="clear-search-container">
          <button className="clear-search" style={{ flex: 1 }}>
            {clearAll(mobileView)}
          </button>
          <SubmitBar disabled={!!Object.keys(formState.errors).length} label={t("ES_COMMON_SEARCH")} style={{ flex: 1 }} submit={true} />
        </ActionBar>
      )}
    </form>
  );
}

export default Search;
