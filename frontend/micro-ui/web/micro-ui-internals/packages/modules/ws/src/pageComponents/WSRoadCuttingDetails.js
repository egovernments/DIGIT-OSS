import { CardLabel, Dropdown, LabelFieldPair, LinkButton, TextInput } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";

const WSRoadCuttingDetails = ({ t, config, onSelect, userType, formData }) => {
  const [roadCuttingDetails, setRoadCuttingDetails] = React.useState({
    roadType: {
      value: { code: "", value: "", i18nKey: "" },
      error: { }
    },
    area: {
      value: "",
      error: { }
    },
  });

  const setRoadType = (value) => {
    const error = {  }

    if(!Object.keys(value).length || !value?.value?.length){
      error["type"] = "";
      error["message"] = "WS_FIELD_CANT_BLANK";
    }

    setRoadCuttingDetails({...roadCuttingDetails, roadType: {value, error}})
  }  
  
  const setRoadArea = (value) => {
    const error = { }

    if(!new RegExp(/^[0-9]{1,5}/i)){
      error["type"] = "regex";
      error["message"] = "WS_FIELD_MUST_NUMERIC";
    }

    setRoadCuttingDetails({...roadCuttingDetails, area: {value, error}})
  }

  React.useEffect(() => {
    onSelect(config.key, {...roadCuttingDetails})
  }, [roadCuttingDetails]);

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_ROAD_TYPE`)}:`}</CardLabel>
        <div className="field">
          <Dropdown
            key={config.key}
            t={t}
            selected={roadCuttingDetails.roadType.value}
            select={(value) => setRoadType(value)}
          ></Dropdown>
        </div>
      </LabelFieldPair>
      { roadCuttingDetails.roadType.error.type && (
        <CardLabelError> {t(roadCuttingDetails.roadType.error.message)} </CardLabelError> 
      )}

      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`WS_AREA_SQ_FT`)}:`}</CardLabel>
        <div className="field">
          <TextInput
            key={config.key}
            value={roadCuttingDetails.area.value}
            onChange={(ev) => setRoadArea(ev.target.value)}
          ></TextInput>
        </div>
      </LabelFieldPair>
      { roadCuttingDetails.area.error.type && (
        <CardLabelError> {t(roadCuttingDetails.area.error.message)} </CardLabelError> 
      )}

      <Link to={`/digit-ui/employee/commonpt/search?redirectToUrl=${""}`}>
        <LinkButton label={t("WS_ADD_ROAD_TYPE")} style={{ color: "#f47738", display: "inline-block" }} />
      </Link>
    </React.Fragment>
  );
};

export default WSRoadCuttingDetails;
