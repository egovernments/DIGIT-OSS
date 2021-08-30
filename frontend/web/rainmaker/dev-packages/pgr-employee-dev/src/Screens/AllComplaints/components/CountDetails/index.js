import React from "react";
import Label from "egov-ui-kit/utils/translationNode";
import { statusToLocalisationKeyMapping } from "egov-ui-kit/utils/commons";
import "./index.css";

const styles = {
  box: {}
};

const CountDetails = ({ count, total, status }) => {
  return (
    <div className="box">
      <div className="count-details">
        <Label
          label="ES_COMPLAINTS_COUNT_RATIO_LABEL"
          dynamicArray={[count, total, statusToLocalisationKeyMapping[status]]}
        />
        {/* Showing {count} of {total} {status} complaints */}
      </div>
    </div>
  );
};

export default CountDetails;
