import React from "react";
import formHoc from "egov-ui-kit/hocs/form";
import GenericForm from "egov-ui-kit/common/GenericForm";
import Field from "egov-ui-kit/utils/field";
import { RadioButton, Card, Icon, ToolTipUi } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";
import "./index.css";

const options = [
  { value: "Male", label: <Label label="PT_FORM3_MALE" /> },
  { value: "Female", label: <Label label="PT_FORM3_FEMALE" /> },
  { value: "TRANSGENDER", label: <Label label="PT_FORM3_TRANSGENDER" /> },
];

// const guardianOptions = [{ value: "Husband", label: <Label label="Husband" /> }, { value: "Father ", label: <Label label="Father" /> }];

const styles = {
  labelStyle: {
    font: "12px",
    letterSpacing: 0.6,
    marginBottom: 5,
    marginTop: 14,
  },

  radioButtonItemStyle: {
    marginBottom: "18px",
    paddingLeft: "2px",
    height: "16px",
  },
  selectedLabelStyle: {
    color: "#00bbd3",
  },
  radioButtonLabelStyle: {
    lineHeight: 1,
    marginBottom: 8,
  },
  iconStyle: {
    width: 16,
    height: 27,
  },
};

const OwnerInformation = ({
  form,
  formKey,
  handleFieldChange,
  cardTitle,
  deleteBtn,
  handleChange,
  handleGuardianChange,
  handleRemoveOwner,
  formId,
  disabled,
  checkBox,
}) => {
  const fields = form.fields || {};
  const genderSelected = get(fields, "ownerGender.value", "Male");
  return (
    <Card
      textChildren={
        <div className="pt-owner-info">
          <div>
            <div>{cardTitle}</div>
            {!disabled && deleteBtn && (
              <div
                className="pt-ownerinfo-deletebtn"
                onClick={() => {
                  handleRemoveOwner(formId, formKey);
                }}
              >
                <Icon action="content" name="clear" />
              </div>
            )}
          </div>
          <div className={`${formKey} col-sm-12`}>
            <div className="col-sm-6">
              <Field fieldKey="ownerName" field={fields["ownerName"]} handleFieldChange={handleFieldChange} disabled={disabled} />
            </div>
            <div className="col-sm-6">
              <Label label={"PT_FORM3_GENDER"} required fontSize={12} labelStyle={styles.labelStyle} bold={true} />
              <RadioButton
                id="gender-selection"
                name="gender-selection"
                options={options}
                handleChange={(e) => {
                  handleFieldChange("ownerGender", e.target.value);
                }}
                radioButtonItemStyle={styles.radioButtonItemStyle}
                labelStyle={styles.radioButtonLabelStyle}
                selectedLabelStyle={styles.selectedLabelStyle}
                className="owner-gender-selection"
                iconStyle={styles.iconStyle}
                valueSelected={genderSelected}
                disabled={disabled}
                radioButtonItemStyle={styles.childrenStyle}
              />
            </div>
            <div className="col-sm-6">
              <Field fieldKey="ownerMobile" field={fields["ownerMobile"]} handleFieldChange={handleFieldChange} disabled={disabled} />
            </div>
            <div className="col-sm-6">
              <Field fieldKey="ownerAlterMobile" field={fields["ownerAlterMobile"]} handleFieldChange={handleFieldChange} disabled={disabled} />
            </div>
            <div style={{ padding: 0 }} className="col-sm-6">
              <div className="col-sm-6">
                <Field fieldKey="ownerGuardian" field={fields["ownerGuardian"]} handleFieldChange={handleFieldChange} disabled={disabled} />
              </div>
              <div className="col-sm-6 owner-relationship">
                <Field fieldKey="ownerRelationship" field={fields["ownerRelationship"]} handleFieldChange={handleFieldChange} disabled={disabled} />
              </div>
            </div>
            <div className="col-sm-6">
              <Field
                fieldKey="ownerCategory"
                field={fields["ownerCategory"]}
                handleFieldChange={handleFieldChange}
                disabled={disabled}
                className="ownerCategory"
              />
            </div>
            <div className="col-sm-6 ownerCategoryIdType" style={{ display: "flex", alignItems: "center" }}>
              <Field
                fieldKey="ownerCategoryIdType"
                field={fields["ownerCategoryIdType"]}
                handleFieldChange={handleFieldChange}
                disabled={disabled}
                className="ownerCategoryIdType"
              />
              {fields["ownerCategoryIdType"] && fields["ownerCategoryIdType"].toolTip && !fields["ownerCategoryIdType"].hideField && (
                <ToolTipUi id={"form-wizard-tooltip"} title={fields["ownerCategoryIdType"].toolTipMessage} />
              )}
            </div>
            <div className="col-sm-6" style={{ display: "flex", alignItems: "center" }}>
              <Field fieldKey="ownerCategoryId" field={fields["ownerCategoryId"]} handleFieldChange={handleFieldChange} disabled={disabled} />
              {fields["ownerCategoryId"] && fields["ownerCategoryId"].toolTip && !fields["ownerCategoryId"].hideField && (
                <ToolTipUi id={"form-wizard-tooltip"} title={fields["ownerCategoryId"].toolTipMessage} />
              )}
            </div>
            <div className="col-sm-6" style={{ paddingBottom: "4px", paddingTop: "2px" }}>
              <Field fieldKey="ownerEmail" field={fields["ownerEmail"]} handleFieldChange={handleFieldChange} disabled={disabled} />
            </div>
            <div className="col-sm-6" style={{ paddingBottom: "8px" }}>
              <Field fieldKey="ownerAddress" field={fields["ownerAddress"]} handleFieldChange={handleFieldChange} disabled={disabled} />
              {!checkBox && (
              <div>
                <Field
                  fieldKey="isSameAsPropertyAddress"
                  field={fields.isSameAsPropertyAddress}
                  handleFieldChange={handleFieldChange}
                  disabled={disabled}
                  containerClassName="property-corr"
                />
              </div>
            )}
            </div>
          
          </div>
        </div>
      }
    />
  );
};

