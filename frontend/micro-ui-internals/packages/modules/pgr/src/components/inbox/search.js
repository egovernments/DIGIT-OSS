import React, { useState } from "react";
import { useForm } from "react-hook-form";
const { Card, TextInput, Label, SubmitBar, LinkLabel, ActionBar } = require("@egovernments/digit-ui-react-components");

const SearchComplaint = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm();

  const onSubmitInput = (data) => {
    onSubmit(data);
  };

  const clearAll = () => {
    return <LinkLabel style={{ color: "#F47738" }}>Clear Search</LinkLabel>;
  };

  return (
    // <form onSubmit={handleSubmit(onSubmitInput)}>
    <React.Fragment>
      <div className="search-container">
        <div className="search-complaint-container">
          <div className="complaint-input-container">
            <span className="complaint-input">
              <Label>Complaint No.</Label>
              <TextInput name="businessId" inputRef={register} style={{ width: "280px", marginBottom: "8px" }}></TextInput>
              <span className="clear-search">{clearAll()}</span>
            </span>
            <span className="mobile-input">
              <Label>Mobile No.</Label>
              <TextInput name="mobileNo" inputRef={register} style={{ width: "280px" }}></TextInput>
            </span>
          </div>
        </div>
      </div>
      <div>
        <ActionBar>
          <SubmitBar label="Search" />
        </ActionBar>
      </div>
    </React.Fragment>
    // </form>
  );
};

export default SearchComplaint;
