import React, { Component } from "react";
import { List, Icon, Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";

import ModuleLandingPage from "./components/ModuleLandingPage";
import Screen from "egov-ui-kit/common/common/Screen";
import { connect } from "react-redux";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { addBreadCrumbs } from "egov-ui-kit/redux/app/actions";
import { getFinalAssessments } from "./components/TransformedAssessments";

import get from "lodash/get";
import "./index.css";

const iconStyle = {
  width: "45px",
  height: "45px",
  color: "#fe7a51"
};

const listIconStyle = {
  margin: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  height: "inherit"
};

const labelContainerStyle = {
  marginTop: "25px"
};

const innerDivStyle = {
  padding: "20px 56px 20px 0px",
  borderBottom: "1px solid #e0e0e0"
};

const labelStyle = {
  letterSpacing: 0.6,
  color: "rgba(0, 0, 0, 0.8700000047683716)",
  fontSize: 14,
  bold: true
};

class PTHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogueOpen: false
    };
  }

  iconStyle = {
    color: "#fe7a51",
    height: 30,
    width: 30,
    overflow: "visible"
  };
  getCardItems = () => {

    return [
      {
        label: "PT_COLLECT_PAYMENT",
        icon: (
          <Icon style={iconStyle} action="custom" name="home-city-outline" />
        ),
        route: "/property-tax/search-property"
      }
    ];
  };

  getlistItems = () => {
    const { numDrafts } = this.props;
    return [
      {
        primaryText: <Label label="PT_HOW_IT_WORKS" labelStyle={labelStyle} />,
        route: "/property-tax/how-it-works",
        rightIcon: (
          <div style={listIconStyle}>
            <Icon action="hardware" name="keyboard-arrow-right" />
          </div>
        )
      },
      {
        primaryText: <Label label="PT_EXAMPLE" labelStyle={labelStyle} />,
        route: "/property-tax/pt-examples",
        rightIcon: (
          <div style={listIconStyle}>
            <Icon action="hardware" name="keyboard-arrow-right" />
          </div>
        )
      }
    ];
  };

  componentDidMount = () => {
    const {
      addBreadCrumbs,
      title,
      location,
      fetchProperties,
      userInfo
    } = this.props;
    const { pathname } = location;
    let url = pathname && pathname.split("/").pop();
    (title || url) &&
      url === "property-tax" &&
      addBreadCrumbs({ title: "", path: "" });
    fetchProperties(
      [{ key: "accountId", value: userInfo.uuid }],
      [
        { key: "userId", value: userInfo.uuid },
        { key: "isActive", value: true },
        { key: "limit", value: 100 }
      ],
      [
        { key: "userUuid", value: userInfo.uuid },
        { key: "txnStatus", value: "FAILURE" }
      ]
    );
  };

  handleItemClick = (item, index) => {
    const { route } = item;
    this.props.history.push(route);
  };

  render() {
    let { getlistItems, handleItemClick, getCardItems } = this;
    const { loading, history } = this.props;
    return (
      <Screen loading={loading} className="pt-home-screen">
        <ModuleLandingPage items={getCardItems()} history={history} />

        <div style={{ padding: "0px 8px" }}>
          <Card
            className="property-tax-card"
            textChildren={
              <List
                innerDivStyle={innerDivStyle}
                onItemClick={handleItemClick}
                listItemStyle={{
                  padding: "0px 20px",
                  borderWidth: "10px 10px 0px"
                }}
                nestedListStyle={{ padding: "0px", background: "#f2f2f2" }}
                autoGenerateNestedIndicator={false}
                primaryTogglesNestedList={true}
                items={getlistItems()}
              />
            }
          />
        </div>
      </Screen>
    );
  }
}

const getTransformedItems = propertiesById => {
  return (
    propertiesById &&
    Object.values(propertiesById).reduce((acc, curr) => {
      const propertyDetail =
        curr.propertyDetails &&
        curr.propertyDetails.map(item => {
          return {
            consumerCode: `${curr.propertyId}:${item.assessmentNumber}`
          };
        });
      acc = [...acc, ...propertyDetail];
      return acc;
    }, [])
  );
};

const mapStateToProps = state => {
  const { properties } = state;
  const { propertiesById, draftsById, loading, failedPayments } =
    properties || {};
  const numProperties = propertiesById && Object.keys(propertiesById).length;
  const mergedData =
    failedPayments &&
    propertiesById &&
    getFinalAssessments(failedPayments, propertiesById);
  let finalFailedTransactions = mergedData && getTransformedItems(mergedData);
  const numFailedPayments = finalFailedTransactions
    ? Object.keys(finalFailedTransactions).length
    : 0;
  const transformedDrafts = Object.values(draftsById).reduce(
    (result, draft) => {
      const { prepareFormData, assessmentNumber } = draft.draftRecord || {};
      if (
        !assessmentNumber &&
        get(prepareFormData, "Properties[0].propertyDetails[0].financialYear")
      ) {
        result.push(draft);
      }
      return result;
    },
    []
  );
  const numDrafts = transformedDrafts.length + numFailedPayments;
  return { numProperties, numDrafts, loading };
};

const mapDispatchToProps = dispatch => {
  return {
    addBreadCrumbs: url => dispatch(addBreadCrumbs(url)),
    fetchProperties: (
      queryObjectProperty,
      queryObjectDraft,
      queryObjectFailedPayments
    ) =>
      dispatch(
        fetchProperties(
          queryObjectProperty,
          queryObjectDraft,
          queryObjectFailedPayments
        )
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PTHome);
