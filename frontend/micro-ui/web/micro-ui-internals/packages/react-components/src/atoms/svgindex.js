import React from "react";
const ArrowLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className={className} width="19px">
    <path d="M24 0v24H0V0h24z" fill="none" opacity=".87" />
    <path d="M14 7l-5 5 5 5V7z" />
  </svg>
);

const ArrowLeftWhite = ({ className }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z" fill="white" />
  </svg>
);
const PrivacyMaskIcon = ({ className, style = {} }) => (
  // <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
  //   <path
  //     d="M11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0ZM11 12.5C8.24 12.5 6 10.26 6 7.5C6 4.74 8.24 2.5 11 2.5C13.76 2.5 16 4.74 16 7.5C16 10.26 13.76 12.5 11 12.5ZM11 4.5C9.34 4.5 8 5.84 8 7.5C8 9.16 9.34 10.5 11 10.5C12.66 10.5 14 9.16 14 7.5C14 5.84 12.66 4.5 11 4.5Z"
  //     fill="#EEEEEE"
  //   />
  // </svg>
  <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path
     d="M11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0ZM11 12.5C8.24 12.5 6 10.26 6 7.5C6 4.74 8.24 2.5 11 2.5C13.76 2.5 16 4.74 16 7.5C16 10.26 13.76 12.5 11 12.5ZM11 4.5C9.34 4.5 8 5.84 8 7.5C8 9.16 9.34 10.5 11 10.5C12.66 10.5 14 9.16 14 7.5C14 5.84 12.66 4.5 11 4.5Z"
     fill="#B1B4B6"/>
  </svg>
);

const ArrowDown = ({ className, onClick, styles, disable }) => (
  <svg
    style={{ ...styles }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={disable ? "#9E9E9E" : "black"}
    className={className}
    onClick={onClick}
    width="18px"
    height="18px"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M7 10l5 5 5-5H7z" />
  </svg>
);

const ArrowBack = ({ className, onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className={className} onClick={onClick} width="18px" height="18px">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" />
  </svg>
);

const ArrowForward = ({ className, onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className={className} onClick={onClick} width="18px" height="18px">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z" />
  </svg>
);

const ArrowToFirst = ({ className, onClick }) => (
  <svg width="18px" height="18px" viewBox="0 0 13 12" fill="black" xmlns="http://www.w3.org/2000/svg" className={className} onClick={onClick}>
    <path d="M12.41 10.59L7.82 6L12.41 1.41L11 0L5 6L11 12L12.41 10.59ZM0 0H2V12H0V0Z" fill="#505a5f"></path>
  </svg>
);

const ArrowToLast = ({ className, onClick }) => (
  <svg width="18px" height="18px" viewBox="0 0 13 12" fill="black" xmlns="http://www.w3.org/2000/svg" className={className} onClick={onClick}>
    <path d="M0.589844 1.41L5.17984 6L0.589844 10.59L1.99984 12L7.99984 6L1.99984 0L0.589844 1.41ZM10.9998 0H12.9998V12H10.9998V0Z" fill="#505a5f" />
  </svg>
);

const DownloadPrefixIcon = ({ className, onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
  </svg>
);

const CameraSvg = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 24 24"
    className={className}
    viewBox="0 0 24 24"
    fill="black"
    width="46px"
    height="42px"
  >
    <rect fill="none" height="24" width="24" />
    <path d="M3,4V1h2v3h3v2H5v3H3V6H0V4H3z M6,10V7h3V4h7l1.83,2H21c1.1,0,2,0.9,2,2v12c0,1.1-0.9,2-2,2H5c-1.1,0-2-0.9-2-2V10H6z M13,19c2.76,0,5-2.24,5-5s-2.24-5-5-5s-5,2.24-5,5S10.24,19,13,19z M9.8,14c0,1.77,1.43,3.2,3.2,3.2s3.2-1.43,3.2-3.2 s-1.43-3.2-3.2-3.2S9.8,12.23,9.8,14z" />
  </svg>
);

const DeleteBtn = ({ className, onClick, fill }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className={className} onClick={onClick} width="18px" height="18px">
    <path d="M0 0h24v24H0V0z" fill={fill} />
    <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
  </svg>
);

const SuccessSvg = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00703C" className={className}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
  </svg>
);

const ErrorSvg = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d4351c" className={className}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <circle cx="12" cy="19" r="2" />
    <path d="M10 3h4v12h-4z" />
  </svg>
);

const StarFilled = ({ className, id, onClick, styles, percentage = 100 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 24 24"
    className={className}
    style={styles}
    onClick={onClick}
    viewBox="0 0 24 24"
    fill="#F47738"
    width="48px"
    height="48px"
  >
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stopColor="#F47738" stopOpacity={1}></stop>
      <stop offset={`${percentage}%`} stopColor="#F47738" stopOpacity={1}></stop>
      <stop offset={`${percentage}%`} stopColor="white" stopOpacity={0}></stop>
    </linearGradient>
    <g>
      <path d="M0,0h24v24H0V0z" fill="none" />
      <path d="M0,0h24v24H0V0z" fill="none" />
    </g>
    <g>
      <path
        d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"
        fill={`url(#${id})`}
        stroke="#F47738"
        strokeWidth={1}
      />
    </g>
  </svg>
);

const StarEmpty = ({ className, onClick, styles }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#F47738"
    className={className}
    style={styles}
    width="48px"
    height="48px"
    onClick={onClick}
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path
      d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
      strokeWidth={1}
    />
  </svg>
);

const DownloadImgIcon = () => (
  <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 6H10V0H4V6H0L7 13L14 6ZM0 15V17H14V15H0Z" fill="#F47738" />
  </svg>
);

const PrevIcon = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.99997 0L0.589966 1.41L5.16997 6L0.589966 10.59L1.99997 12L7.99997 6L1.99997 0Z" fill="#0B0C0C" />
  </svg>
);

const ViewsIcon = () => (
  <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5ZM11 13C8.24 13 6 10.76 6 8C6 5.24 8.24 3 11 3C13.76 3 16 5.24 16 8C16 10.76 13.76 13 11 13ZM11 5C9.34 5 8 6.34 8 8C8 9.66 9.34 11 11 11C12.66 11 14 9.66 14 8C14 6.34 12.66 5 11 5Z"
      fill="#F47738"
    />
  </svg>
);

const DocumentIcon = () => (
  <svg width="100" height="100" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM11 14H4V12H11V14ZM14 10H4V8H14V10ZM14 6H4V4H14V6Z"
      fill="#F47738"
    />
  </svg>
);

const DocumentIconSolid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
  </svg>
);

const SurveyIconSolid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M11 7h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zM20.1 3H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM19 19H5V5h14v14z" />
  </svg>
);

const PMBIcon = () => (
  <svg width="32" height="16" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 9C18.1733 9 20.0933 9.52 21.6533 10.2C23.0933 10.84 24 12.28 24 13.84V16H8V13.8533C8 12.28 8.90667 10.84 10.3467 10.2133C11.9067 9.52 13.8267 9 16 9ZM5.33333 9.33333C6.8 9.33333 8 8.13333 8 6.66667C8 5.2 6.8 4 5.33333 4C3.86667 4 2.66667 5.2 2.66667 6.66667C2.66667 8.13333 3.86667 9.33333 5.33333 9.33333ZM6.84 10.8C6.34667 10.72 5.85333 10.6667 5.33333 10.6667C4.01333 10.6667 2.76 10.9467 1.62667 11.44C0.64 11.8667 0 12.8267 0 13.9067V16H6V13.8533C6 12.7467 6.30667 11.7067 6.84 10.8ZM26.6667 9.33333C28.1333 9.33333 29.3333 8.13333 29.3333 6.66667C29.3333 5.2 28.1333 4 26.6667 4C25.2 4 24 5.2 24 6.66667C24 8.13333 25.2 9.33333 26.6667 9.33333ZM32 13.9067C32 12.8267 31.36 11.8667 30.3733 11.44C29.24 10.9467 27.9867 10.6667 26.6667 10.6667C26.1467 10.6667 25.6533 10.72 25.16 10.8C25.6933 11.7067 26 12.7467 26 13.8533V16H32V13.9067ZM16 0C18.2133 0 20 1.78667 20 4C20 6.21333 18.2133 8 16 8C13.7867 8 12 6.21333 12 4C12 1.78667 13.7867 0 16 0Z"
      fill="#F47738"
    />
  </svg>
);

const PMBIconSolid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
    <g>
      <rect fill="none" height="24" width="24" />
    </g>
    <path d="M18,11c0,0.67,0,1.33,0,2c1.2,0,2.76,0,4,0c0-0.67,0-1.33,0-2C20.76,11,19.2,11,18,11z" />
    <path d="M16,17.61c0.96,0.71,2.21,1.65,3.2,2.39c0.4-0.53,0.8-1.07,1.2-1.6c-0.99-0.74-2.24-1.68-3.2-2.4 C16.8,16.54,16.4,17.08,16,17.61z" />
    <path d="M20.4,5.6C20,5.07,19.6,4.53,19.2,4c-0.99,0.74-2.24,1.68-3.2,2.4c0.4,0.53,0.8,1.07,1.2,1.6 C18.16,7.28,19.41,6.35,20.4,5.6z" />
    <path d="M4,9c-1.1,0-2,0.9-2,2v2c0,1.1,0.9,2,2,2h1v4h2v-4h1l5,3V6L8,9H4z M9.03,10.71L11,9.53v4.94l-1.97-1.18L8.55,13H8H4v-2h4 h0.55L9.03,10.71z" />
    <path d="M15.5,12c0-1.33-0.58-2.53-1.5-3.35v6.69C14.92,14.53,15.5,13.33,15.5,12z" />
  </svg>
);

const EventsIconSolid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2zm-2 5h-5v5h5v-5z" />
  </svg>
);

const DustbinIcon = () => (
  <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z" fill="#F47738" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
  </svg>
);

// const DocumentSVG = ({className}) => <svg xmlns = "http://www.w3.org/2000/svg" className={className} height = "48px" viewBox = "0 0 24 24" width = "48px" fill = "#000000" > < path d = "M0 0h24v24H0V0z" fill = "none" />
// < path d = "M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
// </svg>

// const PDFSvg = ({className, width = 100, height = 100, style, viewBox="0 0 34 34" }) => <svg style={style} xmlns="http://www.w3.org/2000/svg" className={className} width={width} height={height} viewBox={viewBox} fill="gray">
// <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
// </svg>

