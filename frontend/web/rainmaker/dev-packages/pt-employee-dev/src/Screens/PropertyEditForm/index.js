import React, { Component } from "react";
import { Screen } from "modules/common";
import { Icon } from "components";
import formHoc from "egov-ui-kit/hocs/form";
import GenericForm from "egov-ui-kit/common/GenericForm";
import { OwnerInformation } from "../FormWizard/components/Forms";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { ActionFooter } from "modules/common";
import Label from "egov-ui-kit/utils/translationNode";
import { getLatestPropertyDetails } from "egov-ui-kit/utils/PTCommon";
import { connect } from "react-redux";

import "./index.css";

const buttons = {
  button1: "GO BACK",
  button2: "SAVE",
};

const OwnerInfoHOC = formHoc({ formKey: "ownerInfo", path: "PropertyTaxPay" })(OwnerInformation);

const PropertyAddressHOC = formHoc({ formKey: "propertyInformation", path: "PropertyTaxPay" })(GenericForm);

class PropertyInformation extends Component {
  componentDidMount() {
    const { fetchProperties } = this.props;
    fetchProperties([{ key: "propertyIds", value: this.props.match.params.propertyId }, { key: "tenantId", value: this.props.match.params.tenantId }]);
  }
  render() {
    return (
      <Screen>
        <div className="form-without-button-cont-generic">
          <PropertyAddressHOC
            cardTitle={
              <div className="rainmaker-displayInline" style={{ marginLeft: 12, marginBottom: 10 }}>
                <Icon action="action" name="home" />
                <Label label="Property Address" containerStyle={{ marginLeft: 5 }} />
              </div>
            }
          />
          <OwnerInfoHOC
            checkBox={true}
            cardTitle={
              <div className="rainmaker-displayInline" style={{ marginLeft: 25, marginBottom: 10 }}>
                <Icon action="social" name="person" />
                <Label label="Owner Information" containerStyle={{ marginLeft: 5 }} />
              </div>
            }
          />
          <ActionFooter label1={buttons.button1} label2={buttons.button2} />
        </div>
      </Screen>
    );
  }
}

const mapStateToProps = ({ properties }, compProps) => {
  const { propertiesById } = properties;
  let currentProperty = [];
  if (propertiesById.hasOwnProperty(compProps.match.params.propertyId)) {
    currentProperty[0] = propertiesById[compProps.match.params.propertyId];
    currentProperty[0].propertyDetails = getLatestPropertyDetails(currentProperty[0].propertyDetails);
  }
  return {
    currentProperty,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProperties: (queryObjectProperty) => dispatch(fetchProperties(queryObjectProperty)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyInformation);
