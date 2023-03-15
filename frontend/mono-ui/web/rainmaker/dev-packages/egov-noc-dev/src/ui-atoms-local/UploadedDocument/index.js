import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import React from "react";
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from "@material-ui/core/styles";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    fontSize: 13
  }
}))(Tooltip);

const UploadedDocument = props => {
  const { document, removeDocument, disabled } = props;
  return (
    <LightTooltip title={document.fileName} arrow>
    <Button
      variant="outlined"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(5, 5, 5, 0.11999999731779099)",
        minWidth: 300,
        justifyContent: "space-between"
      }}
    >
      <div style={{width:100,overflow: "hidden", whiteSpace: "nowrap",textOverflow: "ellipsis"}}>
      {document.fileName}
      </div>
     
      {!disabled && <Icon
        style={{ color: "#E54D42", marginLeft: "16px" }}
        onClick={removeDocument}
      >
        <i class="material-icons">highlight_off</i>
      </Icon>}
    </Button>
    </LightTooltip>
  );
};

export default UploadedDocument;
