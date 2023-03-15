import React from "react";
import PropTypes from "prop-types";
import InputAdornment from '@material-ui/core/InputAdornment';

const MihyInputAdornment=(props)=>{
  const {children,...rest}=props;
  return (
    <InputAdornment {...rest}>
      {children}
    </InputAdornment>
  )
}

MihyInputAdornment.propTypes={
  children:PropTypes.any
}


export default MihyInputAdornment;
