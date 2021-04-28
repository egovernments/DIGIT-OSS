import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

const Container =(props)=>{
  const {children,spacing,...rest}=props;
  return(
    <Grid container spacing={spacing} {...rest}>
      {children}
    </Grid>
  )
}

Container.propTypes={
  children:PropTypes.any.isRequired,
  spacing:PropTypes.number.isRequired
}

Container.defaultProps={
  spacing:8
}

export default Container;
