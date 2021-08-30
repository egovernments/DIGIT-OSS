import React, { Component } from 'react';
import { Grid, Row, Col, Table, DropdownButton } from 'react-bootstrap';
import { Card, CardHeader, CardText } from 'material-ui/Card';

export default class CommentDoc extends Component {
  componentDidMount() {}

  render() {
    let self = this;
    return (
      <Card className="uiCard">
        <CardHeader
          style={{ paddingTop: 4, paddingBottom: 0 }}
          title={<div style={{ color: '#354f57', fontSize: 18, margin: '8px 0' }}>Comments & Documents</div>}
        />
        <CardText style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Grid>
            <Row>
              <Col md={6} xs={12}>
                <Table responsive style={{ fontSize: 'bold' }} bordered condensed>
                  <thead>
                    <tr>
                      <th>By</th>
                      <th>Date</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {self.props.ServiceRequest && self.props.ServiceRequest.comments && self.props.ServiceRequest.comments.length ? (
                      self.props.ServiceRequest.comments.map(function(v, i) {
                        return (
                          <tr
                            key={i}
                            style={{
                              backgroundColor: v.from == JSON.parse(localStorage.userRequest).userName ? '#EEE' : '#FFFFFF',
                            }}
                          >
                            <td>{v.from}</td>
                            <td>{self.props.getFullDate(v.timeStamp)}</td>
                            <td>{v.text}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td style={{ textAlign: 'center' }} colSpan={3}>
                          No comments yet!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
              <Col md={6} xs={12}>
                <Table responsive style={{ fontSize: 'bold' }} bordered condensed>
                  <thead>
                    <tr>
                      <th>By</th>
                      <th>Date</th>
                      <th>File Name</th>
                      {self.props.showRemarks ? <th>Remarks</th> : ''}
                      <th>Final</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {self.props.ServiceRequest && self.props.ServiceRequest.documents && self.props.ServiceRequest.documents.length ? (
                      self.props.ServiceRequest.documents.map(function(v, i) {
                        return (
                          <tr key={i}>
                            <td>{v.from + (v.from == JSON.parse(localStorage.userRequest).userName ? ' (You)' : '')}</td>
                            <td>{self.props.getFullDate(v.timeStamp)}</td>
                            <td>{v.name}</td>
                            {self.props.showRemarks ? <td>{v.remarks}</td> : ''}
                            <td>{v.isFinal ? 'Yes' : ''}</td>
                            <td>
                              <a
                                target="_blank"
                                href={'/filestore/v1/files/id?tenantId=' + localStorage.getItem('tenantId') + '&fileStoreId=' + v.filePath}
                              >
                                Download
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td style={{ textAlign: 'center' }} colSpan={self.props.showRemarks ? 5 : 4}>
                          No documents uploaded!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Grid>
        </CardText>
      </Card>
    );
  }
}
