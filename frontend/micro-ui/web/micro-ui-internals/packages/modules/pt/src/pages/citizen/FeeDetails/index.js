import { BackButton, Card, CardLabelDesc, CardText, Header, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";

const PTFeeDetails = ({ }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { acknowledgementIds, tenantId } = useParams();
  const [bill, setBill] = React.useState();

  React.useEffect(() => {
    if (acknowledgementIds && tenantId) {
      Digit.PaymentService.searchBill(tenantId, { service: "PT.MUTATION", consumerCode: acknowledgementIds })
        .then(res => setBill(res?.Bill?.[0]));
    }
  }, [acknowledgementIds, tenantId]);

  const cardStyle = { marginBottom: "16px" };

  return (<React.Fragment>
    <Header>{t("PT_FEE_DETAILS_HEADER")}</Header>
    <Card style={cardStyle}>
      <div className="payment-amount-info" >
        <h5 style={{ fontWeight: "bold" }}>{t("PT_APPLICATION_NO")}</h5>
        <p> {acknowledgementIds}</p>
      </div>
    </Card>
    {bill?.billDetails?.[0]?.billAccountDetails?.length &&
      (<Card style={{ ...cardStyle, lineHeight: "2rem" }}>
        {bill?.billDetails?.[0]?.billAccountDetails?.map((accountDetails) => (
          <div className="payment-amount-info">
            <h5 style={{ fontWeight: "bold" }}>{t(accountDetails?.taxHeadCode)}</h5>
            <p>₹ {accountDetails?.amount}</p>
          </div>
        ))}
        <div className="payment-amount-info">
          <h4 style={{ fontWeight: "bold" }}>{t("PT_TOTAL_AMOUNT_DUE")}</h4>
          <p style={{ fontWeight: "bold", fontSize: "18px" }}>₹ {bill?.billDetails?.[0]?.amount}</p>
        </div>
      </Card>)}
    {bill?.billDetails?.[0]?.amount &&
      (<Card style={cardStyle}>
        <SubmitBar
          label={t("PT_PROCEED_TO_PAY")}
          onSubmit={() => {
            history.push(`/digit-ui/citizen/payment/collect/PT.MUTATION/${acknowledgementIds}`)
          }}
          disabled={!(bill?.billDetails?.[0]?.amount)}
        > </SubmitBar>
      </Card>)}
  </React.Fragment>);
}

export default PTFeeDetails;