import React, { Fragment } from "react";
import { CardLabel, LabelFieldPair, LocationSearch } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SelectGeolocation = ({ onSelect, config, formData }) => {
  const { t } = useTranslation();
  const onChange = (pincode, position) => {
    onSelect(config?.key, position)
  }
  return (
    <Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`EVENTS_GEOLOCATION_LABEL`)}`}</CardLabel>
        <div className="field">
          <LocationSearch position={{ latitude: formData?.geoLocation?.latitude, longitude: formData?.geoLocation?.longitude }} onChange={onChange} />
        </div>
      </LabelFieldPair>
    </Fragment>
  )
}

export default SelectGeolocation; 