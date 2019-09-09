import React from "react";

const Div=(props)=>{
  const {children,...rest}=props;
  return (
    <div {...rest}>
        {children}
    </div>
  )
}

export default Div;
