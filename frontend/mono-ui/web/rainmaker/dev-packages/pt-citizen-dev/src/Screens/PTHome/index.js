import React, { Component } from "react";
import { List, Icon, Card } from "components";
import store from "ui-redux/store";
import Label from "egov-ui-kit/utils/translationNode";
import { Link } from "react-router-dom";
import { Screen, ModuleLandingPage } from "modules/common";
import { connect } from "react-redux";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { addBreadCrumbs } from "egov-ui-kit/redux/app/actions";
import { getFinalAssessments } from "../common/TransformedAssessments";
import MyPropertyIcon from "@material-ui/icons/Home";
import PropertyIcon from "@material-ui/icons/CreditCard";
import { fetchData } from "egov-pt/ui-config/screens/specs/pt-mutation/searchResource/citizenSearchFunctions";
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
    const { numProperties, numDrafts, myApplicationsCount } = this.props;
    return [
      {
        label: "PT_PAYMENT_PAY_PROPERTY_TAX",
        icon: (
          <Icon style={iconStyle} action="custom" name="home-city-outline" />
        ),
        route: "/pt-mutation/propertySearch"
      },
      {
        label: "PT_MY_PROPERTY_SCREEN_HEADER",
        icon: <Icon style={iconStyle} action="custom" name="home-account" />,
        dynamicArray: [numProperties],
        route: "/property-tax/my-properties"
      },{
        label: "PT_MUTATION_MY_APPLICATIONS",
        icon: <Icon style={iconStyle} action="custom" name="home-account" />,
        dynamicArray: [myApplicationsCount],
        route: "/pt-mutation/my-applications"
      }
    ];
  };

  getlistItems = () => {
    const { numDrafts } = this.props;
    return [
      /*
      Assessment IS REMOVED FROM PT2.0
      {
        primaryText: (
          <Label label="PT_COMPLETED_ASSESSMENTS" labelStyle={labelStyle} />
        ),
        route: "/property-tax/completed-assessments",
        // leftIcon: (
        //   <div style={listIconStyle}>
        //     <Icon action="action" name="done" />
        //   </div>
        // ),
        rightIcon: (
          <div style={listIconStyle}>
            <Icon action="hardware" name="keyboard-arrow-right" />
          </div>
        )
      }, */
   /*  
   DRAFTS IS REMOVED FROM PT2.2
   
   {
        primaryText: (
          <Label
            label="PT_INCOMPLETE_ASSESSMENT"
            dynamicArray={[numDrafts]}
            labelStyle={labelStyle}
          />
        ),
        route: "/property-tax/incomplete-assessments",
        rightIcon: (
          <div style={listIconStyle}>
            <Icon action="hardware" name="keyboard-arrow-right" />
          </div>
        )
      }, */
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
      []
    );
    fetchData(null, null, store.dispatch);
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
        {/* <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                <Icon
                  style={{ marginLeft: "18px" }}
                  action="action"
                  name="credit-card"
                  color="#767676"
                />
                <Label
                  label="PT_PAY_PROPERTY_TAX"
                  containerStyle={{ marginLeft: 25, marginTop: 3 }}
                  labelStyle={labelStyle}
                  color="#484848"
                  fontSize="16px"
                  bold={true}
                />
              </div>
              <div className="row pt-service-list">
                <Link to="/property-tax/assess-pay">
                  <div className="col-sm-4 text-center pt-new-property">
                    <Icon
                      style={iconStyle}
                      action="communication"
                      name="business"
                    />
                    <Label
                      label="PT_PAYMENT_ASSESS_AND_PAY"
                      fontSize="20px"
                      color="#484848"
                      bold={true}
                      className="pt-home-servicess"
                    />
                  </div>
                </Link>
                <Link to="/property-tax/incomplete-assessments">
                  <div className="col-sm-4 text-center pt-search-property">
                    <Icon style={iconStyle} action="image" name="edit" />
                    <div className="pt-home-rainmaker-displayInline pt-home-servicess">
                      <Label
                        label="PT_INCOMPLETE_ASSESSMENT"
                        secondaryText={` (${numDrafts})`}
                        fontSize="20px"
                        color="#484848"
                        bold={true}
                      />
                    </div>
                  </div>
                </Link>
                <Link to="/property-tax/my-properties">
                  <div className="col-sm-4 text-center pt-my-properties">
                    <Icon
                      style={iconStyle}
                      action="custom"
                      name="property-tax"
                    />
                    <div className="pt-home-rainmaker-displayInline pt-home-servicess">
                      <Label
                        label="PT_MY_PROPERTY"
                        secondaryText={` (${numProperties})`}
                        fontSize="20px"
                        color="#484848"
                      />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          }
        /> */}
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
  const { properties, screenConfiguration} = state;
  const {preparedFinalObject} = screenConfiguration;
  const {myApplicationsCount=0} = preparedFinalObject;
  const { propertiesById,  loading } =
    properties || {};
  const numProperties = propertiesById && Object.keys(propertiesById).length;
  return { numProperties,  loading, myApplicationsCount };
};

const mapDispatchToProps = dispatch => {
  return {
    addBreadCrumbs: url => dispatch(addBreadCrumbs(url)),
    fetchProperties: (
      queryObjectProperty,
    
    ) =>
      dispatch(
        fetchProperties(
          queryObjectProperty,
        
        )
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PTHome);
