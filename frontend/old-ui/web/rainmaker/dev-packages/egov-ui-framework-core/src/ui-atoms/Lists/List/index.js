import React from "react";
import PropTypes from "prop-types";
import List from '@material-ui/core/List';

const MihyList=(props)=>{
  const {children,...rest}=props;
  return(
    <List {...rest}>
      {children}
    </List>
  )
}

MihyList.propTypes={
  children:PropTypes.any
}

export default MihyList;
