import React from "react";
import PropTypes from "prop-types";

const Details = ({ label, name }) => {
  return (
    <div className="detail">
      <span className="label">
        <h2>{label}</h2>
      </span>
      <span className="name">{name}</span>
    </div>
  );
};

const DetailsCard = ({ data }) => {
  return (
    <div>
      {data.map((object, itemIndex) => {
        return (
          <div key={itemIndex} className="details-container">
            {Object.keys(object).map((name, index) => {
              return <Details label={name} name={object[name]} key={index} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

DetailsCard.propTypes = {
  data: PropTypes.array,
};

DetailsCard.defaultProps = {
  data: [],
};

export default DetailsCard;
