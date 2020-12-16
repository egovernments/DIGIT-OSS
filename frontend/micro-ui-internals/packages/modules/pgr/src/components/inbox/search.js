import React, { useState } from "react";
import { useForm } from "react-hook-form";
const { TextInput, Label, SubmitBar, LinkLabel, ActionBar } = require("@egovernments/digit-ui-react-components");

const SearchComplaint = ({ onClose, onSearch, type }) => {
  const { register, handleSubmit } = useForm();

  const onSubmitInput = (data) => {
    console.log("data", data);
    if (data.businessId) {
      onSearch({ businesssId: data.businessId });
    } else {
      onSearch({ mobileNumber: data.mobileNo });
    }
  };

  function clearSearch() {
    onSearch({});
  }

  const clearAll = () => {
    return (
      <LinkLabel style={{ color: "#F47738" }} onClick={clearSearch}>
        Clear Search
      </LinkLabel>
    );
  };

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
                <TextInput name="businessId" inputRef={register} style={{ width: "280px", marginBottom: "8px" }}></TextInput>
              </span>
              <span className="mobile-input">
                <Label>Mobile No.</Label>
                <TextInput name="mobileNo" inputRef={register} style={{ width: "280px" }}></TextInput>
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
