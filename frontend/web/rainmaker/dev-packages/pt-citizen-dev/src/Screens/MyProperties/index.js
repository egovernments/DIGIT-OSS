import React, { Component } from "react";
import AssessmentList from "../common/AssessmentList";
import { Screen, SingleProperty } from "modules/common";
import Hidden from "@material-ui/core/Hidden";
import Label from "egov-ui-kit/utils/translationNode";
import { connect } from "react-redux";
import { BreadCrumbs, Icon } from "components";
import { addBreadCrumbs } from "egov-ui-kit/redux/app/actions";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { getCommaSeperatedAddress } from "egov-ui-kit/utils/commons";
import orderby from "lodash/orderBy";
import get from "lodash/get";

const innerDivStyle = {
  paddingTop: "16px",
  paddingLeft: 0,
  borderBottom: "1px solid #e0e0e0"
};

const IconStyle = {
  margin: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  height: "inherit"
};

class MyProperties extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogueOpen: false,
      items: [
        {
          primaryText: (
            <Label
              label="EB-154, Maya Enclave, Jail Road, Harinagar"
              fontSize="16px"
              color="#484848"
              bold={true}
            />
          ),
          route: "/my-properties/property",
          secondaryText: "Property ID: PQL-98-876"
        },
        {
          primaryText: (
            <Label
              label="P-9/2, Balwinder Colony, Palwal Road, Indirapuram"
              fontSize="16px"
              color="#484848"
              bold={true}
            />
          ),
          route: "/my-properties/property",
          secondaryText: "Property ID: JML-34-756"
        }
      ]
    };
  }

  closeYearRangeDialogue = () => {
    this.setState({ dialogueOpen: false });
  };

  componentDidMount = () => {
    const {
      addBreadCrumbs,
      title,
      fetchProperties,
      userInfo,
      renderCustomTitle,
      numProperties
    } = this.props;
    fetchProperties([ ]); //Unnecessary API call to prevent page break on reload
    renderCustomTitle(numProperties);
    title && addBreadCrumbs({ title: title, path: window.location.pathname });
  };

  onNewPropertyButtonClick = () => {
    const { history } = this.props;
    history.push('/property-tax/assessment-form');
    // this.setState({
    //   dialogueOpen: true
    // });
  };

  onListItemClick = item => {
    const { route: propertyId, tenantId } = item;
    this.props.history.push(
      `/property-tax/my-properties/property/${encodeURIComponent(
        propertyId
      )}/${tenantId}?isMutationApplication=true`
    );
  };

  render() {
    const {
      urls,
      history,
      transformedPropertiesWeb,
      transformedPropertiesMobile,
      loading
    } = this.props;

    return (
      <Screen loading={loading} className="screen-with-bredcrumb">
        <BreadCrumbs url={urls} history={history} />
        <Hidden xsDown>
          <AssessmentList
            // pageTitle={`My Properties (${numProperties})`}
            onItemClick={this.onListItemClick}
            innerDivStyle={innerDivStyle}
            items={transformedPropertiesWeb}
            history={this.props.history}
            noAssessmentMessage="PT_NO_ASSESSMENT_MESSAGE3"
            button={true}
            yearDialogue={this.state.dialogueOpen}
            closeDialogue={this.closeYearRangeDialogue}
            onNewPropertyButtonClick={this.onNewPropertyButtonClick}
          />
        </Hidden>
        <Hidden smUp>
          <SingleProperty
            data={transformedPropertiesMobile}
            action="PT_VIEW_DETAILS"
            history={history}
            // onActionClick={this.onListItemClick}
          />
        </Hidden>
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { properties, common } = state;
  const { urls } = state.app;
  const { cities } = common;
  const { loading, propertiesById } = properties || {};
  const numProperties = propertiesById && Object.keys(propertiesById).length;
  const transformedPropertiesMobile = Object.values(propertiesById).map(
    (property, index) => {
      return {
        address: getCommaSeperatedAddress(property.address, cities),
        propertyId: property.propertyId,
        route: property.propertyId,
        tenantId: property.tenantId,
        oldPropertyId: property.oldPropertyId,
        name: get(property, "propertyDetails[0].owners[0].name")
      };
    }
  );
  const transformedPropertiesWeb = Object.values(propertiesById).map(
    (property, index) => {
      return {
        primaryText: (
          <Label
            label={getCommaSeperatedAddress(property.address, cities)}
            fontSize="16px"
            color="#484848"
            bold={true}
            labelStyle={{ letterSpacing: 0.6 }}
          />
        ),
        secondaryText: (
          <div className="rainmaker-displayInline" style={{height: "25px !important", marginTop: "0px !important"}}>
            <Label
              label="PT_PROPERTY_ASSESSMENT_ID"
              color="#484848"
              dark={true}
              labelStyle={{ letterSpacing: 0.5 }}
            />
            <Label
              label={property.propertyId}
              dark={true}
              color="#484848"
              labelStyle={{ letterSpacing: 0.5, marginLeft: 5 }}
            />
          </div>
        ),
        rightIcon: (
          <div style={IconStyle}>
            <Icon
              action="hardware"
              name="keyboard-arrow-right"
              color="#767676"
            />
          </div>
        ),
        route: property.propertyId,
        tenantId: property.tenantId,
        modifiedTime: property.auditDetails.lastModifiedTime
      };
    }
  );

  const sortedProperties = orderby(
    transformedPropertiesWeb,
    ["modifiedTime"],
    ["desc"]
  );

  return {
    urls,
    transformedPropertiesWeb: sortedProperties,
    transformedPropertiesMobile: orderby(
      transformedPropertiesMobile,
      ["modifiedTime"],
      ["desc"]
    ),
    loading,
    numProperties
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addBreadCrumbs: url => dispatch(addBreadCrumbs(url)),
    fetchProperties: queryObjectProperty =>
      dispatch(fetchProperties(queryObjectProperty))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyProperties);
