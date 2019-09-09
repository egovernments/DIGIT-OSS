import React from "react";
import PropTypes from "prop-types";
import Drawer from '@material-ui/core/Drawer';

const MihyDrawer=(props)=>{
  const {children,...rest}=props;
  return (
    <Drawer {...rest}>
      {children}
    </Drawer>
  )
}

MihyDrawer.propTypes={
  children:PropTypes.any
}

export default MihyDrawer;
