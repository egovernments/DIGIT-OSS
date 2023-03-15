import { httpRequest } from "egov-ui-kit/utils/api";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import jp from "jsonpath";
import React, { Component } from "react";
import { Col } from "react-bootstrap";
import AutoComplete from "material-ui/AutoComplete";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

class UiBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boundaryData: [],
      dropDownData: [],
      dropDownDataVal: {},
      labelArr: [],
      viewLabels: [],
      localityArray: [],
      levelSearchString: {},
    };
  }

  componentDidMount() {
    this.fetchLocations(this.props.item);
  }

  initDropdownValues = (boundaryData, bdryCode) => {
    var ddArr = [];
    var jPath = "";
    var viewLabels = {};
    var pathArr = jp.paths(boundaryData, `$..[?(@.code=='${bdryCode}')]`);
    pathArr = pathArr[0];
    if (pathArr) {
      for (var i = 0; i < pathArr.length; ) {
        ddArr.push(pathArr[i] + "[" + pathArr[i + 1] + "]");
        jPath = ddArr.join(".");
        if (i > 1) {
          var code = jp.query(boundaryData, jPath + ".code");
          var label = jp.query(boundaryData, jPath + ".label");
          var name = jp.query(boundaryData, jPath + ".name");
          viewLabels[label] = name[0];

          //for update screen
          if (this.props.match.url.split("/")[1] != "view") {
            this.handler(code[0], label[0]);
          }
        }
        i += 2;
      }
    }

    this.setState({
      viewLabels: viewLabels,
    });
  };

  fetchBoundaryData = async (item) => {
    let boundaryData = sessionStorage.getItem("boundaryData");
    if (boundaryData) {
      try {
        boundaryData = JSON.parse(boundaryData);
      } catch (error) {
        boundaryData = [];
      }
    } else {
      const queryObj = [
        {
          key: "hierarchyTypeCode",
          value: "REVENUE",
        },
      ];
      boundaryData = await httpRequest("/egov-location/location/v11/boundarys/_search?", "", queryObj, {});
      sessionStorage.setItem("boundaryData", JSON.stringify(boundaryData));
    }
    return boundaryData;
  };

  fetchLocations = async (item) => {
    const boundaryData = await this.fetchBoundaryData(item);
    let cityBdry = jp.query(boundaryData, `$.TenantBoundary[?(@.hierarchyType.name=="${item.hierarchyType}")].boundary[?(@.label=='City')]`);
    var labelArr = this.fetchLabels(cityBdry[0]);
    let localityArray = jp.query(cityBdry, `$..children[?(@.label=="Locality")].code`);
    this.setState({
      boundaryData: cityBdry,
      labelArr: labelArr,
      localityArray: localityArray,
    });

    this.setFirstDropDownData(cityBdry);

    /**Code to set the localities for the entire tenant (first load)*/
    this.props.handleFieldChange({ target: { value: localityArray } }, "localityArray", true, "");
    /**End of locality array code*/
  };

  getDepth = (obj) => {
    var depth = 0;
    if (obj.children) {
      obj.children.forEach((d) => {
        var tmpDepth = this.getDepth(d);
        if (tmpDepth > depth) {
          depth = tmpDepth;
        }
      });
    }
    return 1 + depth;
  };

  getLabelName = (obj) => {
    for (var i = 0; i < obj.length - 1; i++) {
      if (obj[i].code && obj[i].name && obj[i].label && obj[i].code != "" && obj[i].name != "" && obj[i].label != "") {
        return obj[i].label;
      }
    }
    return null;
  };

  fetchLabels = (cityBdry) => {
    var labelArr = [];
    var bdryArr = [];

    if (cityBdry != null) {
      bdryArr = jp.query(cityBdry, `$.children..label`);
      for (var i = 0; i < bdryArr.length - 1; i++) {
        if (bdryArr[i] !== "") {
          labelArr.push(bdryArr[i]);
        }
      }
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      labelArr = labelArr.filter(onlyUnique);
    }
    return labelArr;
  };

  handler = (key, property, text) => {
    let { dropDownDataVal, labelArr } = this.state;
    const { boundaryFieldsText, handleFieldChange } = this.props;
    let newDropDownDataVal = {};

    handleFieldChange({ target: { value: { ...boundaryFieldsText, [property]: text } } }, "boundaryFieldsText", true, "");
    for (let i = 0; i < labelArr.length; i++) {
      if (labelArr[i] == property) {
        newDropDownDataVal[property] = key;
        break;
      } else {
        newDropDownDataVal[labelArr[i]] = dropDownDataVal[labelArr[i]];
      }
    }
    this.setState({ dropDownDataVal: newDropDownDataVal });
    //below runs for create & update only
    this.populateNextDropDown(key, property);

    /** Add locality array to search parameters */
    handleFieldChange({ target: { value: this.state.localityArray } }, "localityArray", true, "");
    handleFieldChange({ target: { value: newDropDownDataVal } }, "ZonalSelection", true, "");
    /** END Add local... */
  };

  setFirstDropDownData = (cityBdry) => {
    var objArr,
      ddData = [];
    objArr = jp.query(cityBdry, `$.*.children[?(@.label=='${this.state.labelArr[0]}')]`);
    if (objArr.length > 0) {
      objArr.map((v) => {
        var dd = {};
        dd.key = v.code;
        dd.value = v.name;
        ddData.push(dd);
      });
    }
    this.setState({
      dropDownData: {
        ...this.state.dropDownData,
        [this.state.labelArr[0]]: ddData,
      },
    });
  };

  populateNextDropDown = (key, property) => {
    var index = this.state.labelArr.indexOf(property);
    if (index > -1) {
      var objArr,
        ddData = [];
      let localityArray = [];
      var str = "";
      for (var i = 0; i < index; i++) {
        str = str + ".*.children";
      }
      var jPath = "$.*.children" + str + `[?(@.code=='${key}')]`;
      objArr = jp.query(this.state.boundaryData, jPath + `.children[?(@.label=='${this.state.labelArr[index + 1]}')]`);

      /**Code to set the locality array locality wise reports data*/
      if (this.state.labelArr.length - index == 2) {
        localityArray = jp.query(objArr, `$..code`);
      } else if (this.state.labelArr.length - index == 1) {
        localityArray = [key];
      } else {
        localityArray = jp.query(objArr, `$..children[?(@.label=="Locality")].code`);
      }
      this.setState({
        localityArray: localityArray,
      });
      /**End of locality array code*/

      if (objArr.length > 0) {
        objArr.map((v) => {
          if (v.label == this.state.labelArr[index + 1]) {
            var dd = {};
            dd.key = v.code;
            dd.value = v.name;
            ddData.push(dd);
          }
        });
      }
    }
    this.setState({
      dropDownData: {
        ...this.state.dropDownData,
        [this.state.labelArr[index + 1]]: ddData,
      },
    });
  };

  renderFields = (level) => {
    let { dropDownData, labelArr, dropDownDataVal } = this.state;
    const { boundaryFieldsText, handleFieldChange, localizationLabels } = this.props;
    let data =
      dropDownData && dropDownData[level]
        ? dropDownData[level].map((dd, index) => {
            return { value: dd.key, text: dd.value };
          })
        : [];
    const dataSourceConfig = { text: "text", value: "value" };
    let isDisabled = false;
    const levelndex = labelArr.indexOf(level);
    levelndex > 0 && (isDisabled = dropDownDataVal[labelArr[levelndex - 1]] ? false : true);

    // Localization of boundary labels
    let translatedLabel = getLocaleLabels(level, `reports.${level}.label`, localizationLabels);

    return (
      <div>
        <AutoComplete
          id={`boundary-${level}`}
          floatingLabelText={
            <div className="rainmaker-displayInline">
              <Label
                className="show-field-label"
                label={translatedLabel}
                containerStyle={{ marginRight: "5px" }}
                style={{ fontSize: "16px !important" }}
              />
            </div>
          }
          floatingLabelFixed={true}
          fullWidth={true}
          style={{ display: "inline-block" }}
          disabled={isDisabled}
          filter={(searchText, key) => {
            return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
          }}
          searchText={(boundaryFieldsText && boundaryFieldsText[level]) || ""}
          onNewRequest={(data, index) => {
            this.handler(data.value, level, data.text);
          }}
          onUpdateInput={(searchText, dataSource, params) => {
            handleFieldChange({ target: { value: { ...boundaryFieldsText, [level]: searchText } } }, "boundaryFieldsText", true, "");
          }}
          dataSource={data}
          dataSourceConfig={dataSourceConfig}
          openOnFocus={true}
          maxSearchResults={5}
        />
      </div>
    );
  };

  render() {
    return this.state.labelArr.map((v, i) => {
      return (
        <Col xs={12} sm={4} md={4} lg={4} key={i}>
          {this.renderFields(v)}
        </Col>
      );
    });
  }
}
const mapStateToProps = (state) => {
  const { form } = state.formtemp || {};
  const { localizationLabels } = state.app;
  const { boundaryFieldsText } = (form && form) || {};
  return { boundaryFieldsText, localizationLabels };
};

export default connect(
  mapStateToProps,
  null
)(UiBoundary);
