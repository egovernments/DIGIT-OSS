import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import styles from '../../../styles/material-ui';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { translate } from '../common';

const customStyles = {
  titleStyle: {
    paddingBottom: 0,
  },
};

export default class PdfViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfData: undefined,
    };
  }

  render() {
    return (
      <Grid style={styles.fullWidth}>
        <Card style={styles.marginStyle}>
          <CardTitle title={translate(this.props.title)} style={customStyles.titleStyle} />
          <CardText>
            <iframe title={translate(this.props.title)} type="application/pdf" style={{ width: '100%' }} height="500" src={this.props.pdfData} />
            {this.props.children}
          </CardText>
        </Card>
      </Grid>
    );
  }
}
