import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import styles from '../../../styles/material-ui';
import { translate } from '../../common/common';

class ServerSideTable extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    this.setState({
      resultList: this.props.resultSet,
      pageCount: this.props.pageCount,
      userSearch: false,
      value: '',
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.resultSet !== nextProps.resultSet) {
      this.setState({
        resultList: nextProps.resultSet,
        pageCount: nextProps.pageCount,
        userSearch: false,
        value: '',
      });
    }
  }
  handleNavigation = path => {
    this.props.setRoute(path);
  };
  handleChange = event => {
    var results = [];
    let toSearch = event.target.value.toLowerCase();
    for (var i = 0; i < this.state.resultList.reportReponseData.length; i++) {
      for (var key in this.state.resultList.reportReponseData[i]) {
        if (this.state.resultList.reportReponseData[i][key].toLowerCase().indexOf(toSearch) != -1) {
          results.push(this.state.resultList.reportReponseData[i]);
        }
      }
    }
    this.setState({
      userSearch: true,
      value: event.target.value,
      userSearchResult: results,
    });
  };
  renderHeader = () => {
    let { resultList } = this.state;
    if (resultList) {
      if (resultList.reportReponseData && resultList.reportReponseData.length > 0) {
        return Object.keys(resultList.reportReponseData[0]).map((header, index) => {
          return <th key={index}>{header}</th>;
        });
      }
    }
  };
  renderBody = () => {
    let { resultList, userSearchResult, userSearch } = this.state;
    if (resultList) {
      var searchResponse = userSearch ? userSearchResult : resultList.reportReponseData;
      if (searchResponse && searchResponse.length > 0) {
        return searchResponse.map((obj, index) => {
          return (
            <tr key={index}>
              {Object.values(obj).map((data, idx) => {
                if (Object.values(resultList.reportActionData[0])[idx].trim()) {
                  return (
                    <td key={idx}>
                      <a
                        href="javascript:void(0)"
                        onClick={e => {
                          this.handleNavigation(Object.values(resultList.reportActionData[0])[idx] + encodeURIComponent(data));
                        }}
                      >
                        {data}
                      </a>
                    </td>
                  );
                } else {
                  return <td key={idx}>{data}</td>;
                }
              })}
            </tr>
          );
        });
      }
    }
  };
  showPagination = () => {
    return (
      <Col md={12}>
        <div style={{ textAlign: 'center' }}>
          <ReactPaginate
            previousLabel={translate('pgr.lbl.previous')}
            nextLabel={translate('pgr.lbl.next')}
            breakLabel={<a href="">...</a>}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
      </Col>
    );
  };
  handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * 10);
    this.props.search(true, offset);
  };
  render() {
    return (
      <Card style={styles.marginStyle}>
        <CardHeader style={{ paddingBottom: 0 }} title={<div style={styles.headerStyle}> {translate('pgr.searchresult')} </div>} />
        <CardText style={{ paddingTop: 0 }}>
          <Row>
            <Col mdOffset={7} md={3}>
              <label className="pull-right">Search: </label>
            </Col>
            <Col md={2}>
              <input
                type="text"
                className="form-control"
                value={this.state.userSearch ? this.state.value : ''}
                onChange={this.handleChange}
                style={{ marginBottom: 5 }}
              />
            </Col>
            <Col md={12}>
              <Table style={{ color: 'black', fontWeight: 'normal' }} bordered responsive className="table-striped">
                <thead>
                  <tr>{this.renderHeader()}</tr>
                </thead>
                <tbody>{this.renderBody()}</tbody>
              </Table>
            </Col>
            {this.showPagination()}
          </Row>
        </CardText>
      </Card>
    );
  }
}

// export default ServerSideTable;
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setRoute: route => dispatch({ type: 'SET_ROUTE', route }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerSideTable);