const DocumentSVG = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M46.6667 6.6665H20C16.3334 6.6665 13.3667 9.6665 13.3667 13.3332L13.3334 66.6665C13.3334 70.3332 16.3 73.3332 19.9667 73.3332H60C63.6667 73.3332 66.6667 70.3332 66.6667 66.6665V26.6665L46.6667 6.6665ZM53.3334 59.9998H26.6667V53.3332H53.3334V59.9998ZM53.3334 46.6665H26.6667V39.9998H53.3334V46.6665ZM43.3334 29.9998V11.6665L61.6667 29.9998H43.3334Z"
      fill="#505A5F"
    />
  </svg>
);

const PDFSvg = ({
  className,
  width = 80,
  height = 80,
  style = { background: "#f6f6f6", padding: "8px", boxShadow: "0px 2px 0px #d6d5d3", borderRadius: "2px" },
  viewBox = "0 0 80 80",
}) => (
  <svg {...{ className, width, height, style, viewBox }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M46.6667 6.6665H20C16.3334 6.6665 13.3667 9.6665 13.3667 13.3332L13.3334 66.6665C13.3334 70.3332 16.3 73.3332 19.9667 73.3332H60C63.6667 73.3332 66.6667 70.3332 66.6667 66.6665V26.6665L46.6667 6.6665ZM53.3334 59.9998H26.6667V53.3332H53.3334V59.9998ZM53.3334 46.6665H26.6667V39.9998H53.3334V46.6665ZM43.3334 29.9998V11.6665L61.6667 29.9998H43.3334Z"
      fill="#505A5F"
    />
  </svg>
);

const SearchIconSvg = ({ className, onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f47738" className={className} width="24px" height="24px" onClick={onClick}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const CheckSvg = ({ className, style = {} }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F47738" className={className} style={style}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
  </svg>
);

const RoundedCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" className={className}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z" />
  </svg>
);

const Calender = ({ className, onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className={className} onClick={onClick}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
  </svg>
);

const Phone = ({ className, fillcolor, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fillcolor ? fillcolor : "#f47738"}
    viewBox="0 0 24 24"
    style={style ? style : {}}
    className={className}
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const FilterSvg = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="#f47738" width="24" height="24" viewBox="0 0 24 24" className={className}>
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
  </svg>
);

const SortSvg = ({ className }) => (
  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 16H24V13.3333H8V16ZM0 0V2.66667H24V0H0ZM8 9.33333H24V6.66667H8V9.33333Z" fill="#505A5F" />
  </svg>
);

const Close = ({ className, style }) => (
  <svg style={{ ...style }} focusable="false" viewBox="0 0 24 24" aria-hidden="true" width="24" height="24" fill="#9E9E9E" className={className}>
    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path>
  </svg>
);

const Feedback = ({ className }) => (
  <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" className={className}></path>
  </svg>
);

// Download Icon

const GetApp = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f47738" className={className}>
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </svg>
);

const HamburgerIcon = ({ className, styles, color = "#fdfdfd" }) => (
  <svg style={{ ...styles }} width="24" height="24" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill={color}></path>
  </svg>
);

export const HomeIcon = ({ className, styles }) => (
  <svg className={className} viewBox="0 0 24 24" style={{ ...styles }}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
  </svg>
);

export const LanguageIcon = ({ className, styles }) => (
  <svg className={className} viewBox="0 0 24 24" style={{ ...styles }}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></path>
  </svg>
);

export const LogoutIcon = ({ className, styles }) => (
  <svg className={className}  viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ ...styles }}>
<path d="M15 4L13.59 5.41L16.17 8H6V10H16.17L13.59 12.58L15 14L20 9L15 4ZM2 2H10V0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H10V16H2V2Z" fill="#505A5F"/>
</svg>
);

export const LoginIcon = ({ className, styles }) => (
  <svg className={className} viewBox="0 0 24 24" style={{ ...styles }}>
    <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"></path>
  </svg>
);
const CalendarIcon = (props) => (
  <svg {...props} fill={props.isdisabled ? "#e3e3e3" : "Black"} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
  </svg>
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

const ArrowRightInbox = ({ style }) => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M13 0L11.59 1.41L16.17 6H0V8H16.17L11.58 12.59L13 14L20 7L13 0Z" fill="#F47738" />
  </svg>
);

const ShippingTruck = ({ className, styles }) => (
  <svg style={{ ...styles }} className={className} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      fill={"white"}
      d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
    />
  </svg>
);

function CloseSvg({ onClick }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" onClick={onClick}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

const UpwardArrow = ({ color = "#00703C", rotate = 0, marginRight = 0 }) => (
  <svg
    style={{ display: "inline-block", verticalAlign: "baseline", transform: `rotate(${rotate}deg)`, marginRight: `${marginRight}px` }}
    width="11"
    height="16"
    viewBox="0 0 11 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 5.6L1.10786 6.728L4.71429 3.064V16H6.28571V3.064L9.89214 6.736L11 5.6L5.5 0L0 5.6Z" fill={color} />
  </svg>
);

const DownwardArrow = (props) => <UpwardArrow {...props} color="#e54d42" rotate={180} />;

const DownloadIcon = ({ styles, className, onClick }) => (
  <svg
    style={{ ...styles }}
    width="19"
    height="24"
    viewBox="0 0 19 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
  >
    <path
      d="M18.8337 8.5H13.5003V0.5H5.50033V8.5H0.166992L9.50033 17.8333L18.8337 8.5ZM0.166992 20.5V23.1667H18.8337V20.5H0.166992Z"
      fill="#505A5F"
    />
  </svg>
);

const GenericFileIcon = () => (
  <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 0H10C4.5 0 0.0500011 4.5 0.0500011 10L0 90C0 95.5 4.45 100 9.95 100H70C75.5 100 80 95.5 80 90V30L50 0ZM60 80H20V70H60V80ZM60 60H20V50H60V60ZM45 35V7.5L72.5 35H45Z"
      fill="#505A5F"
    />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 16H2V2H9V0H2C0.89 0 0 0.9 0 2V16C0 17.1 0.89 18 2 18H16C17.1 18 18 17.1 18 16V9H16V16ZM11 0V2H14.59L4.76 11.83L6.17 13.24L16 3.41V7H18V0H11Z"
      fill="#F47738"
    />
  </svg>
);

const PrimaryDownlaodIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f47738">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </svg>
);

const Ellipsis = ({ className, onClick }) => (
  <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} onClick={onClick}>
    <path
      d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z"
      fill="#B1B4B6"
    />
  </svg>
);

const Poll = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 6C0 2.68629 2.68629 0 6 0H34C37.3137 0 40 2.68629 40 6V34C40 37.3137 37.3137 40 34 40H6C2.68629 40 0 37.3137 0 34V6Z" fill="white" />
    <path
      d="M31.6667 5H8.33333C6.5 5 5 6.5 5 8.33333V31.6667C5 33.5 6.5 35 8.33333 35H31.6667C33.5 35 35 33.5 35 31.6667V8.33333C35 6.5 33.5 5 31.6667 5ZM15 28.3333H11.6667V16.6667H15V28.3333ZM21.6667 28.3333H18.3333V11.6667H21.6667V28.3333ZM28.3333 28.3333H25V21.6667H28.3333V28.3333Z"
      fill="#F47738"
    />
  </svg>
);

const Details = () => (
  <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5ZM11 13C8.24 13 6 10.76 6 8C6 5.24 8.24 3 11 3C13.76 3 16 5.24 16 8C16 10.76 13.76 13 11 13ZM11 5C9.34 5 8 6.34 8 8C8 9.66 9.34 11 11 11C12.66 11 14 9.66 14 8C14 6.34 12.66 5 11 5Z"
      fill="#505A5F"
    />
  </svg>
);

const FilterIcon = ({ onClick }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
    <path
      d="M0.666904 2.48016C3.36024 5.9335 8.33357 12.3335 8.33357 12.3335V20.3335C8.33357 21.0668 8.93357 21.6668 9.6669 21.6668H12.3336C13.0669 21.6668 13.6669 21.0668 13.6669 20.3335V12.3335C13.6669 12.3335 18.6269 5.9335 21.3202 2.48016C22.0002 1.60016 21.3736 0.333496 20.2669 0.333496H1.72024C0.613571 0.333496 -0.0130959 1.60016 0.666904 2.48016Z"
      fill="#505A5F"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z"
      fill="#0B0C0C"
    />
  </svg>
);

const RefreshSVG = () => (
  <svg width="17" height="17" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z"
      fill="#505A5F"
    />
  </svg>
);

const PrintIcon = () => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17 5H3C1.34 5 0 6.34 0 8V14H4V18H16V14H20V8C20 6.34 18.66 5 17 5ZM14 16H6V11H14V16ZM17 9C16.45 9 16 8.55 16 8C16 7.45 16.45 7 17 7C17.55 7 18 7.45 18 8C18 8.55 17.55 9 17 9ZM16 0H4V4H16V0Z"
      fill="#505A5F"
    />
  </svg>
);
function PropertyHouse({ className, styles }) {
  return (
    <svg className={className} fill="#FFFFFF" style={{ ...styles }} width="24" height="24" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.6167 9.5L1.66667 17.4667V35H10V21.6667H16.6667V35H25V17.0833L13.6167 9.5Z" />
      <path d="M16.6667 5V7.51667L20 9.73333L22.8833 11.6667H25V13.0833L28.3333 15.3167V18.3333H31.6667V21.6667H28.3333V25H31.6667V28.3333H28.3333V35H38.3333V5H16.6667ZM31.6667 15H28.3333V11.6667H31.6667V15Z" />
    </svg>
  );
}

const InfoBannerIcon = ({ fill = "#3498DB" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z"
        fill={fill}
      />
    </svg>
  );
};

const InfoIcon = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 5H11V7H9V5ZM9 9H11V15H9V9ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="#505A5F"/>
    </svg>

  );
};

const ShareIcon = ({ styles, className }) => (
  <svg style={{ ...styles }} className={className} width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 14.08C14.24 14.08 13.56 14.38 13.04 14.85L5.91 10.7C5.96 10.47 6 10.24 6 10C6 9.76 5.96 9.53 5.91 9.3L12.96 5.19C13.5 5.69 14.21 6 15 6C16.66 6 18 4.66 18 3C18 1.34 16.66 0 15 0C13.34 0 12 1.34 12 3C12 3.24 12.04 3.47 12.09 3.7L5.04 7.81C4.5 7.31 3.79 7 3 7C1.34 7 0 8.34 0 10C0 11.66 1.34 13 3 13C3.79 13 4.5 12.69 5.04 12.19L12.16 16.35C12.11 16.56 12.08 16.78 12.08 17C12.08 18.61 13.39 19.92 15 19.92C16.61 19.92 17.92 18.61 17.92 17C17.92 15.39 16.61 14.08 15 14.08Z"
      fill="#505A5F"
    />
  </svg>
);

