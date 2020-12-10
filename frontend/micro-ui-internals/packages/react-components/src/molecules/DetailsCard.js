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
    <div className="details-container">
      {data.map((object) => {
        return Object.keys(object).map((name, index) => {
          return <Details label={name} name={object[name]} />;
        });
      })}
    </div>
  );
};

DetailsCard.propTypes = {
  data: PropTypes.array.isRequired,
};

DetailsCard.defaultProps = {
  data: [],
};

export default DetailsCard;
