import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import React from 'react';

const MihyText = (props) => {
  const { id, value, label, fullWidth, ...rest } = props;

  return (
    <TextField
      id={id}
      label={label}
      value={value}
      fullWidth={true}
      FormHelperTextProps={{ style: { fontSize: "1.4rem" } }}
      {...rest}
    />
  );
}

MihyText.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string
};

MihyText.defaultProps = {
  fullWidth: true
}

export default MihyText;
