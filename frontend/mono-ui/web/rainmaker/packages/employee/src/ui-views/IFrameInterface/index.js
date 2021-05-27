import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import themeObject from "../../ui-config/themes";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";
import get from "lodash/get";
import { connect } from "react-redux";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { fetchUiCommonConstants } from "egov-ui-kit/redux/app/actions";
const theme = createMuiTheme(themeObject);
class IFrameInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = { num: 0 };
  }
  componentDidMount() {
    this.buildURL(this.props);
  }

  buildURL = (props) => {
    const { match } = props;
    const { params } = match;
    const { moduleName, pageName } = params;
    let { uiCommonConstants, fetchUiCommonConstants } = props;
    if (!uiCommonConstants) fetchUiCommonConstants();
    const isOrign = get(uiCommonConstants, `${moduleName}.iframe-routes.${pageName}.isOrigin`, false);
    const domain = isOrign
      ? process.env.NODE_ENV === "development"
        ? "https://qa.digit.org"
        : document.location.origin
      : get(uiCommonConstants, `${moduleName}.iframe-routes.${pageName}.domain`, "");

    const contextPath = get(uiCommonConstants, `${moduleName}.iframe-routes.${pageName}.routePath`, "");
    const title = get(uiCommonConstants, `${moduleName}.iframe-routes.${pageName}.title`, "");
    let url = `${domain}${contextPath}`;
    if (this.props.common && this.props.common.cities) {
      let tenantid = getTenantId();
      let tenant_info = this.props.common.cities.filter((key) => key.code === tenantid)[0];
      let tenant_name = tenant_info.name;
      url = url.replace(/__tenantid__/g, tenantid).replace(/__tenantname__/g, tenant_name);
      this.setState({ url, title });
    }
  };

  componentWillReceiveProps(nextProps) {
    this.buildURL(nextProps);
  }

  render() {
    const { url, title } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        {title && (
          <div className="row">
            <div className="col-sm-12" style={{ margin: "24px" }}>
              <Label className="screen-title-label" label={title} dark={true} bold={true} fontSize={20} />
            </div>
          </div>
        )}
        <div className="app-container-iframe">
          <iframe src={url} className="app-container-iframe" />
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUiCommonConstants: () => dispatch(fetchUiCommonConstants()),
  };
};

const mapStateToProps = (state) => {
  const { app, common } = state;
  const { uiCommonConstants } = app;
  return { uiCommonConstants, common };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IFrameInterface);
