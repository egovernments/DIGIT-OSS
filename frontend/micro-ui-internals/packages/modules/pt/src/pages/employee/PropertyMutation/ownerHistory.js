import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// import { Mo } from "@egovernments/digit-ui-react-components";

import PropertyOwnerHistory from "../../citizen/MyProperties/propertyOwnerHistory";

const OwnerHistory = (props) => {
  const { propertyId, userType } = props;

  return <PropertyOwnerHistory propertyId={propertyId} userType={userType} />;
};

export default OwnerHistory;
