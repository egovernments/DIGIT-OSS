import { CardLabel, Dropdown, LabelFieldPair, LinkButton, TextInput } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";

const WSRoadCuttingDetails = ({ t, config, userType, formData }) => {
  const [roadCuttingDetails, setRoadCuttingDetails] = React.useState({
    roadType: { code: "", value: "", i18nKey: "" },
    area: "",
  });

  React.useEffect(() => {});

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_ROAD_TYPE`)}:`}</CardLabel>
        <div className="field">
          <Dropdown
            key={config.key}
            t={t}
            selected={roadCuttingDetails.roadType}
            select={(value) => {
              setRoadCuttingDetails({ ...roadCuttingDetails, roadType: value });
            }}
          ></Dropdown>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_AREA_SQ_FT`)}:`}</CardLabel>
        <div className="field">
          <TextInput
            key={config.key}
            value={roadCuttingDetails.area}
            onChange={(ev) => {
              setRoadCuttingDetails({ ...roadCuttingDetails, area: ev.target.value });
            }}
          ></TextInput>
        </div>
      </LabelFieldPair>
      <Link to={`/digit-ui/employee/commonpt/search?redirectToUrl=${""}`}>
        <LinkButton label={t("WS_ADD_ROAD_TYPE")} style={{ color: "#f47738", display: "inline-block" }} />
      </Link>
    </React.Fragment>
  );
};

export default WSRoadCuttingDetails;
