import React from "react";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';

const MihyAppbar=(props)=>{
  const {children,position,...rest}=props;
  return (
    <AppBar position={position} {...rest}>
      {children?children:null}
    </AppBar>
  )
}

MihyAppbar.propTypes = {
  position: PropTypes.string.isRequired,
};

MihyAppbar.defaultProps= {
  position:"static"
}

export default MihyAppbar;
