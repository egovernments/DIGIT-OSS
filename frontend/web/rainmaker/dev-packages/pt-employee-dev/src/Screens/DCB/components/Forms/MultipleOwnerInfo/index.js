import React from "react";
import { Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";


const titleStyle = {
  display: "flex",
  alignItems: "center",
};

const getTitle = (length) => (
  <div className="pt-ownerinfo-title" style={titleStyle}>
    <span>
      <Icon action="social" name="person" />
    </span>
    <Label
      labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
      label={'COMMON_OWNER'}
      secondaryText={'-' + (length)}
      fontSize="18px"
    />
  </div>
);

const MultipleOwnerInfoHOC = ({ handleRemoveOwner, addOwner, ownerDetails, disabled }) => (
    <div>
      {ownerDetails.map((Data, index) => (
        <Data.Component
          key={index}
          cardTitle={getTitle(index + 1)}
          deleteBtn={ownerDetails.length > 2}
          handleRemoveOwner={(formId, formKey) => { handleRemoveOwner(formId, formKey) }}
          formId={Data.index}
          disabled={disabled}
        />
      ))}
      {!disabled && <div className="pt-add-owner-btn" onClick={addOwner}>
        + ADD OWNER
      </div>}
    </div>
);

export default MultipleOwnerInfoHOC;
