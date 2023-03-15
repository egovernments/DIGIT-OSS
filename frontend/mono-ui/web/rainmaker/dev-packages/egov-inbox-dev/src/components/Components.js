import React from 'react';

export const FilterDropdown = React.memo(({ header, name, value, id, t, showOptionAll = true, onChangeFunction, className = "inbox-filter-dropdown", data = [] }) => {
  return (<div className={`jk-inbox-pointer ${className} `}>
    {header && <label >     {t(header)}</label>}
    <select name={name} value={value} id={id} onChange={onChangeFunction}>
      {showOptionAll && <option value={"ALL"} >
        {t("CS_INBOX_SELECT_ALL")}
      </option>}
      {data && data.map(item => <option value={item.value} >
        {t(item.key)}
      </option>)}
    </select>
  </div>)
});

export const Loader = ({ cancelSignal, t }) => (<div>
  <div className="jk-spinner-wrapper">
    <div className="jk-sm-inbox-loader"></div>
  </div>
  <div className="jk-spinner-wrapper">
    {t("CS_LOADING")}
  </div>
  <div className="cancel-inbox-api">
    <button onClick={cancelSignal}> {t("CS_CANCEL")}</button>
  </div>
</div>)


const ArrowBack = ({ className, onClick }) => (
  <span className={className} onClick={onClick}>
   {'<'}
  </span>
  // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} onClick={onClick} width="18px" height="18px">
  //   <path d="M0 0h24v24H0z" fill="none" />
  //   <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" />
  // </svg>
);

const ArrowForward = ({ className, onClick }) => (
  <span className={className} onClick={onClick}>
  {'>'}
 </span>
  // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} onClick={onClick} width="18px" height="18px">
  //   <path d="M0 0h24v24H0z"  fill="none" />
  //   <path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z" />
  // </svg>
);

const ArrowToFirst = ({ className, onClick }) => (
  <span className={className} onClick={onClick}>
  {'<<'}
 </span>
  // <svg width="18px" height="18px" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} onClick={onClick} >
  //   <path d="M12.41 10.59L7.82 6L12.41 1.41L11 0L5 6L11 12L12.41 10.59ZM0 0H2V12H0V0Z" fill="#505a5f"></path>
  // </svg>
);

const ArrowToLast = ({ className, onClick }) => (
  <span className={className} onClick={onClick}>
  {'>>'}
 </span>
  // <svg width="18px" height="18px" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} onClick={onClick}>
  //   <path d="M0.589844 1.41L5.17984 6L0.589844 10.59L1.99984 12L7.99984 6L1.99984 0L0.589844 1.41ZM10.9998 0H12.9998V12H10.9998V0Z" fill="#505a5f" />
  // </svg>
);

const SortDown = (style) => (
  <svg
    style={{ display: "inline-block", height: "16px", ...style }}
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 24 24"
    height="24"
    viewBox="0 0 24 24"
    width="24"
  >
    <rect fill="none" height="24" width="24" />
    <path d="M19,15l-1.41-1.41L13,18.17V2H11v16.17l-4.59-4.59L5,15l7,7L19,15z" />
  </svg>
);

const SortUp = (style) => (
  <svg
    style={{ display: "inline-block", height: "16px", ...style }}
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 24 24"
    height="24"
    viewBox="0 0 24 24"
    width="24"
  >
    <rect fill="none" height="24" width="24" />
    <path d="M5,9l1.41,1.41L11,5.83V22H13V5.83l4.59,4.59L19,9l-7-7L5,9z" />
  </svg>
);

export const svgIcons = {
  ArrowBack,
  ArrowToLast,
  ArrowToFirst,
  ArrowForward,
  SortDown,
  SortUp
}