const InstitutionAuthority = ({ form, formKey, handleFieldChange, cardTitle, formId, disabled }) => {
  const fields = form.fields || {};
  return (
    <Card
      textChildren={
        <div className="pt-institute-authority-info">
          <div className="pt-authority-title">
            <span>
              <Icon action="social" name="person" />
            </span>
            <span>{cardTitle}</span>
          </div>
          <div className="authority-details-form">
            <div className="name-address">
              <Field fieldKey="name" field={fields["name"]} handleFieldChange={handleFieldChange} disabled={disabled} />
              <Field fieldKey="mobile" field={fields["mobile"]} handleFieldChange={handleFieldChange} disabled={disabled} />
              <Field fieldKey="telephone" field={fields["telephone"]} handleFieldChange={handleFieldChange} disabled={disabled} />
              <Field fieldKey="address" field={fields["address"]} handleFieldChange={handleFieldChange} disabled={disabled} />
              <Field
                fieldKey="isSameAsPropertyAddress"
                field={fields.isSameAsPropertyAddress}
                handleFieldChange={handleFieldChange}
                disabled={disabled}
                containerClassName="property-corr"
              />
                </div>
            <div className="address">
              <Field fieldKey="designation" field={fields["designation"]} handleFieldChange={handleFieldChange} disabled={disabled} />
              <Field fieldKey="alterMobile" field={fields["alterMobile"]} handleFieldChange={handleFieldChange} disabled={disabled} />
              <Field fieldKey="email" field={fields["email"]} handleFieldChange={handleFieldChange} disabled={disabled} />
            </div>
          </div>
        </div>
      }
    />
  );
};

const UsageInformationHOC = formHoc({ formKey: "basicInformation", path: "PropertyTaxPay", isCoreConfiguration: true })(GenericForm);
const PropertyAddressHOC = formHoc({ formKey: "propertyAddress", path: "PropertyTaxPay" })(GenericForm);
//const PlotInformationHOC = formHoc({ formKey: "plotInformation", path: "PropertyTaxPay",isCoreConfiguration:true})(GenericForm);
const OwnershipTypeHOC = formHoc({ formKey: "ownershipType", path: "PropertyTaxPay", isCoreConfiguration: true })(GenericForm);
const OwnerInfoHOC = formHoc({ formKey: "ownerInfo", path: "PropertyTaxPay", isCoreConfiguration: true })(OwnerInformation);
const ExemptionCategoryHOC = formHoc({ formKey: "exemptionCategory", path: "PropertyTaxPay", isCoreConfiguration: true })(GenericForm);
const InstitutionHOC = formHoc({ formKey: "institutionDetails", path: "PropertyTaxPay/OwnerInformation/Institution", isCoreConfiguration: true })(
  GenericForm
);
const DynamicFormHoc = (formKey, Form) => {
  return formHoc({ formKey })(Form);
};
const InstitutionAuthorityHOC = formHoc({
  formKey: "institutionAuthority",
  path: "PropertyTaxPay/OwnerInformation/Institution",
  isCoreConfiguration: true,
})(InstitutionAuthority);

export {
  UsageInformationHOC,
  PropertyAddressHOC,
  OwnershipTypeHOC,
  OwnerInfoHOC,
  ExemptionCategoryHOC,
  DynamicFormHoc,
  OwnerInformation,
  InstitutionHOC,
  InstitutionAuthorityHOC,
};
