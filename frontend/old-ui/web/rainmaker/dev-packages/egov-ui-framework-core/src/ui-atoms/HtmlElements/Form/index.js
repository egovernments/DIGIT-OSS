import React from "react";

const Form = props => {
  const { children, ...rest } = props;
  return <form {...rest}>{children}</form>;
};

export default Form;
