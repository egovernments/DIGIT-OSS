import React from "react";
import { Card, TextFieldIcon } from "components";
import { Link } from "react-router-dom";
import DownArrow from "material-ui/svg-icons/navigation/arrow-drop-down";
import "./index.css";

const ComplaintTypeField = ({ categories, localizationLabels, complaintType = {} }) => {
  const complainTypeMessage =
    (complaintType && complaintType.value && (localizationLabels["SERVICEDEFS." + (complaintType.value || "").toUpperCase()] || {}).message) || "";

  return (
    <div className="complaint-type-main-cont">
      <Card
        className="complaint-type-card common-padding-for-new-complaint-card"
        textChildren={
          <Link to="/citizen/complaint-type">
            <TextFieldIcon
              {...{ ...complaintType, value: complainTypeMessage }}
              iconPosition="after"
              fullWidth={true}
              Icon={DownArrow}
              name="complaint-type"
              isRequired={true}
              disabled={false}
            />
          </Link>
        }
      />
    </div>
  );
};

export default ComplaintTypeField;
