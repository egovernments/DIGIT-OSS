import React from "react";

const Main=(props)=>{
  const {children,...rest}=props;
  return (
    <main {...rest}>
        {children}
    </main>
  )
}

export default Main;
