import React from "react";
import Div from "../../ui-atoms/HtmlElements/Div";
import RenderScreen from "../../ui-molecules/RenderScreen";
import Container from "../../ui-atoms/Layout/Container";
import Item from "../../ui-atoms/Layout/Item";
import Button from "../../ui-atoms/Button";
import IconButton from "@material-ui/core/IconButton";
import Icon from "../../ui-atoms/Icon";
import { connect } from "react-redux";
import get from "lodash/get";
import set from "lodash/set";
import cloneDeep from "lodash/cloneDeep";
import { addComponentJsonpath } from "../../ui-utils/commons";
import { prepareFinalObject as pFO } from "../../ui-redux/screen-configuration/actions";
import isEqual from "lodash/isEqual";
import LabelConatiner from "../LabelContainer";

const checkActiveItems = items => {
  let count = 0;
  for (var i = 0; i < items.length; i++) {
    if (checkActiveItem(items[i])) count++;
  }
  return count;
};

const checkActiveItem = item => {
  return item && (item.isDeleted === undefined || item.isDeleted !== false);
};

class MultiItem extends React.Component {
  componentDidMount = () => {
    this.initMultiItem(this.props);
  };

  initMultiItem = props => {
    const { items, sourceJsonPath, preparedFinalObject } = props;
    const editItems = get(preparedFinalObject, sourceJsonPath, []);
    if (editItems) {
      if (!items.length && !editItems.length) {
        this.addItem();
      } else {
        if (items.length < editItems.length) {
          for (var i = 0; i < editItems.length; i++) {
            if (checkActiveItem(editItems[i])) {
              if (i) {
                this.addItem();
              } else {
                this.addItem(true);
              }
              // this.addItem(true);
            }
          }
        }
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      this.initMultiItem(nextProps);
    }else if(!isEqual(get(nextProps,`preparedFinalObject.${nextProps.sourceJsonPath}`,[]), get(this.props,`preparedFinalObject.${this.props.sourceJsonPath}`,[]))) {
      this.initMultiItem(nextProps);
    }else if(get(nextProps,`preparedFinalObject.${nextProps.sourceJsonPath}`,[]) && get(this.props,`items`,[]) && get(nextProps,`preparedFinalObject.${nextProps.sourceJsonPath}`,[]).length!==get(this.props,`items`,[]).length) {
      this.initMultiItem(nextProps);
    }
  }

  objectToDropdown = object => {
    let dropDown = [];
    for (var variable in object) {
      if (object.hasOwnProperty(variable)) {
        dropDown.push({ code: variable });
      }
    }
    return dropDown;
  };

  addItem = (isNew = false) => {
    const {
      onFieldChange: addItemToState,
      screenKey,
      scheama,
      sourceJsonPath,
      prefixSourceJsonPath,
      afterPrefixJsonPath,
      componentJsonpath,
      headerName,
      headerJsonPath,
      screenConfig,
      preparedFinalObject,
      onMultiItemAdd
    } = this.props;
    const items = isNew
      ? []
      : get(screenConfig, `${screenKey}.${componentJsonpath}.props.items`, []);
    const itemsLength = items.length;
    set(scheama, headerJsonPath, `${headerName} - ${itemsLength + 1}`);
    if (sourceJsonPath) {
      let multiItemContent = get(scheama, prefixSourceJsonPath, {});
      for (var variable in multiItemContent) {
        if(multiItemContent.hasOwnProperty(variable) && multiItemContent[variable].componentPath == "DynamicMdmsContainer" ){
          multiItemContent[variable].index = itemsLength;
        } else if (
          multiItemContent.hasOwnProperty(variable) &&
          multiItemContent[variable].props &&
          multiItemContent[variable].props.jsonPath
        ) {
          let prefixJP = multiItemContent[variable].props.jsonPathUpdatePrefix
            ? multiItemContent[variable].props.jsonPathUpdatePrefix
            : sourceJsonPath;
          let splitedJsonPath = multiItemContent[variable].props.jsonPath.split(
            prefixJP
          );
          if (splitedJsonPath.length > 1) {
            let propertyName = splitedJsonPath[1].split("]");
            if (propertyName.length > 1) {
              multiItemContent[
                variable
              ].jsonPath = `${prefixJP}[${itemsLength}]${propertyName[1]}`;
              multiItemContent[
                variable
              ].props.jsonPath = `${prefixJP}[${itemsLength}]${
                propertyName[1]
              }`;
              multiItemContent[variable].index = itemsLength;
            }
          }
        } else if (
          afterPrefixJsonPath &&
          multiItemContent.hasOwnProperty(variable) &&
          get(multiItemContent[variable], `${afterPrefixJsonPath}.props`) &&
          get(
            multiItemContent[variable],
            `${afterPrefixJsonPath}.props.jsonPath`
          )
        ) {
          let splitedJsonPath = get(
            multiItemContent[variable],
            `${afterPrefixJsonPath}.props.jsonPath`
          ).split(sourceJsonPath);
          if (splitedJsonPath.length > 1) {
            let propertyName = splitedJsonPath[1].split("]");
            if (propertyName.length > 1) {
              set(
                multiItemContent[variable],
                `${afterPrefixJsonPath}.props.jsonPath`,
                `${sourceJsonPath}[${itemsLength}]${propertyName[1]}`
              );
            }
          }
        }
      }
      if (onMultiItemAdd) {
        multiItemContent = onMultiItemAdd(this.props.state, multiItemContent);
      }
      set(scheama, prefixSourceJsonPath, multiItemContent);
    }
    items[itemsLength] = cloneDeep(
      addComponentJsonpath(
        { [`item${itemsLength}`]: scheama },
        `${componentJsonpath}.props.items[${itemsLength}]`
      )
    );
    addItemToState(screenKey, componentJsonpath, `props.items`, items);
  };

  removeItem = index => {
    const {
      onFieldChange: removeItem,
      screenKey,
      componentJsonpath,
      screenConfig,
      updatePreparedFormObject,
      sourceJsonPath
    } = this.props;
    const items = get(
      screenConfig,
      `${screenKey}.${componentJsonpath}.props.items`
    );
    updatePreparedFormObject(`${sourceJsonPath}[${index}].isDeleted`, false);
    items[index].isDeleted = false;
    // items.splice(index,1);
    removeItem(screenKey, componentJsonpath, `props.items`, items);
  };

  // Check if the key exists in the object and then return false
  // which disables the delete functionality of the card by not
  // showing the delete icon
  checkDisableDelete = (
    disableDeleteIfKeyExists,
    preparedFinalObject,
    sourceJsonPath,
    key
  ) => {
    if (
      disableDeleteIfKeyExists &&
      get(
        preparedFinalObject,
        `${sourceJsonPath}[${key}].${disableDeleteIfKeyExists}`
      )
    ) {
      return false;
    }
    return true;
  };

  render() {
    const {
      items,
      scheama,
      addItemLabel,
      id,
      uiFramework,
      onFieldChange,
      onComponentClick,
      hasAddItem,
      screenKey,
      isReviewPage,
      disableDeleteIfKeyExists,
      preparedFinalObject,
      sourceJsonPath
    } = this.props;
    const { addItem, removeItem, checkDisableDelete } = this;
    const { labelName, labelKey } = addItemLabel || "";
    return (
      <Div>
        {items.length > 0 &&
          items.map((item, key) => {
            if (checkActiveItem(item)) {
              return (
                <Div key={key}>
                  {checkActiveItems(items) > 1 &&
                    !isReviewPage &&
                    checkDisableDelete(
                      disableDeleteIfKeyExists,
                      preparedFinalObject,
                      sourceJsonPath,
                      key
                    ) && (
                      <Container>
                        <Item xs={12} align="right">
                          <IconButton
                            style={{
                              marginBottom: "-105px",
                              width: "40px",
                              height: "40px"
                            }}
                            onClick={e => removeItem(key)}
                            aria-label="Remove"
                          >
                            <Icon iconName="clear" />
                          </IconButton>
                        </Item>
                      </Container>
                    )}
                  <RenderScreen
                    screenKey={screenKey}
                    components={item}
                    uiFramework={uiFramework}
                    onFieldChange={onFieldChange}
                    onComponentClick={onComponentClick}
                  />
                </Div>
              );
            }
          })}
        {hasAddItem !== false && (
          <Container style={{ marginTop: "8px" }}>
            <Item xs={12} align="right">
              <Button onClick={e => addItem()} color="primary" className="sss">
                <Icon iconName="add" />
                <LabelConatiner labelName={labelName} labelKey={labelKey} />
              </Button>
            </Item>
          </Container>
        )}
      </Div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { screenConfig, preparedFinalObject } = screenConfiguration;
  return { screenConfig, preparedFinalObject, state };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePreparedFormObject: (jsonPath, value) =>
      dispatch(pFO(jsonPath, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultiItem);
