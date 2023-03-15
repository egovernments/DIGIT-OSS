import React from "react";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const MihyTypegraphy=(props)=>{
  const {children,variant,color,...rest}=props;
  return (
    <Typography variant={variant} color={color} {...rest}>
        {children}
    </Typography>
  )
}

MihyTypegraphy.propTypes = {
  variant:PropTypes.string,
  color:PropTypes.string
}

MihyTypegraphy.defaultProps = {
  variant:"title",
  color:"inherit"
}

export default MihyTypegraphy;
