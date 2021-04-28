import React from "react";
import PropTypes from "prop-types";
import ListItem from '@material-ui/core/ListItem';

const MihyListItem=(props)=>{
  const {children,...rest}=props;
  return(
    <ListItem {...rest}>
      {children}
    </ListItem>
  )
}

MihyListItem.propTypes={
  children:PropTypes.any
}

export default MihyListItem;
