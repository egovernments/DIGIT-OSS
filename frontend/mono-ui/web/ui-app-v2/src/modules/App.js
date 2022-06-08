import React, { Component } from "react";
import classnames from "classnames";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Toast, Drawer, Image } from "components";
import { addBodyClass } from "utils/commons";
import { fetchCurrentLocation, fetchLocalizationLabel, toggleSnackbarAndSetText, setRoute } from "redux/app/actions";
import { fetchMDMSData } from "redux/common/actions";
import Router from "./Router";
import commonConfig from "config/common";
import logoMseva from "assets/images/logo-white.png";
import routes from "./Routes";
import ActionMenu from "./employee/ActionMenu";

//it should remove once role action mapping start works
const actionList = [
  {
    id: 1535,
    name: "PropertyType",
    url: "url",
    displayName: "Property Type",
    orderNumber: 1,
    parentModule: "propertytax",
    enabled: true,
    serviceCode: "PT",
    code: "null",
    path: "Property Tax.PT Masters.PropertyType",
    navigationURL: "mdms/PropertyTax/PropertyType",
  },
  {
    id: 1536,
    name: "PropertySubType",
    url: "url",
    displayName: "Property Subtype",
    orderNumber: 2,
    parentModule: "propertytax",
    enabled: true,
    serviceCode: "PT",
    code: "null",
    path: "Property Tax.PT Masters.PropertySubType",
    navigationURL: "mdms/PropertyTax/PropertySubType",
  },
  {
    id: 1537,
    name: "ConstructionType",
    url: "url",
    displayName: "Construction Type",
    orderNumber: 3,
    parentModule: "propertytax",
    enabled: true,
    serviceCode: "PT",
    code: "null",
    path: "Property Tax.PT Masters.ConstructionType",
    navigationURL: "mdms/PropertyTax/ConstructionType",
  },
  {
    id: 1538,
    name: "ConstructionSubType",
    url: "url",
    displayName: "Construction Subtype",
    orderNumber: 4,
    parentModule: "propertytax",
    enabled: true,
    serviceCode: "PT",
    code: "null",
    path: "Property Tax.PT Masters.ConstructionSubType",
    navigationURL: "mdms/PropertyTax/ConstructionSubType",
  },
  {
    id: 1539,
    name: "OccupancyType",
    url: "url",
    displayName: "Occupancy Type",
    orderNumber: 5,
    parentModule: "propertytax",
    enabled: true,
    serviceCode: "PT",
    code: "null",
    path: "Property Tax.PT Masters.OccupancyType",
    navigationURL: "mdms/PropertyTax/OccupancyType",
  },
  {
    id: 1540,
    name: "OwnerShipCategory",
    url: "url",
    displayName: "Ownership Category",
    orderNumber: 6,
    parentModule: "propertytax",
    enabled: true,
    serviceCode: "PT",
    code: "null",
    path: "Property Tax.PT Masters.OwnerShipCategory",
    navigationURL: "mdms/PropertyTax/OwnerShipCategory",
  },
  {
    id: 1541,
    name: "SubOwnerShipCategory",
    url: "url",
    displayName: "Subownerhip Category",
    orderNumber: 7,
    parentModule: "propertytax",
    enabled: true,
    serviceCode: "PT",
    code: "null",
    path: "Property Tax.PT Masters.SubOwnerShipCategory",
    navigationURL: "mdms/PropertyTax/SubOwnerShipCategory",
  },
  {
    id: 1542,
    name: "UsageCategoryDetail",
    url: "url",
    displayName: "Usage Category Detail",
    orderNumber: 8,
    parentModule: "propertytax",
    enabled: true,
    serviceCode: "PT",
    code: "null",
    path: "Property Tax.PT Masters.UsageCategoryDetail",
    navigationURL: "mdms/PropertyTax/UsageCategoryDetail",
  },
  {
    id: 1543,
    name: "UsageCategoryMajor",
    url: "url",
    displayName: "Usage Category Major",
    orderNumber: 9,
    parentModule: "propertytax",
    enabled: true,
    serviceCode: "PT",
    code: "null",
    path: "Property Tax.PT Masters.UsageCategoryMajor",
    navigationURL: "mdms/PropertyTax/UsageCategoryMajor",
  },
  {
    id: 1544,
    name: "UsageCategoryMinor",
    url: "url",
    displayName: "Usage Category Minor",
    orderNumber: 10,
    parentModule: "propertytax",
    enabled: true,
    serviceCode: "PT",
    code: "null",
    path: "Property Tax.PT Masters.UsageCategoryMinor",
    navigationURL: "mdms/PropertyTax/UsageCategoryMinor",
  },
  {
    id: 1545,
    name: "UsageCategorySubMinor",
    url: "url",
    displayName: "Usage Category Subminor",
    orderNumber: 11,
    parentModule: "propertytax",
    enabled: true,
    serviceCode: "PT",
    code: "null",
    path: "Property Tax.PT Masters.UsageCategorySubMinor",
    navigationURL: "mdms/PropertyTax/UsageCategorySubMinor",
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    const { pathname: currentPath } = props.location;

    props.history.listen((location, action) => {
      const { pathname: nextPath } = location;
      addBodyClass(nextPath);
      props.toggleSnackbarAndSetText(false, "");
    });

    addBodyClass(currentPath);
  }

  componentDidMount() {
    const { fetchLocalizationLabel, fetchCurrentLocation, fetchMDMSData } = this.props;
    let requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "Department",
              },
              {
                name: "Designation",
              },
            ],
          },
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "tenants",
              },
            ],
          },
        ],
      },
    };
    // can be combined into one mdms call
    fetchLocalizationLabel(localStorage.getItem("locale") || "en_IN");
    // current location
    fetchCurrentLocation();
    fetchMDMSData(requestBody);
  }

  componentWillReceiveProps(nextProps) {
    const { route: nextRoute } = nextProps;
    const { route: currentRoute, history, setRoute } = this.props;
    if (nextRoute && currentRoute !== nextRoute) {
      history.push(nextRoute);
      setRoute("");
    }
  }

  render() {
    const { toast } = this.props;
    return (
      <div className={classnames("app-content", { expanded: true || false })}>
        <div>
          <Drawer width={230} containerClassName="drawer-backGround" open={true}>
            <div className="drawerHeader text-center">
              <Image className="mseva-logo" source={logoMseva} />
            </div>
            <div className="drawerContent">{actionList && actionList.length > 0 && <ActionMenu actionList={actionList} />}</div>
          </Drawer>
        </div>
        <Router routes={routes} />
        {toast && toast.open && toast.message.length && <Toast open={toast.open} message={toast.message} error={toast.error} />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { route, toast } = state.app;
  const props = {};
  if (route && route.length) {
    props.route = route;
  }
  if (toast && toast.open && toast.message && toast.message.length) {
    props.toast = toast;
  }
  return props;
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocalizationLabel: (locale) => dispatch(fetchLocalizationLabel(locale)),
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchMDMSData: (criteria) => dispatch(fetchMDMSData(criteria)),
    fetchCurrentLocation: () => dispatch(fetchCurrentLocation()),
    setRoute: (route) => dispatch(setRoute(route)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
