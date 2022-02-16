import React from "react";
import {ReactComponent as Arrow_Upward} from "../images/Arrow_Upward.svg";

export function ArrowUpwardElement(marginRight, marginLeft) 
{ 
    return <Arrow_Upward style={
        {
            display: "inline-block", 
            verticalAlign: "baseline", 
            marginRight: !marginRight ? "0px" : marginRight, 
            marginLeft: !marginLeft ? "0px" : marginLeft
        }
    }/>
};