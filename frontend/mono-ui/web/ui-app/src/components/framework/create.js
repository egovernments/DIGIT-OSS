import React, { Component } from "react";
import { connect } from "react-redux";
import RaisedButton from "material-ui/RaisedButton";
import { Grid, Row, Col, Table, DropdownButton } from "react-bootstrap";
import _ from "lodash";
import ShowFields from "./showFields";

import { translate } from "../common/common";
import Api from "../../api/api";
import jp from "jsonpath";
import UiButton from "./components/UiButton";
import {
  fileUpload,
  getInitiatorPosition,
  callApi,
  parseKeyAndValueForDD
} from "./utility/utility";
import UiConfirm from "./components/UiConfirm/index.js";
import { createConfirmation } from "react-confirm";

import $ from "jquery";

import UiBackButton from "./components/UiBackButton";
// import UiLogo from './components/UiLogo';

var specifications = {};
let reqRequired = [];
let baseUrl = "https://raw.githubusercontent.com/abhiegov/test/master/specs/";

const REGEXP_FIND_IDX = /\[(.*?)\]+/g;
const defaultConfirmation = createConfirmation(UiConfirm);

class Report extends Component {
  state = {
    pathname: "",
    mdmsData: {}
  };
  constructor(props) {
    super(props);
    this.getVal = this.getVal.bind(this);
  }

  //TODO generate Specific FormData
  generateSpecificForm = (formData, omitPropertiesJPath) => {
    omitPropertiesJPath.forEach(function (item, index) {
      eval(item);
    });
    return formData;
  };

  confirm(confirmation, options = {}) {
    return defaultConfirmation({ confirmation, ...options });
  }

  showObjectInTable = (field, inArrayFormat = false, property = "name") => {
    var str;
    if (inArrayFormat) {
      str = [];
    } else {
      str = "";
    }

    if (Array.isArray(field)) {
      field.forEach(function (item, index) {
        if (typeof item == "object") {
          // console.log(item);
          if (inArrayFormat) {
            str[index] = item[property] ? item[property] : item["code"];
          } else {
            str += (item[property] ? item[property] : item["code"]) + ",";
          }
        } else {
          str += item + ",";
        }
      });
      if (inArrayFormat) {
        return str;
      } else {
        return str.slice(0, -1);
      }
    } else {
      return field;
    }
  };

  setLabelAndReturnRequired(configObject) {
    if (configObject && configObject.groups) {
      for (var i = 0; configObject && i < configObject.groups.length; i++) {
        configObject.groups[i].label = translate(configObject.groups[i].label);
        for (var j = 0; j < configObject.groups[i].fields.length; j++) {
          configObject.groups[i].fields[j].label = translate(
            configObject.groups[i].fields[j].label
          );
          if (
            configObject.groups[i].fields[j].isRequired &&
            !configObject.groups[i].fields[j].hide &&
            !configObject.groups[i].hide
          )
            reqRequired.push(configObject.groups[i].fields[j].jsonPath);
           if(configObject && configObject.groups[i].fields[j] && configObject.groups[i].fields[j].type == 'tableList'){

             for(var l=0; l < configObject.groups[i].fields[j].tableList.values.length ; l++){
               if(configObject.groups[i].fields[j].tableList.values[l].isRequired){

                  reqRequired.push(configObject.groups[i].fields[j].tableList.values[l].jsonPath);
                }
             }
          }

        }

        if (
          configObject.groups[i].children &&
          configObject.groups[i].children.length
        ) {
          for (var k = 0; k < configObject.groups[i].children.length; k++) {
            this.setLabelAndReturnRequired(configObject.groups[i].children[k]);
          }
        }
      }
    }
  }

  setDefaultForMultiple(group, dat) {
    var self = this;
    for (var j = 0; j < group.fields.length; j++) {
      if (
        typeof group.fields[j].defaultValue == "string" ||
        typeof group.fields[j].defaultValue == "number" ||
        typeof group.fields[j].defaultValue == "boolean"
      ) {
        _.set(dat, group.fields[j].jsonPath, group.fields[j].defaultValue);
      }
    }
  }

  setDefaultValues(groups, dat) {
    var self = this;
    for (var i = 0; i < groups.length; i++) {
      for (var j = 0; j < groups[i].fields.length; j++) {
        if (
          typeof groups[i].fields[j].defaultValue == "string" ||
          typeof groups[i].fields[j].defaultValue == "number" ||
          typeof groups[i].fields[j].defaultValue == "boolean"
        ) {
          _.set(
            dat,
            groups[i].fields[j].jsonPath,
            groups[i].fields[j].defaultValue
          );
        }

        if (
          groups[i].fields[j].children &&
          groups[i].fields[j].children.length
        ) {
          for (var k = 0; k < groups[i].fields[j].children.length; k++) {
            this.setDefaultValues(groups[i].fields[j].children[k].groups);
          }
        }
      }
    }
  }

  // setDefaultValues(groups, dat) {
  //   let formData = this.props.formData;
  //   for (var i = 0; i < groups.length; i++) {
  //     for (var j = 0; j < groups[i].fields.length; j++) {
  //       if (
  //         typeof groups[i].fields[j].defaultValue == 'string' ||
  //         typeof groups[i].fields[j].defaultValue == 'number' ||
  //         typeof groups[i].fields[j].defaultValue == 'boolean'
  //       ) {
  //         if (!_.get(formData, groups[i].fields[j].jsonPath)) {
  //           _.set(dat, groups[i].fields[j].jsonPath, groups[i].fields[j].defaultValue);
  //         }
  //       }
  //       if (groups[i].children && groups[i].children.length) {
  //         for (var k = 0; k < groups[i].children.length; k++) {
  //           this.setDefaultValues(groups[i].children[k].groups, dat);
  //         }
  //       }
  //     }
  //   }
  // }

  depedantValue(groups) {
    let self = this;
    for (let i = 0; i < groups.length; i++) {
      for (let j = 0; j < groups[i].fields.length; j++) {
        if (
          groups[i].fields[j].depedants &&
          groups[i].fields[j].depedants.length
        ) {
          for (let k = 0; k < groups[i].fields[j].depedants.length; k++) {
            if (groups[i].fields[j].depedants[k].type == "dropDown") {
              let splitArray = groups[i].fields[j].depedants[k].pattern.split(
                "?"
              );
              let context = "";
              let id = {};
              // id[splitArray[1].split("&")[1].split("=")[0]]=e.target.value;
              for (let p = 0; p < splitArray[0].split("/").length; p++) {
                context += splitArray[0].split("/")[p] + "/";
              }

              let queryStringObject = splitArray[1].split("|")[0].split("&");
              for (let m = 0; m < queryStringObject.length; m++) {
                if (m) {
                  if (queryStringObject[m].split("=")[1].search("{") > -1) {
                    let value = self.getVal(
                      queryStringObject[m]
                        .split("=")[1]
                        .split("{")[1]
                        .split("}")[0]
                    );
                    id[queryStringObject[m].split("=")[0]] =
                      queryStringObject[m].split("=")[1].split("{")[0] +
                      value +
                      queryStringObject[m]
                        .split("=")[1]
                        .split("{")[1]
                        .split("}")[1];
                  } else {
                    id[queryStringObject[m].split("=")[0]] = queryStringObject[
                      m
                    ].split("=")[1];
                  }
                }
              }

              // if(id.categoryId == "" || id.categoryId == null){
              //   formData.tradeSubCategory = "";
              //   setDropDownData(value.jsonPath, []);
              //   console.log(value.jsonPath);
              //   console.log("helo", formData);
              //   return false;
              // }
              Api.commonApiPost(context, id).then(
                function (response) {
                  if (response) {
                    let queries = splitArray[1].split("|");
                    let keys = jp.query(response, queries[1]);
                    let values = jp.query(response, queries[2]);

                    let others = [];
                    if (queries.length > 3) {
                      for (let i = 3; i < queries.length; i++) {
                        others.push(
                          jp.query(response, queries[i]) || undefined
                        );
                      }
                    }

                    let dropDownData = [];
                    for (let t = 0; t < keys.length; t++) {
                      let obj = {};
                      obj["key"] = keys[t];
                      obj["value"] = values[t];

                      if (others && others.length > 0) {
                        let otherItemDatas = [];
                        for (let i = 0; i < others.length; i++) {
                          otherItemDatas.push(others[i][k] || undefined);
                        }
                        obj["others"] = otherItemDatas;
                      }

                      dropDownData.push(obj);
                    }
                    dropDownData.sort(function (s1, s2) {
                      return s1.value < s2.value
                        ? -1
                        : s1.value > s2.value ? 1 : 0;
                    });
                    dropDownData.unshift({
                      key: null,
                      value: "-- Please Select --"
                    });
                    self.props.setDropDownData(
                      groups[i].fields[j].depedants[k].jsonPath,
                      dropDownData
                    );
                    self.props.setDropDownOriginalData(groups[i].fields[j].depedants[k].jsonPath, response);
                  }
                },
                function (err) {
                  console.log(err);
                }
              );
            }
          }
        }

        self.checkifHasDependedantMdmsField(
          groups[i].fields[j].jsonPath,
          self.getVal(groups[i].fields[j].jsonPath)
        );

        if (
          groups[i].fields[j].children &&
          groups[i].fields[j].children.length
        ) {
          for (var k = 0; k < groups[i].fields[j].children.length; k++) {
            self.depedantValue(groups[i].fields[j].children[k].groups);
          }
        }
      }
    }
  }

  setInitialUpdateChildData(form, children) {
    let _form = JSON.parse(JSON.stringify(form));
    for (var i = 0; i < children.length; i++) {
      for (var j = 0; j < children[i].groups.length; j++) {
        if (children[i].groups[j].multiple) {
          var arr = _.get(_form, children[i].groups[j].jsonPath);
          var ind = j;
          var _stringifiedGroup = JSON.stringify(children[i].groups[j]);
          var regex = new RegExp(
            children[i].groups[j].jsonPath
              .replace(/\[/g, "\\[")
              .replace(/\]/g, "\\]") + "\\[\\d{1}\\]",
            "g"
          );
          for (var k = 1; k < arr.length; k++) {
            j++;
            children[i].groups[j].groups.splice(
              ind + 1,
              0,
              JSON.parse(
                _stringifiedGroup.replace(
                  regex,
                  children[i].groups[ind].jsonPath + "[" + k + "]"
                )
              )
            );
            children[i].groups[j].groups[ind + 1].index = ind + 1;
          }
        }

        if (
          children[i].groups[j].children &&
          children[i].groups[j].children.length
        ) {
          this.setInitialUpdateChildData(form, children[i].groups[j].children);
        }
      }
    }
  }

  getValNew = (form, path, dateBool) => {
    var _val = _.get(form, path);
    if (dateBool && typeof _val == "string" && _val && _val.indexOf("-") > -1) {
      var _date = _val.split("-");
      return new Date(_date[0], Number(_date[1]) - 1, _date[2]);
    }

    return typeof _val != "undefined" ? _val : "";
  };

