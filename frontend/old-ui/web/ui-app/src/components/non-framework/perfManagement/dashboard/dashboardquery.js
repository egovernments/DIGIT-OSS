import React, { Component } from 'react';
import { Card, CardText, CardMedia, CardHeader } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import Snackbar from 'material-ui/Snackbar';
import { Grid, Row, Col } from 'react-bootstrap';
import { translate } from '../../../common/common';

import {
  fetchDepartmentKPIsAPI,
  fetchULBsAPI,
  fetchFinancialYearsAPI,
  fetchCompareSearchAPI,
  parseULBResponse,
  parseFinancialYearCurrentPlusNextResponse,
  parseDepartmentKPIsAsPerKPIType,
} from '../apis/apis';
import LoadingIndicator from '../../../common/LoadingIndicator';
import KPISelectField from './kpiselectfield';
import ChartCard from './chartscard';
import TableCard from './tablecard';

var jp = require('jsonpath');

const kpiTypes = [
  {
    name: 'VALUE',
    code: 'VALUE',
  },
  {
    name: 'OBJECTIVE',
    code: 'OBJECTIVE',
  },
  {
    name: 'TEXT',
    code: 'TEXT',
  },
];

export default class KPIDashboardQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiLoading: false,
      kpis: [],
      showKPIQueryView: false,
      showChartView: false,
      showTableView: false,
      showToast: false,

      disableViewButton: false,
      kpiTypeIndex: 0,
      kpiIndices: 0,
      ulbIndices: [0],
      fyIndices: [0],
      toastMsg: '',
      isReportConsolidated: false
    };
    this.kpiTypeLabel = translate('perfManagement.dashboard.query.label.kpiType');
    this.kpiLabel = translate('perfManagement.dashboard.query.label.kpis');
    this.ulbLabel = translate('perfManagement.dashboard.query.label.ULBs');
    this.fyLabel = translate('perfManagement.dashboard.query.label.targetFinancialYears');
    this.ulbRes = null;
    this.fyRes = null;
    this.kpiRes = null;
    this.chartRes = null;
  }

  componentDidMount() {
    this.busyUI(true);
    fetchDepartmentKPIsAPI(this.props.department.id, (err, res) => {
      if (err || !res) {
        this.busyUI(false);
        this.toast(translate('perfManagement.dashboard.query.api.error.department'));
      } else {
        this.kpiRes = res;
        fetchULBsAPI((err, res) => {
          if (err || !res) {
            this.busyUI(false);
            this.toast(translate('perfManagement.dashboard.query.api.error.ulbs'));
          } else {
            this.ulbRes = res;
            fetchFinancialYearsAPI((err, res) => {
              if (err || !res) {
                this.busyUI(false);
                this.toast(translate('perfManagement.dashboard.query.api.error.financialyears'));
              } else {
                this.fyRes = res;
                this.busyUI(false);

                let departmentKPIs = parseDepartmentKPIsAsPerKPIType(this.kpiRes, kpiTypes[this.state.kpiTypeIndex].name);
                if (departmentKPIs.length === 0) {
                  this.setState({
                    disableViewButton: true,
                  });
                }
                this.setState({
                  showKPIQueryView: true,
                });
              }
            });
          }
        });
      }
    });
  }

  /**
   * SelectField manipulations.
   */
  processSelectOnKPISelectField = (index, values, label) => {
    if (label === this.kpiTypeLabel) {
      this.setState({
        kpiTypeIndex: index,
        showChartView: false,
        showTableView: false,
      });

      let departmentKPIs = parseDepartmentKPIsAsPerKPIType(this.kpiRes, kpiTypes[this.state.kpiTypeIndex].name);
      if (departmentKPIs.length === 0) {
        this.setState({
          disableViewButton: true,
        });
      }
    }

    if (label === this.kpiLabel) {
      this.setState({
        kpiIndices: values,
      });
    }

    if (label === this.ulbLabel) {
      if (values.length > 1) {
        if (this.state.fyIndices.length > 1) {
          this.toast(translate('perfManagement.dashboard.query.user.error.multiplefinancialyears'));
        } else {
          this.setState({
            ulbIndices: values,
          });
        }
      } else {
        this.setState({
          ulbIndices: values,
        });
      }
    }
    if (label === this.fyLabel) {
      if (values.length > 1) {
        if (this.state.ulbIndices.length > 1) {
          this.toast(translate('perfManagement.dashboard.query.user.error.multipleulbs'));
        } else {
          this.setState({
            fyIndices: values,
          });
        }
      } else {
        this.setState({
          fyIndices: values,
        });
      }
    }

    if (values.length === 0) {
      this.setState({
        disableViewButton: true,
      });
    } else {
      this.setState({
        disableViewButton: false,
      });
    }
  };

  processOnClickViewConsolidateButton = () => {
    this.processViewReport(true)
  }
  processOnClickViewButton = () => {
    this.processViewReport(false)
  }

  processViewReport = (isConsolidated) => {
    let finYears = this.state.fyIndices.map((item, index) => parseFinancialYearCurrentPlusNextResponse(this.fyRes)[item]['finYearRange']).join(',');
    let ulbs = this.state.ulbIndices.map((item, index) => jp.query(this.ulbRes, `$.MdmsRes.tenant.tenants[${item}].code`)).join(',');
    let kpis = parseDepartmentKPIsAsPerKPIType(this.kpiRes, kpiTypes[this.state.kpiTypeIndex].name)[this.state.kpiIndices]['code'];

    this.setState({
      showChartView: false,
      showTableView: false,
    });

    this.busyUI(true);
    fetchCompareSearchAPI(finYears, kpis, ulbs, (err, res) => {
      this.busyUI(false);
      if (err || !res) {
        this.toast(translate('perfManagement.dashboard.query.api.error.reportdata'));
      } else {
        this.chartRes = res;

        if (kpiTypes[this.state.kpiTypeIndex].name === 'TEXT') {
          this.setState({
            showChartView: false,
            showTableView: true,
            isReportConsolidated: isConsolidated
          });
        } else {
          this.setState({
            showChartView: true,
            showTableView: false,
            isReportConsolidated: isConsolidated
          });
        }
      }
    });
  }

  /**
   * render
   */
  render() {
    return (
      <div>
        {this.renderUIBusy()}
        {this.renderKPIQueryView()}
        {this.renderKPIData()}
        {this.renderToast()}
      </div>
    );
  }

  /**
   * render
   * present card with query options
   */
  renderKPIQueryView = () => {
    if (!this.state.showKPIQueryView) {
      return <div />;
    }
    const style = {
      margin: 12,
      refresh: {
        display: 'inline-block',
        position: 'relative',
        zIndex: 9999,
        marginLeft: '50%',
        marginTop: '20%',
      },
    };
    let departmentKPIs = parseDepartmentKPIsAsPerKPIType(this.kpiRes, kpiTypes[this.state.kpiTypeIndex].name);

    return (
      <div>
        <br />
        <RaisedButton
          label={translate('perfManagement.dashboard.common.nav.back')}
          style={{ margin: '15px' }}
          primary={true}
          type="button"
          onClick={this.props.onBackClicked}
          icon={
            <i className="material-icons" style={{ color: 'white' }}>
              arrow_back
            </i>
          }
        />
        <br />
        <br />
        <Card className="uiCard">
          <CardHeader title={<strong style={{ fontSize: '18px' }}>{translate('perfManagement.dashboard.query.label.kpidashboard')}</strong>} />
          <Grid fluid>
            <Row>
              <Col xs={12} sm={3} md={3}>
                <KPISelectField
                  label={this.kpiTypeLabel}
                  mandatory={true}
                  multiple={false}
                  disabled={false}
                  displayKey={'name'}
                  value={this.state.kpiTypeIndex}
                  items={kpiTypes}
                  onItemsSelected={this.processSelectOnKPISelectField}
                />
              </Col>
              <Col xs={12} sm={3} md={3}>
                <KPISelectField
                  label={this.kpiLabel}
                  mandatory={true}
                  multiple={false}
                  disabled={false}
                  displayKey={'name'}
                  value={this.state.kpiIndices}
                  items={departmentKPIs}
                  onItemsSelected={this.processSelectOnKPISelectField}
                />
              </Col>
              <Col xs={12} sm={3} md={3}>
                <KPISelectField
                  label={this.ulbLabel}
                  mandatory={true}
                  multiple={true}
                  disabled={false}
                  displayKey={'name'}
                  value={this.state.ulbIndices}
                  items={parseULBResponse(this.ulbRes)}
                  onItemsSelected={this.processSelectOnKPISelectField}
                />
              </Col>
              <Col xs={12} sm={3} md={3}>
                <KPISelectField
                  label={this.fyLabel}
                  mandatory={true}
                  multiple={true}
                  disabled={false}
                  displayKey={'name'}
                  value={this.state.fyIndices}
                  items={parseFinancialYearCurrentPlusNextResponse(this.fyRes)}
                  onItemsSelected={this.processSelectOnKPISelectField}
                />
              </Col>
            </Row>
          </Grid>
        </Card>

        <div style={{ textAlign: 'center' }}>
          <br />
          <RaisedButton
            label={translate('perfManagement.dashboard.common.nav.monthlyView')}
            style={style}
            primary={true}
            type="button"
            onClick={this.processOnClickViewButton}
            disabled={this.state.disableViewButton}
          />
          <RaisedButton
            label={translate('perfManagement.dashboard.common.nav.consolidatedView')}
            style={style}
            primary={true}
            type="button"
            onClick={this.processOnClickViewConsolidateButton}
            disabled={this.state.disableViewButton}
          />
        </div>
      </div>
    );
  };

  /**
   * callback
   * toggle between tablecard and barchartcard
   */
  processOnClickKPIDataRepresentation = view => {
    if (view === 'chartview') {
      this.setState({
        showChartView: false,
        showTableView: true,
      });
    } else {
      if (kpiTypes[this.state.kpiTypeIndex].name === 'TEXT') {
        translate('perfManagement.dashboard.query.user.error.noChartForTextType')
      } else {
        this.setState({
          showChartView: true,
          showTableView: false,
        });
      }
    }
  };

  /**
   * render
   * display charts for the selected values
   */
  renderKPIData = () => {
    if (!this.state.showChartView && !this.state.showTableView) {
      return <div />;
    }
    let finYears = this.state.fyIndices.map((item, index) => jp.query(this.fyRes, `$.MdmsRes["egf-master"].FinancialYear[${item}].finYearRange`)).join(',');
    let kpis = parseDepartmentKPIsAsPerKPIType(this.kpiRes, kpiTypes[this.state.kpiTypeIndex].name)[this.state.kpiIndices]['name'];

    if (this.state.showChartView) {
      return (
        <ChartCard
          data={this.chartRes}
          finYears={finYears}
          ulbs={this.ulbRes}
          kpis={kpis}
          kpiType={kpiTypes[this.state.kpiTypeIndex].name}
          toggleDataViewFormat={this.processOnClickKPIDataRepresentation}
          isReportConsolidated={this.state.isReportConsolidated}
        />
      );
    }

    if (this.state.showTableView) {
      return (
        <TableCard 
          data={this.chartRes} 
          finYears={finYears} 
          ulbs={this.ulbRes}
          kpis={kpis} 
          kpiType={kpiTypes[this.state.kpiTypeIndex].name} 
          toggleDataViewFormat={this.processOnClickKPIDataRepresentation} 
          isReportConsolidated={this.state.isReportConsolidated}
        />
      );
    }

    return <div />;
  };

  /**
   * render
   * show/hide UI busy
   */
  renderUIBusy = () => {
    return this.state.apiLoading ? <LoadingIndicator status={'loading'} /> : <LoadingIndicator status={'hide'} />;
  };
  /**
   * render
   * display Snackbar to inform user
   */
  renderToast = () => {
    if (!this.state.showToast) {
      return <div />;
    }
    return (
      <Snackbar
        open={this.state.showToast}
        message={this.state.toastMsg}
        autoHideDuration={3000}
        onRequestClose={() => {
          this.setState({
            showToast: false,
          });
        }}
      />
    );
  };

  /**
   * helpers
   */
  toast = msg => {
    console.log(msg);

    this.setState({
      showToast: true,
      toastMsg: msg,
    });
  };

  busyUI = status => {
    this.setState({
      apiLoading: status,
    });
  };
}
