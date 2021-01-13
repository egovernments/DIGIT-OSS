import React, { useState } from "react";
import { useForm } from "react-hook-form";
const { TextInput, Label, SubmitBar, LinkLabel, ActionBar } = require("@egovernments/digit-ui-react-components");
import { useTranslation } from "react-i18next";

const SearchApplication = ({ onSearch, type, onClose }) => {
  const { t } = useTranslation();
  const [applicationNo, setApplicationNo] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const { register, handleSubmit, reset } = useForm();

  const onSubmitInput = (data) => {
    console.log("data", data);
    if (data.serviceRequestId) {
      onSearch({ serviceRequestId: data.serviceRequestId });
    } else {
      onSearch({ mobileNumber: data.mobileNumber });
    }
    if (type === "mobile") {
      onClose();
    }
  };
  function clearSearch() {
    reset();
    onSearch({});
    setApplicationNo("");
    setMobileNo("");
  }

  const clearAll = () => {
    return (
      <LinkLabel style={{ color: "#F47738", cursor: "pointer" }} onClick={clearSearch}>
        {t("ES_COMMON_CLEAR_SEARCH")}
      </LinkLabel>
    );
  };

  function setComplaint(e) {
    setApplicationNo(e.target.value);
  }

  function setMobile(e) {
    setMobileNo(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit(onSubmitInput)}>
      <React.Fragment>
        <div className="search-container" style={{ width: "auto" }}>
          <div className="search-complaint-container" style={{ display: "flex", flexDirection: "column", alignItems: "end" }}>
            {type === "mobile" && (
              <div
                className="complaint-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "20px",
                }}
              >
                <h2>SEARCH BY:</h2>
                <span onClick={onClose}>x</span>
              </div>
            )}
            <div className="complaint-input-container" style={{ width: "100%" }}>
              <span className="complaint-input">
                <Label>{t("ES_SEARCH_APPLICATION_APPLICATION_NO")}</Label>
                <TextInput
                  name="serviceRequestId"
                  value={applicationNo}
                  onChange={setComplaint}
                  inputRef={register}
                  style={{ width: "280px", marginBottom: "8px" }}
                ></TextInput>
              </span>
              <span className="mobile-input">
                <Label>{t("ES_SEARCH_APPLICATION_MOBILE_NO")}</Label>
                <TextInput name="mobileNumber" value={mobileNo} onChange={setMobile} inputRef={register} style={{ width: "280px" }}></TextInput>
              </span>
              {type === "desktop" && <SubmitBar style={{ marginTop: 32, marginLeft: "auto" }} label={t("ES_COMMON_SEARCH")} submit />}
            </div>
            {type === "desktop" && <span className="clear-search">{clearAll()}</span>}
          </div>
        </div>
        {type === "mobile" && (
          <ActionBar>
            <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
          </ActionBar>
        )}
      </React.Fragment>
    </form>
  );
};

export default SearchApplication;
