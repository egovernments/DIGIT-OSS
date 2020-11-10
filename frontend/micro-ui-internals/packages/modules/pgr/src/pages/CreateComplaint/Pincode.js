import React, { useState } from "react";
import { Card, CardHeader, CardSubHeader, CardText, CardLabel, Textinput, SubmitBar, LinkLabel } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Pincode = (props) => {
  const [pincode, setPincode] = useState(null);

  const { t } = useTranslation();

  function textInput(e) {
    setPincode(e.target.value);
  }
  return (
    <Card>
      <CardSubHeader>{t("CS_ADDCOMPLAINT_COMPLAINT_LOCATION")}</CardSubHeader>
      <CardHeader>{t("CS_ADDCOMPLAINT_PINCODE")}</CardHeader>
      <CardText>
        {/* If you know the pincode of the complaint address, provide below. It will
        help us identify complaint location easily or you can skip and continue */}
        {t("CS_ADDCOMPLAINT_CHANGE_PINCODE_TEXT")}
      </CardText>
      <CardLabel>{t("CORE_COMMON_PINCODE")}</CardLabel>
      <Textinput onChange={textInput} />
      <Link
        to="/create-complaint/address"
        onClick={() => {
          props.save(pincode);
        }}
      >
        <SubmitBar label={t("PT_COMMONS_NEXT")} />
      </Link>
      {props.skip ? (
        <Link to="/create-complaint/address">
          <div className="skipButton">
            <LinkLabel>{t("CORE_COMMON_SKIP_CONTINUE")}</LinkLabel>
          </div>
        </Link>
      ) : null}
    </Card>
  );
};

export default Pincode;
