import React from "react";
const { Card, TextInput, Label, SubmitBar } = require("@egovernments/digit-ui-react-components");

const SearchComplaint = () => {
  const textInput = () => {};
  return (
    <div style={{ backgroundColor: "#fff", display: "flex" }}>
      <div>
        <span>
          <Label>Hi</Label>
          <TextInput onChange={textInput}></TextInput>
        </span>
        <span>
          <Label>Hi</Label>
          <TextInput onChange={textInput}></TextInput>
        </span>
      </div>
      <div>
        <SubmitBar label="Search" />
      </div>
    </div>
  );
};

export default SearchComplaint;
