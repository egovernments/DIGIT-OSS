import React from "react";
const { Card, TextInput, Label, SubmitBar } = require("@egovernments/digit-ui-react-components");

const SearchComplaint = () => {
  const textInput = () => {};
  const clearAll = () => {
    return <span>Clear Search</span>;
  };
  return (
    <div className="search-complaint-container">
      <div className="complaint-input-container">
        <span className="complaint-input">
          <Label>Complaint No.</Label>
          <TextInput style={{ width: "280px", marginBottom: "8px" }} onChange={textInput}></TextInput>
          {clearAll()}
        </span>
        <span className="mobile-input">
          <Label>Mobile No.</Label>
          <TextInput style={{ width: "280px" }} onChange={textInput}></TextInput>
        </span>
      </div>
      <div>
        <SubmitBar label="Search" style={{ width: "200px" }} />
      </div>
    </div>
  );
};

export default SearchComplaint;
