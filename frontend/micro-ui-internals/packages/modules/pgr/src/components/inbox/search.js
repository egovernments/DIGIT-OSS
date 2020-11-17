import React from "react";
const { Card, TextInput, Label } = require("@egovernments/digit-ui-react-components");

const SearchComplaint = () => {
  const textInput = () => {};
  return (
    <div style={{ padding: "16px", backgroundColor: "#fff" }}>
      <Label>Hi</Label>
      <TextInput onChange={textInput}></TextInput>
    </div>
  );
};

export default SearchComplaint;
