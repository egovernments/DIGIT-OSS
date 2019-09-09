import React from 'react';
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from "../../Icon";
import TextField from '@material-ui/core/TextField';

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={['(', '+', '9', '1', ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
    />
  );
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
};



const Phonenumber=(props)=> {
    const {id,textmask,label,fullWidth,...rest} = props;
    return (
        <TextField
          label={label}
          value={textmask}
          id={id}
          fullWidth={fullWidth}
          InputProps={{
            inputComponent: TextMaskCustom,
            startAdornment: (
              <InputAdornment position="start">
                <Icon iconName="stay_current_portrait"/>
              </InputAdornment>
            )
          }}

          {...rest}
        />
    );
  }

Phonenumber.propTypes = {
  id: PropTypes.string.isRequired,
  label:PropTypes.string.isRequired,
  textmask:PropTypes.string.isRequired
};

Phonenumber.defaultProps= {
  fullWidth:true
}


export default Phonenumber;
