import React, { Component } from 'react';
import { Card, CardText, CardMedia, CardHeader, CardTitle } from 'material-ui/Card';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import {
  parseCompareSearchResponse,
  parseCompareSearchConsolidatedResponse,
  formatChartDataForFileStoreIds,
  parseTenantName,
  fetchFileMetadataByFileStoreId,
  fetchFileByFileStoreId,
  fetchFilesMetadata,
} from '../apis/apis';
import {
  formatChartData,
  formatConsolidatedChartData,
} from '../apis/helpers';
import { translate } from '../../../common/common';

export default class TableCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataKey: null,
      showChartView: true,
      chartDataIndex: 1,
      maxChartData: 0,
    };
    this.kpis = this.props.kpis;
    this.filesMetadata = [];
  }
  componentDidMount() {

    if (this.props.isReportConsolidated) {
      formatConsolidatedChartData(parseCompareSearchConsolidatedResponse(this.props.data, this.props.kpiType === 'TEXT' ? true : false), (data, dataKey) => {
        if (!data || !dataKey) {
        } else {
          this.setState({
            data: data,
            dataKey: dataKey,
          });
        }
      });
    } else {
      formatChartData(parseCompareSearchResponse(this.props.data, this.props.kpiType === 'TEXT' ? true : false), (data, dataKey) => {
        if (!data || !dataKey) {
        } else {
          fetchFilesMetadata(formatChartDataForFileStoreIds(data), (err, res) => {
            this.filesMetadata = res
            console.log(this.filesMetadata)

            this.setState({
              data: data,
              dataKey: dataKey,
              chartDataIndex: 1,
              maxChartData: data.length,
            });
          })
        }
      });
    }
  }

  processOnClickKPIDataRepresentation = () => {
    this.props.toggleDataViewFormat('tableview');
  };

  processOnClickNextKPIData = () => {
    if (this.state.chartDataIndex < this.state.maxChartData) {
      this.setState({
        chartDataIndex: this.state.chartDataIndex + 1
      })
    } else {
      this.setState({
        chartDataIndex: this.state.maxChartData
      })
    }
  }

  processOnClickPreviousKPIData = () => {
    if (this.state.chartDataIndex > 1) {
      this.setState({
        chartDataIndex: this.state.chartDataIndex - 1
      })
    } else {
      this.setState({
        chartDataIndex: 1
      })
    }
  }

  processOnClickDownloadAttachments = (fileStoreId, ulbName) => {
    fetchFileByFileStoreId(fileStoreId, ulbName)
  }

  getTableHeaders = () => {
    if (this.props.isReportConsolidated) {
      return Object.keys(this.state.data[0]);
    }
    return Object.keys(this.state.data[this.state.chartDataIndex - 1].data[0])
          .filter((elem) => {return elem.toUpperCase() !== 'ULBNAME'})
          .filter((elem) => {return elem.toUpperCase() !== 'PERIOD'})
          .filter((elem) => {return elem.toUpperCase() !== 'VALUE'});
  }

  getTableData = () => {
    if (this.props.isReportConsolidated) {
      return this.state.data;
    }
    return this.state.data[this.state.chartDataIndex - 1];
  }

  getULBName = (code) => {
    let ulbName = parseTenantName(this.props.ulbs, code);
    if (ulbName.length == 0) {
      return code
    }
    return ulbName[0]['name']
  }

  getObjectiveValue(value) {
    switch (value) {
      case 1:
        return 'YES';
      case 2:
        return 'NO';
      case 3:
        return 'IN PROGRESS';
    
      default:
        return 'NO';
    }
  }

  getModifiedChartData = (data) => {
    if (this.props.kpiType === 'OBJECTIVE') {
      if (this.props.isReportConsolidated) {
        return data.map((item, index) => {
          return {
            ...item,
            ulbName: this.getULBName(item.ulbName),
            target: this.getObjectiveValue(item.target),
            value: this.getObjectiveValue(item.value)
          }
        })
      }
      return data.map((item, index) => {
        return {
          ...item,
          ulbName: this.getULBName(item.ulbName),
          target: this.getObjectiveValue(item.target),
          monthlyValue: this.getObjectiveValue(item.monthlyValue)
        }
      })
    }
    return data.map((item, index) => {
      return {
        ...item,
        ulbName: this.getULBName(item.ulbName)
      }
    })
  }

  getChartData = () => {
    if (this.state.data.length === 0) {
      return []
    }

    if (this.props.isReportConsolidated) {
      return this.state.data;
    }
    return this.state.data[this.state.chartDataIndex - 1].data;
  }

  getReportTitle = () => {
    if (this.props.isReportConsolidated) {
      return `${translate('perfManagement.dashboard.chart.consolidated.msg1')} ${this.props.kpis} ${translate('perfManagement.dashboard.chart.consolidated.msg2')}`
    }
    let data = this.state.data[this.state.chartDataIndex - 1]
    let ulbName = this.getULBName(data['ulbName']); 
    return `${translate('perfManagement.dashboard.chart.monthly.msg1')} ${this.props.kpis} ${translate('perfManagement.dashboard.chart.monthly.msg2')} ${ulbName} ${translate('perfManagement.dashboard.chart.monthly.msg3')} ${data.finYear}`
  }

  getColumnName = (name) => {
    if (name === 'FINYEAR') return translate('perfManagement.dashboard.table.header.FINYEAR')
    if (name === 'KPINAME') return translate('perfManagement.dashboard.table.header.KPINAME')
    if (name === 'TARGET') return translate('perfManagement.dashboard.table.header.TARGET')
    if (name === 'NAME') return translate('perfManagement.dashboard.table.header.NAME')
    if (name === 'MONTHLYVALUE') return translate('perfManagement.dashboard.table.header.MONTHLYVALUE')
    if (name === 'VALUE') return translate('perfManagement.dashboard.table.header.VALUE')
    if (name === 'ULBNAME') return translate('perfManagement.dashboard.table.header.ULBNAME')
    if (name === 'DOCUMENTIDS') return translate('perfManagement.dashboard.table.header.DOCUMENTIDS')
    return name
  }

  render() {
    return <div>{this.renderKPIData()}</div>;
  }

  /**
   * render
   * toggle between chart & table format
   */
  renderKPIData = () => {
    if (this.state.showChartView) {
      return this.renderReportTable();
    }
  };

  /**
   * render
   * render footnote for consolidated data
   */
  renderConsolidatedFootnote = () => {
    if (!this.props.isReportConsolidated) {
      return (
        <div />
      )
    }
    return (
      <CardText>
        <span style={{ color: '#FF0000' }}> *</span> {translate('perfManagement.dashboard.chart.monthly.msg4')}
      </CardText>
    )
  }

  /**
   * render
   * render insufficient data to draw the chart
   */
  renderInsufficientDataForChart = () => {
    return (
        <div style={{ textAlign: 'center' }}>
          <br />
          <br />
          <Card className="uiCard">
            <CardHeader title={<div style={{ fontSize: '16px' }}> {translate('perfManagement.dashboard.query.user.error.insufficientdata')} </div>} />
          </Card>
        </div>
    );
  }

  /**
   * render
   * presents same data in tabular format
   */
  renderReportTable = () => {
    
    if (this.getChartData().length < 1) {
      return (
        this.renderInsufficientDataForChart()
      )
    }

    return (
      <div>
        <br />
        <br />
        <Card className="uiCard" style={{ textAlign: 'center' }}>
          <CardHeader style={{ paddingBottom: 0 }} title={<div style={{ fontSize: 16, marginBottom: '25px' }}> {this.getReportTitle()} </div>} />
          {this.renderReportNavigationButton(translate('perfManagement.dashboard.chart.type.chart'))}
          {this.renderTable()}
          {this.renderConsolidatedFootnote()}
        </Card>
      </div>
    );
  };

  /**
   * render
   * render table as per provided headers
   */
  renderTable = () => {
    let headers = this.getTableHeaders();
    let data    = this.getModifiedChartData(this.getChartData())
    return (
        <div>
            <Table style={{ color: 'black', fontWeight: 'normal', marginTop: '10px' }} bordered responsive className="table-striped">
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                  <TableRow>{headers.map((item, index) => <TableHeaderColumn key={index}>{this.getColumnName(item.toUpperCase())}</TableHeaderColumn>)}</TableRow>
                </TableHeader>

                <TableBody displayRowCheckbox={false}>
                  {data.map((item, index) => (
                      <TableRow key={index}> 
                          {
                            headers.map((el, index) => 
                              <TableRowColumn 
                                style={{whiteSpace: 'normal', wordWrap: 'break-word'}} 
                                key={index}>
                                  { (el === 'documentIds' && item[el].length > 0) ?  
                                    this.renderAttachmetLinks(item[el]) : item[el]
                                  } 
                              </TableRowColumn>)
                          } 
                      </TableRow>
                  ))}
                </TableBody>
          </Table>
        </div>
    )
  }

  /**
   * render
   * render next/prev button to navigate when report is not consolidated
   */
  renderReportNavigationButton = (label) => {
    if (this.props.isReportConsolidated || this.state.maxChartData === 1) {
      return (
        <RaisedButton
          style={{ marginLeft: '90%' }}
          label={label}
          primary={true}
          type="button"
          disabled={false}
          onClick={this.processOnClickKPIDataRepresentation}
        />
      )
    }

    return (
      <div>
        <RaisedButton
          label={translate('perfManagement.dashboard.common.prev')}
          primary={true}
          type="button"
          disabled={this.state.chartDataIndex === 1 ? true : false}
          onClick={this.processOnClickPreviousKPIData}
        />

        <RaisedButton
          style={{ marginLeft: '10px' }}
          label={translate('perfManagement.dashboard.common.next')}
          primary={true}
          type="button"
          disabled={this.state.chartDataIndex === this.state.maxChartData ? true : false}
          onClick={this.processOnClickNextKPIData}
        />

        <br />
        <RaisedButton
          style={{ marginLeft: '90%' }}
          label={label}
          primary={true}
          type="button"
          disabled={false}
          onClick={this.processOnClickKPIDataRepresentation}
        />
      </div>
    )
  }

  /**
   * render
   * render download files link with name
   */
  renderAttachmetLinks = (fileStoreIds) => {
    let data = this.state.data[this.state.chartDataIndex - 1]
    const listItems =fileStoreIds.map((fileStoreId, index) => {
      let {documentId, fileName} = this.filesMetadata.filter(elem => elem.documentId === fileStoreId)[0]
      return (
        <div key={documentId}>
          <ul key={documentId}>
            <li key={documentId}>
              <a href="" onClick={() => {this.processOnClickDownloadAttachments(documentId, data.ulbName)}}>{fileName} </a>
            </li>
          </ul>
        </div>
      )
    })
    return listItems;
  }
}
