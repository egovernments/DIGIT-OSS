import React, { Component } from "react";
import { connect } from "react-redux";
import { Row } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import { Card } from "components";
import RaisedButton from "material-ui/RaisedButton";
import { commonApiPost } from "egov-ui-kit/utils/api";
import ShowField from "./showField";
import get from "lodash/get";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import jp from "jsonpath";
import _ from "lodash";
import { getResultUrl } from "./commons/url";
import commonConfig from "config/common.js";
import { getTenantId, setReturnUrl, localStorageSet, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { hideSpinner, showSpinner } from "egov-ui-kit/redux/common/actions";

class ShowForm extends Component {
  state = {
    searchBtnText: <LabelContainer labelName="APPLY" labelKey="REPORTS_SEARCH_APPLY_LABEL" />,
    filterApplied: false,
    getResults: false,
    dateError: "",
  };

  toDateObj = (dateStr) => {
    var parts = dateStr.match(/(\d{4})\-(\d{2})\-(\d{2})/);
    return new Date(Date.UTC(+parts[1], parts[2] - 1, +parts[3]));
  };

  resetFields = () => {
    const { metaData, resetForm, searchForm, setSearchParams } = this.props;
    if (!searchForm) {
      return;
    } else {
      if (get(metaData, "reportDetails.searchParams")) {
        let searchParams = metaData.reportDetails.searchParams;
        var i;
        let fromDateIndex, toDateIndex;
        for (i = 0; i < searchParams.length; i++) {
          if (searchParams[i].name === "fromDate") {
            fromDateIndex = i;
          } else if (searchParams[i].name === "toDate") {
            toDateIndex = i;
          }
        }
        if (fromDateIndex !== undefined) searchParams[fromDateIndex].maxValue = new Date();
        if (toDateIndex !== undefined) {
          searchParams[toDateIndex].minValue = undefined;
          searchParams[toDateIndex].maxValue = new Date();
        }
        setSearchParams(searchParams);
      }
      this.setState({ getResults: false, dateError: "" }, () => {
        resetForm();
      });
    }
  };

  checkForDependentSource = async (fieldIndex, field, selectedValue) => {
    const { pattern: fieldPattern, type: fieldType, name: targetProperty, isMandatory, displayOnly } = field;
    const { metaData, setMetaData, handleChange } = this.props;
    let splitArray = fieldPattern.split("?");
    let url = splitArray[0];
    let queryString = splitArray[1].split("|")[0].split("&");
    let queryJSON = {};

    for (var key in queryString) {
      let dat = queryString[key].split("=");
      if (dat[0] == "tenant-id") continue;
      if (dat[1].indexOf("{") > -1) {
        var path = dat[1].split("{")[1].split("}")[0];
        var pat = new RegExp("{" + path + "}", "g");
        queryJSON[dat[0]] = dat[1].replace(pat, selectedValue);
      } else {
        queryJSON[dat[0]] = dat[1];
      }
    }

    try {
      const response = await commonApiPost(url, queryJSON);
      let keys = jp.query(response, splitArray[1].split("|")[1]);
      let values = jp.query(response, splitArray[1].split("|")[2]);
      let defaultValue = {};
      for (var k = 0; k < keys.length; k++) {
        defaultValue[keys[k]] = values[k];
      }
      const defaultValuesLength = Object.keys(defaultValue).length;

      if (fieldType == "url") {
        metaData.reportDetails.searchParams[fieldIndex].defaultValue = defaultValue;
      } else {
        if (defaultValuesLength < 2) {
          metaData.reportDetails.searchParams[fieldIndex].disabled = true;
        }
      }

      setMetaData(metaData);

      if (defaultValuesLength && defaultValuesLength < 2) {
        const key = Object.keys(defaultValue)[0];
        const value = displayOnly ? defaultValue[key] : key;
        const e = { target: { value } };
        handleChange(e, targetProperty, isMandatory ? true : false, "");
      }
    } catch (error) {
      //alert("Something went wrong while loading depedent");
    }
  };
  handleDateSelect = (metaData, e, property) => {
    let { setSearchParams } = this.props;
    if (get(metaData, "reportDetails.searchParams")) {
      let searchParams = metaData.reportDetails.searchParams;
      var i;
      let fromDateIndex, toDateIndex;
      for (i = 0; i < searchParams.length; i++) {
        if (searchParams[i].name === "fromDate") {
          fromDateIndex = i;
        } else if (searchParams[i].name === "toDate") {
          toDateIndex = i;
        }
      }
      if (property === "fromDate" && toDateIndex !== undefined) {
        searchParams[toDateIndex].minValue = new Date(e.target.value);
      } else if (property === "toDate" && fromDateIndex !== undefined) {
        searchParams[fromDateIndex].maxValue = new Date(e.target.value);
      }
      setSearchParams(searchParams);
    }
  };
  handleChange = (e, property, isRequired, pattern) => {
    const { metaData, setMetaData, handleChange } = this.props;
    const selectedValue = e.target.value;
    if (property === "fromDate" || property === "toDate") {
      this.handleDateSelect(metaData, e, property);
      this.checkDate(selectedValue, property, isRequired, pattern);
    } else {
      handleChange(e, property, isRequired, pattern);
    }

    if (metaData.hasOwnProperty("reportDetails") && metaData.reportDetails.searchParams.length > 0) {
      if (!selectedValue) {
        for (var l = 0; l < metaData.reportDetails.searchParams.length; l++) {
          if (metaData.reportDetails.searchParams[l].type == "url" && metaData.reportDetails.searchParams[l].pattern.search(property) > -1) {
            metaData.reportDetails.searchParams[l].defaultValue = {};
          }
        }
        setMetaData(metaData);
      } else {
        for (var i = 0; i < metaData.reportDetails.searchParams.length; i++) {
          const field = metaData.reportDetails.searchParams[i];
          const defaultValue = field.defaultValue;
          const dependantProperty = field.name;

          if (dependantProperty === property) {
            continue;
          }

          if (typeof defaultValue != "object" || field.hasOwnProperty("pattern")) {
            if (!field.hasOwnProperty("pattern")) {
              field["pattern"] = defaultValue;
            }

            const fieldPattern = field.pattern;

            if (fieldPattern.indexOf("{" + property + "}") == -1) continue;

            if (fieldPattern && fieldPattern.search("{" + property + "}") > -1) {
              this.checkForDependentSource(i, field, selectedValue);
            }
          }
        }
      }
    }
  };

  checkDate = (value, name, required, pattern) => {
    let e = {
      target: {
        value: value,
      },
    };

    if (name == "fromDate") {
      let startDate = value;
      if (this.props.searchForm) {
        try {
          let endDate = this.props.searchForm.toDate;
          this.props.handleChange(e, name, required, pattern);
          this.validateDate(startDate, endDate, required, "fromDate"); //3rd param to denote whether field fails
        } catch (e) {}
      } else {
        this.props.handleChange(e, name, required, pattern);
      }
    } else {
      let endDate = value;
      if (this.props.searchForm) {
        try {
          let startDate = this.props.searchForm.fromDate;
          this.props.handleChange(e, name, required, pattern);
          this.validateDate(startDate, endDate, required, "toDate"); //3rd param to denote whether field fails
        } catch (e) {}
      }
    }
  };

  validateDate = (startDate, endDate, required, field) => {
    if (startDate && endDate) {
      let sD = new Date(startDate);
      sD.setHours(0, 0, 0, 0);
      let eD = new Date(endDate);
      eD.setHours(0, 0, 0, 0);
      if (eD >= sD) {
        this.setState({ datefield: "" });
        this.setState({ dateError: "" });
      } else {
        let e = {
          target: {
            value: "",
          },
        };
        this.props.handleChange(e, field, required, "");
        this.setState({ datefield: field });
        this.setState({
          dateError:
            field === "toDate" ? (
              <Label labelStyle={{ color: "rgb(244, 67, 54)" }} label="REPORT_SEARCHFORM_DATE_GREATER" />
            ) : (
              <Label labelStyle={{ color: "rgb(244, 67, 54)" }} label="REPORT_SEARCHFORM_DATE_LESSER" />
            ),
        });
      }
    }
  };

  // set the value here, introduce the disabled
  handleFormFields = () => {
    let { metaData, searchForm, labels } = this.props;
    if (!_.isEmpty(metaData) && metaData.reportDetails && metaData.reportDetails.searchParams && metaData.reportDetails.searchParams.length > 0) {
      return metaData.reportDetails.searchParams.map((item, index) => {
        item["value"] = !_.isEmpty(searchForm) ? (searchForm[item.name] ? searchForm[item.name] : "") : "";
        if (item.type === "epoch" && item.minValue && item.maxValue && typeof item.minValue !== "object" && typeof item.maxValue !== "object") {
          item.minValue = this.toDateObj(item.minValue);
          item.maxValue = this.toDateObj(item.maxValue);
        } else if (item.type === "epoch" && item.name == "fromDate" && item.maxValue === null) {
          item.maxValue = new Date();
        } else if (item.type === "epoch" && item.name == "toDate" && item.maxValue === null) {
          item.maxValue = new Date();
        }
        if (item.type === "singlevaluelist") {
          item["searchText"] = !_.isEmpty(searchForm) ? (searchForm[item.name] ? searchForm[item.name] : "") : "";
        }
        return (
          item.name !== "tenantId" && (
            <ShowField
              value={item["value"]}
              key={index}
              obj={item}
              dateField={this.state.datefield}
              dateError={this.state.dateError}
              handler={this.handleChange}
              localizationLabels={labels}
            />
          )
        );
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    let { changeButtonText, clearReportHistory, needDefaultSearch } = this.props;

    if (!_.isEqual(this.props.searchForm, nextProps.searchForm)) {
      if (this.state.getResults) {
        this.search(null, false, nextProps.searchForm);
      }
      this.setState({ getResults: false, dateError: "" });
    }
    if (nextProps.metaData.reportDetails && nextProps.metaData.reportDetails !== this.props.metaData.reportDetails) {
      changeButtonText(<LabelContainer labelName="APPLY" labelKey="REPORTS_SEARCH_APPLY_LABEL" />);
      this.setState({
        reportName: nextProps.metaData.reportDetails.reportName,
      });
      this.setState({ moduleName: this.props.match.params.moduleName });

      let { setForm } = this.props;
      let { searchParams } = !_.isEmpty(nextProps.metaData) ? nextProps.metaData.reportDetails : { searchParams: [] };
      let required = [];
      for (var i = 0; i < searchParams.length; i++) {
        if (searchParams[i].name !== "tenantId" && searchParams[i].isMandatory) {
          required.push(searchParams[i].name);
        }
        if (searchParams[i].initialValue) {
          if (searchParams[i].type === "epoch") {
            this.handleChange(
              { target: { value: this.toDateObj(searchParams[i].initialValue) } },
              searchParams[i].name,
              searchParams[i].isMandatory ? true : false,
              ""
            );
          } else {
            this.handleChange(
              { target: { value: searchParams[i].initialValue } },
              searchParams[i].name,
              searchParams[i].isMandatory ? true : false,
              ""
            );
          }
        }
      }
      setForm(required);
      clearReportHistory();
      if (!_.isEmpty(JSON.parse(localStorageGet("searchCriteria")))) {
        this.search(null, true, nextProps.metaData.reportDetails.reportName);
      } else if (needDefaultSearch) {
        this.defautSearch(null, false, nextProps.metaData.reportDetails.reportName, nextProps.match.params.moduleName);
      }
    }
  }

  componentDidMount() {
    let { metaData, setForm, changeButtonText, clearReportHistory } = this.props;
    changeButtonText(<LabelContainer labelName="APPLY" labelKey="REPORTS_SEARCH_APPLY_LABEL" />);
    let searchParams = !_.isEmpty(metaData) ? metaData.reportDetails : { searchParams: [] };
    let required = [];
    this.setState({ reportName: this.props.match.params.reportName });
    this.setState({ moduleName: this.props.match.params.moduleName });
    if (searchParams) {
      for (var i = 0; i < searchParams.length; i++) {
        if (searchParams[i].isMandatory) {
          required.push(searchParams[i].name);
        }
      }
    }

    setForm(required);
    clearReportHistory();
  }

  getDisplayOnlyFields = (metaData) => {
    return (
      metaData &&
      metaData.reportDetails &&
      metaData.reportDetails.searchParams &&
      metaData.reportDetails.searchParams.filter((field) => field.displayOnly).map((field) => field.name)
    );
  };
  setError = (err) => {
    err &&
      err.message &&
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: getTransformedLocale(err.message), labelKey: getTransformedLocale(err.message) },
        "error"
      );
  };

  defautSearch = (e = null, isDrilldown = false, rptName, moduleName) => {
    if (e) {
      e.preventDefault();
    }

    let { showTable, changeButtonText, setReportResult, setFlag, pushReportHistory, clearReportHistory } = this.props;
    let today = new Date();
    let date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
    let tabLabel = `Showing data upto : ${date}`;
    this.props.updateTabLabel(tabLabel);
    const { setError } = this;

    var tenantId = getTenantId() ? getTenantId() : commonConfig.tenantId;
    let self = this;
    if (!isDrilldown) {
      let searchParams = [];
      clearReportHistory();
      let resulturl = getResultUrl(moduleName, rptName);
      resulturl &&
        commonApiPost(resulturl, {}, { tenantId: tenantId, reportName: rptName || this.state.reportName, searchParams }).then(
          function (response) {
            if (response && response.reportHeader && response.reportData) {
              let hiddenRows = [];
              response.reportHeader.map((e, i) => {
                if (!e.showColumn) {
                  hiddenRows.push(i);
                }
              });
              response.reportHeader = response.reportHeader.filter((e) => e.showColumn);
              response.reportData = response.reportData.map((ele) =>
                ele.filter((e, i) => !hiddenRows.includes(i)).map((ele) => (ele == null ? "" : ele))
              );
            }
            pushReportHistory({ tenantId: tenantId, reportName: self.state.reportName, searchParams });
            setReportResult(response);
            showTable(true);
            setFlag(1);
          },
          function (err) {
            showTable(false);
            setError(err);
            // alert(err);
          }
        );
    }

    changeButtonText(<LabelContainer labelName="APPLY" labelKey="REPORTS_SEARCH_APPLY_LABEL" />);
  };
  search = (e = null, isDrilldown = false, searchForm) => {
    if (e) {
      e.preventDefault();
    }
    const { setError } = this;
    let {
      showTable,
      changeButtonText,
      setReportResult,
      metaData,
      setFlag,
      setSearchParams,
      reportHistory,
      reportIndex,
      pushReportHistory,
      clearReportHistory,
      decreaseReportIndex,
      toggleSnackbarAndSetText,
      hideSpinner,
      showSpinner,
    } = this.props;
    let searchParams = [];
    var tenantId = getTenantId() ? getTenantId() : commonConfig.tenantId;
    let self = this;
    let mandatoryfields = [];
    metaData.reportDetails.searchParams.forEach((param) => {
      if (param.isMandatory) {
        mandatoryfields.push(param.name);
      }
    });
    let filledMandatoryFieldsCount = searchForm
      ? Object.keys(searchForm).filter((param) => searchForm[param] && mandatoryfields.includes(param)).length
      : 0;
    if (filledMandatoryFieldsCount != mandatoryfields.length) {
      toggleSnackbarAndSetText(
        true,
        { labelKey: "COMMON_MANDATORY_MISSING_ERROR", labelName: "Please fill all mandatory fields to search" },
        "error"
      );
      return;
    }
    if (!isDrilldown) {
      const displayOnlyFields = this.getDisplayOnlyFields(metaData);

      searchForm = searchForm
        ? Object.keys(searchForm)
            .filter((param) => !_.includes(displayOnlyFields, param))
            .reduce((acc, param) => {
              acc[param] = searchForm[param];
              return acc;
            }, {})
        : searchForm;

      for (var variable in searchForm) {
        let input;

        if (this.state.moduleName == "oldPGR") {
          if (variable == "fromDate") {
            input =
              searchForm[variable].getFullYear() +
              "-" +
              (searchForm[variable].getMonth() > 8 ? searchForm[variable].getMonth() + 1 : "0" + parseInt(searchForm[variable].getMonth() + 1)) +
              "-" +
              (searchForm[variable].getDate() > 9 ? searchForm[variable].getDate() : "0" + searchForm[variable].getDate()) +
              " 00:00:00";
          } else if (variable == "toDate") {
            input =
              searchForm[variable].getFullYear() +
              "-" +
              (searchForm[variable].getMonth() > 8 ? searchForm[variable].getMonth() + 1 : "0" + parseInt(searchForm[variable].getMonth() + 1)) +
              "-" +
              (searchForm[variable].getDate() > 9 ? searchForm[variable].getDate() : "0" + searchForm[variable].getDate()) +
              " 23:59:59";
          } else {
            input = searchForm[variable];
          }
        } else {
          if (variable == "fromDate") {
            try {
              input = searchForm[variable].setHours(0);
              input = searchForm[variable].setMinutes(0);
              input = searchForm[variable].setSeconds(0);
            } catch (e) {}
          } else if (variable == "toDate") {
            try {
              input = searchForm[variable].setHours(23);
              input = searchForm[variable].setMinutes(59);
              input = searchForm[variable].setSeconds(59);
            } catch (e) {}
          } else {
            input = searchForm[variable];
          }
        }
        if (input && input != "All") {
          searchParams.push({ name: variable, input });
        }
      }
      showSpinner();
      setSearchParams(searchParams);

      clearReportHistory();
      let resulturl = getResultUrl(this.state.moduleName, this.state.reportName);
      resulturl &&
        commonApiPost(resulturl, {}, { tenantId: tenantId, reportName: this.state.reportName, searchParams }).then(
          function (response) {
            if (response && response.reportHeader && response.reportData) {
              if (window.location.pathname.includes("TradeLicenseDailyCollectionReport")) {
                const ind = response.reportHeader.findIndex((d) => d.name === "username");
                response.reportHeader[ind].showColumn = false;
                response.reportData = response.reportData.map((eachArr) => {
                  eachArr[ind + 1] = `${eachArr[ind + 1]}/${eachArr[ind]}`;
                  return eachArr;
                });
              }
              let hiddenRows = [];

              response.reportHeader.map((e, i) => {
                if (!e.showColumn) {
                  hiddenRows.push(i);
                }
              });
              response.reportHeader = response.reportHeader.filter((e) => e.showColumn);
              response.reportData = response.reportData.map((ele) =>
                ele.filter((e, i) => !hiddenRows.includes(i)).map((ele) => (ele == null ? "" : ele))
              );
            }
            hideSpinner();
            pushReportHistory({ tenantId: tenantId, reportName: self.state.reportName, searchParams });
            setReportResult(response);
            showTable(true);
            setFlag(1);
          },
          function (err) {
            hideSpinner();
            showTable(false);
            setError(err);
            // alert(err);
          }
        );
    } else {
      if (_.isEmpty(JSON.parse(localStorageGet("searchCriteria")))) {
        let reportData = reportHistory[reportIndex - 1 - 1];
        let resulturl = getResultUrl(this.state.moduleName, this.state.reportName);
        resulturl &&
          commonApiPost(resulturl, {}, { ...reportData }).then(
            function (response) {
              if (response && response.reportHeader && response.reportData) {
                let hiddenRows = [];
                response.reportHeader.map((e, i) => {
                  if (!e.showColumn) {
                    hiddenRows.push(i);
                  }
                });
                response.reportHeader = response.reportHeader.filter((e) => e.showColumn);
                response.reportData = response.reportData.map((ele) =>
                  ele.filter((e, i) => !hiddenRows.includes(i)).map((ele) => (ele == null ? "" : ele))
                );
              }
              decreaseReportIndex();
              setReportResult(response);

              showTable(true);
              setFlag(1);
            },
            function (err) {
              showTable(false);
              setError(err);
              // alert(err);
            }
          );
      } else {
        showSpinner();
        var reportData = JSON.parse(localStorageGet("searchCriteria"));
        let resulturl = getResultUrl(localStorageGet("moduleName"));
        resulturl &&
          commonApiPost(resulturl, {}, { ...reportData }).then(
            function (response) {
              if (response && response.reportHeader && response.reportData) {
                let hiddenRows = [];
                response.reportHeader.map((e, i) => {
                  if (!e.showColumn) {
                    hiddenRows.push(i);
                  }
                });
                response.reportHeader = response.reportHeader.filter((e) => e.showColumn);
                response.reportData = response.reportData.map((ele) =>
                  ele.filter((e, i) => !hiddenRows.includes(i)).map((ele) => (ele == null ? "" : ele))
                );
              }
              setReturnUrl("");
              localStorageSet("searchCriteria", JSON.stringify({}));
              localStorageSet("moduleName", "");
              for (var i = 0; i < reportData.searchParams.length; i++) {
                self.handleChange({ target: { value: reportData.searchParams[i].name } }, reportData.searchParams[i].input, false, false);
              }
              setSearchParams(reportData.searchParams);
              hideSpinner();
              setReportResult(response);

              showTable(true);
              setFlag(1);
            },
            function (err) {
              hideSpinner();
              showTable(false);
              setError(err);
              // alert(err);
            }
          );
      }
    }

    changeButtonText(<LabelContainer labelName="APPLY" labelKey="REPORTS_SEARCH_APPLY_LABEL" />);
  };

  fetchResults = (e, searchForm) => {
    let { search } = this;
    let fromDate;
    let toDate;
    if (searchForm && searchForm.fromDate && searchForm.toDate) {
      fromDate = new Date(searchForm.fromDate);
      toDate = new Date(searchForm.toDate);
    }

    let tabLabel = "";
    if (fromDate && toDate) {
      tabLabel = `Showing data for : ${fromDate.getDate() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getFullYear()} to ${
        toDate.getDate() + "/" + (toDate.getMonth() + 1) + "/" + toDate.getFullYear()
      }`;
    }

    /** Zone wise selection show in header */
    if (searchForm && searchForm.hasOwnProperty("ZonalSelection")) {
      if (searchForm.ZonalSelection.hasOwnProperty("Zone")) {
        tabLabel += ` <b>Zone:</b> ${searchForm.ZonalSelection.Zone}`;
      }
      if (searchForm.ZonalSelection.hasOwnProperty("Block")) {
        tabLabel += ` <b>Block:</b> ${searchForm.ZonalSelection.Block}`;
      }
      if (searchForm.ZonalSelection.hasOwnProperty("Locality")) {
        tabLabel += ` <b>Locality:</b> ${searchForm.ZonalSelection.Locality}`;
      }
    }
    /** END Zone wise ... */

    this.props.updateTabLabel(tabLabel);
    search(e, false, searchForm);
  };

  getReportTitle = (rptName) => {
    let reportName = rptName || this.state.reportName;
    let reportTitleArr = reportName && reportName.split(/(?=[A-Z])/);
    let reportTitle = "";
    if (reportTitleArr) {
      reportTitle = reportTitleArr.map((char) => {
        if (char.length == 1) {
          reportTitle = char + "";
        } else {
          reportTitle = " " + char;
        }
        return reportTitle;
      });
    }
    return (reportTitle && typeof reportTitle == "string" && getLocaleLabels(getTransformedLocale(reportTitle))) || reportTitle;
  };

  getReportTitlefromTwoOptions = (metaData) => {
    if (get(metaData, "reportDetails.additionalConfig.reportTitle")) {
      return (
        <Label
          label={metaData.reportDetails.additionalConfig.reportTitle}
          labelStyle={{ marginLeft: "16px", marginTop: "8px", color: "#484848" }}
          fontSize={20}
        />
      );
    } else {
      return (
        get(metaData, "reportDetails.reportName") && (
          <div className="report-title">
            {getLocaleLabels(getTransformedLocale(metaData.reportDetails.reportName), getTransformedLocale(metaData.reportDetails.reportName))}
          </div>
        )
      );
    }
  };

  render() {
    let { buttonText, metaData, reportIndex, searchForm } = this.props;
    let { search } = this;
    return (
      <div className="">
        {metaData && metaData.reportDetails && (
          <form
            onSubmit={(e) => {
              this.fetchResults(e, searchForm);
            }}
          >
            <div>{metaData && this.getReportTitlefromTwoOptions(metaData)}</div>
            <Card
              style={{ padding: "16px" }}
              textChildren={
                <div>
                  <Label label={"REPORTS_SEARCHFORM_MODIFY_DATE_HEADER"} />
                  <Grid container spacing={8}>
                    {this.handleFormFields()}
                  </Grid>
                  <Row>
                    <div style={{ marginTop: "16px", textAlign: "center" }} className="col-xs-12">
                      <RaisedButton
                        // style={{ marginLeft: "8px" }}
                        type="button"
                        //disabled={!isFormValid}
                        // primary={true}
                        onClick={(e) => {
                          this.resetFields();
                        }}
                        label={<LabelContainer labelName="RESET" labelKey="REPORTS_SEARCH_RESET_LABEL" />}
                      />
                      <RaisedButton
                        style={{ marginLeft: "8px" }}
                        // style={{ height: "48px",borderRadius: "2px", width: "80%", backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                        type="submit"
                        //disabled={!isFormValid}
                        primary={true}
                        label={buttonText}
                      />
                    </div>
                  </Row>
                </div>
              }
            />
          </form>
        )}

        {reportIndex > 1 && (
          <div
            style={{
              textAlign: "right",
              paddingRight: "15px",
            }}
          >
            <br />
            <RaisedButton
              type="button"
              onClick={(e) => {
                search(e, true);
              }}
              primary={true}
              label={"Back"}
            />
            <br />
            <br />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const labels = get(state.app, "localizationLabels");
  return {
    searchForm: state.formtemp.form,
    fieldErrors: state.formtemp.fieldErrors,
    isFormValid: state.formtemp.isFormValid,
    isTableShow: state.formtemp.showTable,
    buttonText: state.formtemp.buttonText,
    metaData: state.report.metaData,
    reportHistory: state.report.reportHistory,
    reportIndex: state.report.reportIndex,
    labels,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setForm: (required = [], pattern = []) => {
    dispatch({
      type: "SET_FORM",
      formtemp: {},
      fieldErrors: {},
      isFormValid: required.length > 0 ? false : true,
      validationData: {
        required: {
          current: [],
          required: required,
        },
        pattern: {
          current: [],
          required: [],
        },
      },
    });
  },
  handleChange: (e, property, isRequired, pattern) => {
    dispatch({
      type: "HANDLE_CHANGE",
      property,
      value: e.target.value,
      isRequired,
      pattern,
    });
  },
  resetForm: () => {
    dispatch({ type: "RESET_FORM" });
  },
  showTable: (state) => {
    dispatch({ type: "SHOW_TABLE", state });
  },
  changeButtonText: (text) => {
    dispatch({ type: "BUTTON_TEXT", text });
  },
  setReportResult: (reportResult) => {
    dispatch({ type: "SET_REPORT_RESULT", reportResult });
  },
  setFlag: (flag) => {
    dispatch({ type: "SET_FLAG", flag });
  },
  toggleSnackbarAndSetText: (open, message, type) => {
    dispatch(toggleSnackbarAndSetText(open, message, type));
  },
  setMetaData: (metaData) => {
    dispatch({ type: "SET_META_DATA", metaData });
  },
  setSearchParams: (searchParams) => {
    dispatch({ type: "SET_SEARCH_PARAMS", searchParams });
  },
  pushReportHistory: (history) => {
    dispatch({ type: "PUSH_REPORT_HISTORY", reportData: history });
  },
  clearReportHistory: () => {
    dispatch({ type: "CLEAR_REPORT_HISTORY" });
  },
  decreaseReportIndex: () => {
    dispatch({ type: "DECREASE_REPORT_INDEX" });
  },
  hideSpinner: () => {
    dispatch(hideSpinner());
  },
  showSpinner: () => {
    dispatch(showSpinner());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowForm);
