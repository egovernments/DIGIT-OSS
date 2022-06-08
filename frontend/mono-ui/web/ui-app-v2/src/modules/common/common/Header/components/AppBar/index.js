import React from "react";
import { AppBar } from "components";
import Label from "utils/translationNode";
import UserSettings from "../UserSettings";
import Toolbar from "material-ui/Toolbar";
import "./index.css";

const styles = {
  titleStyle: { fontSize: "20px", fontWeight: 500 },
};

// handle listners
const EgovAppBar = ({ className, title, isHomeScreen, role, fetchLocalizationLabel, ...rest }) => {
  return (
    <AppBar
      className={isHomeScreen && role === "citizen" ? "home-screen-appbar" : className || "header-with-drawer"}
      title={<Label className="screenHeaderLabelStyle" label={title} />}
      titleStyle={styles.titleStyle}
      {...rest}
    >
      <Toolbar className="app-toolbar" style={{ padding: "0px", height: "64px", background: "#ffffff" }}>
        <UserSettings fetchLocalizationLabel={fetchLocalizationLabel} onIconClick={rest.onLeftIconButtonClick} />
      </Toolbar>
    </AppBar>
  );
};

export default EgovAppBar;