const RupeeIcon = ({ className }) => (
  <svg width="48" className={className} height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="6" fill="#F47738" />
  </svg>
);

const ComplaintIcon = ({ className, styles }) => (
  <svg style={{ ...styles }} className={className} viewBox="0 0 48 48" fill="#F47738" xmlns="http://www.w3.org/2000/svg">
    <path d="M42.6667 0.666748H5.33335C2.76669 0.666748 0.69002 2.76675 0.69002 5.33342L0.666687 47.3334L10 38.0001H42.6667C45.2334 38.0001 47.3334 35.9001 47.3334 33.3334V5.33342C47.3334 2.76675 45.2334 0.666748 42.6667 0.666748ZM26.3334 21.6667H21.6667V7.66675H26.3334V21.6667ZM26.3334 31.0001H21.6667V26.3334H26.3334V31.0001Z" />
  </svg>
);

const DropIcon = ({ className, styles }) => (
  <svg width="28" height="34" style={{ ...styles }} viewBox="0 0 28 34" className={className} fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.4333 10.3332L14 0.916504L4.56663 10.3332C1.96663 12.9332 0.666626 16.3998 0.666626 19.7332C0.666626 23.0665 1.96663 26.5832 4.56663 29.1832C7.16663 31.7832 10.5833 33.0998 14 33.0998C17.4166 33.0998 20.8333 31.7832 23.4333 29.1832C26.0333 26.5832 27.3333 23.0665 27.3333 19.7332C27.3333 16.3998 26.0333 12.9332 23.4333 10.3332ZM3.99996 20.3332C4.01663 16.9998 5.03329 14.8832 6.93329 12.9998L14 5.78317L21.0666 13.0832C22.9666 14.9498 23.9833 16.9998 24 20.3332H3.99996Z" />
  </svg>
);

const Person = (style) => (
  <svg
    style={{ display: "inline-block", fontSize: "16px", ...style }}
    width="24"
    height="24"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.6167 9.5L1.66667 17.4667V35H10V21.6667H16.6667V35H25V17.0833L13.6167 9.5Z" fill="white" />
    <path
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      fill="white"
    />
  </svg>
);

const WhatsappIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.0566406 24L1.74364 17.837C0.702641 16.033 0.155641 13.988 0.156641 11.891C0.159641 5.335 5.49464 0 12.0496 0C15.2306 0.001 18.2166 1.24 20.4626 3.488C22.7076 5.736 23.9436 8.724 23.9426 11.902C23.9396 18.459 18.6046 23.794 12.0496 23.794C10.0596 23.793 8.09864 23.294 6.36164 22.346L0.0566406 24ZM6.65364 20.193C8.32964 21.188 9.92964 21.784 12.0456 21.785C17.4936 21.785 21.9316 17.351 21.9346 11.9C21.9366 6.438 17.5196 2.01 12.0536 2.008C6.60164 2.008 2.16664 6.442 2.16464 11.892C2.16364 14.117 2.81564 15.783 3.91064 17.526L2.91164 21.174L6.65364 20.193ZM18.0406 14.729C17.9666 14.605 17.7686 14.531 17.4706 14.382C17.1736 14.233 15.7126 13.514 15.4396 13.415C15.1676 13.316 14.9696 13.266 14.7706 13.564C14.5726 13.861 14.0026 14.531 13.8296 14.729C13.6566 14.927 13.4826 14.952 13.1856 14.803C12.8886 14.654 11.9306 14.341 10.7956 13.328C9.91264 12.54 9.31564 11.567 9.14264 11.269C8.96964 10.972 9.12464 10.811 9.27264 10.663C9.40664 10.53 9.56964 10.316 9.71864 10.142C9.86964 9.97 9.91864 9.846 10.0186 9.647C10.1176 9.449 10.0686 9.275 9.99364 9.126C9.91864 8.978 9.32464 7.515 9.07764 6.92C8.83564 6.341 8.59064 6.419 8.40864 6.41L7.83864 6.4C7.64064 6.4 7.31864 6.474 7.04664 6.772C6.77464 7.07 6.00664 7.788 6.00664 9.251C6.00664 10.714 7.07164 12.127 7.21964 12.325C7.36864 12.523 9.31464 15.525 12.2956 16.812C13.0046 17.118 13.5586 17.301 13.9896 17.438C14.7016 17.664 15.3496 17.632 15.8616 17.556C16.4326 17.471 17.6196 16.837 17.8676 16.143C18.1156 15.448 18.1156 14.853 18.0406 14.729Z"
      fill="#F47738"
    />
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 4L10 9L2 4V2L10 7L18 2V4Z"
      fill="#F47738"
    />
  </svg>
);

const CaseIcon = ({ className, styles }) => (
  <svg className={className} style={{ ...styles }} fill="#ffffff" width="24" height="24" viewBox="0 0 34 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M30.3333 6.99967H23.6667V3.66634C23.6667 1.81634 22.1833 0.333008 20.3333 0.333008H13.6667C11.8167 0.333008 10.3333 1.81634 10.3333 3.66634V6.99967H3.66667C1.81667 6.99967 0.350001 8.48301 0.350001 10.333L0.333334 28.6663C0.333334 30.5163 1.81667 31.9997 3.66667 31.9997H30.3333C32.1833 31.9997 33.6667 30.5163 33.6667 28.6663V10.333C33.6667 8.48301 32.1833 6.99967 30.3333 6.99967ZM20.3333 6.99967H13.6667V3.66634H20.3333V6.99967Z" />
  </svg>
);

const TLIcon = ({ className, styles }) => (
  <svg className={className} style={{ ...styles }} fill="#ffffff" width="24" height="24" viewBox="0 0 34 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M30.3333 6.99967H23.6667V3.66634C23.6667 1.81634 22.1833 0.333008 20.3333 0.333008H13.6667C11.8167 0.333008 10.3333 1.81634 10.3333 3.66634V6.99967H3.66667C1.81667 6.99967 0.350001 8.48301 0.350001 10.333L0.333334 28.6663C0.333334 30.5163 1.81667 31.9997 3.66667 31.9997H30.3333C32.1833 31.9997 33.6667 30.5163 33.6667 28.6663V10.333C33.6667 8.48301 32.1833 6.99967 30.3333 6.99967ZM20.3333 6.99967H13.6667V3.66634H20.3333V6.99967Z" />
  </svg>
);

const PersonIcon = ({ className, styles }) => (
  <svg className={className} style={{ ...styles }} width="24" height="24" viewBox="0 0 38 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path d="M25.6667 10.3333C28.4334 10.3333 30.65 8.1 30.65 5.33333C30.65 2.56666 28.4334 0.333328 25.6667 0.333328C22.9 0.333328 20.6667 2.56666 20.6667 5.33333C20.6667 8.1 22.9 10.3333 25.6667 10.3333ZM12.3334 10.3333C15.1 10.3333 17.3167 8.1 17.3167 5.33333C17.3167 2.56666 15.1 0.333328 12.3334 0.333328C9.56669 0.333328 7.33335 2.56666 7.33335 5.33333C7.33335 8.1 9.56669 10.3333 12.3334 10.3333ZM12.3334 13.6667C8.45002 13.6667 0.666687 15.6167 0.666687 19.5V23.6667H24V19.5C24 15.6167 16.2167 13.6667 12.3334 13.6667ZM25.6667 13.6667C25.1834 13.6667 24.6334 13.7 24.05 13.75C25.9834 15.15 27.3334 17.0333 27.3334 19.5V23.6667H37.3334V19.5C37.3334 15.6167 29.55 13.6667 25.6667 13.6667Z" />
  </svg>
);

const ReceiptIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" fill="white"></path>
  </svg>
);

const AnnouncementIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24.6665 0.666016H3.33317C1.8665 0.666016 0.679837 1.86602 0.679837 3.33268L0.666504 27.3327L5.99984 21.9993H24.6665C26.1332 21.9993 27.3332 20.7993 27.3332 19.3327V3.33268C27.3332 1.86602 26.1332 0.666016 24.6665 0.666016ZM15.3332 12.666H12.6665V4.66602H15.3332V12.666ZM15.3332 17.9993H12.6665V15.3327H15.3332V17.9993Z"
      fill="#F47738"
    />
  </svg>
);

const PTIcon = ({ className, styles }) => (
  <svg width="34" height="30" style={{ ...styles }} viewBox="0 0 34 30" fill="#ffffff" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M16.9999 6.66667V0H0.333252V30H33.6666V6.66667H16.9999ZM6.99992 26.6667H3.66659V23.3333H6.99992V26.6667ZM6.99992 20H3.66659V16.6667H6.99992V20ZM6.99992 13.3333H3.66659V10H6.99992V13.3333ZM6.99992 6.66667H3.66659V3.33333H6.99992V6.66667ZM13.6666 26.6667H10.3333V23.3333H13.6666V26.6667ZM13.6666 20H10.3333V16.6667H13.6666V20ZM13.6666 13.3333H10.3333V10H13.6666V13.3333ZM13.6666 6.66667H10.3333V3.33333H13.6666V6.66667ZM30.3333 26.6667H16.9999V23.3333H20.3333V20H16.9999V16.6667H20.3333V13.3333H16.9999V10H30.3333V26.6667ZM26.9999 13.3333H23.6666V16.6667H26.9999V13.3333ZM26.9999 20H23.6666V23.3333H26.9999V20Z" />
  </svg>
);

const OBPSIcon = ({ className, styles }) => (
  <svg className={className} style={{ ...styles }} width="34" height="30" viewBox="0 0 34 30" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.3333 0H3.66659C1.83325 0 0.333252 1.5 0.333252 3.33333V26.6667C0.333252 28.5 1.83325 30 3.66659 30H30.3333C32.1666 30 33.6666 28.5 33.6666 26.6667V3.33333C33.6666 1.5 32.1666 0 30.3333 0ZM13.6666 23.3333H5.33325V20H13.6666V23.3333ZM13.6666 16.6667H5.33325V13.3333H13.6666V16.6667ZM13.6666 10H5.33325V6.66667H13.6666V10ZM21.6999 20L16.9999 15.2667L19.3499 12.9167L21.6999 15.2833L26.9833 10L29.3499 12.3667L21.6999 20Z"
    />
  </svg>
);

