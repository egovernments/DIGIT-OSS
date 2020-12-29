import React, { useState } from "react";
import { useForm } from "react-hook-form";
const { TextInput, Label, SubmitBar, LinkLabel, ActionBar } = require("@egovernments/digit-ui-react-components");

const SearchComplaint = ({ onSearch, type, onClose }) => {
  const [complaintNo, setComplaintNo] = useState("");
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
    setComplaintNo("");
    setMobileNo("");
  }

  const clearAll = () => {
    return (
      <LinkLabel style={{ color: "#F47738", cursor: "pointer" }} onClick={clearSearch}>
        Clear Search
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
    <form onSubmit={handleSubmit(onSubmitInput)}>
      <React.Fragment>
        <div className="search-container">
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
            <div className="complaint-input-container">
              <span className="complaint-input">
                <Label>Complaint No.</Label>
                <TextInput
                  name="serviceRequestId"
                  value={complaintNo}
                  onChange={setComplaint}
                  inputRef={register}
                  style={{ width: "280px", marginBottom: "8px" }}
                ></TextInput>
              </span>
              <span className="mobile-input">
                <Label>Mobile No.</Label>
                <TextInput name="mobileNumber" value={mobileNo} onChange={setMobile} inputRef={register} style={{ width: "280px" }}></TextInput>
              </span>
              {type === "desktop" && <SubmitBar style={{ marginTop: 32, marginLeft: 8 }} label="Search" submit />}
            </div>
            {type === "desktop" && <span className="clear-search">{clearAll()}</span>}
          </div>
        </div>
        {type === "mobile" && (
          <ActionBar>
            <SubmitBar label="Search" submit />
          </ActionBar>
        )}
      </React.Fragment>
    </form>
  );
};

export default SearchComplaint;
