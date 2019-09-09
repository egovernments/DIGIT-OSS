import React from "react";
import PropTypes from "prop-types";
import Toolbar from '@material-ui/core/Toolbar';

const MihyToolBar=(props)=>{
  const {children,...rest}=props;
  return(
    <Toolbar {...rest}>
      {children}
    </Toolbar>
  )
}

MihyToolBar.propTypes={
  children:PropTypes.any
}

export default MihyToolBar;