const OBPSIconSolidBg = () => (
  <svg width="34" height="30" viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.333 0H3.66634C1.83301 0 0.333008 1.5 0.333008 3.33333V26.6667C0.333008 28.5 1.83301 30 3.66634 30H30.333C32.1663 30 33.6663 28.5 33.6663 26.6667V3.33333C33.6663 1.5 32.1663 0 30.333 0ZM13.6663 23.3333H5.33301V20H13.6663V23.3333ZM13.6663 16.6667H5.33301V13.3333H13.6663V16.6667ZM13.6663 10H5.33301V6.66667H13.6663V10ZM21.6997 20L16.9997 15.2667L19.3497 12.9167L21.6997 15.2833L26.983 10L29.3497 12.3667L21.6997 20Z"
      fill="white"
    />
  </svg>
);

const CitizenTruck = ({ className }) => (
  <svg width="40" height="40" viewBox="0 0 23 19" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill={"#F47738"}
      d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
    />
  </svg>
);

const FSMIcon = ({ className, styles }) => (
  <svg width="40" height="40" viewBox="0 0 23 19" className={className} style={{ ...styles }} fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

const EDCRIcon = ({ className }) => (
  <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 15.3333V5.33333L15 0.333334L10 5.33333V8.66667H0V32H30V15.3333H20ZM6.66667 28.6667H3.33333V25.3333H6.66667V28.6667ZM6.66667 22H3.33333V18.6667H6.66667V22ZM6.66667 15.3333H3.33333V12H6.66667V15.3333ZM16.6667 28.6667H13.3333V25.3333H16.6667V28.6667ZM16.6667 22H13.3333V18.6667H16.6667V22ZM16.6667 15.3333H13.3333V12H16.6667V15.3333ZM16.6667 8.66667H13.3333V5.33333H16.6667V8.66667ZM26.6667 28.6667H23.3333V25.3333H26.6667V28.6667ZM26.6667 22H23.3333V18.6667H26.6667V22Z"
      fill="#F47738"
    />
  </svg>
);

const BPAIcon = ({ className }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.3333 29.0333H3.33333V8.66667H15V5.33334H3.33333C1.5 5.33334 0 6.83334 0 8.66667V28.6667C0 30.5 1.5 32 3.33333 32H23.3333C25.1667 32 26.6667 30.5 26.6667 28.6667V17H23.3333V29.0333Z"
      fill="#F47738"
    />
    <path
      d="M26.6667 0.333336H23.3333V5.33334H18.3333C18.35 5.35 18.3333 8.66667 18.3333 8.66667H23.3333V13.65C23.35 13.6667 26.6667 13.65 26.6667 13.65V8.66667H31.6667V5.33334H26.6667V0.333336Z"
      fill="#F47738"
    />
    <path d="M20 12H6.66666V15.3333H20V12Z" fill="#F47738" />
    <path d="M6.66666 17V20.3333H20V17H15H6.66666Z" fill="#F47738" />
    <path d="M20 22H6.66666V25.3333H20V22Z" fill="#F47738" />
  </svg>
);

const BPAHomeIcon = ({ className, styles }) => (
  <svg width="34" height="30" className={className} style={{ ...styles }} viewBox="0 0 34 30" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.3333 0H3.66659C1.83325 0 0.333252 1.5 0.333252 3.33333V26.6667C0.333252 28.5 1.83325 30 3.66659 30H30.3333C32.1666 30 33.6666 28.5 33.6666 26.6667V3.33333C33.6666 1.5 32.1666 0 30.3333 0ZM13.6666 23.3333H5.33325V20H13.6666V23.3333ZM13.6666 16.6667H5.33325V13.3333H13.6666V16.6667ZM13.6666 10H5.33325V6.66667H13.6666V10ZM21.6999 20L16.9999 15.2667L19.3499 12.9167L21.6999 15.2833L26.9833 10L29.3499 12.3667L21.6999 20Z"
      fill="white"
    />
  </svg>
);

const HelpIcon = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H22C23.1 18 23.99 17.1 23.99 16L24 2C24 0.9 23.1 0 22 0ZM8 3C9.66 3 11 4.34 11 6C11 7.66 9.66 9 8 9C6.34 9 5 7.66 5 6C5 4.34 6.34 3 8 3ZM14 15H2V14C2 12 6 10.9 8 10.9C10 10.9 14 12 14 14V15ZM17.85 11H19.49L21 13L19.01 14.99C17.7 14.01 16.73 12.61 16.28 11C16.1 10.36 16 9.69 16 9C16 8.31 16.1 7.64 16.28 7C16.73 5.38 17.7 3.99 19.01 3.01L21 5L19.49 7H17.85C17.63 7.63 17.5 8.3 17.5 9C17.5 9.7 17.63 10.37 17.85 11Z"
      fill="#F47738"
    />
  </svg>
);
const EventCalendar = () => {
  return (
    <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.6667 15.0002H12V21.6668H18.6667V15.0002ZM17.3333 0.333496V3.00016H6.66667V0.333496H4V3.00016H2.66667C1.18667 3.00016 0.0133333 4.20016 0.0133333 5.66683L0 24.3335C0 25.8002 1.18667 27.0002 2.66667 27.0002H21.3333C22.8 27.0002 24 25.8002 24 24.3335V5.66683C24 4.20016 22.8 3.00016 21.3333 3.00016H20V0.333496H17.3333ZM21.3333 24.3335H2.66667V9.66683H21.3333V24.3335Z"
        fill="#F47738"
      />
    </svg>
  );
};

const NotificationBell = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 20C9.1 20 10 19.1 10 18H6C6 19.1 6.89 20 8 20ZM14 14V9C14 5.93 12.36 3.36 9.5 2.68V2C9.5 1.17 8.83 0.5 8 0.5C7.17 0.5 6.5 1.17 6.5 2V2.68C3.63 3.36 2 5.92 2 9V14L0 16V17H16V16L14 14Z"
      fill="white"
    />
  </svg>
);

const MapMarker = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 0.333496C2.42 0.333496 0.333328 2.42016 0.333328 5.00016C0.333328 6.16016 0.666661 7.24683 1.27333 8.22683C1.90666 9.2535 2.73999 10.1335 3.37999 11.1602C3.69333 11.6602 3.91999 12.1268 4.15999 12.6668C4.33333 13.0335 4.47333 13.6668 5 13.6668C5.52666 13.6668 5.66666 13.0335 5.83333 12.6668C6.08 12.1268 6.29999 11.6602 6.61333 11.1602C7.25333 10.1402 8.08666 9.26016 8.72 8.22683C9.33333 7.24683 9.66666 6.16016 9.66666 5.00016C9.66666 2.42016 7.58 0.333496 5 0.333496ZM5 6.8335C4.07999 6.8335 3.33333 6.08683 3.33333 5.16683C3.33333 4.24683 4.07999 3.50016 5 3.50016C5.92 3.50016 6.66666 4.24683 6.66666 5.16683C6.66666 6.08683 5.92 6.8335 5 6.8335Z"
      fill="#505A5F"
    />
  </svg>
);

const Clock = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.992 0C3.576 0 0 3.584 0 8C0 12.416 3.576 16 7.992 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 7.992 0ZM7.99994 14.4C4.46393 14.4 1.59993 11.536 1.59993 7.99999C1.59993 4.46399 4.46393 1.59999 7.99994 1.59999C11.5359 1.59999 14.3999 4.46399 14.3999 7.99999C14.3999 11.536 11.5359 14.4 7.99994 14.4ZM7.20003 4H8.40003V8.2L12 10.336L11.4 11.32L7.20003 8.8V4Z"
      fill="#505A5F"
    />
  </svg>
);

const TickMark = ({ fillColor = "white" }) => (
  <svg style={{ display: "inline-block", margin: "auto" }} width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.75012 8.1275L1.62262 5L0.557617 6.0575L4.75012 10.25L13.7501 1.25L12.6926 0.192505L4.75012 8.1275Z" fill={fillColor} />
  </svg>
);

const EditIcon = ({ style }) => (
  <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.126 5.125L11.063 3.188L14.81 6.935L12.873 8.873L9.126 5.125ZM17.71 2.63L15.37 0.289999C15.1826 0.103748 14.9292 -0.000793457 14.665 -0.000793457C14.4008 -0.000793457 14.1474 0.103748 13.96 0.289999L12.13 2.12L15.88 5.87L17.71 4C17.8844 3.81454 17.9815 3.56956 17.9815 3.315C17.9815 3.06044 17.8844 2.81546 17.71 2.63ZM5.63 8.63L0 14.25V18H3.75L9.38 12.38L12.873 8.873L9.126 5.125L5.63 8.63Z"
      fill="#F47738"
    />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
      fill="#505A5F"
    />
  </svg>
);

const DeleteIcon = ({ style, fill }) => (
  <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill={fill} />
  </svg>
);

const WSICon = ({ className, styles }) => (
  <svg width="28" height="34" viewBox="0 0 28 34" fill="#ffffff" style={{ ...styles }} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M23.4332 10.3337L13.9998 0.916992L4.5665 10.3337C1.9665 12.9337 0.666504 16.4003 0.666504 19.7337C0.666504 23.067 1.9665 26.5837 4.5665 29.1837C7.1665 31.7837 10.5832 33.1003 13.9998 33.1003C17.4165 33.1003 20.8332 31.7837 23.4332 29.1837C26.0332 26.5837 27.3332 23.067 27.3332 19.7337C27.3332 16.4003 26.0332 12.9337 23.4332 10.3337ZM3.99984 20.3337C4.0165 17.0003 5.03317 14.8837 6.93317 13.0003L13.9998 5.78366L21.0665 13.0837C22.9665 14.9503 23.9832 17.0003 23.9998 20.3337H3.99984Z" />
  </svg>
);

const ArrowVectorDown = ({ className, styles }) => (
  <svg style={{ ...styles }} className={className} viewBox="0 0 16 11" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2.33331L14.12 0.453308L8 6.55997L1.88 0.453307L-8.21774e-08 2.33331L8 10.3333L16 2.33331Z" fill="#F47738" />
  </svg>
);

const ArrowDirection = ({ className, styles }) => (
  <svg style={{ ...styles }} className={className} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.0013 2.66669L7.0613 3.60669L10.7813 7.33335H2.66797V8.66669H10.7813L7.0613 12.3934L8.0013 13.3334L13.3346 8.00002L8.0013 2.66669Z" />
  </svg>
);

const CameraIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.0002 5L11.9502 8.33333H6.66683C4.8335 8.33333 3.3335 9.83333 3.3335 11.6667V31.6667C3.3335 33.5 4.8335 35 6.66683 35H33.3335C35.1668 35 36.6668 33.5 36.6668 31.6667V11.6667C36.6668 9.83333 35.1668 8.33333 33.3335 8.33333H28.0502L25.0002 5H15.0002ZM20.0002 30C15.4002 30 11.6668 26.2667 11.6668 21.6667C11.6668 17.0667 15.4002 13.3333 20.0002 13.3333C24.6002 13.3333 28.3335 17.0667 28.3335 21.6667C28.3335 26.2667 24.6002 30 20.0002 30Z"
      fill="#F47738"
    />
    <path
      d="M20.0002 28.3333L22.0835 23.75L26.6668 21.6667L22.0835 19.5833L20.0002 15L17.9168 19.5833L13.3335 21.6667L17.9168 23.75L20.0002 28.3333Z"
      fill="#F47738"
    />
  </svg>
);
const RemoveIcon = () => (
  <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.00016 26.6667C2.00016 28.5 3.50016 30 5.3335 30H18.6668C20.5002 30 22.0002 28.5 22.0002 26.6667V6.66667H2.00016V26.6667ZM23.6668 1.66667H17.8335L16.1668 0H7.8335L6.16683 1.66667H0.333496V5H23.6668V1.66667Z"
      fill="#F47738"
    />
  </svg>
);

const GalleryIcon = () => (
  <svg width="40" height="34" viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.33333 7.00016H0V15.3335H0.0166667L0 30.3335C0 32.1668 1.5 33.6668 3.33333 33.6668H33.3333V30.3335H3.33333V7.00016ZM36.6667 3.66683H23.3333L20 0.333496H10C8.16667 0.333496 6.68333 1.8335 6.68333 3.66683L6.66667 23.6668C6.66667 25.5002 8.16667 27.0002 10 27.0002H36.6667C38.5 27.0002 40 25.5002 40 23.6668V7.00016C40 5.16683 38.5 3.66683 36.6667 3.66683ZM11.6667 22.0002L19.1667 12.0002L25 19.5168L29.1667 14.5002L35 22.0002H11.6667Z"
      fill="#F47738"
    />
  </svg>
);

const EditPencilIcon = ({ className, width = 18, height = 18 }) => (
  <svg className={className} width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.126 5.12482L11.063 3.18782L14.81 6.93482L12.873 8.87282L9.126 5.12482ZM17.71 2.62982L15.37 0.289816C15.1826 0.103565 14.9292 -0.000976562 14.665 -0.000976562C14.4008 -0.000976563 14.1474 0.103565 13.96 0.289816L12.13 2.11982L15.88 5.86982L17.71 3.99982C17.8844 3.81436 17.9815 3.56938 17.9815 3.31482C17.9815 3.06025 17.8844 2.81528 17.71 2.62982ZM5.63 8.62982L0 14.2498V17.9998H3.75L9.38 12.3798L12.873 8.87282L9.126 5.12482L5.63 8.62982Z"
      fill="#505A5F"
    />
  </svg>
);
const AddressBookIcon = ({ styles, className }) => (
  <svg className={className} style={{ ...styles }} viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 0H2V2H18V0ZM2 24H18V22H2V24ZM18 4H2C0.9 4 0 4.9 0 6V18C0 19.1 0.9 20 2 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4ZM10 6.75C11.24 6.75 12.25 7.76 12.25 9C12.25 10.24 11.24 11.25 10 11.25C8.76 11.25 7.75 10.24 7.75 9C7.75 7.76 8.76 6.75 10 6.75ZM15 17H5V15.5C5 13.83 8.33 13 10 13C11.67 13 15 13.83 15 15.5V17Z"
      fill="#B1B4B6"
    />
  </svg>
);

const LocationIcon = ({ styles, className }) => (
  <svg className={className} style={{ ...styles }} viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 0C3.13 0 0 3.13 0 7C0 8.74 0.5 10.37 1.41 11.84C2.36 13.38 3.61 14.7 4.57 16.24C5.04 16.99 5.38 17.69 5.74 18.5C6 19.05 6.21 20 7 20C7.79 20 8 19.05 8.25 18.5C8.62 17.69 8.95 16.99 9.42 16.24C10.38 14.71 11.63 13.39 12.58 11.84C13.5 10.37 14 8.74 14 7C14 3.13 10.87 0 7 0ZM7 9.75C5.62 9.75 4.5 8.63 4.5 7.25C4.5 5.87 5.62 4.75 7 4.75C8.38 4.75 9.5 5.87 9.5 7.25C9.5 8.63 8.38 9.75 7 9.75Z"
      fill="#B1B4B6"
    />
  </svg>
);
const CollectionsBookmarIcons = ({ styles, className }) => (
  <svg width="22" height="28" className={className} style={{ ...styles }} viewBox="0 0 22 28" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.9999 0.666992H2.99992C1.53325 0.666992 0.333252 1.86699 0.333252 3.33366V24.667C0.333252 26.1337 1.53325 27.3337 2.99992 27.3337H18.9999C20.4666 27.3337 21.6666 26.1337 21.6666 24.667V3.33366C21.6666 1.86699 20.4666 0.666992 18.9999 0.666992ZM2.99992 3.33366H9.66658V14.0003L6.33325 12.0003L2.99992 14.0003V3.33366Z" />
  </svg>
);

const FinanceChartIcon = ({ styles, className }) => (
  <svg width="30" height="30" className={className} style={{ ...styles }} viewBox="0 0 30 30" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path d="M26.6667 0H3.33333C1.5 0 0 1.5 0 3.33333V26.6667C0 28.5 1.5 30 3.33333 30H26.6667C28.5 30 30 28.5 30 26.6667V3.33333C30 1.5 28.5 0 26.6667 0ZM10 23.3333H6.66667V11.6667H10V23.3333ZM16.6667 23.3333H13.3333V6.66667H16.6667V23.3333ZM23.3333 23.3333H20V16.6667H23.3333V23.3333Z" />
  </svg>
);

const CollectionIcon = ({ styles, className }) => (
  <svg width="24" height="27" className={className} style={{ ...styles }} viewBox="0 0 24 27" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.3333 2.99967H15.76C15.2 1.45301 13.7333 0.333008 12 0.333008C10.2667 0.333008 8.8 1.45301 8.24 2.99967H2.66667C1.2 2.99967 0 4.19967 0 5.66634V24.333C0 25.7997 1.2 26.9997 2.66667 26.9997H21.3333C22.8 26.9997 24 25.7997 24 24.333V5.66634C24 4.19967 22.8 2.99967 21.3333 2.99967ZM12 2.99967C12.7333 2.99967 13.3333 3.59967 13.3333 4.33301C13.3333 5.06634 12.7333 5.66634 12 5.66634C11.2667 5.66634 10.6667 5.06634 10.6667 4.33301C10.6667 3.59967 11.2667 2.99967 12 2.99967ZM14.6667 21.6663H5.33333V18.9997H14.6667V21.6663ZM18.6667 16.333H5.33333V13.6663H18.6667V16.333ZM18.6667 10.9997H5.33333V8.33301H18.6667V10.9997Z" />
  </svg>
);

const BillsIcon = ({ styles, className }) => (
  <svg width="24" height="27" className={className} style={{ ...styles }} viewBox="0 0 24 27" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.3333 2.99967H15.76C15.2 1.45301 13.7333 0.333008 12 0.333008C10.2667 0.333008 8.8 1.45301 8.24 2.99967H2.66667C1.2 2.99967 0 4.19967 0 5.66634V24.333C0 25.7997 1.2 26.9997 2.66667 26.9997H21.3333C22.8 26.9997 24 25.7997 24 24.333V5.66634C24 4.19967 22.8 2.99967 21.3333 2.99967ZM12 2.99967C12.7333 2.99967 13.3333 3.59967 13.3333 4.33301C13.3333 5.06634 12.7333 5.66634 12 5.66634C11.2667 5.66634 10.6667 5.06634 10.6667 4.33301C10.6667 3.59967 11.2667 2.99967 12 2.99967ZM14.6667 21.6663H5.33333V18.9997H14.6667V21.6663ZM18.6667 16.333H5.33333V13.6663H18.6667V16.333ZM18.6667 10.9997H5.33333V8.33301H18.6667V10.9997Z" />
  </svg>
);

const MCollectIcon = ({ styles, className }) => (
  <svg width="37" height="35" className={className} style={{ ...styles }} viewBox="0 0 37 35" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path d="M34.375 28.75V30.625C34.375 32.6875 32.6875 34.375 30.625 34.375H4.375C2.29375 34.375 0.625 32.6875 0.625 30.625V4.375C0.625 2.3125 2.29375 0.625 4.375 0.625H30.625C32.6875 0.625 34.375 2.3125 34.375 4.375V6.25H17.5C15.4187 6.25 13.75 7.9375 13.75 10V25C13.75 27.0625 15.4187 28.75 17.5 28.75H34.375ZM17.5 25H36.25V10H17.5V25ZM25 20.3125C23.4438 20.3125 22.1875 19.0562 22.1875 17.5C22.1875 15.9438 23.4438 14.6875 25 14.6875C26.5562 14.6875 27.8125 15.9438 27.8125 17.5C27.8125 19.0562 26.5562 20.3125 25 20.3125Z" />
  </svg>
);

