import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Breadcrumb = (props) => {
  function isLast(index) {
    return index === props.crumbs.length - 1;
  }

  return (
    <ol className="bread-crumb">
      {props?.crumbs?.map((crumb, ci) => {
        if (!crumb?.show) return;

        return (
          <li key={ci} className="bread-crumb--item">
            {isLast(ci) || !crumb?.path ? <span style={{ color: "#0B0C0C" }}>{crumb.content}</span> : <Link to={crumb.path}>{crumb.content}</Link>}
          </li>
        );
      })}
    </ol>
  );
};

Breadcrumb.propTypes = {
  crumbs: PropTypes.array,
};

Breadcrumb.defaultProps = {
  successful: true,
};

export default Breadcrumb;
