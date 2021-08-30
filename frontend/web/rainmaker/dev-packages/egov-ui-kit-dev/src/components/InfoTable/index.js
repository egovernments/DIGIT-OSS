import React from "react";
import PropTypes from "prop-types";

const InfoTable = ({ items, labelParentClass, valueParentClass, parentClass }) => {
  return items.map((item, index) => {
    return (
      <div key={index} className={parentClass}>
        <div className={labelParentClass}>
          <span>{item.label}</span>
        </div>
        <div className={valueParentClass} children={item.childElements} />
      </div>
    );
  });
};

InfoTable.propTypes = {
  labelContainer: PropTypes.string,
  valueContainer: PropTypes.string,
  itemContainer: PropTypes.string,
};

export default InfoTable;
