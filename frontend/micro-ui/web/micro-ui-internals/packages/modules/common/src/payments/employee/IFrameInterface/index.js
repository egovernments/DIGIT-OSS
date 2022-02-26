import { Header, Loader, RemoveableTag } from "@egovernments/digit-ui-react-components";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const IFrameInterface = (props) => {
  console.log(props, "props");
  const { stateCode } = props;
  const { moduleName, pageName } = useParams();

  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const { data, isLoading } = Digit.Hooks.dss.useMDMS(stateCode, "common-masters", ["uiCommonConstants"], {
    select: (data) => {
      console.log(data, "data");
      let formattedResponse = data?.["common-masters"]?.["uiCommonConstants"]?.[0] || {};
      return formattedResponse;
    },
    enabled: true,
  });

  useEffect(() => {
    const pageObject = data?.[moduleName]?.["iframe-routes"]?.[pageName] || {};
    const isOrign = pageObject?.["isOrigin"] || false;
    const domain = isOrign ? (process.env.NODE_ENV === "development" ? "https://qa.digit.org" : document.location.origin) : pageObject?.["domain"];
    const contextPath = pageObject?.["routePath"] || "";
    const title = pageObject?.["title"] || "";
    let url = `${domain}${contextPath}`;
    setUrl(url);
    setTitle(title);
  }, [data, moduleName, pageName]);

  if (isLoading) {
    return <Loader />;
  }
  console.log(data, moduleName, pageName, "nationalInfo");

  if (!url) {
    return <div>No Iframe To Load</div>;
  }
  return (
    <React.Fragment>
      <Header>{t(title)}</Header>
      <div className="app-container-iframe">
        <iframe src={url} className="app-container-iframe" title={title} />
      </div>
    </React.Fragment>
  );
};

export default IFrameInterface;

/*
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
      <div>
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
        </div>
    );
  }
}
[
  {
    moduleName: "common-masters",
    masterDetails: [
      {
        name: "uiCommonConstants",
      },
    ],
  },
]
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
*/
