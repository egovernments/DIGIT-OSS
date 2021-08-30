import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import Checkbox from 'material-ui/Checkbox';
import { translate } from '../../common/common';
import PropTypes from 'prop-types';
import FileInput from './FileInput';

export default class Documents extends Component {
  constructor() {
    super();
  }

  componentWillMount() {}

  renderFileInputs = () => {
    if (!this.props.items) return null;

    return this.props.items.map((attribute, index) => {
      var field = this.props.files.find(field => field.code == attribute.key);
      var files = field ? field.files : [];

      if (attribute.isActive) {
        return (
          <Col key={index} xs={12} md={4} lg={4}>
            <FileInput
              code={attribute.key}
              dialogOpener={this.props.dialogOpener}
              name={attribute.name}
              addFileHandler={this.props.addFileHandler}
              removeFileHandler={this.props.removeFileHandler}
              isRequired={attribute.required}
              files={files}
              error={this.props.errors[attribute.key]}
            />
          </Col>
        );
      }
    });
  };

  render() {
    const fileInputs = this.renderFileInputs();
    return (
      <Col xs={12}>
        <Row>{fileInputs}</Row>
      </Col>
    );
  }
}

Documents.propTypes = {
  items: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      key: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
    })
  ).isRequired,
};
