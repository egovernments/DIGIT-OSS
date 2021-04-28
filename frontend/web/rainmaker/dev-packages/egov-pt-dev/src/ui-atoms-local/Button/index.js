import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import "./index.css";


const MihyButton =(props)=>{
  const {children,...rest}=props;
  return(
    <Button {...rest}>
      {children}
    </Button>
  )
}


MihyButton.propTypes={
  children:PropTypes.any
}

export default MihyButton;
