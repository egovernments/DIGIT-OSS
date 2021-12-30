import {
  Card,
  Header,
  Row,
  StatusTable,
  SubmitBar,
} from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

const PropertyLinkSuccess = () => {
  const { t } = useTranslation();
  const { propertyIds } = useParams();
  const history = useHistory();

  const { 
    isLoading,
    isError,
    error,
    data
  } = Digit.Hooks.pt.usePropertySearch({ filters: { propertyIds } }, { filters: { propertyIds } });

  const [property, setProperty] = useState(() => data?.Properties[0] || " ");
  
  useEffect(() => {
    if (data) {
      setProperty(data?.Properties[0]);
    }
  }, [data]);

  return (
    <React.Fragment>
      <Header>{t("PT_PROPERTY_LINKED")}</Header>
      <div>
        <Card>
          <StatusTable>
            <Row label={t("PT_PROPERTY_PTUID")} text={`${property.propertyId || t("CS_NA")}`} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
          <SubmitBar
            submit={false}
            label={t("PT_PROPERTY_CREATE")}
            onSubmit={() => history.push('/digit-ui/citizen/commonPt/property/create')}
          />
        </Card>
      </div>
    </React.Fragment>
  );
};

export default PropertyLinkSuccess;
