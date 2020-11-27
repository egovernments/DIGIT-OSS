import React, { useState } from "react";
import { useForm } from "react-hook-form";
const { Card, TextInput, Label, SubmitBar } = require("@egovernments/digit-ui-react-components");

const SearchComplaint = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm();

  const onSubmitInput = (data) => {
    onSubmit(data);
  };

  const clearAll = () => {
    return <span>Clear Search</span>;
  };

  return (
    <form onSubmit={handleSubmit(onSubmitInput)}>
      <div className="search-complaint-container">
        <div className="complaint-input-container">
          <span className="complaint-input">
            <Label>Complaint No.</Label>
            <TextInput name="businessId" inputRef={register} style={{ width: "280px", marginBottom: "8px" }}></TextInput>
            {clearAll()}
          </span>
          <span className="mobile-input">
            <Label>Mobile No.</Label>
            <TextInput name="mobileNo" inputRef={register} style={{ width: "280px" }}></TextInput>
          </span>
        </div>
        <div>
          <SubmitBar label="Search" style={{ width: "200px" }} />
        </div>
      </div>
    </form>
  );
};

export default SearchComplaint;
