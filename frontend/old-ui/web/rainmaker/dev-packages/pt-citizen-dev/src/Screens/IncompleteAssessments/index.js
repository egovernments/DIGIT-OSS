import React, { Component } from "react";
import AssessmentList from "../common/AssessmentList";
import { Screen } from "modules/common";
import { connect } from "react-redux";
import { BreadCrumbs } from "components";
import { addBreadCrumbs } from "egov-ui-kit/redux/app/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { getDateFromEpoch } from "egov-ui-kit/utils/commons";
import orderby from "lodash/orderBy";
import get from "lodash/get";
import { getFinalAssessments } from "../common/TransformedAssessments";
import { getCommaSeperatedAddress } from "egov-ui-kit/utils/commons";
import "./index.css";

const secondaryTextLabelStyle = {
  letterSpacing: 0.5
};

const primaryTextLabelStyle = {
  letterSpacing: 0.6
};

const secondaryTextContainer = {
  marginTop: 5
};

const innerDivStyle = {
  padding: "0px",
  borderBottom: "1px solid #e0e0e0"
};
class IncompleteAssessments extends Component {
  iconStyle = {
    marginLeft: "10px",
    height: "20px"
  };

  componentDidMount = () => {
    const { addBreadCrumbs, title, userInfo, fetchProperties } = this.props;
    title && addBreadCrumbs({ title: title, path: window.location.pathname });
    fetchProperties(
      [{ key: "accountId", value: userInfo.uuid }],
      [
        { key: "userId", value: userInfo.uuid },
        { key: "isActive", value: true },
        { key: "limit", value: 100 }
      ],
      [
        { key: "userUuid", value: userInfo.uuid },
        { key: "txnStatus", value: "FAILURE" },
        { key: "limit", value: 100 }
      ]
    );
  };

  onListItemClick = item => {
    const { route } = item;

    this.props.history.push(route);
  };

  render() {
    const { urls, history, loading, sortedProperties } = this.props;
    return (
      <Screen loading={loading} className="screen-with-bredcrumb">
        <BreadCrumbs url={urls} history={history} />
        {sortedProperties && (
          <AssessmentList
            onItemClick={this.onListItemClick}
            history={history}
            items={sortedProperties}
            innerDivStyle={innerDivStyle}
            noAssessmentMessage="PT_NO_ASSESSMENT_MESSAGE2"
            button={false}
          />
        )}
      </Screen>
    );
  }
}
const getTransformedItems = (propertiesById, cities) => {
  return (
    propertiesById &&
    Object.values(propertiesById).reduce((acc, curr) => {
      const propertyDetail =
        curr.propertyDetails &&
        curr.propertyDetails.map(item => {
          return {
            primaryText: (
              <div className="incomplete-assesment-info">
                <Label
                  label={item.financialYear}
                  fontSize="16px"
                  color="#484848"
                  labelStyle={primaryTextLabelStyle}
                  bold={true}
                />
                <div style={{ height: "auto" }}>
                  <Label
                    label={getCommaSeperatedAddress(curr.address, cities)}
                    labelStyle={secondaryTextLabelStyle}
                    fontSize="14px"
                    containerStyle={secondaryTextContainer}
                    color="#484848"
                  />
                  <Label
                    label={`Assessment No.: ${get(item, "assessmentNumber")}`}
                    labelStyle={secondaryTextLabelStyle}
                    fontSize="13px"
                    containerStyle={secondaryTextContainer}
                    color="#767676"
                  />
                </div>
              </div>
            ),
            // secondaryText: (
            //   <div style={{ height: "auto" }}>
            //     <Label
            //       label={getCommaSeperatedAddress(curr.address, cities)}
            //       labelStyle={secondaryTextLabelStyle}
            //       fontSize="14px"
            //       containerStyle={secondaryTextContainer}
            //       color="#484848"
            //     />
            //     <Label
            //       label={`Assessment No.: ${get(item, "assessmentNumber")}`}
            //       labelStyle={secondaryTextLabelStyle}
            //       fontSize="13px"
            //       containerStyle={secondaryTextContainer}
            //       color="#767676"
            //     />
            //   </div>
            // )
            epocDate: get(item, "auditDetails.lastModifiedTime"),
            route: `/property-tax/assessment-form?FY=${
              item.financialYear
            }&assessmentId=${
              item.assessmentNumber
            }&purpose=reassess&propertyId=${curr.propertyId}&tenantId=${
              item.tenantId
            }`,
            date: item.auditDetails
              ? getDateFromEpoch(get(item, "auditDetails.lastModifiedTime"))
              : "",
            status: "Payment failed"
          };
        });
      acc = [...acc, ...propertyDetail];
      return acc;
    }, [])
  );
};

