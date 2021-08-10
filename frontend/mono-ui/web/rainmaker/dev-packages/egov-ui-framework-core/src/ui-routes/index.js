import React from "react";
import { RenderRoutes } from "../ui-molecules";
import { appRoutes } from "../ui-config";

const MainRoutes = (childProps) => {
  return (
    <main>
      <RenderRoutes routes={appRoutes} childProps={childProps}/>
    </main>
  );
};

export default MainRoutes;
