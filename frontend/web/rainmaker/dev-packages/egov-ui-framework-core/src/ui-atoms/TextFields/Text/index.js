import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

const MihyText=(props)=> {
    const {id,value,label,fullWidth,...rest} = props;

    return (
        <TextField
          id={id}
          label={label}
          value={value}
          fullWidth={true}
          {...rest}
        />
    );
  }

MihyText.propTypes = {
  id: PropTypes.string.isRequired,
  label:PropTypes.string.isRequired,
  value:PropTypes.string
};

MihyText.defaultProps= {
  fullWidth:true
}

export default MihyText;
