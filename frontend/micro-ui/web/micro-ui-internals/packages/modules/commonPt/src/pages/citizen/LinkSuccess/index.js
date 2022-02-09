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

const PropertyLinkSuccess = ({ onSelect }) => {
  const { t } = useTranslation();
  const { propertyIds } = useParams();
  const history = useHistory();

  const onSubmit = () => {
    if(onSelect) {
      onSelect('propertyId', propertyIds);
    }
  }

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
      <Header>{t("PT_PROPERTY_DETAILS")}</Header>
      <div>
        <Card>
          <StatusTable>
            <Row label={t("PT_PROPERTY_PTUID")} text={`${property.propertyId || t("CS_NA")}`} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
          { onSelect ?
            <SubmitBar
              submit={false}
              label={t("CS_COMMONS_NEXT")}
              onSubmit={onSubmit}
            />
          : 
            <SubmitBar
              submit={false}
              label={t("PT_PROPERTY_CREATE")}
              onSubmit={() => history.push('/digit-ui/citizen/commonPt/property/new-application')}
            />
          }
        </Card>
      </div>
    </React.Fragment>
  );
};

export default PropertyLinkSuccess;
