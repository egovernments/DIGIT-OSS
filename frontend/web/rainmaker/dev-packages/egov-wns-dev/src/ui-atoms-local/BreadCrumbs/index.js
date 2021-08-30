import React from "react";
import Icon from "../Icon";
import Label from "egov-ui-kit/utils/translationNode";
import { Link } from "react-router-dom";
import "./index.css";

const style = { marginLeft: 10, marginTop: 2, cursor: "pointer", marginRight: 10 };

const BreadCrumbs = ({ url, history }) => {
  return (
    <div className="rainmaker-displayInline" style={{ paddingLeft: 15 }}>
      <Link to="home">
        <Icon action="action" name="home" color="#fe7a51" />
      </Link>
      <div className="rainmaker-displayInline">
        <div style={style}> ❯ </div>
        <div>
          <Label labelClassName="breadcrum-label-style" label="WS_COMMON_PAST_PAYMENTS" />
        </div>
      </div>
    </div>
  );
};

export default BreadCrumbs;
