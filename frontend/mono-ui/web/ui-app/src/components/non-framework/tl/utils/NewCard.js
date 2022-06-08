import React, { Component } from 'react';
import { translate } from '../../../common/common';
import { Grid, Row } from 'react-bootstrap';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import RenderField from './RenderField';

const customStyles = {
  cardTitle: {
    padding: '16px 16px 0',
  },
};

export default class NewCard extends Component {
  render() {
    const renderedFields = this.props.fields.map((field, index) => {
      if (field.type === 'autocomplete')
        return (
          <RenderField
            key={index}
            field={field}
            error={this.props.fieldErrors[field.code] || ''}
            isDisabled={field.isDisabled || false}
            autocompleteDataSource={this.props.autocompleteDataSource[field.code] || []}
            autocompleteDataSourceConfig={this.props.autocompleteDataSource[field.code + 'Config']}
            autocompleteKeyUp={this.props.autoCompleteKeyUp}
            value={this.props.form[field.code] || ''}
            handleChange={this.props.handleChange}
          />
        );
      else if (field.type === 'dropdown')
        return (
          <RenderField
            key={index}
            field={field}
            error={this.props.fieldErrors[field.code] || ''}
            isDisabled={field.isDisabled || false}
            dropdownDataSource={this.props.dropdownDataSource[field.code] || []}
            nameValue={field.codeName ? this.props.form[field.codeName] || '' : ''}
            dropdownDataSourceConfig={this.props.dropdownDataSource[field.code + 'Config']}
            value={this.props.form[field.code] || ''}
            handleChange={this.props.handleChange}
          />
        );
      else if (field.type === 'textSearch')
        return (
          <RenderField
            key={index}
            field={field}
            error={this.props.fieldErrors[field.code] || ''}
            isDisabled={field.isDisabled || false}
            customSearch={this.props.customSearch}
            value={this.props.form[field.code] || ''}
            handleChange={this.props.handleChange}
          />
        );
      else
        return (
          <RenderField
            key={index}
            field={field}
            error={this.props.fieldErrors[field.code] || ''}
            isDisabled={field.isDisabled || false}
            value={this.props.form[field.code] || ''}
            handleChange={this.props.handleChange}
          />
        );
    });

    return (
      <Card>
        <CardTitle style={customStyles.cardTitle} title={translate(this.props.title)} />
        <CardText>
          <Grid fluid={true}>
            <Row>{renderedFields}</Row>
          </Grid>
        </CardText>
      </Card>
    );
  }
}
