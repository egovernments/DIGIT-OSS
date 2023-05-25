import React from "react";
import Field from "egov-ui-kit/utils/field";
import formHoc from "egov-ui-kit/hocs/form";

const PastPaymentDetailsForm = ({ handleFieldChange, form }) => {
  const fields = form.fields || {};
  return (
    <div className="past-payment-form">
      <Field fieldKey="receipt" field={fields.receipt} handleFieldChange={handleFieldChange} className="receipt" />
      <Field fieldKey="amount" field={fields.amount} handleFieldChange={handleFieldChange} className="amount" />
      <Field fieldKey="misplacedReceipt" field={fields.misplacedReceipt} handleFieldChange={handleFieldChange} className="misplacedReceipt" />
    </div>
  );
};

const PastPaymentDetailsFormHoc = (props) => {
  const DetailsForm = formHoc({ ...props, isCoreConfiguration: true })(PastPaymentDetailsForm);
  return <DetailsForm />;
};

class PastPaymentDetails extends React.Component {
  render() {
    return <PastPaymentDetailsFormHoc path="PropertyTaxPay" {...this.props} />;
  }
}

export default PastPaymentDetails;
