import { CheckBox, FormStep, CardLabel, CardSubHeader, CardCaption } from "@egovernments/digit-ui-react-components";
import WSWaterConnectionDetails from "./WSWaterConnectionDetails";
import WSSewerageConnectionDetails from "./WSSewerageConnectionDetails";
import React from "react";

const ConnectionType = {
  WATER: "WATER",
  SEWERAGE: "SEWERAGE",
};

const WSConnectionDetails = ({ t, config, userType }) => {
  const [connectionType, setConnectionType] = React.useState(ConnectionType.WATER);

  return (
    <React.Fragment>
      <CardCaption>{t("WS_CONNECTION_DETAILS_DESC")}</CardCaption>
      <FormStep>
        <div style={{display: "flex", gap: "0 3rem"}}>
          <CheckBox
            label={t("WS_CONN_TYPE_WATER")}
            onChange={(_) => setConnectionType(ConnectionType.WATER)}
            checked={connectionType === ConnectionType.WATER}
            style={{ paddingBottom: "10px", paddingTop: "10px" }}
          />
          <CheckBox
            label={t("WS_CONN_TYPE_SEWERAGE")}
            onChange={(_) => setConnectionType(ConnectionType.SEWERAGE)}
            checked={connectionType === ConnectionType.SEWERAGE}
            style={{ paddingBottom: "10px", paddingTop: "10px" }}
          />
        </div>
        {connectionType === ConnectionType.WATER && (
          <WSWaterConnectionDetails t={t} userType={userType} config={config}/>
        )}
        {connectionType === ConnectionType.SEWERAGE && (
          <WSSewerageConnectionDetails t={t} userType={userType} config={config}/>
        )}
      </FormStep>
    </React.Fragment>
  );
};

export default WSConnectionDetails;
