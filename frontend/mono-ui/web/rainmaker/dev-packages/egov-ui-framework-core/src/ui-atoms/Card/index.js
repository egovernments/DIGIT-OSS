import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import "./index.css";

const SimpleCard=(props)=> {
  const { children,...rest } = props;
  return (
      <Card classes={{
        root:"mihy-card"
      }} {...rest}>
        {children}
      </Card>
  );
}

SimpleCard.propTypes = {
  children: PropTypes.any,
};

export default SimpleCard;