const PGRIcon = ({ styles, className }) => (
  <svg width="35" height="39" className={className} style={{ ...styles }} viewBox="0 0 35 39" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path d="M31.168 0.75H3.83464C1.95547 0.75 0.435052 2.4375 0.435052 4.5L0.417969 38.25L7.2513 30.75H31.168C33.0471 30.75 34.5846 29.0625 34.5846 27V4.5C34.5846 2.4375 33.0471 0.75 31.168 0.75ZM19.2096 17.625H15.793V6.375H19.2096V17.625ZM19.2096 25.125H15.793V21.375H19.2096V25.125Z" />
  </svg>
);
const FirenocIcon = ({ styles, className }) => (
  <svg width="35" height="39" className={className} style={{ ...styles }} viewBox="0 0 35 39" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21.5142857,14.0571429 C21.12,13.5428571 20.6571429,13.0971429 20.2114286,12.6514286 C19.0971429,11.6228571 17.8114286,10.8857143 16.7314286,9.80571429 C14.2285714,7.30285714 13.7142857,3.17142857 15.2742857,0 C13.7142857,0.394285714 12.2742857,1.28571429 11.0742857,2.26285714 C6.72,5.82857143 5.00571429,12.12 7.06285714,17.52 C7.13142857,17.6914286 7.2,17.8628571 7.2,18.0857143 C7.2,18.4628571 6.94285714,18.8057143 6.6,18.9428571 C6.22285714,19.1142857 5.81142857,19.0114286 5.50285714,18.7371429 C5.4,18.6514286 5.33142857,18.5657143 5.24571429,18.4457143 C3.36,15.9942857 3.05142857,12.48 4.33714286,9.66857143 C1.52571429,12 8.60422844e-16,15.9428571 0.24,19.6628571 C0.308571429,20.52 0.411428571,21.3771429 0.702857143,22.2342857 C0.942857143,23.2628571 1.38857143,24.2914286 1.93714286,25.2 C3.72,28.1657143 6.85714286,30.2914286 10.2342857,30.72 C13.8342857,31.1828571 17.6914286,30.5142857 20.4514286,27.9771429 C23.5371429,25.1314286 24.6514286,20.5714286 23.0228571,16.6628571 L22.8,16.2171429 C22.4571429,15.4285714 21.9942857,14.7257143 21.4285714,14.0742857 L21.5142857,14.0571429 L21.5142857,14.0571429 Z M16.2,24.8571429 C15.72,25.2685714 14.9485714,25.7142857 14.3485714,25.8857143 C12.4628571,26.5714286 10.5771429,25.6114286 9.42857143,24.48 C11.4685714,24 12.6685714,22.4914286 13.0114286,20.9657143 C13.3028571,19.5942857 12.7714286,18.4628571 12.5485714,17.1428571 C12.3428571,15.8742857 12.3771429,14.7942857 12.8571429,13.6114286 C13.1485714,14.2628571 13.4914286,14.9142857 13.8857143,15.4285714 C15.1885714,17.1428571 17.2285714,17.8971429 17.6571429,20.2285714 C17.7257143,20.4685714 17.76,20.7085714 17.76,20.9657143 C17.8114286,22.3714286 17.2114286,23.9142857 16.1828571,24.8571429 L16.2,24.8571429 Z"
      id="Shape"
    ></path>
  </svg>
);
const BirthIcon = ({ styles, className }) => (
  <svg width="35" height="39" className={className} style={{ ...styles }} viewBox="0 0 35 39" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.7502 0.916016H3.25016C1.646 0.916016 0.333496 2.22852 0.333496 3.83268V27.166C0.333496 28.7702 1.646 30.0827 3.25016 30.0827H20.7502C22.3543 30.0827 23.6668 28.7702 23.6668 27.166V3.83268C23.6668 2.22852 22.3543 0.916016 20.7502 0.916016ZM3.25016 3.83268H10.5418V15.4994L6.896 13.3119L3.25016 15.4994V3.83268Z" />
  </svg>
);
const DeathIcon = ({ styles, className }) => (
  <svg width="35" height="39" className={className} style={{ ...styles }} viewBox="0 0 35 39" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M27.1665 0.375H3.83317C2.229 0.375 0.916504 1.6875 0.916504 3.29167V23.7083C0.916504 25.3125 2.229 26.625 3.83317 26.625H27.1665C28.7707 26.625 30.0832 25.3125 30.0832 23.7083V3.29167C30.0832 1.6875 28.7707 0.375 27.1665 0.375ZM12.5832 20.7917H5.2915V17.875H12.5832V20.7917ZM12.5832 14.9583H5.2915V12.0417H12.5832V14.9583ZM12.5832 9.125H5.2915V6.20833H12.5832V9.125ZM19.6123 17.875L15.4998 13.7333L17.5561 11.6771L19.6123 13.7479L24.2353 9.125L26.3061 11.1958L19.6123 17.875Z"
    />
  </svg>
);
const ErrorIcon = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
      fill="white"
    />
  </svg>
);
const DownloadBtnCommon = () => (
  <svg width="112" height="32" viewBox="0 0 112 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25.3337 12H20.0003V4H12.0003V12H6.66699L16.0003 21.3333L25.3337 12ZM6.66699 24V26.6667H25.3337V24H6.66699Z" fill="#F47738" />
    <path
      d="M44.3984 21.5H42.0234L42.0391 20.2734H44.3984C45.2109 20.2734 45.888 20.1042 46.4297 19.7656C46.9714 19.4219 47.3776 18.9427 47.6484 18.3281C47.9245 17.7083 48.0625 16.9844 48.0625 16.1562V15.4609C48.0625 14.8099 47.9844 14.2318 47.8281 13.7266C47.6719 13.2161 47.4427 12.7865 47.1406 12.4375C46.8385 12.0833 46.4688 11.8151 46.0312 11.6328C45.599 11.4505 45.1016 11.3594 44.5391 11.3594H41.9766V10.125H44.5391C45.2839 10.125 45.9635 10.25 46.5781 10.5C47.1927 10.7448 47.7214 11.1016 48.1641 11.5703C48.612 12.0339 48.9557 12.5964 49.1953 13.2578C49.4349 13.9141 49.5547 14.6536 49.5547 15.4766V16.1562C49.5547 16.9792 49.4349 17.7214 49.1953 18.3828C48.9557 19.0391 48.6094 19.599 48.1562 20.0625C47.7083 20.526 47.1667 20.8828 46.5312 21.1328C45.901 21.3776 45.1901 21.5 44.3984 21.5ZM42.8281 10.125V21.5H41.3203V10.125H42.8281ZM51.2188 17.3672V17.1875C51.2188 16.5781 51.3073 16.013 51.4844 15.4922C51.6615 14.9661 51.9167 14.5104 52.25 14.125C52.5833 13.7344 52.987 13.4323 53.4609 13.2188C53.9349 13 54.4661 12.8906 55.0547 12.8906C55.6484 12.8906 56.1823 13 56.6562 13.2188C57.1354 13.4323 57.5417 13.7344 57.875 14.125C58.2135 14.5104 58.4714 14.9661 58.6484 15.4922C58.8255 16.013 58.9141 16.5781 58.9141 17.1875V17.3672C58.9141 17.9766 58.8255 18.5417 58.6484 19.0625C58.4714 19.5833 58.2135 20.0391 57.875 20.4297C57.5417 20.8151 57.138 21.1172 56.6641 21.3359C56.1953 21.5495 55.6641 21.6562 55.0703 21.6562C54.4766 21.6562 53.9427 21.5495 53.4688 21.3359C52.9948 21.1172 52.5885 20.8151 52.25 20.4297C51.9167 20.0391 51.6615 19.5833 51.4844 19.0625C51.3073 18.5417 51.2188 17.9766 51.2188 17.3672ZM52.6641 17.1875V17.3672C52.6641 17.7891 52.7135 18.1875 52.8125 18.5625C52.9115 18.9323 53.0599 19.2604 53.2578 19.5469C53.4609 19.8333 53.7135 20.0599 54.0156 20.2266C54.3177 20.388 54.6693 20.4688 55.0703 20.4688C55.4661 20.4688 55.8125 20.388 56.1094 20.2266C56.4115 20.0599 56.6615 19.8333 56.8594 19.5469C57.0573 19.2604 57.2057 18.9323 57.3047 18.5625C57.4089 18.1875 57.4609 17.7891 57.4609 17.3672V17.1875C57.4609 16.7708 57.4089 16.3776 57.3047 16.0078C57.2057 15.6328 57.0547 15.3021 56.8516 15.0156C56.6536 14.724 56.4036 14.4948 56.1016 14.3281C55.8047 14.1615 55.4557 14.0781 55.0547 14.0781C54.6589 14.0781 54.3099 14.1615 54.0078 14.3281C53.7109 14.4948 53.4609 14.724 53.2578 15.0156C53.0599 15.3021 52.9115 15.6328 52.8125 16.0078C52.7135 16.3776 52.6641 16.7708 52.6641 17.1875ZM62.8672 20L65.0391 13.0469H65.9922L65.8047 14.4297L63.5938 21.5H62.6641L62.8672 20ZM61.4062 13.0469L63.2578 20.0781L63.3906 21.5H62.4141L59.9609 13.0469H61.4062ZM68.0703 20.0234L69.8359 13.0469H71.2734L68.8203 21.5H67.8516L68.0703 20.0234ZM66.2031 13.0469L68.3281 19.8828L68.5703 21.5H67.6484L65.375 14.4141L65.1875 13.0469H66.2031ZM74.2031 14.8516V21.5H72.7578V13.0469H74.125L74.2031 14.8516ZM73.8594 16.9531L73.2578 16.9297C73.263 16.3516 73.349 15.8177 73.5156 15.3281C73.6823 14.8333 73.9167 14.4036 74.2188 14.0391C74.5208 13.6745 74.8802 13.3932 75.2969 13.1953C75.7188 12.9922 76.1849 12.8906 76.6953 12.8906C77.112 12.8906 77.487 12.9479 77.8203 13.0625C78.1536 13.1719 78.4375 13.349 78.6719 13.5938C78.9115 13.8385 79.0938 14.1562 79.2188 14.5469C79.3438 14.9323 79.4062 15.4036 79.4062 15.9609V21.5H77.9531V15.9453C77.9531 15.5026 77.888 15.1484 77.7578 14.8828C77.6276 14.612 77.4375 14.4167 77.1875 14.2969C76.9375 14.1719 76.6302 14.1094 76.2656 14.1094C75.9062 14.1094 75.5781 14.1849 75.2812 14.3359C74.9896 14.487 74.737 14.6953 74.5234 14.9609C74.3151 15.2266 74.151 15.5312 74.0312 15.875C73.9167 16.2135 73.8594 16.5729 73.8594 16.9531ZM83.1719 9.5V21.5H81.7188V9.5H83.1719ZM85.1094 17.3672V17.1875C85.1094 16.5781 85.1979 16.013 85.375 15.4922C85.5521 14.9661 85.8073 14.5104 86.1406 14.125C86.474 13.7344 86.8776 13.4323 87.3516 13.2188C87.8255 13 88.3568 12.8906 88.9453 12.8906C89.5391 12.8906 90.0729 13 90.5469 13.2188C91.026 13.4323 91.4323 13.7344 91.7656 14.125C92.1042 14.5104 92.362 14.9661 92.5391 15.4922C92.7161 16.013 92.8047 16.5781 92.8047 17.1875V17.3672C92.8047 17.9766 92.7161 18.5417 92.5391 19.0625C92.362 19.5833 92.1042 20.0391 91.7656 20.4297C91.4323 20.8151 91.0286 21.1172 90.5547 21.3359C90.0859 21.5495 89.5547 21.6562 88.9609 21.6562C88.3672 21.6562 87.8333 21.5495 87.3594 21.3359C86.8854 21.1172 86.4792 20.8151 86.1406 20.4297C85.8073 20.0391 85.5521 19.5833 85.375 19.0625C85.1979 18.5417 85.1094 17.9766 85.1094 17.3672ZM86.5547 17.1875V17.3672C86.5547 17.7891 86.6042 18.1875 86.7031 18.5625C86.8021 18.9323 86.9505 19.2604 87.1484 19.5469C87.3516 19.8333 87.6042 20.0599 87.9062 20.2266C88.2083 20.388 88.5599 20.4688 88.9609 20.4688C89.3568 20.4688 89.7031 20.388 90 20.2266C90.3021 20.0599 90.5521 19.8333 90.75 19.5469C90.9479 19.2604 91.0964 18.9323 91.1953 18.5625C91.2995 18.1875 91.3516 17.7891 91.3516 17.3672V17.1875C91.3516 16.7708 91.2995 16.3776 91.1953 16.0078C91.0964 15.6328 90.9453 15.3021 90.7422 15.0156C90.5443 14.724 90.2943 14.4948 89.9922 14.3281C89.6953 14.1615 89.3464 14.0781 88.9453 14.0781C88.5495 14.0781 88.2005 14.1615 87.8984 14.3281C87.6016 14.4948 87.3516 14.724 87.1484 15.0156C86.9505 15.3021 86.8021 15.6328 86.7031 16.0078C86.6042 16.3776 86.5547 16.7708 86.5547 17.1875ZM99.6016 20.0547V15.7031C99.6016 15.3698 99.5339 15.0807 99.3984 14.8359C99.2682 14.5859 99.0703 14.3932 98.8047 14.2578C98.5391 14.1224 98.2109 14.0547 97.8203 14.0547C97.4557 14.0547 97.1354 14.1172 96.8594 14.2422C96.5885 14.3672 96.375 14.5312 96.2188 14.7344C96.0677 14.9375 95.9922 15.1562 95.9922 15.3906H94.5469C94.5469 15.0885 94.625 14.7891 94.7812 14.4922C94.9375 14.1953 95.1615 13.9271 95.4531 13.6875C95.75 13.4427 96.1042 13.25 96.5156 13.1094C96.9323 12.9635 97.3958 12.8906 97.9062 12.8906C98.5208 12.8906 99.0625 12.9948 99.5312 13.2031C100.005 13.4115 100.375 13.7266 100.641 14.1484C100.911 14.5651 101.047 15.0885 101.047 15.7188V19.6562C101.047 19.9375 101.07 20.237 101.117 20.5547C101.169 20.8724 101.245 21.1458 101.344 21.375V21.5H99.8359C99.763 21.3333 99.7057 21.112 99.6641 20.8359C99.6224 20.5547 99.6016 20.2943 99.6016 20.0547ZM99.8516 16.375L99.8672 17.3906H98.4062C97.9948 17.3906 97.6276 17.4245 97.3047 17.4922C96.9818 17.5547 96.7109 17.651 96.4922 17.7812C96.2734 17.9115 96.1068 18.0755 95.9922 18.2734C95.8776 18.4661 95.8203 18.6927 95.8203 18.9531C95.8203 19.2188 95.8802 19.4609 96 19.6797C96.1198 19.8984 96.2995 20.0729 96.5391 20.2031C96.7839 20.3281 97.0833 20.3906 97.4375 20.3906C97.8802 20.3906 98.2708 20.2969 98.6094 20.1094C98.9479 19.9219 99.2161 19.6927 99.4141 19.4219C99.6172 19.151 99.7266 18.888 99.7422 18.6328L100.359 19.3281C100.323 19.5469 100.224 19.7891 100.062 20.0547C99.901 20.3203 99.6849 20.5755 99.4141 20.8203C99.1484 21.0599 98.8307 21.2604 98.4609 21.4219C98.0964 21.5781 97.6849 21.6562 97.2266 21.6562C96.6536 21.6562 96.151 21.5443 95.7188 21.3203C95.2917 21.0964 94.9583 20.7969 94.7188 20.4219C94.4844 20.0417 94.3672 19.6172 94.3672 19.1484C94.3672 18.6953 94.4557 18.2969 94.6328 17.9531C94.8099 17.6042 95.0651 17.3151 95.3984 17.0859C95.7318 16.8516 96.1328 16.6745 96.6016 16.5547C97.0703 16.4349 97.5938 16.375 98.1719 16.375H99.8516ZM108.648 19.8594V9.5H110.102V21.5H108.773L108.648 19.8594ZM102.961 17.3672V17.2031C102.961 16.5573 103.039 15.9714 103.195 15.4453C103.357 14.9141 103.583 14.4583 103.875 14.0781C104.172 13.6979 104.523 13.4062 104.93 13.2031C105.341 12.9948 105.799 12.8906 106.305 12.8906C106.836 12.8906 107.299 12.9844 107.695 13.1719C108.096 13.3542 108.435 13.6224 108.711 13.9766C108.992 14.3255 109.214 14.7474 109.375 15.2422C109.536 15.737 109.648 16.2969 109.711 16.9219V17.6406C109.654 18.2604 109.542 18.8177 109.375 19.3125C109.214 19.8073 108.992 20.2292 108.711 20.5781C108.435 20.9271 108.096 21.1953 107.695 21.3828C107.294 21.5651 106.826 21.6562 106.289 21.6562C105.794 21.6562 105.341 21.5495 104.93 21.3359C104.523 21.1224 104.172 20.8229 103.875 20.4375C103.583 20.0521 103.357 19.599 103.195 19.0781C103.039 18.5521 102.961 17.9818 102.961 17.3672ZM104.414 17.2031V17.3672C104.414 17.7891 104.456 18.1849 104.539 18.5547C104.628 18.9245 104.763 19.25 104.945 19.5312C105.128 19.8125 105.359 20.0339 105.641 20.1953C105.922 20.3516 106.258 20.4297 106.648 20.4297C107.128 20.4297 107.521 20.3281 107.828 20.125C108.141 19.9219 108.391 19.6536 108.578 19.3203C108.766 18.987 108.911 18.625 109.016 18.2344V16.3516C108.953 16.0651 108.862 15.7891 108.742 15.5234C108.628 15.2526 108.477 15.013 108.289 14.8047C108.107 14.5911 107.88 14.4219 107.609 14.2969C107.344 14.1719 107.029 14.1094 106.664 14.1094C106.268 14.1094 105.927 14.1927 105.641 14.3594C105.359 14.5208 105.128 14.7448 104.945 15.0312C104.763 15.3125 104.628 15.6406 104.539 16.0156C104.456 16.3854 104.414 16.7812 104.414 17.2031Z"
      fill="#F47738"
    />
  </svg>
);

