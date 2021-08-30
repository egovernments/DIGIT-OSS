import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";

const UploadedDocument = props => {
  const { document, removeDocument, disabled } = props;
  return (
    <Button
      variant="outlined"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(5, 5, 5, 0.11999999731779099)",
        minWidth: 300,
        justifyContent: "space-between"
      }}
    >
      {document.fileName}
      {!disabled && <Icon
        style={{ color: "#E54D42", marginLeft: "16px" }}
        onClick={removeDocument}
      >
        <i class="material-icons">highlight_off</i>
      </Icon>}
    </Button>
  );
};

export default UploadedDocument;
