import React from "react";
const { Card, TextInput, Label, SubmitBar } = require("@egovernments/digit-ui-react-components");

const SearchComplaint = () => {
  const textInput = () => {};
  const clearAll = () => {
    return <span>Clear Search</span>;
  };
  return (
    <div style={{ backgroundColor: "#fff", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", padding: "16px 40px" }}>
        <span style={{ display: "flex", flexDirection: "column" }}>
          <Label>Complaint No.</Label>
          <TextInput style={{ width: "280px" }} onChange={textInput}></TextInput>
          {clearAll()}
        </span>
        <span>
          <Label>Mobile No.</Label>
          <TextInput style={{ width: "280px", marginLeft: "16px" }} onChange={textInput}></TextInput>
        </span>
      </div>
      <div>
        <SubmitBar label="Search" style={{ width: "200px" }} />
      </div>
    </div>
  );
};

export default SearchComplaint;