  setInitialUpdateData(form, specs, moduleName, actionName, objectName) {
    let { setMockData, formData, setFormData } = this.props;
    let _form = JSON.parse(JSON.stringify(form));
    var ind;
    /* -- Create the modified specs for multiple cards -- */
    for (
      var i = 0;
      i < specs[moduleName + "." + actionName].groups.length;
      i++
    ) {
      if (specs[moduleName + "." + actionName].groups[i].multiple) {
        var arr = _.get(
          _form,
          specs[moduleName + "." + actionName].groups[i].jsonPath
        );
        ind = i;
        var _stringifiedGroup = JSON.stringify(
          specs[moduleName + "." + actionName].groups[i]
        );
        var regex = new RegExp(
          specs[moduleName + "." + actionName].groups[i].jsonPath
            .replace(/\[/g, "\\[")
            .replace(/\]/g, "\\]") + "\\[\\d{1}\\]",
          "g"
        );
        for (var j = 1; j < arr.length; j++) {
          i++;
          specs[moduleName + "." + actionName].groups.splice(
            ind + 1,
            0,
            JSON.parse(
              _stringifiedGroup.replace(
                regex,
                specs[moduleName + "." + actionName].groups[ind].jsonPath +
                "[" +
                j +
                "]"
              )
            )
          );
          specs[moduleName + "." + actionName].groups[ind + 1].index = j;
        }
      }
    }

    /* -- Check for valueBasedOn feature -- */
    for (
      var i = 0;
      i < specs[moduleName + "." + actionName].groups.length;
      i++
    ) {
      for (var s = 0; s < specs[moduleName + '.' + actionName].groups[i].fields.length; s++) {
        if (
          specs[moduleName + '.' + actionName].groups[i].fields[s].valueBasedOn &&
          specs[moduleName + '.' + actionName].groups[i].fields[s].valueBasedOn.length
        ) {
          for (let k = 0; k < specs[moduleName + '.' + actionName].groups[i].fields[s].valueBasedOn.length; k++) {
            if (this.getValNew(form, specs[moduleName + '.' + actionName].groups[i].fields[s].valueBasedOn[k].jsonPath)) {
              // _.set(
              //   formData,
              //   specs[moduleName + '.' + actionName].groups[i].fields[s].jsonPath,
              //   specs[moduleName + '.' + actionName].groups[i].fields[s].valueBasedOn[k].valueIfDataFound
              // );
              _.set(
                form,
                specs[moduleName + '.' + actionName].groups[i].fields[s].jsonPath,
                specs[moduleName + '.' + actionName].groups[i].fields[s].valueBasedOn[k].valueIfDataFound
              );

            } else {
              // _.set(
              //   formData,
              //   specs[moduleName + '.' + actionName].groups[i].fields[s].jsonPath,
              //   !specs[moduleName + '.' + actionName].groups[i].fields[s].valueBasedOn[k].valueIfDataFound
              // );
              _.set(
                form,
                specs[moduleName + '.' + actionName].groups[i].fields[s].jsonPath,
                !specs[moduleName + '.' + actionName].groups[i].fields[s].valueBasedOn[k].valueIfDataFound
              );

            }
          }
        }
      }

      /* -- Logic for show/hide feature -- */
      for (
        var j = 0;
        j < specs[moduleName + "." + actionName].groups[i].fields.length;
        j++
      ) {
        if (
          specs[moduleName + "." + actionName].groups[i].fields[j]
            .showHideFields &&
          specs[moduleName + "." + actionName].groups[i].fields[j]
            .showHideFields.length
        ) {
          for (
            var k = 0;
            k <
            specs[moduleName + "." + actionName].groups[i].fields[j]
              .showHideFields.length;
            k++
          ) {
            if (
              specs[moduleName + "." + actionName].groups[i].fields[j]
                .showHideFields[k].ifValue ==
              _.get(
                form,
                specs[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath
              )
            ) {
              if (
                specs[moduleName + "." + actionName].groups[i].fields[j]
                  .showHideFields[k].hide &&
                specs[moduleName + "." + actionName].groups[i].fields[j]
                  .showHideFields[k].hide.length
              ) {
                for (
                  var a = 0;
                  a <
                  specs[moduleName + "." + actionName].groups[i].fields[j]
                    .showHideFields[k].hide.length;
                  a++
                ) {
                  this.hideField(
                    specs,
                    specs[moduleName + "." + actionName].groups[i].fields[j]
                      .showHideFields[k].hide[a],
                    specs[moduleName + "." + actionName].groups[i].fields[j].jsonPath
                  );
                }
              }

              if (
                specs[moduleName + "." + actionName].groups[i].fields[j]
                  .showHideFields[k].show &&
                specs[moduleName + "." + actionName].groups[i].fields[j]
                  .showHideFields[k].show.length
              ) {
                for (
                  var a = 0;
                  a <
                  specs[moduleName + "." + actionName].groups[i].fields[j]
                    .showHideFields[k].show.length;
                  a++
                ) {
                  this.showField(
                    specs,
                    specs[moduleName + "." + actionName].groups[i].fields[j]
                      .showHideFields[k].show[a],
                    specs[moduleName + "." + actionName].groups[i].fields[j].jsonPath
                  );
                }
              }
            }
          }
        }
      }


      if (
        specs[moduleName + "." + actionName].groups[ind || i].children &&
        specs[moduleName + "." + actionName].groups[ind || i].children.length
      ) {
        this.setInitialUpdateChildData(
          form,
          specs[moduleName + "." + actionName].groups[ind || i].children
        );
      }
    }
    /* -- Logic for sorting the specs on index value for multiple cards -- */
    var count = 0;
    var tempArr = [];
    for (
      var i = 0;
      i < specs[moduleName + "." + actionName].groups.length;
      i++
    ) {
      if (specs[moduleName + "." + actionName].groups[i].multiple && !specs[moduleName + "." + actionName].groups[i].index) {
        var flag = 0;
        count = i;
        while (count < specs[moduleName + "." + actionName].groups.length &&
          specs[moduleName + "." + actionName].groups[i].name == specs[moduleName + "." + actionName].groups[count].name) {
          tempArr.push(specs[moduleName + "." + actionName].groups[count]);
          count++;
          flag++;
        }
        tempArr.sort(function (obj1, obj2) {
          return obj1.index - obj2.index;
        })
        specs[moduleName + "." + actionName].groups.splice(i, flag, ...tempArr);
        tempArr = [];
      }
    }
    setMockData(specs);
  }



  displayUI(results) {
    let {
      setMetaData,
      setModuleName,
      setActionName,
      initForm,
      setMockData,
      setFormData,
      setDropDownData,
      setDropDownOriginalData,
      mockData,
      moduleName, actionName
    } = this.props;
    let hashLocation = window.location.hash;
    let self = this;

    specifications = typeof results == "string" ? JSON.parse(results) : results;
    let obj =
      specifications[
      `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
      ];
    reqRequired = [];
    self.setLabelAndReturnRequired(obj);
    if (obj && obj.listners) {
      eval(obj.listners);
    }
    initForm(reqRequired);
    setMetaData(specifications);
    setMockData(JSON.parse(JSON.stringify(specifications)));
    setModuleName(hashLocation.split("/")[2]);
    setActionName(hashLocation.split("/")[1]);

    if (hashLocation.split("/").indexOf("update") == 1) {
      var url = specifications[
        `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
      ].searchUrl.split("?")[0];
      var id =
        (self.props.match.params.id &&
          decodeURIComponent(self.props.match.params.id)) ||
        self.props.match.params.master;
      var query = {
        [specifications[
          `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
        ].searchUrl
          .split("?")[1]
          .split("=")[0]]: id
      };
      //handle 2nd parameter
      if (
        specifications[
          `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
        ].searchUrl
          .split("?")[1]
          .split("=")[2]
      ) {
        var pval = specifications[
          `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
        ].searchUrl
          .split("?")[1]
          .split("=")[2];
        var pname = specifications[
          `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
        ].searchUrl
          .split("?")[1]
          .split("=")[1]
          .split("&")[1];

        query = {
          [specifications[
            `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
          ].searchUrl
            .split("?")[1]
            .split("=")[0]]: id,
          [pname]: pval
        };
      }
      if (window.location.href.indexOf("?") > -1) {
        var qs = window.location.href.split("?")[1];
        if (qs && qs.indexOf("=") > -1) {
          qs = qs.indexOf("&") > -1 ? qs.split("&") : [qs];
          for (var i = 0; i < qs.length; i++) {
            query[qs[i].split("=")[0]] = qs[i].split("=")[1];
          }
        }
      }

      self.props.setLoadingStatus("loading");


      var _body = {};
      if (url.includes("/egov-mdms-service/v1/_search")) {
        var moduleDetails = [];
        var masterDetails = [];
        let data = { moduleName: "", masterDetails: [] };
        let k = 0;
        var masterDetail = {};
        data.moduleName = hashLocation.split("/")[2];
        var filterData = `[?(@.${
          specifications[
            `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
          ].searchUrl
            .split("?")[1]
            .split("={")[0]
          }=='${hashLocation.split("/")[hashLocation.split("/").length - 1]}')]`;
        masterDetail.filter = filterData;
        masterDetail.name =
          specifications[
            `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
          ].objectName;
        data.masterDetails[0] = _.cloneDeep(masterDetail);
        // console.log(data);
        moduleDetails.push(data);

        _body = {
          MdmsCriteria: {
            tenantId: localStorage.getItem("tenantId"),
            moduleDetails: moduleDetails
          }
        };

        query = "";
      }

      Api.commonApiPost(
        url,
        query,
        _body,
        false,
        specifications[
          `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
        ].useTimestamp
      ).then(
        function (res) {
          if (
            specifications[
              `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
            ].isMDMSScreen
          ) {
            var masterName = "";
            var moduleName = "";
            if (Object.keys(res.MdmsRes).length === 1) {
              moduleName = Object.keys(res.MdmsRes)[0];
              masterName = Object.keys(
                res.MdmsRes[Object.keys(res.MdmsRes)[0]]
              )[0];
            }
            let mdmsReq = {};
            mdmsReq.MasterMetaData = {};
            mdmsReq.MasterMetaData.masterData = [];
            mdmsReq.MasterMetaData.moduleName = moduleName;
            mdmsReq.MasterMetaData.masterName = masterName;
            mdmsReq.MasterMetaData.tenantId = localStorage.getItem("tenantId");
            mdmsReq.MasterMetaData.masterData[0] = res.MdmsRes[moduleName][masterName][0];
            console.log(mdmsReq);
            res = mdmsReq;
          }
          //
          self.props.setLoadingStatus("hide");
          if (
            specifications[
              `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
            ].isResponseArray
          ) {
            var obj = {};
            _.set(
              obj,
              specifications[
                `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
              ].objectName,
              jp.query(res, "$..[0]")[0]
            );
            var spec =
              specifications[
              `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
              ];

            if (spec && spec.beforeSetForm) eval(spec.beforeSetForm);
            self.props.setFormData(obj);
            self.setInitialUpdateData(
              obj,
              JSON.parse(JSON.stringify(specifications)),
              hashLocation.split("/")[2],
              hashLocation.split("/")[1],
              specifications[
                `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
              ].objectName
            );
          } else {
            let obj =
              specifications[
              `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
              ];
            if (obj && obj.beforeSetUpdateData) eval(obj.beforeSetUpdateData);
            self.setInitialUpdateData(
              res,
              JSON.parse(JSON.stringify(specifications)),
              hashLocation.split("/")[2],
              hashLocation.split("/")[1],
              specifications[
                `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
              ].objectName
            );
            let fields = jp.query(
              obj,
              `$.groups..fields[?(@.hasATOAATransform==true)]`
            );
            for (var i = 0; i < fields.length; i++) {
              if (!fields[i].hasPreTransform) {
                let values = _.get(res, fields[i].jsonPath);
                res = _.set(
                  res,
                  fields[i]["aATransformInfo"].to,
                  self.showObjectInTable(values, true, "code")
                );
              }
            }
            var spec =
              specifications[
              `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
              ];
            const JP = jp;
            if (spec && spec.beforeSetForm) eval(spec.beforeSetForm);
            self.props.setFormData(res);
            if (spec && spec.afterSetForm) eval(spec.afterSetForm);
          }
          let obj1 =
            specifications[
            `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
            ];
          self.depedantValue(obj1.groups);
        },
        function (err) {
          self.props.setLoadingStatus("hide");
        }
        );
    } else {

      let bodyParams = '';
      bodyParams = localStorage.getItem("bodyParams");
      if (bodyParams != '' && bodyParams != null) {
        localStorage.setItem('bodyParams', '');
      }

      if (
        hashLocation.split("/").indexOf("create") == 1 &&
        specifications[
        `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
        ] &&
        specifications[
          `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
        ].isMDMSScreen
      ) {
        // let obj = specifications[`${hashLocation.split('/')[2]}.${hashLocation.split('/')[1]}`];
        // console.log(obj);
        var masterName = "";
        for (var i = 0; i < obj.groups.length; i++) {
          if (obj.groups[i].hide) {
            for (var j = 0; j < obj.groups[i].fields.length; j++) {
              if (
                obj.groups[i].fields[j].jsonPath === "MasterMetaData.masterName"
              ) {
                masterName = obj.groups[i].fields[j].defaultValue;
              }
              if (
                obj.groups[i].fields[j].jsonPath ===
                "MasterMetaData.masterData[0].code"
              ) {
                if (obj.groups[i].fields[j].acceptCode==true){
                  obj.groups[i].fields[j].defaultValue = obj.groups[i].fields[j].defaultValue;

                }
                else{
                obj.groups[i].fields[j].defaultValue =
                  masterName + "-" + new Date().getTime();
                }
              }
            }
          } else {
            continue;
          }
        }
        // console.log(obj);
      }
      var formData = {};
      if (obj && obj.groups && obj.groups.length)
        self.setDefaultValues(obj.groups, formData);
      setFormData(formData);
      var id =
        self.props.match.params.id &&
        decodeURIComponent(self.props.match.params.id);
      if (id || (bodyParams != '' && bodyParams != null)) {
        //console.log('id', id);
        let mockObj =
          specifications[
          `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
          ];
        if (mockObj.onloadFetchUrl) {
          let requestBody = {};
          if (id) {
            let params = JSON.parse(id);
            self.props.setLoadingStatus("loading");
            // console.log('query', query);

            Object.keys(params).map(key => {
              _.set(requestBody, key, params[key]);
            });
          }
          else {
            let temp = {};
            let bParams = [];
            bodyParams = bodyParams.split(',');
            for (let i = 0; i < bodyParams.length; i++) {
              bParams.push(bodyParams[i]);
            }
            mockObj.bodyParams.map(x => {
              if (x.value == '?') {
                x.value = bParams;
              }
              _.set(temp, x.key, x.value);
            });
            _.set(requestBody, mockObj.objectName, [temp]);
          }
          Api.commonApiPost(
            mockObj.onloadFetchUrl,
            {},
            requestBody,
            false,
            mockObj.useTimestamp
          ).then(
            function (res) {
              self.props.setLoadingStatus("hide");
              if (
                specifications[
                  `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
                ].isResponseArray
              ) {
                var obj = {};
                _.set(
                  obj,
                  specifications[
                    `${hashLocation.split("/")[2]}.${
                    hashLocation.split("/")[1]
                    }`
                  ].objectName,
                  jp.query(res, "$..[0]")[0]
                );
                self.props.setFormData(obj);
                self.setInitialUpdateData(
                  obj,
                  JSON.parse(JSON.stringify(specifications)),
                  hashLocation.split("/")[2],
                  hashLocation.split("/")[1],
                  specifications[
                    `${hashLocation.split("/")[2]}.${
                    hashLocation.split("/")[1]
                    }`
                  ].objectName
                );
              } else {
                self.setInitialUpdateData(
                  res,
                  JSON.parse(JSON.stringify(specifications)),
                  hashLocation.split("/")[2],
                  hashLocation.split("/")[1],
                  specifications[
                    `${hashLocation.split("/")[2]}.${
                    hashLocation.split("/")[1]
                    }`
                  ].objectName
                );
                self.props.setFormData(res);
              }
              let obj1 =
                specifications[
                `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
                ];


              self.depedantValue(obj1.groups);
            },
            function (err) {
              self.props.setLoadingStatus("hide");
            }
            );
        }
      }
    }
    var res = self.handleMasterData(specifications, this.props.moduleName);

    this.setState({
      pathname: this.props.history.location.pathname
    });

    if (obj && obj.preApiCalls) {
      self.props.setLoadingStatus("loading");
      obj.preApiCalls.forEach(async item => {
        let res = await callApi(item);
        let orgRes = Object.assign({}, res);
        if (item.dependentUrl) {
          Api.commonApiPost(item.dependentUrl).then(function (response) {
            let keyValue = jp.query(res, item.jsExpForDD.key)[0];
            let filterObject = _.filter(
              response[`${item.dependantPath}`],
              function (o) {
                if (o[`${item.dependentKey}`] == keyValue) return o;
              }
            );

            self.setVal(item.jsonPath, filterObject[0].name);
            self.props.setLoadingStatus("hide");
          });
        }


        else if (item.type && item.type == 'text') {
          let filteredresponse = self.filterDataFromArray(res, item);
          let jsonpaths = item.jsonPath.split(',');
          if (jsonpaths && filteredresponse) {
            for (var i = 0; i < item.responsePaths.length; i++) {
              if (filteredresponse[0]) {
                var value = _.get(filteredresponse[0], item.responsePaths[i])
                if (value) {
                  self.setVal(jsonpaths[i], value);
                }
              }
            }
          }
          self.props.setLoadingStatus("hide");
        }

        else {
          setDropDownData(
            item.jsonPath,
            parseKeyAndValueForDD(
              res,
              item.jsExpForDD.key,
              item.jsExpForDD.value
            )
          );
          setDropDownOriginalData(item.jsonPath, res);
          self.props.setLoadingStatus("hide");
        }
      });
    }
    self.props.setLoadingStatus("hide");
  }

  handleMasterData(specifications) {
    let self = this;
    let moduleDetails = [];
    let { setDropDownData, setDropDownOriginalData } = this.props;
    let hashLocation = window.location.hash;
    let obj =
      specifications[
      `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
      ];
    let name, filter;
    // let {moduleName, actionName, setMockData} = this.props;
    let data = { moduleName: "", masterDetails: [] };
    let k = 0;
    var masterDetail = {};
    if(obj){
      for (let i = 0; i < obj.groups.length; i++) {
        for (let j = 0; j < obj.groups[i].fields.length; j++) {
          if (obj.groups[i].fields[j].mdms) {
            masterDetail.name = obj.groups[i].fields[j].mdms.masterName;
            masterDetail.filter =
              obj.groups[i].fields[j].mdms.filter != ""
                ? obj.groups[i].fields[j].mdms.filter
                : null;
            data.masterDetails[k] = _.cloneDeep(masterDetail);
            data.moduleName = obj.groups[i].fields[j].mdms.moduleName;
            k++;
          }
        }
      }
      moduleDetails.push(data);
      var _body = {
        MdmsCriteria: {
          tenantId: localStorage.getItem("tenantId"),
          moduleDetails: moduleDetails
        }
      };

      if (jp.query(obj, `$.groups..fields..mdms`) != "") {
        Api.commonApiPost(
          "/egov-mdms-service/v1/_search",
          "",
          _body,
          {},
          true,
          true
        )
          .then(res => {
            this.setState({
              mdmsData: res.MdmsRes
            });

            //set dropdowndata
            for (let i = 0; i < obj.groups.length; i++) {
              for (let j = 0; j < obj.groups[i].fields.length; j++) {
                if (obj.groups[i].fields[j].mdms) {
                  let dropDownData = [];
                  if (
                    Object.keys(res.MdmsRes).includes(
                      obj.groups[i].fields[j].mdms.moduleName
                    )
                  ) {
                    for (var prop in res.MdmsRes) {
                      if (obj.groups[i].fields[j].mdms.dependant) continue;
                      if (res.MdmsRes.hasOwnProperty(prop)) {
                        if (prop == obj.groups[i].fields[j].mdms.moduleName)
                          for (var master in res.MdmsRes[prop]) {
                            if (res.MdmsRes[prop].hasOwnProperty(master)) {
                              var moduleObj = res.MdmsRes[prop];
                              if (
                                master == obj.groups[i].fields[j].mdms.masterName
                              ) {
                                moduleObj[master].forEach(function (item) {
                                  let key = [];
                                  let value = [];
                                  key = jp.query(
                                    item,
                                    obj.groups[i].fields[j].mdms.key
                                  );
                                  value = jp.query(
                                    item,
                                    obj.groups[i].fields[j].mdms.value
                                  );
                                  for (let r = 0; r < key.length; r++) {
                                    let masterObj = {};
                                    masterObj.key = key[r];
                                    masterObj.value = value[r];
                                    dropDownData.push(masterObj);
                                  }
                                });
                              }
                            }
                          }
                      }
                    }
                  }
                  setDropDownData(obj.groups[i].fields[j].jsonPath, dropDownData);
                  setDropDownOriginalData(obj.groups[i].fields[j].jsonPath.split('.').join('-'), res);
                }
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }

  checkifHasDependedantMdmsField(path, value) {
    let obj = { ..._mockData };
    let _mockData = { ...this.props.mockData };
    let _formData = { ...this.props.formData };
    let {
      moduleName,
      actionName,
      setMockData,
      setFormData,
      setDropDownData,
      setDropDownOriginalData
    } = this.props;
    for (
      let i = 0;
      i < _mockData[moduleName + "." + actionName].groups.length;
      i++
    ) {
      for (
        let j = 0;
        j < _mockData[moduleName + "." + actionName].groups[i].fields.length;
        j++
      ) {
        if (_mockData[moduleName + "." + actionName].groups[i].fields[j].mdms) {
          if (
            _mockData[moduleName + "." + actionName].groups[i].fields[j].mdms
              .dependant
          ) {
            let exp =
              _mockData[moduleName + "." + actionName].groups[i].fields[j].mdms
                .dependant.jsonExp;
            let valuePath = exp.split("=='")[1];
            valuePath = valuePath.split("')]")[0];
            if (path == valuePath) {
              exp = exp.replace(path, value);
              var dropdownValues = jp.query(this.state.mdmsData, exp);
              let dropdowndata = [];
              dropdownValues.forEach(function (item) {
                let key = [];
                let value = [];
                key = jp.query(
                  item,
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .mdms.key
                );
                value = jp.query(
                  item,
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .mdms.value
                );
                if(_mockData[moduleName + "." + actionName].groups[i].fields[j].type === "boundary"){
                  let __formData = _.cloneDeep(_formData);
                  _.set(__formData, _mockData[moduleName + "." + actionName].groups[i].fields[j].jsonPath, value[0]);
                  setFormData(__formData);
                }
                for (let r = 0; r < key.length; r++) {
                  let masterObj = {};
                  masterObj.key = key[r];
                  masterObj.value = value[r];
                  dropdowndata.push(masterObj);
                }
              });
              setDropDownData(
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath,
                dropdowndata
              );
              // setDropDownOriginalData(_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, dropdownValues);
            }
          }
        }
      }
    }
  }

  initData() {
    var hash = window.location.hash.split("/");

    let endPoint = "";
    let self = this;
    try {
      if (
        hash.length == 3 ||
        (hash.length == 4 && hash.indexOf("update") > -1)
      ) {
        specifications = require(`./specs/${hash[2]}/${hash[2]}`).default;
      } else {
        if ($("input[type=file]")) {
          $("input[type=file]").val("");
        }
        specifications = require(`./specs/${hash[2]}/master/${hash[3]}`)
          .default;
      }
    } catch (e) {
      console.log(e);
    }

    self.displayUI(specifications);
  }

  componentDidMount() {
    this.initData();
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.state.pathname &&
      this.state.pathname != nextProps.history.location.pathname
    ) {
      this.initData();
    }
  }

  autoComHandler = (autoObject, path) => {
    let self = this;
    var value = this.getVal(path);
    if (!value) return;

    if (Array.isArray(autoObject)) {
      autoObject.forEach(function (item, index) {
        var url = item.autoCompleteUrl.split("?")[0];
        var hashLocation = window.location.hash;
        var parameters = item.autoCompleteUrl.substr(
          item.autoCompleteUrl.indexOf("?") + 1
        );
        if (parameters.split("&").length > 1) {
          var params = parameters.split("&");
          var query = {};
          for (var i = 0; i < params.length; i++) {
            if (params[i].indexOf("{") > 0) {
              params[i] = params[i].replace(
                params[i].substr(
                  params[i].indexOf("{"),
                  params[i].indexOf("}") + 1 - params[i].indexOf("{")
                ),
                value
              );
            }
            var index = params[i].indexOf("=");
            var id = params[i].substr(0, index);
            var val = params[i].substr(index + 1);
            query[id] = val;
          }
        } else {
          var param = parameters.replace(
            parameters.substr(
              parameters.indexOf("{"),
              parameters.indexOf("}") + 1 - parameters.indexOf("{")
            ),
            value
          );
          var index = param.indexOf("=");
          var query = {
            [param.substr(0, index)]: param.substr(index + 1)
          };
        }
        self.props.setLoadingStatus("loading");
        Api.commonApiPost(
          url,
          query,
          {},
          false,
          specifications[
            `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
          ].useTimestamp
        ).then(
          function (res) {
            self.props.setLoadingStatus("hide");
            var formData = { ...self.props.formData };
            for (var key in item.autoFillFields) {
              _.set(formData, key, _.get(res, item.autoFillFields[key]));
            }
            self.props.setFormData(formData);
          },
          function (err) {
            console.log(err);
            self.props.setLoadingStatus("hide");
            var formData = { ...self.props.formData };
            for (var key in item.autoFillFields) {
              _.set(formData, key, _.get(err, item.autoFillFields[key]));
            }
            self.props.setFormData(formData);
            self.props.toggleSnackbarAndSetText(true, err.message);
          }
          );
      });
    } else {
      var url = autoObject.autoCompleteUrl.split("?")[0];
      var hashLocation = window.location.hash;
      var parameters = autoObject.autoCompleteUrl.substr(
        autoObject.autoCompleteUrl.indexOf("?") + 1
      );
      if (parameters.split("&").length > 1) {
        var params = parameters.split("&");
        var query = {};
        for (var i = 0; i < params.length; i++) {
          if (params[i].indexOf("{") > 0) {
            params[i] = params[i].replace(
              params[i].substr(
                params[i].indexOf("{"),
                params[i].indexOf("}") + 1 - params[i].indexOf("{")
              ),
              value
            );
          }
          var index = params[i].indexOf("=");
          var id = params[i].substr(0, index);
          var val = params[i].substr(index + 1);
          query[id] = val;
        }
      } else {
        var param = parameters.replace(
          parameters.substr(
            parameters.indexOf("{"),
            parameters.indexOf("}") + 1 - parameters.indexOf("{")
          ),
          value
        );
        var index = param.indexOf("=");
        var query = {
          [param.substr(0, index)]: param.substr(index + 1)
        };
      }

      Api.commonApiPost(
        url,
        query,
        {},
        false,
        specifications[
          `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
        ].useTimestamp
      ).then(
        function (res) {
          var formData = { ...self.props.formData };
          for (var key in autoObject.autoFillFields) {
            if(key != "iterableFields"){
              _.set(formData, key, _.get(res, autoObject.autoFillFields[key]));
            }else{
              let iterData = _.get(res, autoObject.autoFillFields[key].from);
              if(iterData && _.isArray(iterData)){
                iterData.forEach(function(elem, ind){
                  if(typeof elem === "object"){
                    if(elem.key === autoObject.autoFillFields[key].key){
                      _.set(formData, autoObject.autoFillFields[key].to, elem.value);
                    }
                  }
                })
              }
            }
          }
          self.props.setFormData(formData);
        },
        function (err) {
          console.log(err);
        }
        );
    }
  };

  makeAjaxCall = (formData, url) => {
    let shouldSubmit = true;
    let self = this;
    let _formData = _.cloneDeep(formData);
    var formData=Object.assign({}, formData);
    let { setVal } = this.props;
    var hashLocation = window.location.hash;
    let obj =specifications[`${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`];
    const JP = jp;


    if (obj && obj.beforeSubmit) {
      eval(obj.beforeSubmit);
    }

    if (shouldSubmit) {
      let fields = jp.query(
        obj,
        `$.groups..fields[?(@.hasATOAATransform==true)]`
      );

      for (var i = 0; i < fields.length; i++) {
        let values = _.get(_formData, fields[i].jsonPath);
        if (values && _.isArray(values) && values.length > 0) {
          _formData = _.set(
            _formData,
            fields[i]["aATransformInfo"].to,
            values.map(item => {
              if (_.isObject(item) && _.has(item, fields[i]["aATransformInfo"].key)) {
                return item;
              } else {
                return {
                  [fields[i]["aATransformInfo"].key]: fields[i]["aATransformInfo"]
                    .from
                    ? _.get(item, fields[i]["aATransformInfo"].from)
                    : item
                };
              }
            })
          );

        }
      }

      // console.log(formData);
      delete formData.ResponseInfo;
      //return console.log(formData);
      // console.log(obj);

      if (obj.hasOwnProperty("omittableFields")) {
        this.generateSpecificForm(_formData, obj["omittableFields"]);
      }

      Api.commonApiPost(
        url ||
        self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`]
          .url,
        "",
        _formData,
        "",
        true
      ).then(
        function (response) {
          self.props.setLoadingStatus("hide");
          self.initData();
          if (response.summons) {
            if (response.summons.length > 0) {
              self.props.toggleSnackbarAndSetText(
                true,
                translate(
                  self.props.actionName == "create"
                    ? "Created Successfully Ref No. is " +
                    response.summons[0].summonReferenceNo
                    : "wc.update.message.success"
                ),
                true
              );
            } else {
              self.props.toggleSnackbarAndSetText(
                true,
                translate(
                  self.props.actionName == "create"
                    ? "wc.create.message.success"
                    : "wc.update.message.success"
                ),
                true
              );
            }
          } else {
            let hashLocation = window.location.hash;
            if ($("input[type=file]")) {
              $("input[type=file]").val("");
            }
            self.props.toggleSnackbarAndSetText(
              true,
              translate(
                self.props.actionName == "create"
                  ? "wc.create.message.success"
                  : "wc.update.message.success"
              ),
              true
            );
          }

          setTimeout(function () {
            if (
              self.props.metaData[
                `${self.props.moduleName}.${self.props.actionName}`
              ].idJsonPath
            ) {
              if (
                self.props.metaData[
                  `${self.props.moduleName}.${self.props.actionName}`
                ].ackUrl
              ) {
                var hash =
                  self.props.metaData[
                    `${self.props.moduleName}.${self.props.actionName}`
                  ].ackUrl +
                  "/" +
                  encodeURIComponent(
                    _.get(
                      response,
                      self.props.metaData[
                        `${self.props.moduleName}.${self.props.actionName}`
                      ].idJsonPath
                    )
                  );
              } else {
                if (self.props.actionName == "update") {
                  var hash = window.location.hash.replace(
                    /(\#\/create\/|\#\/update\/)/,
                    "/view/"
                  );
                } else {
                  var hash =
                    window.location.hash.replace(
                      /(\#\/create\/|\#\/update\/)/,
                      "/view/"
                    ) +
                    "/" +
                    encodeURIComponent(
                      _.get(
                        response,
                        self.props.metaData[
                          `${self.props.moduleName}.${self.props.actionName}`
                        ].idJsonPath
                      )
                    );
                }
              }

              self.props.setRoute(
                hash +
                (self.props.metaData[
                  `${self.props.moduleName}.${self.props.actionName}`
                ].queryString || "")
              );
            } else if (
              self.props.metaData[
                `${self.props.moduleName}.${self.props.actionName}`
              ].passResToLocalStore
            ) {
              var hash =
                self.props.metaData[
                  `${self.props.moduleName}.${self.props.actionName}`
                ].ackUrl;
              var obj = _.get(
                response,
                self.props.metaData[
                  `${self.props.moduleName}.${self.props.actionName}`
                ].passResToLocalStore
              );
              if (obj.isVakalatnamaGenerated) {
                localStorage.setItem(
                  "returnUrl",
                  window.location.hash.split("#/")[1]
                );
                localStorage.setItem(
                  self.props.metaData[
                    `${self.props.moduleName}.${self.props.actionName}`
                  ].localStoreResponseKey,
                  JSON.stringify(obj)
                );
                self.props.setRoute(hash);
              }
            }
          }, 1500);


        },
        function (err) {
          self.props.setLoadingStatus("hide");
          self.props.toggleSnackbarAndSetText(true, err.message);
        }
      );

    }
    else {
      self.props.setLoadingStatus("hide");
    }

  };

  filterDataFromArray = (res, item) => {
    if (res) {
      let value = this.getVal(item.queryParameter);
      if (value) {
        var filterdObject = _.filter(
          res[`${item.responseArray}`],
          function (o) {
            // let jsonObject=Json.stringify()
            var currentValue = _.get(o, item.primaryKey);
            if (currentValue == value) { return o };
          });
        return filterdObject;
      }
      return null;
    }

    return null;

  }
  //Needs to be changed later for more customfields
  checkCustomFields = (formData, cb) => {
    var self = this;
    if (
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`]
        .customFields &&
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`]
        .customFields.initiatorPosition
    ) {
      var jPath =
        self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`]
          .customFields.initiatorPosition;
      getInitiatorPosition(function (err, pos) {
        if (err) {
          self.toggleSnackbarAndSetText(true, err.message);
        } else {
          _.set(formData, jPath, pos);
          cb(formData);
        }
      });
    } else {
      cb(formData);
    }
  };

  getFileList = (mockObject, formData, fileList = {}) => {
    for (let i = 0; i < mockObject.groups.length; i++) {
      for (let j = 0; j < mockObject.groups[i].fields.length; j++) {
        if (
          mockObject.groups[i].fields[j].type == "singleFileUpload" &&
          _.get(formData, mockObject.groups[i].fields[j].jsonPath)
        ) {
          fileList[mockObject.groups[i].fields[j].jsonPath] = _.get(
            formData,
            mockObject.groups[i].fields[j].jsonPath
          );
        }
      }

      if (
        mockObject.groups[i].children &&
        mockObject.groups[i].children.length
      ) {
        for (var k = 0; k < mockObject.groups[i].children.length; k++) {
          this.getFileList(
            mockObject.groups[i].children[k],
            formData,
            fileList
          );
        }
      }
    }
  };

  checkifHasInjectData = _mockData => {
    let {
      moduleName,
      actionName,
      setFormData,
      delRequiredFields,
      removeFieldErrors,
      addRequiredFields
    } = this.props;
    let _formData = _.cloneDeep(this.props.formData);
    if (_mockData[moduleName + "." + actionName].injectData) {
      _mockData[moduleName + "." + actionName].injectData.forEach(item => {
        let path = item.jsonPath.split(".");
        path = path.splice(0, path.length - 1).join(".");
        if (this.getVal(path) != "") {
          _.set(this.props.formData, item.jsonPath, item.value);
        }
      });
    }
  };

  checkForOtherFiles = (formData, _url) => {
    // console.log(_url);
    let { mockData, actionName, moduleName } = this.props;
    let self = this;
    let fileList = {};
    var formData=Object.assign({}, formData);
    this.getFileList(
      mockData[moduleName + "." + actionName],
      formData,
      fileList
    );
    let counter = Object.keys(fileList).length;
    if (!counter) {
      self.makeAjaxCall(formData, _url);
    } else {
      let breakOut = 0;
      for (let key in fileList) {
        fileUpload(fileList[key], moduleName, function (err, res) {
          if (breakOut == 1) return;
          if (err) {
            breakOut = 1;
            self.props.setLoadingStatus("hide");
            self.props.toggleSnackbarAndSetText(true, err, false, true);
          } else {
            counter--;
            _.set(formData, key, res.files[0].fileStoreId);
            if (counter == 0 && breakOut == 0)
              self.makeAjaxCall(formData, _url);
          }
        });
      }
    }
  };

  initiateWF = (action, workflowItem, isHidden, status) => {
    let formData = { ...this.props.formData };
    if (!_.get(formData.workflowItem.jsonPath.objectPath)) {
      _.set(formData, workflowItem.jsonPath.objectPath, {});
    }

    if (!isHidden && !_.get(formData, workflowItem.jsonPath.assigneePath)) {
      return this.props.toggleSnackbarAndSetText(
        true,
        translate("wc.create.workflow.fields"),
        false,
        true
      );
    }

    if (
      action.key.toLowerCase() == "reject" &&
      !_.get(formData, workflowItem.commentsPath)
    ) {
      return this.props.toggleSnackbarAndSetText(
        true,
        translate("wc.create.workflow.comment"),
        false,
        true
      );
    }

    _.set(formData, workflowItem.jsonPath.actionPath, action.key);
    _.set(formData, workflowItem.jsonPath.statusPath, status);
    this.create();
  };

  create = e => {
    let self = this,
      _url;
    if (e) e.preventDefault();
    self.props.setLoadingStatus("loading");
    self.checkifHasInjectData(this.props.mockData);
    var formData = { ...this.props.formData };

    if (
      self.props.moduleName &&
      self.props.actionName &&
      self.props.metaData &&
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`]
        .tenantIdRequired
    ) {
      if (
        !formData[
        self.props.metaData[
          `${self.props.moduleName}.${self.props.actionName}`
        ].objectName
        ]
      )
        formData[
          self.props.metaData[
            `${self.props.moduleName}.${self.props.actionName}`
          ].objectName
        ] = {};

      if (
        formData[
          self.props.metaData[
            `${self.props.moduleName}.${self.props.actionName}`
          ].objectName
        ].constructor == Array
      ) {
        for (
          var i = 0;
          i <
          formData[
            self.props.metaData[
              `${self.props.moduleName}.${self.props.actionName}`
            ].objectName
          ].length;
          i++
        ) {
          formData[
            self.props.metaData[
              `${self.props.moduleName}.${self.props.actionName}`
            ].objectName
          ][i]["tenantId"] =
            localStorage.getItem("tenantId") || "default";
        }
      } else
        formData[
          self.props.metaData[
            `${self.props.moduleName}.${self.props.actionName}`
          ].objectName
        ]["tenantId"] =
          localStorage.getItem("tenantId") || "default";
    }

    if (
      /\{.*\}/.test(
        self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`]
          .url
      )
    ) {
      _url =
        self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`]
          .url;
      var match = _url.match(/\{.*\}/)[0];
      var jPath = match.replace(/\{|}/g, "");
      _url = _url.replace(match, _.get(formData, jPath));
    }

    //Check if documents, upload and get fileStoreId
    let formdocumentData =
      formData[
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`]
        .objectName
      ];
    let documentPath =
      self.props.metaData[`${self.props.moduleName}.${self.props.actionName}`]
        .documentsPath;
    formdocumentData =
      (formdocumentData && formdocumentData.length && formdocumentData[0]) ||
      formdocumentData;
    if (documentPath) {
      formdocumentData = _.get(formData, documentPath);
    }

    if (formdocumentData["documents"] && formdocumentData["documents"].length) {
      let documents = [...formdocumentData["documents"]];
      let _docs = [];
      let counter = documents.length,
        breakOut = 0;
      for (let i = 0; i < documents.length; i++) {
        if (documents[i]) {
          fileUpload(documents[i].fileStoreId, self.props.moduleName, function (
            err,
            res
          ) {
            if (breakOut == 1) return;
            if (err) {
              breakOut = 1;
              self.props.setLoadingStatus("hide");
              self.props.toggleSnackbarAndSetText(true, err, false, true);
            } else {

              _docs.push({
                index: i,
                ...documents[i],
                fileStoreId: res.files[0].fileStoreId
              });
              counter--;
              if (counter == 0 && breakOut == 0) {
                let sortedDocs = _.sortBy(_docs, "index", function (n) {
                  return Math.sin(n);
                });
                sortedDocs = sortedDocs.map(
                  ({ index, ...sortedDocs }) => sortedDocs
                );
                _docs = sortedDocs;
                formdocumentData["documents"] = _docs;
                self.checkForOtherFiles(formData, _url);
              }
            }
          });
        }
        else {

          counter--;
        }
      }
    } else {
      self.checkForOtherFiles(formData, _url);
    }
  };

  getVal = (path, dateBool) => {

    var _val = _.get(this.props.formData, path);
    if (dateBool && typeof _val == "string" && _val && _val.indexOf("-") > -1) {
      var _date = _val.split("-");
      return new Date(_date[0], Number(_date[1]) - 1, _date[2]);
    }

    return typeof _val != "undefined" ? _val : "";
  };

  setVal = (jsonPath, value) => {
    let formData = { ...this.props.formData };
    _.set(formData, jsonPath, value);
    this.props.setFormData(formData);
  };

  setPropertyInMockData = (obj, jsonPath, property, value) => {
    if (obj && obj.groups) {
      obj.groups.forEach(function (groupElem, groupInd) {
        if (groupElem.fields && groupElem.fields.length) {
          groupElem.fields.forEach(function (fieldElem, fieldInd) {
            if (jsonPath === fieldElem.jsonPath) {
              fieldElem[property] = value;
            }
          })
        }
      })
    }
  }

  getValFromDropdownData = (fieldJsonPath, key, path) => {
    let dropdownData = this.props.dropDownData[fieldJsonPath] || [];
    let _val = _.get(dropdownData.find(data => data.key == key) || [], path);
    return typeof _val != "undefined" ? _val : "";
  };

  hideField = (_mockData, hideObject, jsonPath, reset, val) => {
    let {
      moduleName,
      actionName,
      setFormData,
      delRequiredFields,
      removeFieldErrors,
      addRequiredFields
    } = this.props;
    let _formData = { ...this.props.formData };
    if (jsonPath != null) {
      var pathArr = jsonPath.split(".");
      pathArr.pop();
      pathArr.push(hideObject.name);
      jsonPath = pathArr.join(".");
    }
    if (hideObject.isField) {
      for (
        let i = 0;
        i < _mockData[moduleName + "." + actionName].groups.length;
        i++
      ) {
        for (
          let j = 0;
          j < _mockData[moduleName + "." + actionName].groups[i].fields.length;
          j++
        ) {
          //Extra check for multiple true
          if (
            hideObject.name ==
            _mockData[moduleName + "." + actionName].groups[i].fields[j]
              .name &&
            (_mockData[moduleName + "." + actionName].groups[i].multiple
              ? jsonPath ===
              _mockData[moduleName + "." + actionName].groups[i].fields[j]
                .jsonPath
              : true)
          ) {
            reset = this.resetCheck(_mockData, hideObject.name, val);
            _mockData[moduleName + "." + actionName].groups[i].fields[
              j
            ].hide = reset ? false : true;
            if (!reset) {
              _.set(
                _formData,
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath,
                ""
              );
              setFormData(_formData);
              //Check if required is true, if yes remove from required fields
              if (
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .isRequired
              ) {
                delRequiredFields([
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .jsonPath
                ]);
                removeFieldErrors(
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .jsonPath
                );
              }
            } else if (
              _mockData[moduleName + "." + actionName].groups[i].fields[j]
                .isRequired
            ) {
              addRequiredFields([
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath
              ]);
            }

            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (
        let i = 0;
        i < _mockData[moduleName + "." + actionName].groups.length;
        i++
      ) {
        if (
          hideObject.name ==
          _mockData[moduleName + "." + actionName].groups[i].name
        ) {
          flag = 1;

          reset = this.resetCheck(_mockData, hideObject.name, val);
          //console.log(hideObject.name,reset);
          _mockData[moduleName + "." + actionName].groups[i].hide = reset
            ? false
            : true;

          if (!reset) {
            var _rReq = [];
            for (
              var j = 0;
              j <
              _mockData[moduleName + "." + actionName].groups[i].fields.length;
              j++
            ) {
              _.set(
                _formData,
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath,
                ""
              );
              if (
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .isRequired
              ) {
                _rReq.push(
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .jsonPath
                );
                removeFieldErrors(
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .jsonPath
                );
              }
            }
            delRequiredFields(_rReq);
            setFormData(_formData);
          } else {
            var _rReq = [];
            for (
              var j = 0;
              j <
              _mockData[moduleName + "." + actionName].groups[i].fields.length;
              j++
            ) {
              if (
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .isRequired
              )
                _rReq.push(
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .jsonPath
                );
            }
            addRequiredFields(_rReq);
          }
          break;
        }
      }

      if (flag == 0) {
        for (
          let i = 0;
          i < _mockData[moduleName + "." + actionName].groups.length;
          i++
        ) {
          if (
            _mockData[moduleName + "." + actionName].groups[i].children &&
            _mockData[moduleName + "." + actionName].groups[i].children.length
          ) {
            for (
              let j = 0;
              j <
              _mockData[moduleName + "." + actionName].groups[i].children
                .length;
              j++
            ) {
              for (
                let k = 0;
                k <
                _mockData[moduleName + "." + actionName].groups[i].children[j]
                  .groups.length;
                k++
              ) {
                if (
                  hideObject.name ==
                  _mockData[moduleName + "." + actionName].groups[i].children[j]
                    .groups[k].name
                ) {
                  reset = this.resetCheck(_mockData, hideObject.name, val);
                  _mockData[moduleName + "." + actionName].groups[i].children[
                    j
                  ].groups[k].hide = reset ? false : true;
                  if (!reset) {
                    var _rReq = [];
                    for (
                      let a = 0;
                      a <
                      _mockData[moduleName + "." + actionName].groups[i]
                        .children[j].groups[k].fields.length;
                      a++
                    ) {
                      _.set(
                        _formData,
                        _mockData[moduleName + "." + actionName].groups[i]
                          .children[j].groups[k].fields[a].jsonPath,
                        ""
                      );
                      if (
                        _mockData[moduleName + "." + actionName].groups[i]
                          .children[j].groups[k].fields[a].isRequired
                      ) {
                        _rReq.push(
                          _mockData[moduleName + "." + actionName].groups[i]
                            .children[j].groups[k].fields[a].jsonPath
                        );
                        removeFieldErrors(
                          _mockData[moduleName + "." + actionName].groups[i]
                            .children[j].groups[k].fields[a].jsonPath
                        );
                      }
                    }
                    delRequiredFields(_rReq);
                    setFormData(_formData);
                  } else {
                    var _rReq = [];
                    for (
                      let a = 0;
                      a <
                      _mockData[moduleName + "." + actionName].groups[i]
                        .children[j].groups[k].fields.length;
                      a++
                    ) {
                      if (
                        _mockData[moduleName + "." + actionName].groups[i]
                          .children[j].groups[k].fields[a].isRequired
                      )
                        _rReq.push(
                          _mockData[moduleName + "." + actionName].groups[i]
                            .children[j].groups[k].fields[a].jsonPath
                        );
                    }
                    addRequiredFields(_rReq);
                  }
                }
              }
            }
          }
        }
      }
    }
    return _mockData;
  };

  resetCheck = (mockData, element, val) => {
    //let val = 'TEXT';
    // console.log('reset check here');
    let { moduleName, actionName, setMockData } = this.props;
    for (
      let i = 0;
      i < mockData[moduleName + "." + actionName].groups.length;
      i++
    ) {
      for (
        let j = 0;
        j < mockData[moduleName + "." + actionName].groups[i].fields.length;
        j++
      ) {
        if (
          mockData[moduleName + "." + actionName].groups[i].fields[j]
            .showHideFields
        ) {
          for (
            let k = 0;
            k <
            mockData[moduleName + "." + actionName].groups[i].fields[j]
              .showHideFields.length;
            k++
          ) {
            if (
              mockData[moduleName + "." + actionName].groups[i].fields[j]
                .showHideFields[k].ifValue
            ) {
              for (
                var l = 0;
                l <
                mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .showHideFields[k].hide.length;
                l++
              ) {
                if (
                  val ==
                  mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .showHideFields[k].ifValue &&
                  element ==
                  mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .showHideFields[k].hide[l].name
                ) {
                  return false;
                }
              }
              for (
                var l = 0;
                l <
                mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .showHideFields[k].show.length;
                l++
              ) {
                if (
                  val ==
                  mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .showHideFields[k].ifValue &&
                  element ==
                  mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .showHideFields[k].show[l].name
                ) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
  };

  showField = (_mockData, showObject, jsonPath, reset) => {
    if (jsonPath != null) {
      var pathArr = jsonPath.split(".");
      pathArr.pop();
      pathArr.push(showObject.name);
      jsonPath = pathArr.join(".");
    }
    let {
      moduleName,
      actionName,
      setFormData,
      delRequiredFields,
      removeFieldErrors,
      addRequiredFields
    } = this.props;
    let _formData = { ...this.props.formData };
    if (showObject.isField) {
      for (
        let i = 0;
        i < _mockData[moduleName + "." + actionName].groups.length;
        i++
      ) {
        for (
          let j = 0;
          j < _mockData[moduleName + "." + actionName].groups[i].fields.length;
          j++
        ) {
          //extra check required on jsonPath for duplicate fields in multiple true

          if (
            showObject.name ==
            _mockData[moduleName + "." + actionName].groups[i].fields[j]
              .name &&
            (_mockData[moduleName + "." + actionName].groups[i].multiple
              ? jsonPath ===
              _mockData[moduleName + "." + actionName].groups[i].fields[j]
                .jsonPath
              : true)
          ) {
            _mockData[moduleName + "." + actionName].groups[i].fields[
              j
            ].hide = reset ? true : false;
            if (!reset) {
              _.set(
                _formData,
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath,
                ""
              );
              setFormData(_formData);
              if (
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .isRequired
              ) {
                addRequiredFields([
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .jsonPath
                ]);
              }
            } else if (
              _mockData[moduleName + "." + actionName].groups[i].fields[j]
                .isRequired
            ) {
              delRequiredFields([
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath
              ]);
              removeFieldErrors(
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath
              );
            }
            break;
          }
        }
      }
    } else {
      let flag = 0;
      for (
        let i = 0;
        i < _mockData[moduleName + "." + actionName].groups.length;
        i++
      ) {
        if (
          showObject.name ==
          _mockData[moduleName + "." + actionName].groups[i].name
        ) {
          flag = 1;
          _mockData[moduleName + "." + actionName].groups[i].hide = reset
            ? true
            : false;
          if (!reset) {
            var _rReq = [];
            for (
              var j = 0;
              j <
              _mockData[moduleName + "." + actionName].groups[i].fields.length;
              j++
            ) {
              _.set(
                _formData,
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath,
                ""
              );
              if (
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .isRequired
              )
                _rReq.push(
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .jsonPath
                );
            }

            addRequiredFields(_rReq);
            setFormData(_formData);
          } else {
            var _rReq = [];
            for (
              var j = 0;
              j <
              _mockData[moduleName + "." + actionName].groups[i].fields.length;
              j++
            ) {
              if (
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .isRequired
              ) {
                _rReq.push(
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .jsonPath
                );
                removeFieldErrors(
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .jsonPath
                );
              }
            }

            if (
              _mockData[moduleName + "." + actionName].groups[i].children &&
              _mockData[moduleName + "." + actionName].groups[i].children.length
            ) {
              for (
                var z = 0;
                z <
                _mockData[moduleName + "." + actionName].groups[i].children
                  .length;
                z++
              ) {
                for (
                  var y = 0;
                  y <
                  _mockData[moduleName + "." + actionName].groups[i].children[z]
                    .groups.length;
                  y++
                ) {
                  for (
                    var x = 0;
                    x <
                    _mockData[moduleName + "." + actionName].groups[i].children[
                      z
                    ].groups[y].fields.length;
                    x++
                  ) {
                    if (
                      _mockData[moduleName + "." + actionName].groups[i]
                        .children[z].groups[y].fields[x].isRequired
                    ) {
                      _rReq.push(
                        _mockData[moduleName + "." + actionName].groups[i]
                          .children[z].groups[y].fields[x].jsonPath
                      );
                      removeFieldErrors(
                        _mockData[moduleName + "." + actionName].groups[i]
                          .children[z].groups[y].fields[x].jsonPath
                      );
                    }
                  }
                }
              }
            }

            delRequiredFields(_rReq);
          }
          break;
        }
      }

      if (flag == 0) {
        for (
          let i = 0;
          i < _mockData[moduleName + "." + actionName].groups.length;
          i++
        ) {
          if (
            _mockData[moduleName + "." + actionName].groups[i].children &&
            _mockData[moduleName + "." + actionName].groups[i].children.length
          ) {
            for (
              let j = 0;
              j <
              _mockData[moduleName + "." + actionName].groups[i].children
                .length;
              j++
            ) {
              for (
                let k = 0;
                k <
                _mockData[moduleName + "." + actionName].groups[i].children[j]
                  .groups.length;
                k++
              ) {
                if (
                  showObject.name ==
                  _mockData[moduleName + "." + actionName].groups[i].children[j]
                    .groups[k].name
                ) {
                  _mockData[moduleName + "." + actionName].groups[i].children[
                    j
                  ].groups[k].hide = reset ? true : false;
                  /*if(!reset) {

                  } else {

                  }*/
                }
              }
            }
          }
        }
      }
    }

    return _mockData;
  };

  // enField = (_mockData, enableStr, reset) => {
  //   let { moduleName, actionName, setFormData } = this.props;
  //   let _formData = { ...this.props.formData };
  //   for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
  //     for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
  //       if (enableStr == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
  //         _mockData[moduleName + '.' + actionName].groups[i].fields[j].isDisabled = reset ? true : false;
  //         if (!reset) {
  //           _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
  //           setFormData(_formData);
  //         }
  //         break;
  //       }
  //     }
  //   }

  //   return _mockData;
  // };

  // disField = (_mockData, disableStr, reset) => {
  //   let { moduleName, actionName, setFormData } = this.props;
  //   let _formData = { ...this.props.formData };
  //   for (let i = 0; i < _mockData[moduleName + '.' + actionName].groups.length; i++) {
  //     for (let j = 0; j < _mockData[moduleName + '.' + actionName].groups[i].fields.length; j++) {
  //       if (disableStr == _mockData[moduleName + '.' + actionName].groups[i].fields[j].name) {
  //         _mockData[moduleName + '.' + actionName].groups[i].fields[j].isDisabled = reset ? false : true;
  //         if (!reset) {
  //           _.set(_formData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, '');
  //           setFormData(_formData);
  //         }

  //         break;
  //       }
  //     }
  //   }

  //   return _mockData;
  // };

  enField = (_mockData, enableStr, reset, required = false) => {

    let { moduleName, actionName, setFormData } = this.props;
    let _formData = { ...this.props.formData };
    for (
      let i = 0;
      i < _mockData[moduleName + "." + actionName].groups.length;
      i++
    ) {
      for (
        let j = 0;
        j < _mockData[moduleName + "." + actionName].groups[i].fields.length;
        j++
      ) {
        if (
          _mockData[moduleName + "." + actionName].groups[i].fields[j].type ==
          "tableList"
        ) {
          for (
            let k = 0;
            j <
            _mockData[moduleName + "." + actionName].groups[i].fields[j]
              .tableList.values.length;
            k++
          ) {
            if (
              enableStr ==
              _mockData[moduleName + "." + actionName].groups[i].fields[j]
                .tableList.values[k].name
            ) {
              _mockData[moduleName + "." + actionName].groups[i].fields[
                j
              ].tableList.values[k].isDisabled = reset ? true : false;
              if (required) {
                _mockData[moduleName + "." + actionName].groups[i].fields[
                  j
                ].tableList.values[k].isRequired = reset ? false : true;
              }
              if (!reset) {
                _.set(
                  _formData,
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .tableList.values[k].jsonPath,
                  ""
                );
                setFormData(_formData);
              }
              break;
            }
          }
        } else {
          if (
            enableStr ==
            _mockData[moduleName + "." + actionName].groups[i].fields[j].name
          ) {
            _mockData[moduleName + "." + actionName].groups[i].fields[
              j
            ].isDisabled = reset ? true : false;
            if (!reset) {
              _.set(
                _formData,
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath,
                ""
              );
              setFormData(_formData);
            }
            break;
          }
        }
      }
    }
    return _mockData;
  };

  disField = (_mockData, disableStr, reset, required = false) => {

    let { moduleName, actionName, setFormData } = this.props;
    let _formData = { ...this.props.formData };
    for (
      let i = 0;
      i < _mockData[moduleName + "." + actionName].groups.length;
      i++
    ) {
      for (
        let j = 0;
        j < _mockData[moduleName + "." + actionName].groups[i].fields.length;
        j++
      ) {
        if (
          _mockData[moduleName + "." + actionName].groups[i].fields[j].type ==
          "tableList"
        ) {
          for (
            let k = 0;
            j <
            _mockData[moduleName + "." + actionName].groups[i].fields[j]
              .tableList.values.length;
            k++
          ) {
            if (
              disableStr ==
              _mockData[moduleName + "." + actionName].groups[i].fields[j]
                .tableList.values[k].name
            ) {
              _mockData[moduleName + "." + actionName].groups[i].fields[
                j
              ].tableList.values[k].isDisabled = reset ? false : true;
              if (required) {
                _mockData[moduleName + "." + actionName].groups[i].fields[
                  j
                ].tableList.values[k].isRequired = reset ? true : false;
              }
              if (!reset) {
                _.set(
                  _formData,
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .tableList.values[k].jsonPath,
                  ""
                );
                setFormData(_formData);
              }
              break;
            }
          }
        } else {
          if (
            disableStr ==
            _mockData[moduleName + "." + actionName].groups[i].fields[j].name
          ) {
            _mockData[moduleName + "." + actionName].groups[i].fields[
              j
            ].isDisabled = reset ? false : true;
            if (!reset) {
              _.set(
                _formData,
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath,
                ""
              );
              setFormData(_formData);
            }
            break;
          }
        }
      }
    }
    // console.log(_mockData);
    return _mockData;
  };

  checkIfHasEnDisFields = (jsonPath, val) => {
    let _mockData = { ...this.props.mockData };
    let { moduleName, actionName, setMockData } = this.props;
    for (
      let i = 0;
      i < _mockData[moduleName + "." + actionName].groups.length;
      i++
    ) {
      for (
        let j = 0;
        j < _mockData[moduleName + "." + actionName].groups[i].fields.length;
        j++
      ) {
        if (
          jsonPath ==
          _mockData[moduleName + "." + actionName].groups[i].fields[j]
            .jsonPath &&
          _mockData[moduleName + "." + actionName].groups[i].fields[j]
            .enableDisableFields &&
          _mockData[moduleName + "." + actionName].groups[i].fields[j]
            .enableDisableFields.length
        ) {
          for (
            let k = 0;
            k <
            _mockData[moduleName + "." + actionName].groups[i].fields[j]
              .enableDisableFields.length;
            k++
          ) {
            if (
              val ==
              _mockData[moduleName + "." + actionName].groups[i].fields[j]
                .enableDisableFields[k].ifValue
            ) {
              for (
                let y = 0;
                y <
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .enableDisableFields[k].disable.length;
                y++
              ) {
                _mockData = this.disField(
                  _mockData,
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .enableDisableFields[k].disable[y]
                );
              }

              for (
                let z = 0;
                z <
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .enableDisableFields[k].enable.length;
                z++
              ) {
                _mockData = this.enField(
                  _mockData,
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .enableDisableFields[k].enable[z]
                );
              }
            }
            //  else {
            //   console.log(_mockData[moduleName + "." + actionName].groups[i].fields[j].enableDisableFields[k].disable, _mockData[moduleName + "." + actionName].groups[i].fields[j].enableDisableFields[k].enable)
            //   for(let y=0; y<_mockData[moduleName + "." + actionName].groups[i].fields[j].enableDisableFields[k].disable.length; y++) {
            //     _mockData = this.disField(_mockData, _mockData[moduleName + "." + actionName].groups[i].fields[j].enableDisableFields[k].disable[y], true);
            //   }

            //   for(let z=0; z<_mockData[moduleName + "." + actionName].groups[i].fields[j].enableDisableFields[k].enable.length; z++) {
            //     _mockData = this.enField(_mockData, _mockData[moduleName + "." + actionName].groups[i].fields[j].enableDisableFields[k].enable[z], true);
            //   }
            // }
          }
        }
      }
    }

    setMockData(_mockData);
  };

  checkIfHasShowHideFields = (jsonPath, val) => {
    let _mockData = { ...this.props.mockData };
    let { moduleName, actionName, setMockData } = this.props;
    for (
      let i = 0;
      i < _mockData[moduleName + "." + actionName].groups.length;
      i++
    ) {
      for (
        let j = 0;
        j < _mockData[moduleName + "." + actionName].groups[i].fields.length;
        j++
      ) {
        if (
          jsonPath ==
          _mockData[moduleName + "." + actionName].groups[i].fields[j]
            .jsonPath &&
          _mockData[moduleName + "." + actionName].groups[i].fields[j]
            .showHideFields &&
          _mockData[moduleName + "." + actionName].groups[i].fields[j]
            .showHideFields.length
        ) {
          for (
            let k = 0;
            k <
            _mockData[moduleName + "." + actionName].groups[i].fields[j]
              .showHideFields.length;
            k++
          ) {
            if (
              val ==
              _mockData[moduleName + "." + actionName].groups[i].fields[j]
                .showHideFields[k].ifValue
            ) {
              for (
                let y = 0;
                y <
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .showHideFields[k].hide.length;
                y++
              ) {
                _mockData = this.hideField(
                  _mockData,
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .showHideFields[k].hide[y],
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .jsonPath,
                  false,
                  val
                );
              }

              for (
                let z = 0;
                z <
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .showHideFields[k].show.length;
                z++
              ) {
                _mockData = this.showField(
                  _mockData,
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .showHideFields[k].show[z],
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .jsonPath
                );
              }
            } else {
              for (let y = 0; y < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide.length; y++) {
                _mockData = this.hideField(
                  _mockData,
                  _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].hide[y],
                  _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath,
                  true,
                  val
                );
              }

              for (let z = 0; z < _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show.length; z++) {
                _mockData = this.showField(_mockData, _mockData[moduleName + '.' + actionName].groups[i].fields[j].showHideFields[k].show[z], _mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath, true);
              }
            }
          }
        }
      }
    }
    setMockData(_mockData);
  };

  checkifHasValueBasedOn = (jsonPath, val) => {
    let _mockData = { ...this.props.mockData };
    let { formData } = this.props;
    let { moduleName, actionName, setMockData } = this.props;
    for (
      let i = 0;
      i < _mockData[moduleName + "." + actionName].groups.length;
      i++
    ) {
      for (
        let j = 0;
        j < _mockData[moduleName + "." + actionName].groups[i].fields.length;
        j++
      ) {
        if (
          _mockData[moduleName + "." + actionName].groups[i].fields[j]
            .valueBasedOn &&
          _mockData[moduleName + "." + actionName].groups[i].fields[j]
            .valueBasedOn.length
        ) {
          for (
            let k = 0;
            k <
            _mockData[moduleName + "." + actionName].groups[i].fields[j]
              .valueBasedOn.length;
            k++
          ) {
            if (
              this.getVal(
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .valueBasedOn[k].jsonPath
              )
            ) {
              _.set(
                formData,
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath,
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .valueBasedOn[k].valueIfDataFound
              );
            } else {
              _.set(
                formData,
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .jsonPath,
                !_mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .valueBasedOn[k].valueIfDataFound
              );
              _.set(
                formData,
                _mockData[moduleName + "." + actionName].groups[i].fields[j]
                  .valueBasedOn[k].jsonPath,
                ""
              );
            }
          }
        }
      }
    }
    setMockData(_mockData);
  };

  // require func.

  reqField = (_mockData, enableStr, reset) => {
    let { moduleName, actionName, setFormData, addRequiredFields, delRequiredFields } = this.props;
    let _formData = { ...this.props.formData };
    for (
      let i = 0;
      i < _mockData[moduleName + "." + actionName].groups.length;
      i++
    ) {
      for (
        let j = 0;
        j < _mockData[moduleName + "." + actionName].groups[i].fields.length;
        j++
      ) {
        if (
          enableStr.name ==
          _mockData[moduleName + "." + actionName].groups[i].fields[j].name
        ) {
          _mockData[moduleName + "." + actionName].groups[i].fields[
            j
          ].isRequired = reset ? true : false;
          if (reset) {
            addRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
          } else {
            delRequiredFields([_mockData[moduleName + '.' + actionName].groups[i].fields[j].jsonPath]);
          }
          break;
        }
      }
    }
    return _mockData;
  };

  checkIfHasReqFields = (jsonPath, val) => {
    let { setFormData } = this.props;
    let _mockData = { ...this.props.mockData };
    let formData = { ...this.props.formData };
    let { moduleName, actionName, setMockData } = this.props;
    for (
      let i = 0;
      i < _mockData[moduleName + "." + actionName].groups.length;
      i++
    ) {
      for (
        let j = 0;
        j < _mockData[moduleName + "." + actionName].groups[i].fields.length;
        j++
      ) {
        if (
          jsonPath ==
          _mockData[moduleName + "." + actionName].groups[i].fields[j]
            .jsonPath &&
          _mockData[moduleName + "." + actionName].groups[i].fields[j]
            .reqNotReqFields &&
          _mockData[moduleName + "." + actionName].groups[i].fields[j]
            .reqNotReqFields.length
        ) {
          for (
            let k = 0;
            k <
            _mockData[moduleName + "." + actionName].groups[i].fields[j]
              .reqNotReqFields.length;
            k++
          ) {
            if (_.isArray(val)) {
              if (
                _.includes(
                  val,
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .reqNotReqFields[k].ifValue
                )
              ) {
                for (
                  let y = 0;
                  y <
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .reqNotReqFields[k].require.length;
                  y++
                ) {
                  _mockData = this.reqField(
                    _mockData,
                    _mockData[moduleName + "." + actionName].groups[i].fields[j]
                      .reqNotReqFields[k].require[y],
                    true
                  );
                }
              } else {
                for (
                  let y = 0;
                  y <
                  _mockData[moduleName + "." + actionName].groups[i].fields[j]
                    .reqNotReqFields[k].require.length;
                  y++
                ) {
                  _mockData = this.reqField(
                    _mockData,
                    _mockData[moduleName + "." + actionName].groups[i].fields[j]
                      .reqNotReqFields[k].require[y],
                    false
                  );
                }
              }
            }
          }
        }
      }
    }
    setMockData(_mockData);
  };

  //require func.

  makeAPICallGetResponse = (urlWithJsonPath, isStateLevel) => {
    let urlResults = urlWithJsonPath.split(/\|/g);
    let params = urlResults[0].match(/\{(.*?)\}/g);

    for (let i = 0; i < params.length; i++)
      urlResults[0] = urlResults[0].replace(
        params[i],
        this.getVal(params[i].replace(/(\}?)(\{?)/, ""))
      );

    return new Promise(function (resolve, reject) {
      Api.commonApiPost(
        urlResults[0],
        {},
        {},
        false,
        false,
        false,
        "",
        "",
        isStateLevel
      ).then(
        function (response) {
          if (response) {
            resolve(jp.query(response, urlResults[1]));
          } else {
            reject("Error");
          }
        },
        function (error) {
          reject("Error");
        }
        );
    });
  };

  affectDependants = (obj, e, property) => {
    let self = this;
    let {
      handleChange,
      setDropDownData,
      setDropDownOriginalData,
      dropDownOringalData,
      delRequiredFields,
      removeFieldErrors,
      addRequiredFields,
      formData,
      mockData,
      moduleName,
      actionName
    } = this.props;
    let {
      getVal,
      setVal,
      getValFromDropdownData,
      returnPathValueFunction,
      enField,
      disField,
      confirm
    } = this;

    const findLastIdxOnJsonPath = jsonPath => {
      var str = jsonPath.split(REGEXP_FIND_IDX);
      for (let i = str.length - 1; i > -1; i--) {
        if (str[i].match(/\d+/)) {
          return str[i];
        }
      }
      return undefined;
    };

    const replaceLastIdxOnJsonPath = (jsonPath, replaceIdx) => {
      var str = jsonPath.split(REGEXP_FIND_IDX);
      var isReplaced = false;
      for (let i = str.length - 1; i > -1; i--) {
        if (str[i].match(/\d+/)) {
          if (!isReplaced) {
            isReplaced = true;
            str[i] = `[${replaceIdx}]`;
          } else str[i] = `[${str[i]}]`;
        }
      }
      return str.join("");
    };

    let depedants = jp.query(
      mockData[moduleName + "." + actionName],
      `$.groups..fields[?(@.jsonPath=="${property}")].depedants.*`
    );
    let dependantIdx;
    if (depedants.length === 0 && property) {
      let currentProperty = property;
      dependantIdx = findLastIdxOnJsonPath(property);
      if (dependantIdx !== undefined)
        currentProperty = replaceLastIdxOnJsonPath(property, 0); //RESET INDEX 0 TO FIND DEPENDANT FIELDS FROM TEMPLATE JSON
      depedants = jp.query(
        obj,
        `$.groups..fields[?(@.type=="tableList")].tableList.values[?(@.jsonPath == "${currentProperty}")].depedants.*`
      );
    }
    if (property) {
      //Changes to handle table sum
      var jpathname =
        property.substr(0, property.lastIndexOf("[") + 1) +
        "0" +
        property.substr(property.lastIndexOf("[") + 2);

      var dependency = jp.query(
        obj,
        `$.groups..values[?(@.jsonPath=="${jpathname}")].dependency`
      );
      if (dependency.length > 0) {
        let _formData = {
          ...this.props.formData
        };
        if (_formData) {
          let impactField = "";
          let dfieldname, cfieldname;
          if (dependency[0].indexOf(":") > 0) {
            let fields = dependency[0].split(":");
            let dfield = fields[0];
            let cfield = fields[1];
            impactField = dfield;
            if (dfield) dfieldname = dfield.substr(dfield.lastIndexOf("]") + 2);
            if (cfield) cfieldname = cfield.substr(cfield.lastIndexOf("]") + 2);
          } else {
            impactField = dependency[0];
          }
          let field = property.substr(0, property.lastIndexOf("["));
          let last = property.substr(property.lastIndexOf("]") + 2);
          let curIndex = property.substr(property.lastIndexOf("[") + 1, 1);

          let arrval = _.get(_formData, field);
          if (arrval) {
            let len = _.get(_formData, field).length;

            let amtsum = 0;
            let svalue = "";
            for (var i = 0; i < len; i++) {
              let ifield = field + "[" + i + "]" + "." + last;
              let multiplier = 1;
              let product = 1;
              if (cfieldname) {
                let ifield2 = field + "[" + i + "]" + "." + cfieldname;
                let pmultiplier = _.get(_formData, ifield2);
                if (pmultiplier) multiplier = parseInt(pmultiplier);
                else multiplier = 0;
              }
              if (i == curIndex) {
                svalue = e.target.value;
              } else {
                svalue = _.get(_formData, ifield);
              }
              product = parseInt(svalue) * multiplier;
              // amtsum += parseInt(svalue);
              amtsum += product;
            }
            if (amtsum > 0) {
              handleChange(
                {
                  target: {
                    value: amtsum
                  }
                },
                // dependency[0],
                impactField,
                false,
                "",
                ""
              );
            }
          }
        }
      }
    }

    _.forEach(depedants, function (value, key) {
      //console.log(value.type);
      if (value.type == "dropDown") {
        let isEmpty = true;
        let splitArray = value.pattern.split("?");
        let context = "";
        let id = {};
        for (var j = 0; j < splitArray[0].split("/").length; j++) {
          context += splitArray[0].split("/")[j] + "/";
        }

        let queryStringObject = splitArray[1].split("|")[0].split("&");
        for (var i = 0; i < queryStringObject.length; i++) {
          if (i) {
            if (queryStringObject[i].split("=")[1].search("{") > -1) {
              if (
                queryStringObject[i]
                  .split("=")[1]
                  .split("{")[1]
                  .split("}")[0] == property
              ) {
                //console.log("replacing!!!", queryStringObject[i].split("=")[1], queryStringObject[i].split("=")[1].replace(/\{(.*?)\}/, e.target.value))
                id[queryStringObject[i].split("=")[0]] =
                  queryStringObject[i]
                    .split("=")[1]
                    .replace(/\{(.*?)\}/, e.target.value) || "";
              } else {
                let filterParameter = queryStringObject[i]
                  .split('=')[1]
                  .split('{')[1]
                  .split('}')[0];
                if (value.indexReplace) {
                  if (dependantIdx && dependantIdx != 0) {
                    filterParameter = replaceLastIdxOnJsonPath(filterParameter, dependantIdx);
                    value.jsonPath = replaceLastIdxOnJsonPath(value.jsonPath, dependantIdx);
                  }
                }
                id[queryStringObject[i].split("=")[0]] = queryStringObject[i].split("=")[1].replace(/\{(.*?)\}/,getVal(filterParameter));
                if (queryStringObject[i].split("=")[1].replace(/\{(.*?)\}/,getVal(filterParameter)) == "") {
                  isEmpty=false;
                }
              }
            }
            else {
              id[queryStringObject[i].split("=")[0]] = queryStringObject[i].split("=")[1];
            }
          }
        }

        if (isEmpty) {
          Api.commonApiPost( context, id, {}, false, false, false, "", "", value.isStateLevel).then(
            function (response) {
              if (response) {
                // console.log('In dropdown');
                // console.log(response);
                let keys = jp.query(response, splitArray[1].split("|")[1]);
                let values = jp.query(response, splitArray[1].split("|")[2]);
                let dropDownData = [];
                for (var k = 0; k < keys.length; k++) {
                  if (keys[k]) {
                    let obj = {};
                    obj["key"] = keys[k];
                    obj["value"] = values[k];
                    dropDownData.push(obj);
                  }
                }

                dropDownData.sort(function (s1, s2) {
                  return s1.value < s2.value ? -1 : s1.value > s2.value ? 1 : 0;
                });
                // if (value.autoSelect) {
                //   //First value to be selected
                // } else {
                //   dropDownData.unshift({
                //     key: null,
                //     value: "-- Please Select --"
                //   });
                // }

                const updateDropDownData = (value, i) => {
                  value.jsonPath = replaceLastIdxOnJsonPath(value.jsonPath, i);
                  setDropDownData(value.jsonPath, dropDownData);
                  setDropDownOriginalData(value.jsonPath, response);
                  if (value.autoSelect) {
                    setVal(value.jsonPath, dropDownData[0]);
                  }
                }

                //to handle tableList dropdown
                let currProperty = value.jsonPath;
                let rootProperty = currProperty.substr(
                  0,
                  currProperty.lastIndexOf("[")
                );
                let numberOfRowsArray = _.get(formData, currProperty);
                var isTableList = false;
                for(var i=0; i<mockData[moduleName+'.'+actionName].groups.length; i++) {
                  for(var j=0; j<mockData[moduleName+'.'+actionName].groups[i].fields.length; j++) {
                    if((mockData[moduleName+'.'+actionName].groups[i].fields[j].type == 'tableListTemp'
                    || mockData[moduleName+'.'+actionName].groups[i].fields[j].type == 'tableList')
                    && JSON.stringify(mockData[moduleName+'.'+actionName].groups[i].fields[j]).includes(currProperty)) {
                      isTableList = true;
                    }
                  }
                }
                if (isTableList && numberOfRowsArray && numberOfRowsArray.length > 0) {
                  if (value.indexReplace) {
                    updateDropDownData(value, dependantIdx);
                  } else {
                    for (let i = 0; i < numberOfRowsArray.length; i++) {
                      updateDropDownData(value, i);
                    }
                  }
                } else {
                  setDropDownData(value.jsonPath, dropDownData);
                  setDropDownOriginalData(value.jsonPath, response);
                  if (value.autoSelect) {
                    setVal(value.jsonPath, dropDownData[0]);
                  }
                }
              }
            },
            function (err) {
              // console.log(err);
              setDropDownData(value.jsonPath, []);
              setDropDownOriginalData(value.jsonPath, []);
              self.props.toggleSnackbarAndSetText(true, err.message);
            }
          );
        }

      } else if (value.type == "textField") {
        try {
          let object = {};
          if (!value.hasFromDropDownOriginalData || value.url) {
            let exp = value.valExp;

            if (dependantIdx) {
              value.jsonPath = replaceLastIdxOnJsonPath(
                value.jsonPath,
                dependantIdx
              );
              exp = exp && exp.replace(/\[\*\]/g, "[" + dependantIdx + "]");
              value.pattern =
                value.pattern &&
                value.pattern.replace(/\[\*\]/g, "[" + dependantIdx + "]");

              if (exp.indexOf('getValFromDropdownData') < 0) {
                value.pattern = exp;
                exp = '';

              }

            }

            let ajaxResult;
            if (value.url) {
              ajaxResult = this.makeAPICallGetResponse(value.url);
            }
            let xt = eval(value.pattern);
            object = {
              target: {
                value:
                  (ajaxResult && ajaxResult) ||
                  (exp && eval(exp)) ||
                  eval(eval(value.pattern))
              }
            };
            console.log(object);
          } else {
            // console.log(dropDownOringalData);
            // console.log(value.pattern);
            // console.log(dropDownOringalData[value.pattern.split("|")[0]][value.pattern.split("|")[1]]);
            var arr =
              dropDownOringalData[value.pattern.split("|")[0]][
              value.pattern.split("|")[1]
              ];
            var searchPropery = value.pattern.split("|")[2];
            var propertyRelToDepedant = value.pattern.split("|")[3];
            object = {
              target: {
                value: ""
              }
            };
            for (var i = 0; i < arr.length; i++) {
              if (arr[i][searchPropery] == e.target.value) {
                object.target.value = arr[i][propertyRelToDepedant];
              }
            }
          }

          handleChange(object, value.jsonPath, "", "", "", "");
          if (value.dependentFlag)
            self.affectDependants(obj, object, value.jsonPath);
        } catch (ex) {
          console.log("ex", ex);
        }
      } else if (value.type == "autoFill") {
        let splitArray = value.pattern.split("?");
        let context = "";
        let id = {};
        for (var j = 0; j < splitArray[0].split("/").length; j++) {
          context += splitArray[0].split("/")[j] + "/";
        }

        let queryStringObject = splitArray[1].split("|")[0].split("&");
        for (var i = 0; i < queryStringObject.length; i++) {
          if (i) {
            if (queryStringObject[i].split("=")[1].search("{") > -1) {
              if (
                queryStringObject[i]
                  .split("=")[1]
                  .split("{")[1]
                  .split("}")[0] == property
              ) {
                id[queryStringObject[i].split("=")[0]] = e.target.value || "";
              } else {
                // id[queryStringObject[i].split("=")[0]] = getVal(
                //   replaceLastIdxOnJsonPath(
                //     queryStringObject[1]
                //       .split("=")[1]
                //       .split("{")[1]
                //       .split("}")[0],
                //     dependantIdx
                //   )
                // );
                let filterParameter = queryStringObject[i]
                  .split('=')[1]
                  .split('{')[1]
                  .split('}')[0];

                if (dependantIdx && dependantIdx != 0 && filterParameter.indexOf('[') != filterParameter.lastIndexOf('[')) {
                  filterParameter = replaceLastIdxOnJsonPath(filterParameter, dependantIdx);
                  value.jsonPath = replaceLastIdxOnJsonPath(value.jsonPath, dependantIdx);
                }

                id[queryStringObject[i].split("=")[0]] =
                  queryStringObject[i].split("=")[1].replace(
                    /\{(.*?)\}/,
                    getVal(
                      filterParameter
                    )
                  ) || "";
              }
            } else {
              id[queryStringObject[i].split("=")[0]] = queryStringObject[
                i
              ].split("=")[1];
            }
          }
        }
        Api.commonApiPost(context, id).then(
          function (response) {
            let fields = jp.query(
              obj,
              `$.groups..fields[?(@.hasATOAATransform==true)]`
            );

            if (response) {
              if (fields && fields.length > 0) {
                let splitArray = value.pattern.split('?');
                for (var i = 0; i < fields.length; i++) {
                  if (!fields[i].hasPreTransform) {
                    var keys = Object.keys(value.autoFillFields);
                    let values = _.get(response, value.autoFillFields[keys[0]]);
                    console.log(values);
                    let keysArray = jp.query(values, splitArray[1].split('|')[1]);
                    let valuesArray = jp.query(values, splitArray[1].split('|')[2]);
                    let dropDownData = [];
                    for (var k = 0; k < keysArray.length; k++) {
                      let dropdownObject = {};
                      dropdownObject['key'] = value.convertToString ? keysArray[k].toString() : value.convertToNumber ? Number(keysArray[k]) : keysArray[k];
                      dropdownObject['value'] = valuesArray[k];
                      dropDownData.push(dropdownObject);
                    }

                    dropDownData.sort(function (s1, s2) {
                      return s1.value < s2.value ? -1 : s1.value > s2.value ? 1 : 0;
                    });

                    setDropDownData(value.jsonPath, dropDownData);

                  }
                }

              }
              else {
                for (var key in value.autoFillFields) {
                  var keyField = key.substr(0, key.lastIndexOf("["));
                  var keyLast = key.substr(key.lastIndexOf("]") + 2);
                  var propertyCurIndex = property.substr(
                    property.lastIndexOf("[") + 1,
                    1
                  );
                  var newKey = keyField + "[" + propertyCurIndex + "]." + keyLast;
                  handleChange(
                    {
                      target: {
                        value: _.get(response, value.autoFillFields[key])
                      }
                    },
                    newKey,
                    false,
                    "",
                    ""
                  );
                }
              }
            }
          },
          function (err) {
            console.log(err);
          }
        );
      } else if (value.type == "radio") {
        if (value.hasFromDropDownOriginalData) {
          var arr =
            dropDownOringalData[value.pattern.split("|")[0]][
            value.pattern.split("|")[1]
            ];
          var searchPropery = value.pattern.split("|")[2];
          var propertyRelToDepedant = value.pattern.split("|")[3];
          var object = {
            target: {
              value: ""
            }
          };
          for (var i = 0; i < arr.length; i++) {
            if (arr[i][searchPropery] == e.target.value) {
              object.target.value = arr[i][propertyRelToDepedant];
            }
          }

          handleChange(object, value.jsonPath, "", "", "", "");
        }
      } else if (value.type == "tableList") {
        //handle grid dependency
        //  console.log(value);
        let object = {
          target: {
            value: ""
          }
        };
        let currProperty = value.jsonPath;
        let rootProperty = currProperty.substr(
          0,
          currProperty.lastIndexOf("[")
        );
        var numberOfRowsArray = _.get(formData, rootProperty);

        if (e.target.value == value.pattern) {
          disField(mockData, value.name, true, true);
          addRequiredFields([currProperty]);
        } else {
          enField(mockData, value.name, true, true);

          if (numberOfRowsArray) {
            if (numberOfRowsArray.length > 0) {
              for (let i = 0; i < numberOfRowsArray.length; i++) {
                value.jsonPath = replaceLastIdxOnJsonPath(value.jsonPath, i);
                handleChange(object, value.jsonPath, "", "", "", "");
              }
            } else {
              handleChange(object, currProperty, "", "", "", "");
            }
            delRequiredFields([currProperty]);
          }
        }
      } else if (value.type == "griddropDown") {
        let level = value.gridjsonPath;
        dependantIdx = findLastIdxOnJsonPath(property);
        if (level == undefined) {
          let splitArray = value.pattern.split("?");
          let context = "";
          let id = {};
          for (var j = 0; j < splitArray[0].split("/").length; j++) {
            context += splitArray[0].split("/")[j] + "/";
          }
          let dataFlag = 0;
          let queryStringObject = splitArray[1].split("|")[0].split("&");
          for (var i = 0; i < queryStringObject.length; i++) {
            if (i) {
              if (queryStringObject[i].split("=")[1].search("{") > -1) {
                if (
                  queryStringObject[i]
                    .split("=")[1]
                    .split("{")[1]
                    .split("}")[0] == property
                ) {
                  //console.log("replacing!!!", queryStringObject[i].split("=")[1], queryStringObject[i].split("=")[1].replace(/\{(.*?)\}/, e.target.value))
                  id[queryStringObject[i].split("=")[0]] =
                    queryStringObject[i]
                      .split("=")[1]
                      .replace(/\{(.*?)\}/, e.target.value) || "";
                } else {

                  let filterParameter = queryStringObject[i]
                    .split('=')[1]
                    .split('{')[1]
                    .split('}')[0];

                  if (dependantIdx && dependantIdx != 0 && filterParameter.indexOf('[') != filterParameter.lastIndexOf('[')) {
                    filterParameter = replaceLastIdxOnJsonPath(filterParameter, dependantIdx);
                    value.jsonPath = replaceLastIdxOnJsonPath(value.jsonPath, dependantIdx);
                  }

                  id[queryStringObject[i].split("=")[0]] =
                    queryStringObject[i].split("=")[1].replace(
                      /\{(.*?)\}/,
                      getVal(
                        filterParameter
                      )
                    ) || "";

                  if (id[queryStringObject[i].split("=")[0]] == "") {
                    dataFlag = 1;
                    break;
                  }
                }
              } else {
                id[queryStringObject[i].split("=")[0]] = queryStringObject[
                  i
                ].split("=")[1];
              }
            }
          }

          if (dataFlag == 0) {
            Api.commonApiPost(
              context,
              id,
              {},
              false,
              false,
              false,
              "",
              "",
              value.isStateLevel
            ).then(
              function (response) {
                if (response) {
                  console.log('In dropdown');
                  console.log(response);
                  let queries = splitArray[1].split("|");
                  let keys = jp.query(response, splitArray[1].split("|")[1]);
                  let values = jp.query(response, splitArray[1].split("|")[2]);
                  let others = [];
                  if (queries.length > 3) {
                    for (let i = 3; i < queries.length; i++) {
                      let oVal = jp.query(
                        response,
                        splitArray[1].split("|")[i]
                      );
                      others.push(oVal);
                    }
                  }

                  let dropDownData = [];
                  for (let t = 0; t < keys.length; t++) {
                    let obj = {};
                    obj["key"] = keys[t];
                    obj["value"] = values[t];

                    if (others && others.length > 0) {
                      let otherItemDatas = [];
                      for (let i = 0; i < others.length; i++) {
                        otherItemDatas.push(others[i][t] || undefined);
                      }
                      obj["others"] = otherItemDatas;
                      dropDownData.push(obj);
                    }
                  }

                  if (dropDownData.length > 0) {
                    if (dependantIdx !== undefined)
                      value.jsonPath = replaceLastIdxOnJsonPath(
                        value.jsonPath,
                        dependantIdx
                      );

                    setDropDownData(value.jsonPath, dropDownData);
                    setDropDownOriginalData(value.jsonPath, response);
                    if (value.autoSelect) {
                      // setVal(value.jsonPath,dropDownData[0]);
                      let cVal = {
                        target: {
                          value: dropDownData[0].value
                        }
                      };
                      handleChange(cVal, value.jsonPath, "", "", "");
                      self.affectDependants(obj, cVal, value.jsonPath);
                    }
                  }
                }
              },
              function (err) {
                console.log(err);
              }
              );
          }
        } else {
          //to handle tableList dropdown
          let _currProperty = value.gridjsonPath;
          let _rootProperty = _currProperty.substr(
            0,
            _currProperty.lastIndexOf("[")
          );
          let origValue = _.get(formData, property);
          let _numberOfRowsArray = _.get(formData, _rootProperty);
          if (_numberOfRowsArray && _numberOfRowsArray.length > 0) {
            confirm("This will reset all rates. Do you wish to Continue?").then(
              () => {
                console.log("proceed!");
                for (let i = 0; i < _numberOfRowsArray.length; i++) {
                  value.gridjsonPath = replaceLastIdxOnJsonPath(
                    value.gridjsonPath,
                    i
                  );
                  let currVal = _.get(formData, value.gridjsonPath);

                  let cVal = {
                    target: {
                      value: currVal
                    }
                  };
                  console.log(self);
                  self.affectDependants(obj, cVal, value.gridjsonPath);
                }
              },
              () => {
                console.log("cancel!");
                handleChange(
                  {
                    target: {
                      value: origValue
                    }
                  },
                  property, //need to get old value
                  "",
                  "",
                  ""
                );
              }
            );
          }
        }
      }
      // else if (value.type == "autoFillBody") {
      //   let context = value.pattern;
      //   let requestName = value.paramName;
      //   let requestBody = {};
      //   let temp = {};
      //   let x= value.bodyParams;
      //   dependantIdx = findLastIdxOnJsonPath(property);
      //   for(let i=0;i<x.length;i++){
      //           if(x[i].value.indexOf("[") > -1){
      //             let filterParameter= x[i].value;
      //              if(dependantIdx&&dependantIdx!=0 && filterParameter.indexOf('[') != filterParameter.lastIndexOf('[')){
      //               filterParameter=replaceLastIdxOnJsonPath(filterParameter,dependantIdx);
      //               value.jsonPath=replaceLastIdxOnJsonPath(value.jsonPath,dependantIdx);
      //             }
      //             x[i].value= getVal(filterParameter);
      //           }
      //           _.set(temp,x[i].key,x[i].value);
      //         }
      //          console.log("in body");
      //         console.log(temp);
      //       _.set(requestBody,requestName,temp);
      //  Api.commonApiPost(
      //       context,
      //       {},
      //       requestBody,
      //       false
      //     ).then(
      //     function(response) {
      //       if (response) {
      //         for (var key in value.autoFillFields) {
      //           var keyField = key.substr(0, key.lastIndexOf("["));
      //           var keyLast = key.substr(key.lastIndexOf("]") + 2);
      //           var propertyCurIndex = property.substr(
      //             property.lastIndexOf("[") + 1,
      //             1
      //           );
      //           var newKey = keyField + "[" + propertyCurIndex + "]." + keyLast;
      //           handleChange(
      //             {
      //               target: {
      //                 value: _.get(response, value.autoFillFields[key])
      //               }
      //             },
      //             newKey,
      //             false,
      //             "",
      //             ""
      //           );
      //         }
      //       }
      //     },
      //     function(err) {
      //       console.log(err);
      //     }
      //   );
      // }
      // else if (value.type == "documentList") {
      //
      //   let splitArray = value.pattern.split("?");
      //   let context = "";
      //   let id = {};
      //   for (var j = 0; j < splitArray[0].split("/").length; j++) {
      //     context+=splitArray[0].split("/")[j]+"/";
      //   }
      //
      //
      //   let queryStringObject=splitArray[1].split("|")[0].split("&");
      //   for (var i = 0; i < queryStringObject.length; i++) {
      //     if (i) {
      //       if (queryStringObject[i].split("=")[1].search("{")>-1) {
      //         if (queryStringObject[i].split("=")[1].split("{")[1].split("}")[0]==property) {
      //           id[queryStringObject[i].split("=")[0]] = e.target.value || "";
      //         } else {
      //           console.log(queryStringObject[i].split("=")[1].split("{")[1].split("}")[0]);
      //           id[queryStringObject[i].split("=")[0]] = e.target.value;//getVal(queryStringObject[i].split("=")[1].split("{")[1].split("}")[0]);
      //         }
      //       } else {
      //         id[queryStringObject[i].split("=")[0]] = queryStringObject[i].split("=")[1];
      //       }
      //     }
      //   }
      //
      //
      //   Api.commonApiPost(context, id).then(function(response) {
      //     if(response) {
      //       //console.log(item);
      //       var documents = [];
      // 			//console.log(this.props);
      //       //let {documentList, useTimestamp, handler} = props;
      //       for (var k = 0; k < response.length; k++) {
      //
      //         var temp = {
      // 					"fileStoreId": "",
      // 					"displayName": response[k].name,
      // 					"name": ""
      // 				};
      //
      //         documents.push(temp);
      //       }
      //       handleChange({target: {value: documents}}, value.jsonPath, false, '');
      //
      //       //handleChange({target: {value: temp}}, value.jsonPath, false, '', '');
      //     }
      //   },function(err) {
      //       console.log(err);
      //   });
      //   // var arr=dropDownOringalData[value.pattern.split("|")[0]][value.pattern.split("|")[1]];
      //   // var searchPropery=value.pattern.split("|")[2];
      //   // var property=value.pattern.split("|")[3];
      //   //console.log(props,'here');
      //
      // }
      //console.log(value.type);
    });
  };

  handleChange = (
    e,
    property,
    isRequired,
    pattern,
    requiredErrMsg = "Required",
    patternErrMsg = "Pattern Missmatch",
    expression,
    expErr,
    isDate
  ) => {
    const self = this;
    let { getVal } = this; //.props;
    var shouldHandleChange = true;
    let {
      handleChange,
      mockData,
      setDropDownData,
      formData,
      setMockData,
      moduleName,
      actionName,
      changeFormStatus,
      delRequiredFields,
      dropDownOringalData
    } = this.props;
    let hashLocation = window.location.hash;
    let obj =
      specifications[
      `${hashLocation.split("/")[2]}.${hashLocation.split("/")[1]}`
      ];



    if (obj && obj.beforeHandleChange) {
      eval(obj.beforeHandleChange)
    }

    if (shouldHandleChange) {
      if (!!obj) {
        obj.groups.map((d) => {
          d.fields.map((innerData) => {
            if (innerData.type == 'tableList') {
              innerData.tableList.values.map((dn) => {
                if (dn.hasOwnProperty('dependantOn') && dn.jsonPath == property) {
                  dn.dependantOn.map((fData) => {
                    if (getVal(`${fData.jsonPath}`) == `${fData.key}`) {
                      expression = expression;
                    }
                    else {
                      expression = '';
                    }

                  })
                }
              })
            }
          })
        })
      }

      if (expression && e.target.value) {
        let str = expression;
        let pos = 0;
        let values = [];
        while (pos < str.length) {
          if (str.indexOf("$", pos) > -1) {
            let ind = str.indexOf("$", pos);
            let spaceInd =
              str.indexOf(" ", ind) > -1 ? str.indexOf(" ", ind) : str.length - 1;
            let value = str.substr(ind, spaceInd);
            if (value != "$" + property) {
              values.push(value.substr(1));
              str = str.replace(
                value,
                "getVal('" + value.substr(1, value.length) + "')"
              );
            } else str = str.replace(value, "e.target.value");
            pos++;
          } else {
            pos++;
          }
        }

        let _flag = 0;
        for (var i = 0; i < values.length; i++) {
          if (!getVal(values[i])) {
            _flag = 1;
          }
        }

        if (
          isDate &&
          e.target.value &&
          [12, 13].indexOf((e.target.value + "").length) == -1
        ) {
          _flag = 1;
        }

        if (_flag == 0) {
          if (!eval(str)) {
            return this.props.toggleSnackbarAndSetText(
              true,
              translate(expErr),
              false,
              true
            );
          }
        }
      }
      // this.checkifHasValueBasedOn(property, e.target.value); --> Not Required on HandleChange
      this.checkIfHasShowHideFields(property, e.target.value);
      this.checkIfHasEnDisFields(property, e.target.value);
      this.checkifHasDependedantMdmsField(property, e.target.value);
      this.checkIfHasReqFields(property, e.target.value);

      try {
        handleChange(
          e,
          property,
          isRequired,
          pattern,
          requiredErrMsg,
          patternErrMsg
        );
      } catch (e) {
        console.log("error in autocomplete . It is version issue");
        console.log(e);
      }
      this.affectDependants(obj, e, property);
      if (
        (property == "agencies[0].status" ||
          property == "agencies[0].advocates[0].status") &&
        e.target.value == "active"
      ) {
        changeFormStatus(true);
      }

      const JP = jp;
      if (obj && obj.afterHandleChange) {
        eval(obj.afterHandleChange)
      }
    }



  };

  incrementIndexValue = (group, jsonPath) => {
    let { formData } = this.props;
    var length = _.get(formData, jsonPath)
      ? _.get(formData, jsonPath).length
      : 0;
    var _group = JSON.stringify(group);
    var regexp = new RegExp(jsonPath + "\\[\\d{1}\\]", "g");
    _group = _group.replace(regexp, jsonPath + "[" + length + "]");
    return JSON.parse(_group);
  };

  indexFinder = (jsonPath) => {
    let matches = jsonPath.match(/(\[\d+\])/g);
    return matches.length ? parseInt(matches[matches.length - 1].replace(/[^\d]/g, "")) : -1;
  }

  getNewSpecs = (group, updatedSpecs, path) => {
    let { moduleName, actionName } = this.props;
    let groupsArray = _.get(updatedSpecs[moduleName + "." + actionName], path);
    groupsArray.push(group);
    _.set(updatedSpecs[moduleName + "." + actionName], path, groupsArray);
    return updatedSpecs;
  };

  getPath = value => {
    let { mockData, moduleName, actionName } = this.props;
    const getFromGroup = function (groups) {
      for (var i = 0; i < groups.length; i++) {
        if (groups[i].children) {
          for (var j = 0; j < groups[i].children.length; i++) {
            if (groups[i].children[j].jsonPath == value) {
              return "groups[" + i + "].children[" + j + "].groups";
            } else {
              return (
                "groups[" +
                i +
                "].children[" +
                j +
                "][" +
                getFromGroup(groups[i].children[j].groups) +
                "]"
              );
            }
          }
        }
      }
    };

    return getFromGroup(mockData[moduleName + "." + actionName].groups);
  };

  addNewCard = (group, jsonPath, groupName) => {
    let self = this;
    let {
      setMockData,
      metaData,
      moduleName,
      actionName,
      setFormData,
      formData,
      addRequiredFields
    } = this.props;
    let mockData = { ...this.props.mockData };
    let reqFields = [];
    if (!jsonPath) {
      for (
        var i = 0;
        i < metaData[moduleName + "." + actionName].groups.length;
        i++
      ) {
        if (
          groupName == metaData[moduleName + "." + actionName].groups[i].name
        ) {
          var _groupToBeInserted = {
            ...metaData[moduleName + "." + actionName].groups[i]
          };
          for (
            var j = mockData[moduleName + "." + actionName].groups.length - 1;
            j >= 0;
            j--
          ) {
            if (
              groupName ==
              mockData[moduleName + "." + actionName].groups[j].name
            ) {
              var regexp = new RegExp(
                mockData[moduleName + "." + actionName].groups[j].jsonPath
                  .replace(/\[/g, "\\[")
                  .replace(/\]/g, "\\]") + "\\[\\d{1}\\]",
                "g"
              );
              var stringified = JSON.stringify(_groupToBeInserted);
              var ind =
                mockData[moduleName + "." + actionName].groups[j].index || 0;
              _groupToBeInserted = JSON.parse(
                stringified.replace(
                  regexp,
                  metaData[moduleName + "." + actionName].groups[i].jsonPath +
                  "[" +
                  (ind + 1) +
                  "]"
                )
              );
              _groupToBeInserted.index = ind + 1;

              mockData[moduleName + "." + actionName].groups.splice(
                j + 1,
                0,
                _groupToBeInserted
              );
              setMockData(mockData);
              var temp = { ...formData };
              if (
                _groupToBeInserted.multiple == true &&
                _groupToBeInserted.index
              ) {
                self.setDefaultForMultiple(_groupToBeInserted, temp);
              } else {
                self.setDefaultValues(
                  mockData[moduleName + "." + actionName].groups,
                  temp
                );
              }

              for (var k = 0; k < _groupToBeInserted.fields.length; k++) {

                if (_groupToBeInserted.fields[k].isRequired) {
                  reqFields.push(_groupToBeInserted.fields[k].jsonPath);
                }
              }
              if (reqFields.length) addRequiredFields(reqFields);

              // Check for showHideFields in multiple --> Delete/Add required fields as per default value
              for (var k = 0; k < _groupToBeInserted.fields.length; k++) {
                if (_groupToBeInserted.fields[k].showHideFields && _groupToBeInserted.fields[k].showHideFields.length) {
                  self.checkIfHasShowHideFields(_groupToBeInserted.fields[k].jsonPath, _groupToBeInserted.fields[k].defaultValue)
                }
              }

              setFormData(temp);
              break;
            }
          }
          break;
        }
      }
    } else {
      group = JSON.parse(JSON.stringify(group));
      //Increment the values of indexes
      var grp = _.get(
        metaData[moduleName + "." + actionName],
        self.getPath(jsonPath) + "[0]"
      );
      group = this.incrementIndexValue(grp, jsonPath);
      //Push to the path
      var updatedSpecs = this.getNewSpecs(
        group,
        JSON.parse(JSON.stringify(mockData)),
        self.getPath(jsonPath)
      );
      //Create new mock data
      setMockData(updatedSpecs);
    }
  };

  removeCard = (jsonPath, index, groupName) => {
    //Remove at that index and update upper array values
    let {
      setMockData,
      moduleName,
      actionName,
      setFormData,
      delRequiredFields,
      addRequiredFields
    } = this.props;
    let _formData = { ...this.props.formData };
    let self = this;
    let mockData = { ...this.props.mockData };
    let notReqFields = [];
    let ReqFields = [];
    console.log(jsonPath);
    if (!jsonPath) {
      var ind = 0;

      for (
        let i = 0;
        i < mockData[moduleName + "." + actionName].groups.length;
        i++
      ) {
        if (
          index == i &&
          groupName == mockData[moduleName + "." + actionName].groups[i].name
        ) {
          console.log(mockData[moduleName + "." + actionName].groups[i].index);
          console.log(
            mockData[moduleName + "." + actionName].groups.filter(
              group => group.name === groupName
            ).length - 1
          );
          /* Check for last card --> Set Form Data --> Splice the groups array. */
          if (
            mockData[moduleName + "." + actionName].groups[i].index ===
            mockData[moduleName + "." + actionName].groups.filter(
              group => group.name === groupName
            ).length -
            1
          ) {
            // console.log(mockData[moduleName + '.' + actionName].groups[i].jsonPath);
            // console.log(_formData);
            if (
              _.get(
                _formData,
                mockData[moduleName + "." + actionName].groups[i].jsonPath
              )
            ) {
              var grps = [
                ..._.get(
                  _formData,
                  mockData[moduleName + "." + actionName].groups[i].jsonPath
                )
              ];
              //console.log(mockData[moduleName + "." + actionName].groups[i].index-1);
              // console.log(mockData[moduleName + "." + actionName].groups);
              grps.splice(
                mockData[moduleName + "." + actionName].groups[i].index,
                1
              );
              _.set(
                _formData,
                mockData[moduleName + "." + actionName].groups[i].jsonPath,
                grps
              );
              // console.log(_formData);
              setFormData(_formData);

              for (
                var k = 0;
                k <
                mockData[moduleName + "." + actionName].groups[i].fields.length;
                k++
              ) {
                if (
                  mockData[moduleName + "." + actionName].groups[i].fields[k]
                    .isRequired
                )
                  notReqFields.push(
                    mockData[moduleName + "." + actionName].groups[i].fields[k]
                      .jsonPath
                  );
              }

              delRequiredFields(notReqFields);

              /* Reduce Index Value */
              mockData[moduleName + "." + actionName].groups[i].index -= 1;
              /* And then splice at the end */
              mockData[moduleName + "." + actionName].groups.splice(i, 1);

              break;
            } else {
              /* Check for no json path in formData --> Splice mockData to remove the card */
              mockData[moduleName + "." + actionName].groups.splice(i, 1);
              break;
            }
          }
          /* Check for any other card --> Splice the array --> Create the form data --> Set form data */
          else {

            for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
              for (var k = 0; k < mockData[moduleName + '.' + actionName].groups[i].fields.length; k++) {
                if (mockData[moduleName + '.' + actionName].groups[i].fields[k].isRequired)
                  notReqFields.push(mockData[moduleName + '.' + actionName].groups[i].fields[k].jsonPath);
              }
              delRequiredFields(notReqFields);
            }

            for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
              if (index == i && groupName == mockData[moduleName + '.' + actionName].groups[i].name) {
                ind = i;
                mockData[moduleName + '.' + actionName].groups.splice(i, 1);
                break;
              }
            }



            for (let i = ind; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
              if (mockData[moduleName + '.' + actionName].groups[i].name == groupName) {
                var regexp = new RegExp(
                  mockData[moduleName + "." + actionName].groups[i].jsonPath
                    .replace(/\[/g, "\\[")
                    .replace(/\]/g, "\\]") + "\\[\\d{1}\\]",
                  "g"
                );
                //console.log(regexp);
                //console.log(mockData[moduleName + "." + actionName].groups[i].index);
                //console.log(mockData[moduleName + "." + actionName].groups[i].index);
                var stringified = JSON.stringify(mockData[moduleName + '.' + actionName].groups[i]);
                mockData[moduleName + '.' + actionName].groups[i] = JSON.parse(
                  stringified.replace(
                    regexp,
                    mockData[moduleName + "." + actionName].groups[i].jsonPath +
                    "[" +
                    (mockData[moduleName + "." + actionName].groups[i].index -
                      1) +
                    "]"
                  )
                );
              }
            }

            console.log(mockData[moduleName + '.' + actionName].groups);

            for (let i = index; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
              if (mockData[moduleName + '.' + actionName].groups[i].name == groupName) {

                if (
                  _.get(
                    _formData,
                    mockData[moduleName + "." + actionName].groups[i].jsonPath
                  )
                ) {
                  var grps = [
                    ..._.get(
                      _formData,
                      mockData[moduleName + "." + actionName].groups[i].jsonPath
                    )
                  ];
                  //console.log(mockData[moduleName + "." + actionName].groups[i].index-1);
                  //console.log(mockData[moduleName + "." + actionName].groups);
                  grps.splice(mockData[moduleName + '.' + actionName].groups[i].index - 1, 1);

                  _.set(_formData, mockData[moduleName + '.' + actionName].groups[i].jsonPath, grps);
                  //console.log(_formData);
                  setFormData(_formData);

                  // Reduce index values
                  for (let k = ind; k < mockData[moduleName + '.' + actionName].groups.length; k++) {
                    if (mockData[moduleName + '.' + actionName].groups[k].name == groupName) {
                      mockData[moduleName + '.' + actionName].groups[k].index -= 1;
                    }
                  }
                  break;
                }
              }
            }
            for (let i = 0; i < mockData[moduleName + '.' + actionName].groups.length; i++) {
              for (var k = 0; k < mockData[moduleName + '.' + actionName].groups[i].fields.length; k++) {
                if (mockData[moduleName + '.' + actionName].groups[i].fields[k].isRequired &&
                !mockData[moduleName + '.' + actionName].groups[i].fields[k].hide){
                  ReqFields.push(mockData[moduleName + '.' + actionName].groups[i].fields[k].jsonPath);
                }
              }
              addRequiredFields(ReqFields);
            }
          }
        }
      }

      console.log(notReqFields);
      console.log(mockData);
      setMockData(mockData);
    } else {
      var _groups = _.get(
        mockData[moduleName + "." + actionName],
        self.getPath(jsonPath)
      );
      _groups.splice(index, 1);
      var regexp = new RegExp("\\[\\d{1}\\]", "g");
      for (var i = index; i < _groups.length; i++) {
        var stringified = JSON.stringify(_groups[i]);
        _groups[i] = JSON.parse(stringified.replace(regexp, "[" + i + "]"));
      }

      _.set(mockData, self.getPath(jsonPath), _groups);
      setMockData(mockData);
    }
  };

  render() {
    let {
      mockData,
      moduleName,
      actionName,
      formData,
      fieldErrors,
      isFormValid
    } = this.props;

    let {
      create,
      handleChange,
      setVal,
      getVal,
      addNewCard,
      removeCard,
      autoComHandler,
      initiateWF
    } = this;
    let customActionsAndUrl =
      !_.isEmpty(mockData[`${moduleName}.${actionName}`]) &&
        mockData[`${moduleName}.${actionName}`].hasOwnProperty(
          "customActionsAndUrl"
        )
        ? mockData[`${moduleName}.${actionName}`]["customActionsAndUrl"][0].url
        : "";
    let customBtnLabel = "Update";
    if (
      !_.isEmpty(mockData[`${moduleName}.${actionName}`]) &&
      (mockData[`${moduleName}.${actionName}`].customDoc ===
        "parawisecomments" ||
        mockData[`${moduleName}.${actionName}`].customDoc === "hearingdetails")
    ) {
      customBtnLabel = "Create";
    }

    //let isUpdateDataFetched = actionName==='update'? !_.isEmpty(formData) : true;
    // console.log({ ...this.props.formData });
    return (
      <div className="Report">
        <Row>
          <Col xs={6} md={6}>
            <h3 style={{ paddingLeft: 15, marginBottom: "0" }}>
              {!_.isEmpty(mockData) &&
                moduleName &&
                actionName &&
                mockData[`${moduleName}.${actionName}`] &&
                mockData[`${moduleName}.${actionName}`].title
                ? translate(mockData[`${moduleName}.${actionName}`].title)
                : ""}
            </h3>
          </Col>
          <Col xs={6} md={6} />
        </Row>

        <form
          onSubmit={e => {
            create(e);
          }}
        >
          {/*<div style={{position:"fixed",zIndex:1000,width:"100%"}}>*/}
          <Row>
            <Col xs={6} md={6}>
              <div
                style={{
                  marginLeft: "16px"
                }}
              >
                <UiBackButton customUrl={customActionsAndUrl} />
              </div>
            </Col>
            <Col xs={6} md={6}>
              <div style={{ textAlign: "right", marginRight: "16px" }}>
                <RaisedButton
                  icon={
                    <i style={{ color: "black" }} className="material-icons">
                      backspace
                    </i>
                  }
                  label="Reset"
                  primary={false}
                  onClick={() => {
                    this.initData();
                  }}
                />{" "}
                &nbsp;&nbsp;
                {actionName == "create" && (
                  <UiButton
                    item={{
                      label: "Save",
                      uiType: "submit",
                      isDisabled: isFormValid ? false : true
                    }}
                    icon={
                      <i style={{ color: "white" }} className="material-icons">
                        save
                      </i>
                    }
                    ui="google"
                  />
                )}
                {actionName == "update" && (
                  <UiButton
                    item={{
                      label: customBtnLabel,
                      uiType: "submit",
                      isDisabled: isFormValid ? false : true
                    }}
                    icon={
                      <i style={{ color: "white" }} className="material-icons">
                        update
                      </i>
                    }
                    ui="google"
                  />
                )}
              </div>
            </Col>
          </Row>
          {/*  </div>*/}
          {!_.isEmpty(mockData) &&
            moduleName &&
            actionName &&
            mockData[`${moduleName}.${actionName}`] && (
              <ShowFields
                groups={mockData[`${moduleName}.${actionName}`].groups}
                noCols={mockData[`${moduleName}.${actionName}`].numCols}
                ui="google"
                actionName={actionName}
                handler={handleChange}
                makeAjaxCall={this.makeAPICallGetResponse}
                addRequiredFields={this.props.addRequiredFields}
                delRequiredFields={this.props.delRequiredFields}
                setVal={setVal}
                getVal={getVal}
                fieldErrors={fieldErrors}
                useTimestamp={
                  mockData[`${moduleName}.${actionName}`].useTimestamp || false
                }
                addNewCard={addNewCard}
                removeCard={removeCard}
                autoComHandler={autoComHandler}
                initiateWF={initiateWF}
                screen={
                  window.location.hash.split("/").indexOf("update") == 1
                    ? "update"
                    : "create"
                }
                workflowId={
                  window.location.hash.split("/").indexOf("update") == 1
                    ? (this.props.match.params.id &&
                      decodeURIComponent(this.props.match.params.id)) ||
                    this.props.match.params.master
                    : ""
                }
              />
            )}
          <div
            style={{
              textAlign: "right",
              color: "#FF0000",
              marginTop: "15px",
              marginRight: "15px",
              paddingTop: "8px"
            }}
          >
            <i>( * ) {translate("framework.required.note")}</i>
            <br />
            <br />
            {/*<UiLogo src={require("../../images/logo.png")} alt="logo"/>*/}
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  metaData: state.framework.metaData,
  mockData: state.framework.mockData,
  moduleName: state.framework.moduleName,
  actionName: state.framework.actionName,
  formData: state.frameworkForm.form,
  fieldErrors: state.frameworkForm.fieldErrors,
  isFormValid: state.frameworkForm.isFormValid,
  requiredFields: state.frameworkForm.requiredFields,
  dropDownData: state.framework.dropDownData,
  dropDownOringalData: state.framework.dropDownOringalData
});

const mapDispatchToProps = dispatch => ({
  initForm: requiredFields => {
    dispatch({
      type: "SET_REQUIRED_FIELDS",
      requiredFields
    });
  },
  displayError: (property, errorMessage) => dispatch({
    type: 'DISPLAY_ERROR', property, errorMessage
  }),
  setMetaData: metaData => {
    dispatch({ type: "SET_META_DATA", metaData });
  },
  setMockData: mockData => {
    dispatch({ type: "SET_MOCK_DATA", mockData });
  },
  setFormData: data => {
    dispatch({ type: "SET_FORM_DATA", data });
  },
  setModuleName: moduleName => {
    dispatch({ type: "SET_MODULE_NAME", moduleName });
  },
  setActionName: actionName => {
    dispatch({ type: "SET_ACTION_NAME", actionName });
  },
  handleChange: (
    e,
    property,
    isRequired,
    pattern,
    requiredErrMsg,
    patternErrMsg
  ) => {
    dispatch({
      type: "HANDLE_CHANGE_FRAMEWORK",
      property,
      value: e.target.value,
      isRequired,
      pattern,
      requiredErrMsg,
      patternErrMsg
    });
  },
  changeFormStatus: status => {
    dispatch({
      type: "CHANGE_FORM_STATUS",
      status
    });
  },
  setLoadingStatus: loadingStatus => {
    dispatch({ type: "SET_LOADING_STATUS", loadingStatus });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg, isSuccess, isError) => {
    dispatch({
      type: "TOGGLE_SNACKBAR_AND_SET_TEXT",
      snackbarState,
      toastMsg,
      isSuccess,
      isError
    });
  },
  setDropDownData: (fieldName, dropDownData) => {
    dispatch({ type: "SET_DROPDWON_DATA", fieldName, dropDownData });
  },
  setDropDownOriginalData: (fieldName, dropDownData) => {
    dispatch({ type: "SET_ORIGINAL_DROPDWON_DATA", fieldName, dropDownData });
  },
  setRoute: route => dispatch({ type: "SET_ROUTE", route }),
  delRequiredFields: requiredFields => {
    dispatch({ type: "DEL_REQUIRED_FIELDS", requiredFields });
  },
  addRequiredFields: requiredFields => {
    dispatch({ type: "ADD_REQUIRED_FIELDS", requiredFields });
  },
  removeFieldErrors: key => {
    dispatch({ type: "REMOVE_FROM_FIELD_ERRORS", key });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);
