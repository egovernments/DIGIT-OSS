import React from "react";
import Icon from "../Icon";
import Label from "egov-ui-kit/utils/translationNode";
import { Link } from "react-router-dom";
import "./index.css";

const style = { marginLeft: 10, marginTop: 2, cursor: "pointer" };
const selStyle = { color: "#fe7a51" };

const BreadCrumbs = ({ url, history }) => {
  return (
    <div className="rainmaker-displayInline" style={{ paddingLeft: 15 }}>
      <Link to="/property-tax">
        <Icon action="action" name="home" color="#fe7a51" />
      </Link>
      {url &&
        url.map((item, index) => {
          return (
            <div key={index} className="rainmaker-displayInline">
              <div style={style}>❯</div>
              <div
                onClick={() => {
                  url.length > 1 && index != url.length - 1 && history.push(item.path);
                }}
                style={url.length - 1 === index ? style : { ...selStyle, ...style }}
              >
                <Label labelClassName="breadcrum-label-style" label={item.title} />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default BreadCrumbs;
