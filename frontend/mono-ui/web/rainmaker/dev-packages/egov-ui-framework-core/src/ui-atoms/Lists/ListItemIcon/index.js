import React from "react";
import PropTypes from "prop-types";
import ListItemIcon from '@material-ui/core/ListItemIcon';

const MihyListItemIcon=(props)=>{
  const {children,...rest}=props;
  return(
    <ListItemIcon {...rest}>
      {children}
    </ListItemIcon>
  )
}

MihyListItemIcon.propTypes={
  children:PropTypes.any
}

export default MihyListItemIcon;
