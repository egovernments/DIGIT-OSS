import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

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

const DetailsCard = ({ data, serviceRequestIdKey, linkPrefix, handleSelect, selectedItems, keyForSelected }) => {
  if (linkPrefix && serviceRequestIdKey) {
    return (
      <div>
        {data.map((object, itemIndex) => {
          return (
            <Link
              key={itemIndex}
              to={`${linkPrefix}${typeof serviceRequestIdKey === "function" ? serviceRequestIdKey(object) : object[serviceRequestIdKey]}`}
            >
              <div className="details-container">
                {Object.keys(object).map((name, index) => {
                  return <Details label={name} name={object[name]} key={index} />;
                })}
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {data.map((object, itemIndex) => {
        if (serviceRequestIdKey && linkPrefix) {
          return (
            <Link
              key={itemIndex}
              to={`${linkPrefix}${typeof serviceRequestIdKey === "function" ? serviceRequestIdKey(object) : object[serviceRequestIdKey]}`}
            >
              <div className="details-container">
                {Object.keys(object).map((name, index) => {
                  return <Details label={name} name={object[name]} key={index} />;
                })}
              </div>
            </Link>
          );
        }
        return (
          <div
            key={itemIndex}
            style={{ border: selectedItems?.includes(object[keyForSelected]) ? "2px solid #f47738" : "2px solid #fff" }}
            className="details-container"
            onClick={() => handleSelect(object)}
          >
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
