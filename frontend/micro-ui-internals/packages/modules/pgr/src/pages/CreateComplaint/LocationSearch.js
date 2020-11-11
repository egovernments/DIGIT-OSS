import React from "react";
import { Card, CardHeader, CardText, LocationSearch, SubmitBar, LinkButton } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateComplaint = (props) => {
  let { t } = useTranslation();
  return (
    <Card>
      <CardHeader>{t("CS_ADDCOMPLAINT_PIN_LOCATION")}</CardHeader>
      <CardText>
        {/* Click and hold to drop the pin to complaint location. If you are not
        able to pin the location you can skip the continue for next step. */}
        {t("CS_ADDCOMPLAINT_PIN_LOCATION_TEXT")}
      </CardText>

      <LocationSearch />

      <Link to="/create-complaint/pincode">
        <SubmitBar label={t("PT_COMMONS_NEXT")} />
        {props.skip ? <LinkButton label={t("CORE_COMMON_SKIP_CONTINUE")} /> : null}
      </Link>
    </Card>
  );
};

export default CreateComplaint;
