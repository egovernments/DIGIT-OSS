import React, { Component } from 'react';
import { translate } from '../../../common/common';
import { Grid, Row, Col } from 'react-bootstrap';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

const style = {
  cardText: {
    textAlign: 'center',
    padding: '16px 16px 0',
  },
  cardTitle: {
    textAlign: 'center',
  },
};

export default class MsgCard extends Component {
  render() {
    let { msg, icon } = this.props;
    return (
      <Grid>
        <br />
        <br />
        <Row>
          <Col xs={12} mdOffset={3} md={6}>
            <Card>
              <CardText style={style.cardText}>
                <Avatar icon={icon} size={60} />
              </CardText>
              <CardTitle title={msg} style={style.cardTitle} />
            </Card>
          </Col>
        </Row>
      </Grid>
    );
  }
}
