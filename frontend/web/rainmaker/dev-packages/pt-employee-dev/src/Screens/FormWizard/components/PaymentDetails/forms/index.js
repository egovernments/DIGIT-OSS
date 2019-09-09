import React from "react";
import Field from "egov-ui-kit/utils/field";
import { DatePicker, Icon } from "components";
import "./index.css";

const changeDateToFormat = (date) => {
  const dateObj = new Date(date);
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let dt = dateObj.getDate();
  dt = dt < 10 ? "0" + dt : dt;
  month = month < 10 ? "0" + month : month;
  return dt + "-" + month + "-" + year;
};

const CashInformation = ({ form, formKey, handleFieldChange }) => {
  const fields = form.fields || {};
  return (
    <div className="clearfix">
      <div className="col-sm-12 general-form-cont-padding">
        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="paidBy" field={fields.paidBy} handleFieldChange={handleFieldChange} />
        </div>
        <div className="col-sm-6 general-field-padding">
          <div style={{ height: 64, marginBottom: 14 }} />
        </div>
        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="payerName" field={fields.payerName} handleFieldChange={handleFieldChange} />
        </div>
        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="payerMobile" field={fields.payerMobile} handleFieldChange={handleFieldChange} />
        </div>
      </div>
    </div>
  );
};

const ChequeInformation = ({ form, formKey, handleFieldChange, onIconClick }) => {
  const fields = form.fields || {};
  return (
    <div className="clearfix">
      <div className="col-sm-12 general-form-cont-padding">
        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="chequeNo" field={fields.chequeNo} handleFieldChange={handleFieldChange} />
        </div>
        <div className="col-sm-6 general-field-padding">
          <DatePicker
            onChange={(first, object) => {
              let e = { target: { value: object } };
              handleFieldChange("chequeDate", e.target.value);
            }}
            formatDate={(date) => changeDateToFormat(date)}
            textFieldStyle={{ cursor: "pointer" }}
            {...fields.chequeDate}
          />
          <div className="datepicker-icon" onClick={(e) => e.preventDefault}>
            <Icon action="action" name="date-range" />
          </div>
        </div>
        <div className="col-sm-6 general-field-padding ifsc-field">
          <Field fieldKey="ifscCode" field={fields.ifscCode} onTextFieldIconClick={onIconClick} handleFieldChange={handleFieldChange} />
        </div>
        <div className="col-sm-6" style={{ height: 72, marginTop: 14 }} />
        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="BankName" field={fields.BankName} handleFieldChange={handleFieldChange} />
        </div>

        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="BankBranch" field={fields.BankBranch} handleFieldChange={handleFieldChange} />
        </div>
      </div>
    </div>
  );
};

const ReceiptInformation = ({ form, formKey, handleFieldChange }) => {
  const fields = form.fields || {};
  return (
    <div className="clearfix" style={{ paddingLeft: 10 }}>
      <div className="col-sm-12 general-form-cont-padding">
        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="receiptNo" field={fields.receiptNo} handleFieldChange={handleFieldChange} />
        </div>
        <div className="col-sm-6 general-field-padding">
          <DatePicker
            onChange={(first, object) => {
              let e = { target: { value: object } };
              handleFieldChange("receiptDate", e.target.value);
            }}
            formatDate={(date) => changeDateToFormat(date)}
            textFieldStyle={{ cursor: "pointer" }}
            {...fields.receiptDate}
          />
          <div className="datepicker-icon" onClick={(e) => e.preventDefault}>
            <Icon action="action" name="date-range" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DemandDraftInformation = ({ form, formKey, handleFieldChange, onIconClick }) => {
  const fields = form.fields || {};
  return (
    <div className="clearfix">
      <div className="col-sm-12 general-form-cont-padding">
        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="demandNo" field={fields.demandNo} handleFieldChange={handleFieldChange} />
        </div>
        <div className="col-sm-6 general-field-padding">
          <DatePicker
            onChange={(first, object) => {
              let e = { target: { value: object } };
              handleFieldChange("demandDate", e.target.value);
            }}
            formatDate={(date) => changeDateToFormat(date)}
            textFieldStyle={{ cursor: "pointer" }}
            {...fields.demandDate}
          />
          <div className="datepicker-icon" onClick={(e) => e.preventDefault}>
            <Icon action="action" name="date-range" />
          </div>
        </div>
        <div className="col-sm-6 general-field-padding ifsc-field">
          <Field fieldKey="ifscCode" field={fields.ifscCode} onTextFieldIconClick={onIconClick} handleFieldChange={handleFieldChange} />
        </div>
        <div className="col-sm-6" style={{ height: 72, marginTop: 14 }} />
        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="BankName" field={fields.BankName} handleFieldChange={handleFieldChange} />
        </div>
        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="BankBranch" field={fields.BankBranch} handleFieldChange={handleFieldChange} />
        </div>
      </div>
    </div>
  );
};

const CardInformation = ({ form, formKey, handleFieldChange }) => {
  const fields = form.fields || {};
  return (
    <div className="clearfix">
      <div className="col-sm-12 general-form-cont-padding">
        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="cardDigits" field={fields.cardDigits} handleFieldChange={handleFieldChange} />
        </div>
        <div className="col-sm-6 general-field-padding">
          <div style={{ height: 64, marginBottom: 14 }} />
        </div>
        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="receiptNo" field={fields.receiptNo} handleFieldChange={handleFieldChange} />
        </div>
        <div className="col-sm-6 general-field-padding">
          <Field fieldKey="confirmReceiptNo" field={fields.confirmReceiptNo} handleFieldChange={handleFieldChange} />
        </div>
      </div>
    </div>
  );
};

const PaymentModeInformation = ({ form, formKey, handleFieldChange }) => {
  const fields = form.fields || {};
  return (
    <div className="payment-mode-info">
      <Field fieldKey="mode" field={fields.mode} handleFieldChange={handleFieldChange} />
    </div>
  );
};

export { CashInformation, ChequeInformation, DemandDraftInformation, ReceiptInformation, CardInformation, PaymentModeInformation };
