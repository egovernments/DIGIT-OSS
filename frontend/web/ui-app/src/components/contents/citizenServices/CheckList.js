import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Checkbox from 'material-ui/Checkbox';
import { translate } from '../../common/common';
import PropTypes from 'prop-types';

const styles = {
  checkbox: {
    marginBottom: 5,
    marginTop: 10,
  },
};

export default class CheckList extends Component {
  constructor() {
    super();
  }

  renderCheckBoxItems = () => {
    if (!this.props.items) return null;

    return this.props.items.map((attribute, index) => {
      if (attribute.isActive)
        return (
          <CheckBoxItem
            key={index}
            error={this.props.errors[attribute.key]}
            obj={attribute}
            handler={this.props.handler}
            value={this.props.values[attribute.key]}
          />
        );
    });
  };

  render() {
    const checkBoxList = this.renderCheckBoxItems();
    return <Col xs={12}>{checkBoxList}</Col>;
  }
}

class CheckBoxItem extends Component {
  render() {
    return (
      <div>
        <Checkbox
          ref={this.props.obj.key}
          checked={this.props.value ? this.props.value : false}
          onCheck={(e, isChecked) => {
            this.props.handler(isChecked ? true : '', this.props.obj.key, this.props.obj.required || false, '');
          }}
          label={translate(this.props.obj.name) + (this.props.obj.required ? ' *' : '')}
          style={styles.checkbox}
        />
        {this.props.error ? <span className="errorMsg">{this.props.error}</span> : null}
      </div>
    );
  }
}

CheckList.propTypes = {
  items: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      key: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
    })
  ).isRequired,
};
