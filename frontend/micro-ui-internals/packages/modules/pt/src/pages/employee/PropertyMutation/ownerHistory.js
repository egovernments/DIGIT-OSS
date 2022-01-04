import React from "react";
import PropertyOwnerHistory from "../../citizen/MyProperties/propertyOwnerHistory";

const OwnerHistory = (props) => {
  const { propertyId, userType } = props;
  return <PropertyOwnerHistory propertyId={propertyId} userType={userType} />;
};

export default OwnerHistory;
