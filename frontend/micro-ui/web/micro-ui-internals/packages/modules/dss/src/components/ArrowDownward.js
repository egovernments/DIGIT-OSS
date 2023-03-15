import React from "react";
import {ReactComponent as Arrow_Downward} from "../images/Arrow_Downward.svg"

export function ArrowDownwardElement(marginRight, marginLeft)
{
    return <Arrow_Downward style={
        {
            display: "inline-block", 
            verticalAlign: "baseline", 
            marginRight: !marginRight ? "0px" : marginRight,
            marginLeft: !marginLeft ? "0px" : marginLeft
        }
    }/>
};