const getAddressFromProperty = (address, mohallaById) => {
  return (
    mohallaById && {
      doorNo: get(address, "doorNo"),
      buildingName: get(address, "buildingName"),
      street: get(address, "street"),
      pincode: get(address, "pincode"),
      locality: {
        name: mohallaById
          ? mohallaById[get(address, "locality.code")]
            ? mohallaById[get(address, "locality.code")].name
            : ""
          : ""
      },
      city: get(address, "city")
    }
  );
};

const mapStateToProps = state => {
  const { properties, common } = state;
  const { urls } = state.app;
  const { cities } = common;
  const { loading, draftsById, propertiesById, failedPayments, mohallaById } =
    properties || {};

  let transformedDrafts = Object.values(draftsById).reduce((result, draft) => {
    const { prepareFormData, assessmentNumber } = draft.draftRecord || {};
    if (
      !assessmentNumber &&
      get(prepareFormData, "Properties[0].propertyDetails[0].financialYear")
    ) {
      const address = getAddressFromProperty(
        get(prepareFormData, "Properties[0].address"),
        mohallaById
      );
      const financialYear = get(
        prepareFormData,
        "Properties[0].propertyDetails[0].financialYear"
      );
      result.push({
        primaryText: (
          <div className="incomplete-assesment-info">
            <Label
              label={financialYear}
              fontSize="16px"
              color="#484848"
              labelStyle={primaryTextLabelStyle}
              bold={true}
            />
            <div style={{ height: "auto" }}>
              <Label
                label={getCommaSeperatedAddress(address, cities)}
                labelStyle={secondaryTextLabelStyle}
                fontSize="14px"
                containerStyle={secondaryTextContainer}
                color="#484848"
              />
            </div>
          </div>
        ),
        // secondaryText: (
        //   <div style={{ height: "auto" }}>
        //     <Label
        //       label={getCommaSeperatedAddress(address, cities)}
        //       labelStyle={secondaryTextLabelStyle}
        //       fontSize="14px"
        //       containerStyle={secondaryTextContainer}
        //       color="#484848"
        //     />
        //   </div>
        // )
        epocDate: get(draft, "auditDetails.lastModifiedTime"),
        route: `/property-tax/assessment-form?FY=${financialYear}&assessmentId=${
          draft.id
        }&tenantId=${draft.tenantId}`,
        financialYear: financialYear,
        assessmentNo: draft.id,
        date: draft.auditDetails
          ? getDateFromEpoch(get(draft, "auditDetails.lastModifiedTime"))
          : "",
        status: "Saved Draft"
      });
    }
    return result;
  }, []);
  const mergedData =
    failedPayments &&
    propertiesById &&
    getFinalAssessments(failedPayments, propertiesById);
  let finalFailedTransactions =
    mergedData && getTransformedItems(mergedData, cities);
  const incompleteAssessments = transformedDrafts
    ? finalFailedTransactions
      ? [...transformedDrafts, ...finalFailedTransactions]
      : [...transformedDrafts]
    : [];

  const sortedProperties =
    incompleteAssessments &&
    orderby(incompleteAssessments, ["epocDate"], ["desc"]);

  return { urls, loading, sortedProperties };
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
)(IncompleteAssessments);
