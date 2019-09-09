import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

const Conatainer =(props)=>{
  const {children,...rest}=props;
  return(
    <Grid item {...rest}>
      {children}
    </Grid>
  )
}

Conatainer.propTypes={
  children:PropTypes.any
}


export default Conatainer;
