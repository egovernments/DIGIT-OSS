import React, { useEffect, useState } from "react";

const ErrorMessage = ({ name, formState, formData, config, setError, clearErrors }) => {
  useEffect(() => {
    const { pattern, errMsg } = config.inputs.find((i) => i.name === name);
    const regex = new RegExp(pattern);
    if (!regex.test(formData?.[name]) && pattern) {
      setError(name, { type: "pattern", message: errMsg });
    } else {
      clearErrors(name);
    }
  }, [formData?.[name]]);

  return (
    <React.Fragment>
      {Object.keys(formState?.dirtyFields)?.includes(name) || formState?.isSubmitted ? (
        <h2 className="card-label-error">{formState?.errors?.[name].messsage}</h2>
      ) : (
        <React.Fragment />
      )}
    </React.Fragment>
  );
};

export default ErrorMessage;
