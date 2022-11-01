import React from "react";
<<<<<<< HEAD
import Arrow_Downward from "../images/Arrow_Downward.svg"
=======
import Arrow_Downward from "../images/Arrow_Downward.svg";
>>>>>>> b9f8be5d587ed5fdb50ff06c2554ddfdf80257fc

export function ArrowDownwardElement(marginRight, marginLeft) {
  return (
    <Arrow_Downward
      style={{
        display: "inline-block",
        verticalAlign: "baseline",
        marginRight: !marginRight ? "0px" : marginRight,
        marginLeft: !marginLeft ? "0px" : marginLeft,
      }}
    />
  );
}
