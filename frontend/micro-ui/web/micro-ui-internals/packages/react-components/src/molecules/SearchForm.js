import React from "react";

export const SearchField = ({ children, className }) => {
  const isMobile = window.Digit.Utils.browser.isMobile();
  const isEnabledCommonModules =
    window.location.href.includes("/obps/") ||
    window.location.href.includes("/noc/")

  const disbaleModules = window.location.href.includes("obps/search") || window.location.href.includes("noc/search");
  if (isEnabledCommonModules && !isMobile && !disbaleModules) {
    return (
      <div className={`input-fields`} style={{ marginTop: "5px" }}>
        {children}
      </div>
    );
  }
  return <div className={`form-field ${className || ""}`}>{children}</div>;
};

export const SearchForm = ({ children, onSubmit, handleSubmit, id, className = "" }) => {
  const isMobile = window.Digit.Utils.browser.isMobile();
  const isEnabledCommonModules =
    window.location.href.includes("/obps/") ||
    window.location.href.includes("/noc/");

  const disbaleModules = window.location.href.includes("obps/search") || window.location.href.includes("noc/search");

  if (isEnabledCommonModules && !isMobile && !disbaleModules) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} {...{ id }}>
        {children}
      </form>
    );
  }
  return (
    <form className={`search-form-wrapper ${className}`} onSubmit={handleSubmit(onSubmit)} {...{ id }}>
      {children}
    </form>
  );
};
