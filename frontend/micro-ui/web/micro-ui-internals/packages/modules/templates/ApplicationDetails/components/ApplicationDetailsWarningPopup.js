import { Card, ButtonSelector, CardText, CardSubHeader, Modal, CardSectionHeader, Row } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const Close = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );
  
const CloseBtn = (props) => {
    return (
      <div className="icon-bg-secondary" onClick={props.onClick}>
        <Close />
      </div>
    );
  };

function ApplicationDetailsWarningPopup({ action,workflowDetails,businessService,isWarningPop,closeWarningPopup  }) {
const { t } = useTranslation();
const isMobile = window.Digit.Utils.browser.isMobile();
return (
    <React.Fragment>
    <Modal
      headerBarMain={<h1 className="heading-m">{t("PT_DUES_ARE_PENDING")}</h1>}
      headerBarEnd={
        <CloseBtn
          onClick={() => {
            closeWarningPopup();
          }}
        />
      }
      hideSubmit={true}
      isDisabled={false}
      popupStyles={isMobile ? {} : { width: "29%", marginTop: "auto" }}
    >
   <Card>
        <div style={{marginBottom:"30px"}}>
          <h1>{t("PT_YOU_HAVE")} ₹{action?.AmountDueForPay} {t("PT_DUE_WARNING_MSG2")}</h1>
        </div>
       <Row rowContainerStyle={{display:"flex"}} labelStyle={{fontSize:"24px",fontWeight:"700",marginRight:"10%"}} textStyle={{fontSize:"24px",fontWeight:"700",marginBottom:"20px"}} label={`${t("PT_AMOUNT_DUE")}`} text={`₹${t(action?.AmountDueForPay)}`} />
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <ButtonSelector theme="border" label={t('ES_PT_COMMON_CANCEL')} onSubmit={closeWarningPopup} style={{ marginLeft: "10px" }} />
          <ButtonSelector label={t('PT_COLLECT')} onSubmit={() => window.location.assign(`${window.location.origin}${action?.redirectionUrl?.pathname}`)} style={{ marginLeft: "10px" }} />
        </div>
      </Card>
   </Modal>
  )
    </React.Fragment>
)
}

export default ApplicationDetailsWarningPopup;