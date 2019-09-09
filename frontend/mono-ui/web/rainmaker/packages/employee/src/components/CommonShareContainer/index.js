import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { matchPath } from "react-router";
import get from "lodash/get";
import forEach from "lodash/forEach";
import isEmpty from "lodash/isEmpty";
import CommonShare from "egov-ui-kit/components/CommonShare";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";

class CommonShareContainer extends React.Component {
  visible = false;
  matchedURL; //URL Route matching with respect to actionComponentMapping
  currentRole = null; //current Role matched from localstorage and urlRoles
  indexMenu;
  shareCallBack = () => {
    const { actionComponentMapping, componentId, complaints } = this.props;

    const { visible, matchedURL, currentRole, indexMenu } = this;
    if (currentRole != null && indexMenu != -1 && matchedURL) {
      const metaData = actionComponentMapping[componentId][matchedURL][currentRole]["metaData"];
      let { jsonPaths } = metaData;
      let { template } = metaData;
      let { title } = metaData;
      jsonPaths.forEach((path, index) => {
        template = template.replace(`{${index}}`, get(complaints, path, ""));
      });

      navigator
        .share({
          title: title,
          text: template,
          url: "",
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    }
  };

  render() {
    const { match, location, history, menu, actionComponentMapping, componentId, complaints } = this.props;
    this.visible = false;
    this.matchedURL = null;
    this.indexMenu = menu && menu.findIndex((elem) => elem.name === componentId);
    const actionData = get(actionComponentMapping, componentId);
    let actionURLs = actionData && Object.keys(actionData);
    const isPathMatched =
      actionURLs &&
      actionURLs.findIndex((elem) =>
        matchPath(location.pathname, {
          path: elem,
          exact: true,
          strict: false,
        })
      );
    //Get User Role from localStorage
    const roleDefination = { rolePath: "user-info.roles" };
    const splitList = get(roleDefination, "rolePath").split(".");
    const localdata = JSON.parse(localStorageGet(splitList[0]));
    const localRoles = localdata && get(localdata, splitList.slice(1).join("."), localdata);

    const roleCodes =
      localRoles &&
      localRoles.map((elem) => {
        return get(elem, "code");
      });
    let urlRoles; //Roles for given url

    if (isPathMatched != undefined && isPathMatched != -1) {
      this.matchedURL = actionURLs[isPathMatched];
      urlRoles = Object.keys(get(actionData, this.matchedURL));
      for (let i = 0; i < roleCodes.length; i++) {
        if (urlRoles.includes(roleCodes[i])) {
          this.currentRole = roleCodes[i];
          break;
        }
      }
    }

    if (this.currentRole != null && this.indexMenu != -1 && this.matchedURL && !isEmpty(complaints)) {
      this.visible = true;
    }
    // console.log("visible", this.visible);
    // console.log("path", location.pathname, this.visible, this.currentRole, this.indexMenu, this.matchedURL);

    return (
      <div className="share-btn">{navigator.share && <CommonShare variant="fab" visible={this.visible} shareCallback={this.shareCallBack} />}</div>
    );
  }
}

CommonShareContainer.propTypes = {
  // classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const menu = state.app.menu || [];
  const uiCommonConfig = state.app.uiCommonConfig || {};
  const actionComponentMapping = uiCommonConfig["action-component-mapping"];
  const prepareFormData = state.common.prepareFormData || {};
  const { complaints } = prepareFormData;

  return { menu, actionComponentMapping, complaints };
};

export default withRouter(connect(mapStateToProps)(CommonShareContainer));
