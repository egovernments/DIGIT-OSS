import React from 'react';
import PropTypes from 'prop-types';

const CustomTooltip = (props) => {
  const { active } = props;
  if (active) {
    const { payload } = props;
    return (
      <div
        className="recharts-tooltip-wrapper"
        style={{ backgroundColor: '#fff', padding: '10px', border: 'solid black 1px' }}
      >
        <span>
          {`${props.formatLabel(payload[0].name)} : ${props.formatValue(payload[0].value)}`}
        </span>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    payload: PropTypes.object.isRequired,
  })),
  formatLabel: PropTypes.func,
  formatValue: PropTypes.func,
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
  formatLabel: name => name,
  formatValue: val => val,
};

export default CustomTooltip;
