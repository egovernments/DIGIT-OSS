import React from "react";
import RenderScreen from "egov-ui-framework/ui-molecules/RenderScreen";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import CustomTab from "../../ui-molecules-local/CustomTab";
import { connect } from "react-redux";
import { addComponentJsonpath } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import cloneDeep from "lodash/cloneDeep";
import { resetFields } from "../../ui-config/screens/specs/pt-mutation/mutation-methods";

class MultiItem extends React.Component {
  state = { tabIndex: 0 };

  setInstrumentType = (value, dispatch) => {
    dispatch(prepareFinalObject("currentTab", value));
    if (value === "PT_SEARCH_PROPERTY") {
      dispatch(handleField("propertySearch", "components.div.children.searchPropertyTable", "visible", false));
      dispatch(handleField("propertySearch", "components.div.children.searchApplicationTable", "visible", false));
      } 
      else {
      dispatch(handleField("propertySearch", "components.div.children.searchApplicationTable", "visible", false));
      dispatch(handleField("propertySearch", "components.div.children.searchPropertyTable", "visible", false));
      }
      dispatch(prepareFinalObject("searchScreen.mobileNumber", ""));
      dispatch(prepareFinalObject("searchScreen.ids", ""));
      resetFields(value, dispatch)
  };

  onTabChange = (tabIndex, dispatch, state) => {
    switch (tabIndex) {
      case 0:
        this.setInstrumentType("PT_SEARCH_PROPERTY", dispatch);
        break;
      case 1:
        this.setInstrumentType("PT_SEARCH_APPLICATION", dispatch);
        break;
      default:
        this.setInstrumentType("PT_SEARCH_PROPERTY", dispatch);
        break;
    }
  };

  onTabClick = tabIndex => {
    const { state, dispatch } = this.props;
    this.onTabChange(tabIndex, dispatch, state);
    this.setState({ tabIndex });
  };

  render() {
    const {
      uiFramework,
      onFieldChange,
      onComponentClick,
      screenKey,
      componentJsonpath
    } = this.props;

    const { onTabClick } = this;

    const transFormedProps = {
      ...this.props,
      tabs: this.props.tabs.map((tab, key) => {
        return {
          ...tab,
          tabContent: (
            <RenderScreen
              key={key}
              screenKey={screenKey}
              components={cloneDeep(
                addComponentJsonpath(
                  tab.tabContent,
                  `${componentJsonpath}.props.tabs[${key}].tabContent`
                )
              )}
              uiFramework={uiFramework}
              onFieldChange={onFieldChange}
              onComponentClick={onComponentClick}
            />
          )
        };
      })
    };
    return <CustomTab handleClick={onTabClick} {...transFormedProps} />;
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { screenConfig, preparedFinalObject } = screenConfiguration;
  return { screenConfig, preparedFinalObject, state };
};

export default connect(mapStateToProps)(MultiItem);