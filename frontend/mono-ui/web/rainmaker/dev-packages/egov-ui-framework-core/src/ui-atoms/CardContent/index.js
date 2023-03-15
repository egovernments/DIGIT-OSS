import React from 'react';
import PropTypes from 'prop-types';
import CardContent from '@material-ui/core/CardContent';


const SimpleCardContent=(props)=> {
  const { children,...rest } = props;
  return (
      <CardContent {...rest}>
        {children}
      </CardContent>
  );
}

SimpleCardContent.propTypes = {
  children: PropTypes.any.isRequired,
};

export default SimpleCardContent;