const PrintBtnCommon = () => (
  <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32.1663 13.8333H8.83301C6.06634 13.8333 3.83301 16.0667 3.83301 18.8333V28.8333H10.4997V35.5H30.4997V28.8333H37.1663V18.8333C37.1663 16.0667 34.933 13.8333 32.1663 13.8333ZM27.1663 32.1667H13.833V23.8333H27.1663V32.1667ZM32.1663 20.5C31.2497 20.5 30.4997 19.75 30.4997 18.8333C30.4997 17.9167 31.2497 17.1667 32.1663 17.1667C33.083 17.1667 33.833 17.9167 33.833 18.8333C33.833 19.75 33.083 20.5 32.1663 20.5ZM30.4997 5.5H10.4997V12.1667H30.4997V5.5Z"
      fill="#505A5F"
    />
  </svg>
);

const WhatsappIconGreen = ({ className, styles }) => (
  <svg className={className} style={{ ...styles }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.0566406 24L1.74364 17.837C0.702641 16.033 0.155641 13.988 0.156641 11.891C0.159641 5.335 5.49464 0 12.0496 0C15.2306 0.001 18.2166 1.24 20.4626 3.488C22.7076 5.736 23.9436 8.724 23.9426 11.902C23.9396 18.459 18.6046 23.794 12.0496 23.794C10.0596 23.793 8.09864 23.294 6.36164 22.346L0.0566406 24ZM6.65364 20.193C8.32964 21.188 9.92964 21.784 12.0456 21.785C17.4936 21.785 21.9316 17.351 21.9346 11.9C21.9366 6.438 17.5196 2.01 12.0536 2.008C6.60164 2.008 2.16664 6.442 2.16464 11.892C2.16364 14.117 2.81564 15.783 3.91064 17.526L2.91164 21.174L6.65364 20.193ZM18.0406 14.729C17.9666 14.605 17.7686 14.531 17.4706 14.382C17.1736 14.233 15.7126 13.514 15.4396 13.415C15.1676 13.316 14.9696 13.266 14.7706 13.564C14.5726 13.861 14.0026 14.531 13.8296 14.729C13.6566 14.927 13.4826 14.952 13.1856 14.803C12.8886 14.654 11.9306 14.341 10.7956 13.328C9.91264 12.54 9.31564 11.567 9.14264 11.269C8.96964 10.972 9.12464 10.811 9.27264 10.663C9.40664 10.53 9.56964 10.316 9.71864 10.142C9.86964 9.97 9.91864 9.846 10.0186 9.647C10.1176 9.449 10.0686 9.275 9.99364 9.126C9.91864 8.978 9.32464 7.515 9.07764 6.92C8.83564 6.341 8.59064 6.419 8.40864 6.41L7.83864 6.4C7.64064 6.4 7.31864 6.474 7.04664 6.772C6.77464 7.07 6.00664 7.788 6.00664 9.251C6.00664 10.714 7.07164 12.127 7.21964 12.325C7.36864 12.523 9.31464 15.525 12.2956 16.812C13.0046 17.118 13.5586 17.301 13.9896 17.438C14.7016 17.664 15.3496 17.632 15.8616 17.556C16.4326 17.471 17.6196 16.837 17.8676 16.143C18.1156 15.448 18.1156 14.853 18.0406 14.729Z"
      fill="#25D366"
    />
  </svg>
);

const HelpLineIcon = ({ className, styles }) => (
  <svg className={className} style={{ ...styles }} width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H22C23.1 18 23.99 17.1 23.99 16L24 2C24 0.9 23.1 0 22 0ZM8 3C9.66 3 11 4.34 11 6C11 7.66 9.66 9 8 9C6.34 9 5 7.66 5 6C5 4.34 6.34 3 8 3ZM14 15H2V14C2 12 6 10.9 8 10.9C10 10.9 14 12 14 14V15ZM17.85 11H19.49L21 13L19.01 14.99C17.7 14.01 16.73 12.61 16.28 11C16.1 10.36 16 9.69 16 9C16 8.31 16.1 7.64 16.28 7C16.73 5.38 17.7 3.99 19.01 3.01L21 5L19.49 7H17.85C17.63 7.63 17.5 8.3 17.5 9C17.5 9.7 17.63 10.37 17.85 11Z"
      fill="#0B0C0C"
    />
  </svg>
);

const ServiceCenterIcon = ({ className, styles }) => (
  <svg className={className} style={{ ...styles }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 10H4V17H7V10Z" fill="#0B0C0C" />
    <path d="M13.5 10H10.5V17H13.5V10Z" fill="#0B0C0C" />
    <path d="M22 19H2V22H22V19Z" fill="#0B0C0C" />
    <path d="M20 10H17V17H20V10Z" fill="#0B0C0C" />
    <path d="M12 1L2 6V8H22V6L12 1Z" fill="#0B0C0C" />
  </svg>
);

const TimerIcon = ({ className, styles }) => (
  <svg className={className} style={{ ...styles }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.0998 17.3701L14.0998 19.1101C13.1398 19.5501 12.0898 19.84 10.9998 19.9501V17.93C11.7398 17.84 12.4398 17.6501 13.0998 17.3701ZM2.0698 11H0.0498047C0.159805 12.1 0.449805 13.14 0.889805 14.1L2.6298 13.1C2.3498 12.44 2.1598 11.74 2.0698 11ZM13.0998 2.63005L14.0998 0.890049C13.1398 0.450049 12.0998 0.160049 10.9998 0.0500488V2.07005C11.7398 2.16005 12.4398 2.35005 13.0998 2.63005ZM17.9298 9.00005H19.9498C19.8398 7.90005 19.5498 6.86005 19.1098 5.90005L17.3698 6.90005C17.6498 7.56005 17.8398 8.26005 17.9298 9.00005ZM6.8998 17.3701L5.89981 19.1101C6.85981 19.5501 7.9098 19.84 8.9998 19.9501V17.93C8.2598 17.84 7.5598 17.6501 6.8998 17.3701ZM8.9998 2.07005V0.0500488C7.8998 0.160049 6.85981 0.450049 5.89981 0.890049L6.8998 2.63005C7.5598 2.35005 8.2598 2.16005 8.9998 2.07005ZM16.3598 5.17005L18.0998 4.16005C17.4698 3.29005 16.6998 2.52005 15.8298 1.89005L14.8198 3.63005C15.4098 4.08005 15.9198 4.59005 16.3598 5.17005ZM2.6298 6.90005L0.889805 5.90005C0.449805 6.86005 0.159805 7.90005 0.0498047 9.00005H2.0698C2.1598 8.26005 2.3498 7.56005 2.6298 6.90005ZM17.9298 11C17.8398 11.74 17.6498 12.44 17.3698 13.1L19.1098 14.1C19.5498 13.14 19.8398 12.09 19.9498 11H17.9298ZM14.8298 16.3601L15.8398 18.1C16.7098 17.4701 17.4798 16.7 18.1098 15.83L16.3698 14.82C15.9198 15.41 15.4098 15.9201 14.8298 16.3601ZM5.1698 3.64005L4.1698 1.89005C3.2898 2.53005 2.5298 3.29005 1.8998 4.17005L3.6398 5.18005C4.0798 4.59005 4.5898 4.08005 5.1698 3.64005ZM3.6398 14.83L1.8998 15.83C2.5298 16.7 3.2998 17.4701 4.1698 18.1L5.1798 16.3601C4.5898 15.9201 4.0798 15.41 3.6398 14.83ZM10.9998 5.00005H8.9998V10.41L13.2898 14.7L14.6998 13.29L10.9998 9.59005V5.00005Z"
      fill="#F47738"
    />
  </svg>
);

const RupeeSymbol = ({ className, styles }) => (
  <svg className={className} style={{ ...styles }} width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.5781 3.26953H9.12891C9.48828 3.83203 9.72266 4.48438 9.83203 5.22656H12.1875L11.5664 7.54688H9.82031C9.64062 8.71094 9.17578 9.63672 8.42578 10.3242C7.67578 11.0117 6.59766 11.4922 5.19141 11.7656L10.3125 17.8359V18H6.43359L0.761719 11.3555L0.75 9.29297H3.52734C4.97266 9.29297 5.87891 8.71094 6.24609 7.54688H0.46875L1.07812 5.22656H6.17578C5.79297 4.28125 4.95312 3.80078 3.65625 3.78516H0.46875L1.16016 0.9375H12.1875L11.5781 3.26953Z"
      fill="#F47738"
    />
  </svg>
);

const ValidityTimeIcon = ({ className, styles }) => (
  <svg className={className} style={{ ...styles }} width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 0C7.03 0 3 4.03 3 9H0L3.89 12.89L3.96 13.03L8 9H5C5 5.13 8.13 2 12 2C15.87 2 19 5.13 19 9C19 12.87 15.87 16 12 16C10.07 16 8.32 15.21 7.06 13.94L5.64 15.36C7.27 16.99 9.51 18 12 18C16.97 18 21 13.97 21 9C21 4.03 16.97 0 12 0ZM11 5V10L15.28 12.54L16 11.33L12.5 9.25V5H11Z"
      fill="#F47738"
    />
  </svg>
);

const AddIcon = ({ styles, className, fill = "white" }) => (
  <svg width="12" height="14" className={className} style={{ ...styles }} viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.8125 5.49609V8.4375H0.117188V5.49609H11.8125ZM7.57031 0.867188V13.2891H4.37109V0.867188H7.57031Z" fill={fill} />
  </svg>
);

const AddNewIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.3333 14.5833C24.3542 14.5833 25.3312 14.7729 26.25 15.0938V8.75L17.5 0H2.91667C1.29792 0 0 1.29792 0 2.91667V23.3333C0 24.9521 1.3125 26.25 2.91667 26.25H15.0938C14.7729 25.3312 14.5833 24.3542 14.5833 23.3333C14.5833 18.5062 18.5062 14.5833 23.3333 14.5833ZM16.0417 2.1875L24.0625 10.2083H16.0417V2.1875ZM29.1667 21.875V24.7917H24.7917V29.1667H21.875V24.7917H17.5V21.875H21.875V17.5H24.7917V21.875H29.1667Z"
      fill="#F47738"
    />
  </svg>
);

const ViewReportIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M26.6667 0H3.33333C1.5 0 0 1.5 0 3.33333V26.6667C0 28.5 1.5 30 3.33333 30H26.6667C28.5 30 30 28.5 30 26.6667V3.33333C30 1.5 28.5 0 26.6667 0ZM18.3333 23.3333H6.66667V20H18.3333V23.3333ZM23.3333 16.6667H6.66667V13.3333H23.3333V16.6667ZM23.3333 10H6.66667V6.66667H23.3333V10Z"
      fill="#F47738"
    />
  </svg>
);

const InboxIcon = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M26.6667 0H3.33333C1.5 0 0 1.5 0 3.33333V15C0 16.8333 1.5 18.3333 3.33333 18.3333H26.6667C28.5 18.3333 30 16.8333 30 15V3.33333C30 1.5 28.5 0 26.6667 0ZM26.6667 10H20C20 12.7 17.7 15 15 15C12.3 15 10 12.7 10 10H3.33333V3.33333H26.6667V10ZM20 21.6667H30V26.6667C30 28.5 28.5 30 26.6667 30H3.33333C1.5 30 0 28.5 0 26.6667V21.6667H10C10 24.4333 12.2333 26.6667 15 26.6667C17.7667 26.6667 20 24.4333 20 21.6667Z"
      fill="#F47738"
    />
  </svg>
);

