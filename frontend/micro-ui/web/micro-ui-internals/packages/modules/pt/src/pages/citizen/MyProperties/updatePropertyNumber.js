import { CloseSvg, SubmitBar, Header, StatusTable, Row, TextInput, MobileNumber, CardLabel } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Link } from "react-router-dom";

const UpdatePropertyNumber = ({ showPopup, property, t }) => {
    
    const  SelectOtp = Digit?.ComponentRegistryService?.getComponent('SelectOtp');

  return (
    <div className="popup-module updatePropertyNumber">
      <div className="popup-close-icon" onClick={() => showPopup(false)}>
        <CloseSvg />
      </div>

      <Header>{t("PTUPNO_HEADER")}</Header>
      <div className="pt-update-no-popup-wrapper">
        <StatusTable >
          <Row label={t("PTUPNO_OWNER_NAME")} text={`${property?.owners?.[0]?.name || t("CS_NA")}`} />
          <Row label={t("PTUPNO_CURR_NO")} text={`${property?.owners?.[0]?.mobileNumber || t("CS_NA")}`} />
          <CardLabel style={{ marginBottom: "8px" }}>{t("PT_UPDATE_NEWNO")}</CardLabel>
          <MobileNumber className="field pt-update-no-field" onChange={(e) => console.log(e)} value={""} disable={false} />
          <SelectOtp
          userType="employee"
            config={{"header":"OTP Verification","cardText":"Enter the OTP sent to 9965664222","nextText":"Next","submitBarLabel":"Next"}}
            onOtpChange={(e) => console.log(e)}
            onResend={(e) => console.log(e)}
            onSelect={(e) => console.log(e)}
            otp={''}
            error={false}
            t={t}
          />
        </StatusTable>
        <SubmitBar label={t("PTUPNO_SENDOTP")} onClick={(e) => console.log("clicked", e)} />
      </div>
    </div>
  );
};
export default UpdatePropertyNumber;
