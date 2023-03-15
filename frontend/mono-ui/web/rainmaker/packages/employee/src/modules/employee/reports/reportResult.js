import React, { Component } from "react";
import { connect } from "react-redux";
import RaisedButton from "material-ui/RaisedButton";
import { commonApiPost } from "egov-ui-kit/utils/api";
import { translate } from "./commons/common";
import $ from "jquery";
import _ from "lodash";
// import "datatables-buttons";
// import "datatables";
// import "datatables.net";
// import "datatables.net-buttons";
// import "datatables.net-dt";
// import "datatables.net-buttons-bs";
// import "datatables.net-responsive";
// import "datatables.net-responsive-dt";
import JSZip from "jszip/dist/jszip";
import get from "lodash/get";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
// import "datatables.net-buttons/js/buttons.html5.js"; // HTML 5 file export
// import "datatables.net-buttons/js/buttons.flash.js"; // Flash file export
// import "datatables.net-buttons/js/buttons.colVis.min.js";
import { getResultUrl } from "./commons/url";
import Label from "egov-ui-kit/utils/translationNode";
import commonConfig from "config/common.js";
import { getTenantId, setReturnUrl, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { getLocaleLabels ,getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import "./index.css";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
window.JSZip = JSZip;

var sumColumn = [];
var footerexist = false;
let rTable;

const formatLocaleKeys=(key="")=>{
if(typeof key!='string'){
  return key;
}
key=key.trim&&key.trim()||key;
key=key.toUpperCase&&key.toUpperCase()||key;
key=key.replace(/[.:-\s\/]/g, "_")||key;
return key;
}

class ShowField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ck: {},
      rows: {},
      showPrintBtn: false,
    };
  }

  componentWillUnmount() {
    $("#reportTable")
      .DataTable()
      .destroy(true);
  }

  componentWillUpdate() {
    let { flag } = this.props;
    if (flag == 1) {
      flag = 0;
      $("#reportTable")
        .dataTable()
        .fnDestroy();
    }
  }

  componentDidMount() {
    let _this = this;
    _this.setState({
      reportName: _this.props.match.params.reportName,
      moduleName: _this.props.match.params.moduleName,
    });
    _this.subHeader(_this.props.match.params.moduleName);
  }

  componentWillReceiveProps(nextprops) {
    this.setState({
      reportName: nextprops.match.params.reportName,
      moduleName: nextprops.match.params.moduleName,
      ck: {},
    });
    this.subHeader(nextprops.match.params.moduleName);
    // }
  }

  getExportOptions = () => {
    let _this = this;

    for (let key in _this.state.ck) {
      if (_this.state.ck[key]) {
        break;
      }
    }

    const { tabLabel, metaData } = _this.props;
    const reportDetails = metaData.hasOwnProperty("reportDetails") ? metaData.reportDetails : {};
    const additionalConfig = reportDetails.hasOwnProperty("additionalConfig") && reportDetails.additionalConfig ? reportDetails.additionalConfig : {};
    const reportHeader = reportDetails.hasOwnProperty("reportHeader") ? reportDetails.reportHeader : [];
    const pageSize = (additionalConfig.print && additionalConfig.print.pdfPageSize) ? additionalConfig.print.pdfPageSize : "LEGAL"
    let reportTitle = this.getReportTitle();
    let xlsTitle = this.getXlsReportTitle();
    let orientation = reportHeader.length > 6 ? "landscape" : "portrait";

    const buttons = [
      {
        text: `<span style="color:#767676">${getLocaleLabels("RT_DOWNLOAD_AS","RT_DOWNLOAD_AS")}</span>`,
        className: "report-download-button-text",
      },
      {
        extend: "pdf",
        filename: _this.state.reportName,
        messageTop: tabLabel,
        text: getLocaleLabels("RT_DOWNLOAD_PDF","RT_DOWNLOAD_PDF"),
        orientation: orientation,
        pageSize: pageSize,
        footer: true,
        customize: function (doc) {
          doc.content[0].text = [];
          doc.content[0].text.push({ text: "mSeva System Reports\n\n", bold: true, fontSize: 20 });
          doc.content[0].text.push({ text: reportTitle, fontSize: 18 });
        },
        className: "report-pdf-button",
      },
      {
        extend: "excel",
        text: getLocaleLabels("RT_DOWNLOAD_XLS","RT_DOWNLOAD_XLS"),
        filename: _this.state.reportName,
        title: xlsTitle,
        messageTop: tabLabel,
        footer: true,
        className: "report-excel-button",
      },
      "colvis",
    ];
    return buttons;
  };

  componentDidUpdate() {
    let { tabLabel, metaData } = this.props;
    let { reportDetails = {} } = metaData;
    let tableConfig;
    if (get(reportDetails, "additionalConfig.tableConfig")) {
      tableConfig = reportDetails.additionalConfig.tableConfig;
    }
    let self = this;
    let displayStart = 0;
    if (rTable && rTable.page && rTable.page.info()) {
      displayStart = rTable.page.info().start;
    }
    let showTabLabel = () => {
      $(".report-result-table-header").html(`${tabLabel}`);
    };
    rTable = $("#reportTable").DataTable({
      dom:
        "<'&nbsp''row'<'col-sm-2 col-xs-12 text-center'l><'col-sm-4 col-xs-12 text-center'f><'col-sm-6 col-xs-12 text-center'B>><'row margin0'<'col-sm-12't>><'&nbsp''row'<'col-sm-5 col-xs-12'i><'col-sm-7 col-xs-12'p>>",
      displayStart: displayStart,
      buttons: self.getExportOptions(),
      searching: true,
      paging: true,
      ordering: true,
      columnDefs: [
        {
          ordering: false,
          targets: 0,
        },
      ],
      fixedColumns: true,
      scrollY: 400,
      aLengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      scrollX: true,
      fnInitComplete: function () {
        this.css("visibility", "visible");

        $(".dataTables_scrollBody thead tr").css({ visibility: "collapse" });
      },
      drawCallback: function (settings) {
        $(".dataTables_scrollBody thead tr").css({ visibility: "collapse" });
      },
      ...tableConfig,
    });
    showTabLabel();
  }

  drillDown = (e, i, i2, item, item1) => {
    let {
      reportResult,
      searchForm,
      setReportResult,
      setFlag,
      searchParams,
      setRoute,
      match,
      pushReportHistory,
    } = this.props;
    let object = reportResult.reportHeader[i2];
    let copySearchParams = _.clone(searchParams);

    if (object.defaultValue && object.defaultValue.search("_parent") > -1) {
      let splitArray = object.defaultValue.split("&");

      for (var i = 1; i < splitArray.length; i++) {
        let key, value;
        if (splitArray[i].search("{") > -1) {
          key = splitArray[i].split("=")[0];
          let inputparam = splitArray[i].split("{")[1].split("}")[0];
          for (var j = 0; j < reportResult.reportHeader.length; j++) {
            if (reportResult.reportHeader[j].name == inputparam) {
              value = item[j];
            }
          }
        } else {
          key = splitArray[i].split("=")[0];
          if (key == "status") {
            value = splitArray[i].split("=")[1].toUpperCase();
          } else {
            value = splitArray[i].split("=")[1];
          }
        }
        searchParams.push({ name: key, input: value });
      }

      var tenantId = getTenantId() ? getTenantId() : commonConfig.tenantId;

      commonApiPost(
        "/report/" + "pgr" + "/_get",
        {},
        {
          tenantId: tenantId,
          reportName: splitArray[0].split("=")[1],
          searchParams,
        }
      ).then(
        function (response) {
          if (response.viewPath && response.reportData && response.reportData[0]) {
            localStorage.reportData = JSON.stringify(response.reportData);
            setReturnUrl(window.location.hash.split("#/")[1]);
            localStorageSet("moduleName", match.params.moduleName);
            localStorageSet(
              "searchCriteria",
              JSON.stringify({
                tenantId: tenantId,
                reportName: match.params.reportName,
                searchParams: copySearchParams,
              })
            );
            localStorageSet("searchForm", JSON.stringify(searchForm));
            setRoute("/print/report/" + response.viewPath);
          } else {
            pushReportHistory({
              tenantId: tenantId,
              reportName: splitArray[0].split("=")[1],
              searchParams,
            });
            setReportResult(response);
            setFlag(1);
          }
        },
        function (err) {
        }
      );
    } else if (object.defaultValue && object.defaultValue.search("_url") > -1) {
      let afterURL = object.defaultValue.split("?")[1];
      let URLparams = afterURL.split(":");
      if (URLparams.length > 1) {
        setRoute(`${URLparams[0] + encodeURIComponent(item1)}`);
      } else {
        setRoute(URLparams[0]);
      }
    }
  };

  addCommas = (num) => {
    if (isNaN(num)) {
      return num;
    }
    let value = num.toString().trim();
    const decLoc = value.indexOf(".") > -1 ? value.indexOf(".") : value.length;
    let i = decLoc - 3;
    if (i >= 1 && value.charAt(i - 1) !== "-") {
      value = value.substr(0, i) + "," + value.substr(i, value.length);
      i -= 2;
      while (i >= 1) {
        if (value.charAt(i - 1) == "-")
          // Handle for negatives
          break;
        value = value.substr(0, i) + "," + value.substr(i, value.length);
        i -= 2;
      }
    }
    return value;
  };

  checkIfDate = (val, i) => {
    let { reportResult } = this.props;
    if (
      reportResult &&
      reportResult.reportHeader &&
      reportResult.reportHeader.length &&
      reportResult.reportHeader[i] &&
      reportResult.reportHeader[i].type == "epoch"
    ) {
      var _date = new Date(Number(val));
      return ("0" + _date.getDate()).slice(-2) + "/" + ("0" + (_date.getMonth() + 1)).slice(-2) + "/" + _date.getFullYear();
    } else {
      if (
        reportResult &&
        reportResult.reportHeader &&
        reportResult.reportHeader.length &&
        reportResult.reportHeader[i] &&
        (reportResult.reportHeader[i].type == "currency" || reportResult.reportHeader[i].total)
      ) {
        return this.addCommas(Number(val) % 1 === 0 ? Number(val) : Number(val).toFixed(2));
      }
      else if (val && reportResult &&
        reportResult.reportHeader &&
        reportResult.reportHeader.length &&
        reportResult.reportHeader[i] &&
        reportResult.reportHeader[i].isLocalisationRequired && reportResult.reportHeader[i].localisationPrefix) {

          if(reportResult.reportHeader[i].localisationPrefix=='ACCESSCONTROL_ROLES_ROLES_'){
            let list=val&&val.split(',');
            return list.map(v1=>(<Label
            className="report-header-row-label"
            labelStyle={{ wordWrap: "unset", wordBreak: "unset" }}
            label={`${reportResult.reportHeader[i].localisationPrefix}${formatLocaleKeys(v1)||v1}`}
          />))           
            
          }
        return <Label
          className="report-header-row-label"
          labelStyle={{ wordWrap: "unset", wordBreak: "unset" }}
          label={`${reportResult.reportHeader[i].localisationPrefix}${formatLocaleKeys(val)}`}
        />;
      }
      else {
        return val;

      }
    }
  };

  checkAllRows = (e) => {
    let { reportResult } = this.props;
    let ck = { ...this.state.ck };
    let rows = { ...this.state.rows };
    let showPrintBtn = true;

    if (reportResult && reportResult.reportData && reportResult.reportData.length) {
      if (e.target.checked)
        for (let i = 0; i < reportResult.reportData.length; i++) {
          ck[i] = true;
          rows[i] = reportResult.reportData[i];
        }
      else {
        ck = {};
        rows = {};
        showPrintBtn = false;
      }

      this.setState({
        ck,
        rows,
        showPrintBtn,
      });
    }
  };

  renderHeader = () => {
    let { reportResult, metaData } = this.props;
    let { checkAllRows } = this;
    return (
      <thead>
        <tr className="report-table-header">
          <th key={"S. No."} className="report-header-cell">
            <Label
                      className="report-header-row-label"
                      labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold" }}
                      label={'RT_SNO'}
                    />
          </th>
          {metaData && metaData.reportDetails && metaData.reportDetails.selectiveDownload && (
            <th key={"testKey"}>
              <input type="checkbox" onChange={checkAllRows} />
            </th>
          )}
          {reportResult.hasOwnProperty("reportHeader") &&
            reportResult.reportHeader.map((item, i) => {
              if (item.showColumn) {
                return (
                  <th key={i} className="report-header-cell">
                    <Label
                      className="report-header-row-label"
                      labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold" }}
                      label={item.label}
                    />
                  </th>
                );
              } else {
                return (
                  <th style={{ display: "none" }} key={i}>
                    <Label
                      className="report-header-row-label"
                      labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold" }}
                      label={item.label}
                    />
                  </th>
                );
              }
            })}
        </tr>
      </thead>
    );
  };

  printSelectedDetails() {
    let rows = { ...this.state.rows };
    let { reportResult, searchParams, setRoute, match } = this.props;
    let header = this.props.reportResult.reportHeader;
    let defaultValue = "";
    for (let key in header) {
      if (header[key].defaultValue && header[key].defaultValue.search("_parent") > -1) {
        defaultValue = header[key].defaultValue;
      }
    }

    if (defaultValue) {
      let splitArray = defaultValue.split("&");
      let values = [],
        key;
      for (var k in rows) {
        for (var i = 1; i < splitArray.length; i++) {
          let value;
          if (splitArray[i].search("{") > -1) {
            key = splitArray[i].split("=")[0];
            let inputparam = splitArray[i].split("{")[1].split("}")[0];
            for (var j = 0; j < reportResult.reportHeader.length; j++) {
              if (reportResult.reportHeader[j].name == inputparam) {
                value = rows[k][j];
              }
            }
          } else {
            key = splitArray[i].split("=")[0];
            if (key == "status") {
              value = splitArray[i].split("=")[1].toUpperCase();
            } else {
              value = splitArray[i].split("=")[1];
            }
          }
          values.push(value);
        }
      }

      searchParams.push({ name: key, input: values });
      let resulturl = getResultUrl(match.params.moduleName);

      var tenantId = getTenantId() ? getTenantId() : commonConfig.tenantId;
      resulturl &&
        commonApiPost(
          resulturl,
          {},
          {
            tenantId: tenantId,
            reportName: splitArray[0].split("=")[1],
            searchParams,
          }
        ).then(
          function (response) {
            if (response.viewPath && response.reportData) {
              localStorage.reportData = JSON.stringify(response.reportData);
              setReturnUrl(window.location.hash.split("#/")[1]);
              setRoute("/print/report/" + response.viewPath);
            }
          },
          function (err) {
          }
        );
    }
  }

  getStyleForCell = (i) => {
    let { reportResult } = this.props;
    if (
      reportResult &&
      reportResult.reportHeader &&
      reportResult.reportHeader.length &&
      reportResult.reportHeader[i] &&
      (reportResult.reportHeader[i].type == "currency" || reportResult.reportHeader[i].total)
    ) {
      return { textAlign: "right" };
    } else {
      return { textAlign: "left" };
    }
  };

  renderBody = () => {
    sumColumn = [];
    let { reportResult, metaData } = this.props;
    let { drillDown, checkIfDate } = this;
    return (
      <tbody>
        {reportResult.hasOwnProperty("reportData") &&
          reportResult.reportData.map((dataItem, dataIndex) => {
            //array of array
            let reportHeaderObj = reportResult.reportHeader;
            return (
              <tr key={dataIndex} className={this.state.ck[dataIndex] ? "selected" : ""}>
                <td>{dataIndex + 1}</td>
                {metaData && metaData.reportDetails && metaData.reportDetails.selectiveDownload && (
                  <td>
                    <input
                      type="checkbox"
                      checked={this.state.ck[dataIndex] ? true : false}
                      onClick={(e) => {
                        let ck = { ...this.state.ck };
                        ck[dataIndex] = e.target.checked;
                        let rows = this.state.rows;
                        if (e.target.checked) {
                          rows[dataIndex] = dataItem;
                        } else {
                          delete rows[dataIndex];
                        }

                        let showPrintBtn;
                        if (Object.keys(rows).length) showPrintBtn = true;
                        else showPrintBtn = false;
                        this.setState({
                          ck,
                          rows,
                          showPrintBtn,
                        });
                      }}
                    />
                  </td>
                )}
                {dataItem.map((item, itemIndex) => {
                  //array for particular row
                  var respHeader = reportHeaderObj[itemIndex];
                  if (respHeader.showColumn) {
                    return (
                      <td
                        key={itemIndex}
                        style={this.getStyleForCell(itemIndex)}
                        onClick={(e) => {
                          drillDown(e, dataIndex, itemIndex, dataItem, item);
                        }}
                      >
                        {respHeader.defaultValue ? <a href="javascript:void(0)">{checkIfDate(item, itemIndex)}</a> : checkIfDate(item, itemIndex)}
                      </td>
                    );
                  } else {
                    return (
                      <td
                        key={itemIndex}
                        style={{ display: "none" }}
                        onClick={(e) => {
                          drillDown(e, dataIndex, itemIndex, dataItem, item);
                        }}
                      >
                        {respHeader.defaultValue ? <a href="javascript:void(0)">{checkIfDate(item, itemIndex)}</a> : checkIfDate(item, itemIndex)}
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        {/*this.renderFooter()*/}
      </tbody>
    );
  };

  renderFooter = () => {
    let { reportResult } = this.props;
    let reportHeaderObj = reportResult.reportHeader;
    if (reportResult && reportResult.reportData && reportResult.reportData.length > 0) {
      footerexist = true;
    } else {
      footerexist = false;
    }
    {
      reportHeaderObj.map((headerObj, index) => {
        let columnObj = {};
        if (headerObj.showColumn) {
          columnObj["showColumn"] = headerObj.showColumn;
          columnObj["total"] = null == headerObj.total ? false : headerObj.total;
          sumColumn.push(columnObj);
        }
      });
      //for 1st column (Sr.No)
      let firstColObj = {};
      firstColObj["total"] = false;
      sumColumn.unshift(firstColObj);
    }

    var intVal = function (i) {
      if (typeof i === "string") {
        let a = i.replace(/,/g, "");
        a = a.replace(/[^-+0-9. ]/g, " ").split(" ")[0];
        let inta = a && Number(a);
        return inta;
      } else if (typeof i === "number") {
        return i;
      }
    };

    let total = [];
    for (let i = 0; i < reportResult.reportData.length; i++) {
      for (let j = 0; j < reportResult.reportData[i].length; j++) {
        let val = intVal(reportResult.reportData[i][j]);
        if (i == 0) {
          if (sumColumn[j + 1].total && typeof val === "number") {
            total.push(val);
          } else {
            total.push("");
          }
          continue;
        }
        if (sumColumn[j + 1].total) {
          if (typeof val === "number") {
            if (typeof total[j] === "string") {
              total[j] = val;
            } else {
              total[j] += val;
            }
          }
        }
      }
    }

    if (footerexist) {
      return (
        <tfoot>
          <tr className="total">
            {sumColumn.map((columnObj, index) => {
              return (
                <th style={index !== 0 ? { textAlign: "right" } : {}} key={index}>
                  {index === 0
                    ? getLocaleLabels('RT_TOTAL',"RT_TOTAL")
                    : this.addCommas(Number(total[index - 1]) % 1 === 0 ? total[index - 1] : Number(total[index - 1]).toFixed(2))}
                </th>
              );
            })}
          </tr>
        </tfoot>
      );
    }
  };

  subHeader = (moduleName) => {
    let { metaData } = this.props;
    if (_.isEmpty(metaData)) {
      return;
    }

    let result = metaData && metaData.reportDetails && metaData.reportDetails.summary ? metaData.reportDetails.summary : "";

    this.setState({ reportSubTitle: result });
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
    return reportTitle;
  };

  getXlsReportTitle = (rptName) => {
    let reportName = rptName || this.state.reportName;
    let reportTitleArr = reportName && reportName.split(/(?=[A-Z])/);
    let reportTitle = "";
    let reportHeaderName = "";
    if (reportTitleArr) {
      reportTitle = reportTitleArr.map((char) => {
        if (char.length == 1) {
          reportTitle = char + "";
          reportHeaderName += char;
        } else if (typeof char === "object") {
          reportTitle = char.text + "";
        } else {
          reportTitle = " " + char;
          reportHeaderName = reportHeaderName + " " + char
        }
        return reportTitle;
      });
    }
    // return reportTitle;
    return [reportHeaderName];
  };


  render() {
    let { isTableShow, metaData, reportResult } = this.props;
    let self = this;
    const viewTabel = () => {
      return (
        // <div>
              <div class="table-responsive">  

          <table
            id="reportTable"
            style={{
              width: "100%",
            }}
            className="table table-striped table-bordered"
          >
            {self.renderHeader()}
            {self.renderBody()}

            {this.renderFooter()}
          </table>
          {metaData.reportDetails && metaData.reportDetails.viewPath && metaData.reportDetails.selectiveDownload && self.state.showPrintBtn ? (
            <div style={{ textAlign: "center" }}>
              <RaisedButton
                style={{ marginTop: "10px" }}
                label={translate("reports.print.details")}
                onClick={() => {
                  self.printSelectedDetails();
                }}
                primary={true}
              />
            </div>
          ) : (
            ""
          )}
          <br />
        </div>
      );
    };
    return isTableShow ? (
      <div>
        <div className="report-result-table">
          {isTableShow && !_.isEmpty(reportResult) && reportResult.hasOwnProperty("reportData") && viewTabel()}
        </div>
      </div>
    ) : null;
  }
}
const mapStateToProps = (state) => {
  return {
    isTableShow: state.formtemp.showTable,
    metaData: state.report.metaData,
    reportResult: state.report.reportResult,
    flag: state.report.flag,
    searchForm: state.formtemp.form,
    searchParams: state.report.searchParams,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setReportResult: (reportResult) => {
    dispatch({ type: "SET_REPORT_RESULT", reportResult });
  },
  setFlag: (flag) => {
    dispatch({ type: "SET_FLAG", flag });
  },
  toggleSnackbarAndSetText: (snackbarState, toastMsg) => {
    dispatch({ type: "TOGGLE_SNACKBAR_AND_SET_TEXT", snackbarState, toastMsg });
  },
  setRoute: (route) => dispatch({ type: "SET_ROUTE", route }),
  pushReportHistory: (history) => {
    dispatch({ type: "PUSH_REPORT_HISTORY", reportData: history });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowField);
