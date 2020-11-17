import React from "react";
const { Card, TextInput } = require("@egovernments/digit-ui-react-components");

const SearchComplaint = () => {
  const textInput = () => {};
  return (
    <div style={{ gridColumn: "2", gridRow: "1" }}>
      <TextInput onChange={textInput}></TextInput>
    </div>
  );
};

export default SearchComplaint;
