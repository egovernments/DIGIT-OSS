import { Card, ButtonSelector } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const PropertyInvalidMobileNumber = ({ userType, propertyId: propertyIdFromProp, skipNContinue, updateMobileNumber }) => {
  const { t } = useTranslation();
  const { propertyIds } = useParams();

  return (
    <React.Fragment>
      <Card>
        <div>
          <p>{t('PT_INVALID_OWNERS_MOBILE_NO')}</p>
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <ButtonSelector theme="border" label={t('PT_SKIP_N_CONTINUE')} onSubmit={skipNContinue} style={{ marginLeft: "10px" }} />
          <ButtonSelector label={t('PT_UPDATE_MOBILE_NO')} onSubmit={updateMobileNumber} style={{ marginLeft: "10px" }} />
        </div>
      </Card>
    </React.Fragment>
  );
};

export default PropertyInvalidMobileNumber;