export {
  AnnouncementIcon,
  ReceiptIcon,
  ArrowLeft,
  ArrowDown,
  CameraSvg,
  DeleteBtn,
  DownloadIcon,
  Ellipsis,
  SuccessSvg,
  ErrorSvg,
  StarFilled,
  StarEmpty,
  SearchIconSvg,
  CheckSvg,
  RoundedCheck,
  Calender,
  Phone,
  FilterSvg,
  SortSvg,
  Close,
  Feedback,
  GetApp,
  HamburgerIcon,
  ArrowBack,
  ArrowForward,
  ArrowRightInbox,
  SortDown,
  SortUp,
  ShippingTruck,
  CloseSvg,
  CalendarIcon,
  UpwardArrow,
  DownwardArrow,
  Poll,
  FilterIcon,
  RefreshIcon,
  RefreshSVG,
  Details,
  PrintIcon,
  PropertyHouse,
  PrimaryDownlaodIcon,
  InfoBannerIcon,
  ShareIcon,
  RupeeIcon,
  ComplaintIcon,
  DropIcon,
  Person,
  WhatsappIcon,
  EmailIcon,
  DocumentIcon,
  DocumentIconSolid,
  EventsIconSolid,
  SurveyIconSolid,
  PMBIconSolid,
  DustbinIcon,
  ExternalLinkIcon,
  DownloadImgIcon,
  ViewsIcon,
  PrevIcon,
  DocumentSVG,
  ArrowToFirst,
  ArrowToLast,
  DownloadPrefixIcon,
  CaseIcon,
  PersonIcon,
  PTIcon,
  OBPSIcon,
  OBPSIconSolidBg,
  CitizenTruck,
  FSMIcon,
  EDCRIcon,
  BPAIcon,
  BPAHomeIcon,
  HelpIcon,
  NotificationBell,
  MapMarker,
  Clock,
  EventCalendar,
  ImageIcon,
  TickMark,
  PDFSvg,
  EditIcon,
  SearchIcon,
  DeleteIcon,
  PMBIcon,
  GenericFileIcon,
  ArrowLeftWhite,
  WSICon,
  ArrowVectorDown,
  ArrowDirection,
  CameraIcon,
  RemoveIcon,
  GalleryIcon,
  EditPencilIcon,
  AddressBookIcon,
  LocationIcon,
  CollectionsBookmarIcons,
  FinanceChartIcon,
  CollectionIcon,
  MCollectIcon,
  PGRIcon,
  TLIcon,
  BillsIcon,
  ErrorIcon,
  DownloadBtnCommon,
  PrintBtnCommon,
  WhatsappIconGreen,
  HelpLineIcon,
  ServiceCenterIcon,
  TimerIcon,
  RupeeSymbol,
  ValidityTimeIcon,
  AddIcon,
  AddNewIcon,
  ViewReportIcon,
  InboxIcon,
  PrivacyMaskIcon,
  FirenocIcon,
  BirthIcon,
  DeathIcon,
  InfoIcon,
};
