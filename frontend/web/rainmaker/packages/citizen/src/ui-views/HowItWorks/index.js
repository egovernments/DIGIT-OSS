import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import get from "lodash/get";

const HowItWorks = ({ url }) => {
  return (
    <div style={{ height: "100vh" }}>
      <iframe
        src={url}
        style={{ width: "100%", height: "90%" }}
        frameborder="0"
      />
    </div>
  );
};

const mapStateToProps = ({ common, app }) => {
  const { stateInfoById } = common;
  const { locale } = app;
  let userInfoManual = get(stateInfoById, "0.userManuals");
  let url;
  userInfoManual.forEach(moduleManual => {
    if (moduleManual.module === "TL") {
      console.log("==============cvvvcg===========" + moduleManual.manuals);
      moduleManual.manuals.forEach(localeManual => {
        if (localeManual.locale == locale) {
          console.log("================>>>", JSON.stringify(localeManual.url));
          url = (localeManual.url);
        }
      });
    }
  });

  return { url };
};

export default connect(
  mapStateToProps,
  null
)(HowItWorks);
