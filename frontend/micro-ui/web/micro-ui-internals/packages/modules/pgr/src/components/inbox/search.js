import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar, CloseSvg } from "@egovernments/digit-ui-react-components";

const SearchComplaint = ({ onSearch, type, onClose, searchParams }) => {
  const [complaintNo, setComplaintNo] = useState(searchParams?.search?.serviceRequestId || "");
  const [mobileNo, setMobileNo] = useState(searchParams?.search?.mobileNumber || "");
  const { register, errors, handleSubmit, reset } = useForm();
  const { t } = useTranslation();

  const onSubmitInput = (data) => {
    if (!Object.keys(errors).filter((i) => errors[i]).length) {
      if (data.serviceRequestId !== "") {
        onSearch({ serviceRequestId: data.serviceRequestId });
      } else if (data.mobileNumber !== "") {
        onSearch({ mobileNumber: data.mobileNumber });
      } else {
        onSearch({});
      }

      if (type === "mobile") {
        onClose();
      }
    }
  };

  function clearSearch() {
    reset();
    onSearch({});
    setComplaintNo("");
    setMobileNo("");
  }

  const clearAll = () => {
    return (
      <LinkLabel className="clear-search-label" onClick={clearSearch}>
        {t("ES_COMMON_CLEAR_SEARCH")}
      </LinkLabel>
    );
  };

  function setComplaint(e) {
    setComplaintNo(e.target.value);
  }

  function setMobile(e) {
    setMobileNo(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit(onSubmitInput)} style={{ marginLeft: "24px" }}>
      <React.Fragment>
        <div className="search-container" style={{ width: "auto" }}>
          <div className="search-complaint-container">
            {type === "mobile" && (
              <div className="complaint-header">
                <h2> {t("CS_COMMON_SEARCH_BY")}:</h2>
                <span onClick={onClose}>
                  <CloseSvg />
                </span>
              </div>
            )}
            <div className="complaint-input-container">
              <span className="complaint-input">
                <Label>{t("CS_COMMON_COMPLAINT_NO")}.</Label>
                <TextInput
                  name="serviceRequestId"
                  value={complaintNo}
                  onChange={setComplaint}
                  inputRef={register({
                    pattern: /(?!^$)([^\s])/,
                  })}
                  style={{ marginBottom: "8px" }}
                ></TextInput>
              </span>
              <span className="mobile-input">
                <Label>{t("CS_COMMON_MOBILE_NO")}.</Label>
                <TextInput
                  name="mobileNumber"
                  value={mobileNo}
                  onChange={setMobile}
                  inputRef={register({
                    pattern: /^[6-9]\d{9}$/,
                  })}
                ></TextInput>
              </span>
              {type === "desktop" && (
                <SubmitBar
                  style={{ marginTop: 32, marginLeft: "16px", width: "calc( 100% - 16px )" }}
                  label={t("ES_COMMON_SEARCH")}
                  submit={true}
                  disabled={Object.keys(errors).filter((i) => errors[i]).length}
                />
              )}
            </div>
            {type === "desktop" && <span className="clear-search">{clearAll()}</span>}
          </div>
        </div>
        {type === "mobile" && (
          <ActionBar>
            <SubmitBar label="Search" submit={true} />
          </ActionBar>
        )}
      </React.Fragment>
    </form>
  );
};

export default SearchComplaint;
