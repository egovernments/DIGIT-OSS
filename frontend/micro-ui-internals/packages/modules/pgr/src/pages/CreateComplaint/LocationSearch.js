import React from "react";
import { Card, CardHeader, CardText, LocationSearch, SubmitBar, LinkButton } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../constants/Localization";
import { PgrRoutes, getRoute } from "../../constants/Routes";

const CreateComplaint = (props) => {
  let { t } = useTranslation();
  return (
    <Card>
      <CardHeader>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_PIN_LOCATION`)}</CardHeader>
      <CardText>
        {/* Click and hold to drop the pin to complaint location. If you are not
        able to pin the location you can skip the continue for next step. */}
        {t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_PIN_LOCATION_TEXT`)}
      </CardText>

      <LocationSearch />

      <Link to={getRoute(props.match, PgrRoutes.Pincode)}>
        <SubmitBar label={t(`${LOCALIZATION_KEY.PT_COMMONS}_NEXT`)} />
        {props.skip ? <LinkButton label={t(`${LOCALIZATION_KEY.CORE_COMMON}_SKIP_CONTINUE`)} /> : null}
      </Link>
    </Card>
  );
};

export default CreateComplaint;
