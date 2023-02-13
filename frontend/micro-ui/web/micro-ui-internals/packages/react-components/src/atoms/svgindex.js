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
    fill="#fff"
    width="48px"
    height="48px"
  >
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stopColor="#1266af" stopOpacity={1}></stop>
      <stop offset={`${percentage}%`} stopColor="#1266af" stopOpacity={1}></stop>
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
        stroke="#1266af"
        strokeWidth={1}
      />
    </g>
  </svg>
);

const StarEmpty = ({ className, onClick, styles }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#fff"
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
    <path d="M14 6H10V0H4V6H0L7 13L14 6ZM0 15V17H14V15H0Z" fill="#fff" />
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
      fill="#fff"
    />
  </svg>
);

const DocumentIcon = () => (
  <svg width="100" height="100" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM11 14H4V12H11V14ZM14 10H4V8H14V10ZM14 6H4V4H14V6Z"
      fill="#fff"
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
      fill="#fff"
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
    <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z" fill="#fff" />
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

const PDFSvg = ({className, width = 80, height = 80, style={ background: "#f6f6f6", padding: "8px", boxShadow: "0px 2px 0px #d6d5d3", borderRadius: "2px" }, viewBox="0 0 80 80" }) => (
  <svg {...{className, width , height, style, viewBox }} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M46.6667 6.6665H20C16.3334 6.6665 13.3667 9.6665 13.3667 13.3332L13.3334 66.6665C13.3334 70.3332 16.3 73.3332 19.9667 73.3332H60C63.6667 73.3332 66.6667 70.3332 66.6667 66.6665V26.6665L46.6667 6.6665ZM53.3334 59.9998H26.6667V53.3332H53.3334V59.9998ZM53.3334 46.6665H26.6667V39.9998H53.3334V46.6665ZM43.3334 29.9998V11.6665L61.6667 29.9998H43.3334Z"
      fill="#505A5F"
    />
  </svg>
);

const SearchIconSvg = ({ className, onClick }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" className={className} width="24px" height="24px" onClick={onClick}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const CheckSvg = ({ className, style={} }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" className={className} style={style}>
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
  <svg xmlns="http://www.w3.org/2000/svg" fill={fillcolor?fillcolor:"#1266af"} viewBox="0 0 24 24" style={style?style:{}} className={className}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const FilterSvg = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24" viewBox="0 0 24 24" className={className}>
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
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff" className={className}>
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
    <path d="M13 0L11.59 1.41L16.17 6H0V8H16.17L11.58 12.59L13 14L20 7L13 0Z" fill="#fff" />
  </svg>
);

const ShippingTruck = (style) => (
  <svg style={{ display: "inline-block", fontSize: "16px", ...style }} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
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
      fill="#fff"
    />
  </svg>
);

const PrimaryDownlaodIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff">
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
      fill="#fff"
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
)

const PrintIcon = () => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17 5H3C1.34 5 0 6.34 0 8V14H4V18H16V14H20V8C20 6.34 18.66 5 17 5ZM14 16H6V11H14V16ZM17 9C16.45 9 16 8.55 16 8C16 7.45 16.45 7 17 7C17.55 7 18 7.45 18 8C18 8.55 17.55 9 17 9ZM16 0H4V4H16V0Z"
      fill="#505A5F"
    />
  </svg>
);
function PropertyHouse(style) {
  return (
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
        d="M16.6667 5V7.51667L20 9.73333L22.8833 11.6667H25V13.0833L28.3333 15.3167V18.3333H31.6667V21.6667H28.3333V25H31.6667V28.3333H28.3333V35H38.3333V5H16.6667ZM31.6667 15H28.3333V11.6667H31.6667V15Z"
        fill="white"
      />
    </svg>
  );
}

const InfoBannerIcon = ({fill="#3498DB"}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z"
        fill={fill}
      />
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
    <rect width="48" height="48" rx="6" fill="#fff" />
  </svg>
);

const ComplaintIcon = ({ className }) => (
  <svg width="48" height="48" className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M42.6667 0.666748H5.33335C2.76669 0.666748 0.69002 2.76675 0.69002 5.33342L0.666687 47.3334L10 38.0001H42.6667C45.2334 38.0001 47.3334 35.9001 47.3334 33.3334V5.33342C47.3334 2.76675 45.2334 0.666748 42.6667 0.666748ZM26.3334 21.6667H21.6667V7.66675H26.3334V21.6667ZM26.3334 31.0001H21.6667V26.3334H26.3334V31.0001Z"
      fill="#fff"
    />
  </svg>
);


const DropIcon = ({ className }) => (
  <svg width="28" height="34" viewBox="0 0 28 34" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.4333 10.3332L14 0.916504L4.56663 10.3332C1.96663 12.9332 0.666626 16.3998 0.666626 19.7332C0.666626 23.0665 1.96663 26.5832 4.56663 29.1832C7.16663 31.7832 10.5833 33.0998 14 33.0998C17.4166 33.0998 20.8333 31.7832 23.4333 29.1832C26.0333 26.5832 27.3333 23.0665 27.3333 19.7332C27.3333 16.3998 26.0333 12.9332 23.4333 10.3332ZM3.99996 20.3332C4.01663 16.9998 5.03329 14.8832 6.93329 12.9998L14 5.78317L21.0666 13.0832C22.9666 14.9498 23.9833 16.9998 24 20.3332H3.99996Z"
      fill="#fff"
    />
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
      fill="#fff"
    />
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 4L10 9L2 4V2L10 7L18 2V4Z"
      fill="#fff"
    />
  </svg>
);

const CaseIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M30.3333 6.99967H23.6667V3.66634C23.6667 1.81634 22.1833 0.333008 20.3333 0.333008H13.6667C11.8167 0.333008 10.3333 1.81634 10.3333 3.66634V6.99967H3.66667C1.81667 6.99967 0.350001 8.48301 0.350001 10.333L0.333334 28.6663C0.333334 30.5163 1.81667 31.9997 3.66667 31.9997H30.3333C32.1833 31.9997 33.6667 30.5163 33.6667 28.6663V10.333C33.6667 8.48301 32.1833 6.99967 30.3333 6.99967ZM20.3333 6.99967H13.6667V3.66634H20.3333V6.99967Z"
      fill="white"
    />
  </svg>
);

const PersonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M25.6667 10.3333C28.4334 10.3333 30.65 8.1 30.65 5.33333C30.65 2.56666 28.4334 0.333328 25.6667 0.333328C22.9 0.333328 20.6667 2.56666 20.6667 5.33333C20.6667 8.1 22.9 10.3333 25.6667 10.3333ZM12.3334 10.3333C15.1 10.3333 17.3167 8.1 17.3167 5.33333C17.3167 2.56666 15.1 0.333328 12.3334 0.333328C9.56669 0.333328 7.33335 2.56666 7.33335 5.33333C7.33335 8.1 9.56669 10.3333 12.3334 10.3333ZM12.3334 13.6667C8.45002 13.6667 0.666687 15.6167 0.666687 19.5V23.6667H24V19.5C24 15.6167 16.2167 13.6667 12.3334 13.6667ZM25.6667 13.6667C25.1834 13.6667 24.6334 13.7 24.05 13.75C25.9834 15.15 27.3334 17.0333 27.3334 19.5V23.6667H37.3334V19.5C37.3334 15.6167 29.55 13.6667 25.6667 13.6667Z"
      fill="white"
    />
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
      fill="#fff"
    />
  </svg>
);

const PTIcon = ({ className }) => (
  <svg width="34" height="30" viewBox="0 0 34 30" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.9999 6.66667V0H0.333252V30H33.6666V6.66667H16.9999ZM6.99992 26.6667H3.66659V23.3333H6.99992V26.6667ZM6.99992 20H3.66659V16.6667H6.99992V20ZM6.99992 13.3333H3.66659V10H6.99992V13.3333ZM6.99992 6.66667H3.66659V3.33333H6.99992V6.66667ZM13.6666 26.6667H10.3333V23.3333H13.6666V26.6667ZM13.6666 20H10.3333V16.6667H13.6666V20ZM13.6666 13.3333H10.3333V10H13.6666V13.3333ZM13.6666 6.66667H10.3333V3.33333H13.6666V6.66667ZM30.3333 26.6667H16.9999V23.3333H20.3333V20H16.9999V16.6667H20.3333V13.3333H16.9999V10H30.3333V26.6667ZM26.9999 13.3333H23.6666V16.6667H26.9999V13.3333ZM26.9999 20H23.6666V23.3333H26.9999V20Z"
      fill="#FFF"
    />
  </svg>
);

const OBPSIcon = () => (
  <svg width="34" height="30" viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30.3333 0H3.66659C1.83325 0 0.333252 1.5 0.333252 3.33333V26.6667C0.333252 28.5 1.83325 30 3.66659 30H30.3333C32.1666 30 33.6666 28.5 33.6666 26.6667V3.33333C33.6666 1.5 32.1666 0 30.3333 0ZM13.6666 23.3333H5.33325V20H13.6666V23.3333ZM13.6666 16.6667H5.33325V13.3333H13.6666V16.6667ZM13.6666 10H5.33325V6.66667H13.6666V10ZM21.6999 20L16.9999 15.2667L19.3499 12.9167L21.6999 15.2833L26.9833 10L29.3499 12.3667L21.6999 20Z"
      fill="#fff"
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
      fill={"#1266af"}
      d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
    />
  </svg>
);

const EDCRIcon = ({ className }) => (
  <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 15.3333V5.33333L15 0.333334L10 5.33333V8.66667H0V32H30V15.3333H20ZM6.66667 28.6667H3.33333V25.3333H6.66667V28.6667ZM6.66667 22H3.33333V18.6667H6.66667V22ZM6.66667 15.3333H3.33333V12H6.66667V15.3333ZM16.6667 28.6667H13.3333V25.3333H16.6667V28.6667ZM16.6667 22H13.3333V18.6667H16.6667V22ZM16.6667 15.3333H13.3333V12H16.6667V15.3333ZM16.6667 8.66667H13.3333V5.33333H16.6667V8.66667ZM26.6667 28.6667H23.3333V25.3333H26.6667V28.6667ZM26.6667 22H23.3333V18.6667H26.6667V22Z"
      fill="#fff"
    />
  </svg>
);

const BPAIcon = ({ className }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.3333 29.0333H3.33333V8.66667H15V5.33334H3.33333C1.5 5.33334 0 6.83334 0 8.66667V28.6667C0 30.5 1.5 32 3.33333 32H23.3333C25.1667 32 26.6667 30.5 26.6667 28.6667V17H23.3333V29.0333Z"
      
    />
    <path
      d="M26.6667 0.333336H23.3333V5.33334H18.3333C18.35 5.35 18.3333 8.66667 18.3333 8.66667H23.3333V13.65C23.35 13.6667 26.6667 13.65 26.6667 13.65V8.66667H31.6667V5.33334H26.6667V0.333336Z"
      
    />
    <path d="M20 12H6.66666V15.3333H20V12Z"  />
    <path d="M6.66666 17V20.3333H20V17H15H6.66666Z"  />
    <path d="M20 22H6.66666V25.3333H20V22Z"  />
  </svg>
);

const BPAHomeIcon = ({ className }) => (
  <svg width="34" height="30" viewBox="0 0 34 30" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      fill="#fff"
    />
  </svg>
);
const EventCalendar = () => {
  return (
    <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.6667 15.0002H12V21.6668H18.6667V15.0002ZM17.3333 0.333496V3.00016H6.66667V0.333496H4V3.00016H2.66667C1.18667 3.00016 0.0133333 4.20016 0.0133333 5.66683L0 24.3335C0 25.8002 1.18667 27.0002 2.66667 27.0002H21.3333C22.8 27.0002 24 25.8002 24 24.3335V5.66683C24 4.20016 22.8 3.00016 21.3333 3.00016H20V0.333496H17.3333ZM21.3333 24.3335H2.66667V9.66683H21.3333V24.3335Z"
        fill="#fff"
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

const TickMark = ({fillColor="white"}) => (
  <svg style={{ display: "inline-block", margin: "auto" }} width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.75012 8.1275L1.62262 5L0.557617 6.0575L4.75012 10.25L13.7501 1.25L12.6926 0.192505L4.75012 8.1275Z" fill={fillColor} />
  </svg>
);

const EditIcon = ({ style }) => (
  <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.126 5.125L11.063 3.188L14.81 6.935L12.873 8.873L9.126 5.125ZM17.71 2.63L15.37 0.289999C15.1826 0.103748 14.9292 -0.000793457 14.665 -0.000793457C14.4008 -0.000793457 14.1474 0.103748 13.96 0.289999L12.13 2.12L15.88 5.87L17.71 4C17.8844 3.81454 17.9815 3.56956 17.9815 3.315C17.9815 3.06044 17.8844 2.81546 17.71 2.63ZM5.63 8.63L0 14.25V18H3.75L9.38 12.38L12.873 8.873L9.126 5.125L5.63 8.63Z"
      fill="#fff"
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

const WSICon = ({ className }) => <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M23.4332 10.3337L13.9998 0.916992L4.5665 10.3337C1.9665 12.9337 0.666504 16.4003 0.666504 19.7337C0.666504 23.067 1.9665 26.5837 4.5665 29.1837C7.1665 31.7837 10.5832 33.1003 13.9998 33.1003C17.4165 33.1003 20.8332 31.7837 23.4332 29.1837C26.0332 26.5837 27.3332 23.067 27.3332 19.7337C27.3332 16.4003 26.0332 12.9337 23.4332 10.3337ZM3.99984 20.3337C4.0165 17.0003 5.03317 14.8837 6.93317 13.0003L13.9998 5.78366L21.0665 13.0837C22.9665 14.9503 23.9832 17.0003 23.9998 20.3337H3.99984Z" fill="#fff" />
</svg>

const CameraIcon = () => <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.0002 5L11.9502 8.33333H6.66683C4.8335 8.33333 3.3335 9.83333 3.3335 11.6667V31.6667C3.3335 33.5 4.8335 35 6.66683 35H33.3335C35.1668 35 36.6668 33.5 36.6668 31.6667V11.6667C36.6668 9.83333 35.1668 8.33333 33.3335 8.33333H28.0502L25.0002 5H15.0002ZM20.0002 30C15.4002 30 11.6668 26.2667 11.6668 21.6667C11.6668 17.0667 15.4002 13.3333 20.0002 13.3333C24.6002 13.3333 28.3335 17.0667 28.3335 21.6667C28.3335 26.2667 24.6002 30 20.0002 30Z" fill="#fff"/>
<path d="M20.0002 28.3333L22.0835 23.75L26.6668 21.6667L22.0835 19.5833L20.0002 15L17.9168 19.5833L13.3335 21.6667L17.9168 23.75L20.0002 28.3333Z" fill="#fff"/>
</svg>

const RemoveIcon = () => <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.00016 26.6667C2.00016 28.5 3.50016 30 5.3335 30H18.6668C20.5002 30 22.0002 28.5 22.0002 26.6667V6.66667H2.00016V26.6667ZM23.6668 1.66667H17.8335L16.1668 0H7.8335L6.16683 1.66667H0.333496V5H23.6668V1.66667Z" fill="#fff"/>
</svg>

const GalleryIcon = () => <svg width="40" height="34" viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.33333 7.00016H0V15.3335H0.0166667L0 30.3335C0 32.1668 1.5 33.6668 3.33333 33.6668H33.3333V30.3335H3.33333V7.00016ZM36.6667 3.66683H23.3333L20 0.333496H10C8.16667 0.333496 6.68333 1.8335 6.68333 3.66683L6.66667 23.6668C6.66667 25.5002 8.16667 27.0002 10 27.0002H36.6667C38.5 27.0002 40 25.5002 40 23.6668V7.00016C40 5.16683 38.5 3.66683 36.6667 3.66683ZM11.6667 22.0002L19.1667 12.0002L25 19.5168L29.1667 14.5002L35 22.0002H11.6667Z" fill="#fff"/>
</svg>

const EditPencilIcon = ({ className ,width=18, height=18}) => <svg className={className} width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path  d="M9.126 5.12482L11.063 3.18782L14.81 6.93482L12.873 8.87282L9.126 5.12482ZM17.71 2.62982L15.37 0.289816C15.1826 0.103565 14.9292 -0.000976562 14.665 -0.000976562C14.4008 -0.000976563 14.1474 0.103565 13.96 0.289816L12.13 2.11982L15.88 5.86982L17.71 3.99982C17.8844 3.81436 17.9815 3.56938 17.9815 3.31482C17.9815 3.06025 17.8844 2.81528 17.71 2.62982ZM5.63 8.62982L0 14.2498V17.9998H3.75L9.38 12.3798L12.873 8.87282L9.126 5.12482L5.63 8.62982Z" fill="#505A5F"/>
</svg>

const ErrorIcon = ({ className }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="white" />
  </svg>
);

const BPAIco = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="28" className={className}>
    <defs>
      <clipPath id="afe21c4cf7">
      <path d="M 19.710938 39 L 354.960938 39 L 354.960938 334 L 19.710938 334 Z M 19.710938 39 " clip-rule="nonzero"/>
      </clipPath>
    </defs>
    <g clip-path="url(#afe21c4cf7)">
      <path d="M 193.242188 243.3125 L 193.242188 261.164062 L 208.347656 266.71875 L 208.347656 248.863281 Z M 193.242188 208.46875 L 193.242188 226.320312 L 208.347656 231.871094 L 208.347656 214.019531 Z M 268.695312 187.734375 L 235.507812 209.351562 L 235.507812 298.589844 C 246.789062 299.863281 257.871094 301.582031 268.695312 303.746094 Z M 193.242188 173.648438 L 193.242188 191.472656 L 208.347656 197.03125 L 208.347656 179.199219 Z M 99.03125 168.640625 L 65.824219 190.257812 L 65.824219 314.007812 C 76.441406 310.59375 87.550781 307.640625 99.03125 305.171875 Z M 223.300781 149.871094 L 223.300781 167.699219 L 238.410156 173.253906 L 238.410156 155.425781 Z M 193.242188 138.804688 L 193.242188 156.65625 L 208.347656 162.214844 L 208.347656 144.359375 Z M 223.300781 115.023438 L 223.300781 132.882812 L 238.410156 138.410156 L 238.410156 120.585938 Z M 193.242188 103.96875 L 193.242188 121.816406 L 208.347656 127.367188 L 208.347656 109.515625 Z M 223.300781 80.1875 L 223.300781 98.039062 L 238.410156 103.589844 L 238.410156 85.738281 Z M 193.242188 69.121094 L 193.242188 86.976562 L 208.347656 92.527344 L 208.347656 74.675781 Z M 173.1875 52.023438 L 139.980469 73.640625 L 139.980469 298.472656 C 150.929688 297.304688 162.019531 296.53125 173.1875 296.207031 Z M 180.132812 39.148438 L 251.292969 65.304688 L 251.292969 175.589844 L 218.335938 197.070312 L 218.335938 297.085938 C 221.71875 297.285156 225.128906 297.546875 228.515625 297.839844 L 228.515625 205.554688 L 275.664062 174.859375 L 315.820312 201.023438 L 315.820312 316.28125 C 329.914062 321.175781 343.023438 326.835938 354.890625 333.207031 L 19.777344 333.207031 C 31.652344 326.882812 44.761719 321.242188 58.832031 316.394531 L 58.832031 186.476562 L 105.984375 155.773438 L 133.007812 173.359375 L 133.007812 69.871094 Z M 180.132812 39.148438 " fill-opacity="1" fill-rule="evenodd"/>
      </g>
  </svg>
);

const LicencingIcon = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="28" className={className}>
  <defs>
    <clipPath id="ef91b9e837">
      <path d="M 18.550781 38 L 356.800781 38 L 356.800781 291 L 18.550781 291 Z M 18.550781 38 " clip-rule="nonzero"/>
    </clipPath>
  </defs>
  <g clip-path="url(#ef91b9e837)">
    <path d="M 21.027344 220.464844 L 95.917969 220.464844 C 96.84375 220.464844 97.773438 219.539062 97.773438 218.613281 C 97.773438 217.996094 97.464844 217.6875 97.15625 217.375 L 60.019531 169.191406 L 59.710938 168.882812 C 59.398438 168.574219 58.78125 168.265625 58.472656 168.265625 C 58.160156 168.265625 57.542969 168.574219 57.234375 168.882812 L 56.925781 169.191406 L 56.613281 169.5 L 20.097656 217.066406 L 19.476562 217.6875 C 19.167969 217.996094 19.167969 218.304688 19.167969 218.613281 C 19.167969 219.539062 20.097656 220.464844 21.027344 220.464844 Z M 95.609375 227.261719 L 20.40625 227.261719 C 19.476562 227.261719 18.550781 228.1875 18.550781 229.113281 L 18.550781 287.800781 C 18.550781 288.726562 19.476562 289.652344 20.40625 289.652344 L 44.546875 289.652344 L 44.546875 252.898438 C 44.546875 251.972656 45.472656 251.042969 46.402344 251.042969 L 68.683594 251.042969 C 69.613281 251.042969 70.539062 251.972656 70.539062 252.898438 L 70.539062 289.652344 L 95.296875 289.652344 C 96.226562 289.652344 97.15625 288.726562 97.15625 287.800781 L 97.15625 229.113281 C 97.464844 228.1875 96.84375 227.261719 95.609375 227.261719 Z M 354.941406 211.816406 L 280.671875 211.816406 C 279.742188 211.816406 278.8125 212.742188 278.8125 213.671875 L 278.8125 288.417969 C 278.8125 289.34375 279.742188 290.273438 280.671875 290.273438 L 354.941406 290.273438 C 355.871094 290.273438 356.800781 289.34375 356.800781 288.417969 L 356.800781 213.671875 C 356.800781 212.742188 356.179688 211.816406 354.941406 211.816406 M 314.402344 260.929688 C 314.402344 261.855469 313.472656 262.78125 312.546875 262.78125 L 290.265625 262.78125 C 289.335938 262.78125 288.40625 261.855469 288.40625 260.929688 L 288.40625 247.335938 C 288.40625 246.410156 289.335938 245.484375 290.265625 245.484375 L 312.546875 245.484375 C 313.472656 245.484375 314.402344 246.410156 314.402344 247.335938 Z M 314.402344 235.910156 C 314.402344 236.835938 313.472656 237.761719 312.546875 237.761719 L 290.265625 237.761719 C 289.335938 237.761719 288.40625 236.835938 288.40625 235.910156 L 288.40625 222.320312 C 288.40625 221.390625 289.335938 220.464844 290.265625 220.464844 L 312.546875 220.464844 C 313.472656 220.464844 314.402344 221.390625 314.402344 222.320312 Z M 348.445312 260.929688 C 348.445312 261.855469 347.515625 262.78125 346.585938 262.78125 L 324.304688 262.78125 C 323.378906 262.78125 322.449219 261.855469 322.449219 260.929688 L 322.449219 247.335938 C 322.449219 246.410156 323.378906 245.484375 324.304688 245.484375 L 346.585938 245.484375 C 347.515625 245.484375 348.445312 246.410156 348.445312 247.335938 Z M 348.445312 235.910156 C 348.445312 236.835938 347.515625 237.761719 346.585938 237.761719 L 324.304688 237.761719 C 323.378906 237.761719 322.449219 236.835938 322.449219 235.910156 L 322.449219 222.320312 C 322.449219 221.390625 323.378906 220.464844 324.304688 220.464844 L 346.585938 220.464844 C 347.515625 220.464844 348.445312 221.390625 348.445312 222.320312 Z M 182.257812 38.226562 L 109.84375 38.226562 C 108.914062 38.226562 107.988281 39.15625 107.988281 40.082031 L 107.988281 288.109375 C 107.988281 289.035156 108.914062 289.960938 109.84375 289.960938 L 182.570312 289.960938 C 183.496094 289.960938 184.425781 289.035156 184.425781 288.109375 L 184.425781 40.082031 C 184.117188 38.847656 183.496094 38.226562 182.257812 38.226562 M 139.242188 261.546875 C 139.242188 262.164062 138.933594 262.472656 138.3125 262.472656 L 121.601562 262.472656 C 120.984375 262.472656 120.675781 262.164062 120.675781 261.546875 L 120.675781 243.011719 C 120.675781 242.394531 120.984375 242.085938 121.601562 242.085938 L 138.3125 242.085938 C 138.933594 242.085938 139.242188 242.394531 139.242188 243.011719 Z M 139.242188 218.921875 C 139.242188 219.539062 138.933594 219.847656 138.3125 219.847656 L 121.601562 219.847656 C 120.984375 219.847656 120.675781 219.539062 120.675781 218.921875 L 120.675781 200.386719 C 120.675781 199.769531 120.984375 199.460938 121.601562 199.460938 L 138.3125 199.460938 C 138.933594 199.460938 139.242188 199.769531 139.242188 200.386719 Z M 139.242188 176.296875 C 139.242188 176.914062 138.933594 177.222656 138.3125 177.222656 L 121.601562 177.222656 C 120.984375 177.222656 120.675781 176.914062 120.675781 176.296875 L 120.675781 157.761719 C 120.675781 157.144531 120.984375 156.835938 121.601562 156.835938 L 138.3125 156.835938 C 138.933594 156.835938 139.242188 157.144531 139.242188 157.761719 Z M 139.242188 133.980469 C 139.242188 134.597656 138.933594 134.90625 138.3125 134.90625 L 121.601562 134.90625 C 120.984375 134.90625 120.675781 134.597656 120.675781 133.980469 L 120.675781 115.449219 C 120.675781 114.828125 120.984375 114.519531 121.601562 114.519531 L 138.3125 114.519531 C 138.933594 114.519531 139.242188 114.828125 139.242188 115.449219 Z M 139.242188 91.355469 C 139.242188 91.972656 138.933594 92.28125 138.3125 92.28125 L 121.601562 92.28125 C 120.984375 92.28125 120.675781 91.972656 120.675781 91.355469 L 120.675781 72.824219 C 120.675781 72.203125 120.984375 71.894531 121.601562 71.894531 L 138.3125 71.894531 C 138.933594 71.894531 139.242188 72.203125 139.242188 72.824219 Z M 171.738281 261.546875 C 171.738281 262.164062 171.425781 262.472656 170.808594 262.472656 L 154.097656 262.472656 C 153.476562 262.472656 153.167969 262.164062 153.167969 261.546875 L 153.167969 243.011719 C 153.167969 242.394531 153.476562 242.085938 154.097656 242.085938 L 170.808594 242.085938 C 171.425781 242.085938 171.738281 242.394531 171.738281 243.011719 Z M 171.738281 218.921875 C 171.738281 219.539062 171.425781 219.847656 170.808594 219.847656 L 154.097656 219.847656 C 153.476562 219.847656 153.167969 219.539062 153.167969 218.921875 L 153.167969 200.386719 C 153.167969 199.769531 153.476562 199.460938 154.097656 199.460938 L 170.808594 199.460938 C 171.425781 199.460938 171.738281 199.769531 171.738281 200.386719 Z M 171.738281 176.296875 C 171.738281 176.914062 171.425781 177.222656 170.808594 177.222656 L 154.097656 177.222656 C 153.476562 177.222656 153.167969 176.914062 153.167969 176.296875 L 153.167969 157.761719 C 153.167969 157.144531 153.476562 156.835938 154.097656 156.835938 L 170.808594 156.835938 C 171.425781 156.835938 171.738281 157.144531 171.738281 157.761719 Z M 171.738281 133.980469 C 171.738281 134.597656 171.425781 134.90625 170.808594 134.90625 L 154.097656 134.90625 C 153.476562 134.90625 153.167969 134.597656 153.167969 133.980469 L 153.167969 115.449219 C 153.167969 114.828125 153.476562 114.519531 154.097656 114.519531 L 170.808594 114.519531 C 171.425781 114.519531 171.738281 114.828125 171.738281 115.449219 Z M 171.738281 91.355469 C 171.738281 91.972656 171.425781 92.28125 170.808594 92.28125 L 154.097656 92.28125 C 153.476562 92.28125 153.167969 91.972656 153.167969 91.355469 L 153.167969 72.824219 C 153.167969 72.203125 153.476562 71.894531 154.097656 71.894531 L 170.808594 71.894531 C 171.425781 71.894531 171.738281 72.203125 171.738281 72.824219 Z M 356.800781 204.402344 C 356.800781 205.332031 356.179688 205.949219 355.253906 205.949219 L 280.359375 205.949219 C 279.433594 205.949219 278.8125 205.332031 278.8125 204.402344 L 278.8125 189.578125 C 278.8125 188.652344 279.433594 188.035156 280.359375 188.035156 L 355.253906 188.035156 C 356.179688 188.035156 356.800781 188.652344 356.800781 189.578125 Z M 270.148438 84.867188 C 269.839844 83.941406 269.21875 83.632812 268.292969 83.632812 C 267.980469 83.632812 267.671875 83.632812 267.363281 83.941406 L 266.746094 84.558594 L 195.257812 175.0625 L 194.949219 175.371094 C 194.636719 175.679688 194.328125 176.296875 194.328125 176.914062 L 194.328125 288.109375 C 194.328125 289.035156 195.257812 289.960938 196.183594 289.960938 L 268.910156 289.960938 C 269.839844 289.960938 270.765625 289.035156 270.765625 288.109375 L 270.765625 85.488281 C 270.457031 85.488281 270.457031 85.175781 270.148438 84.867188 Z M 240.128906 133.980469 L 240.75 133.363281 C 245.699219 127.183594 253.746094 116.992188 257.769531 112.050781 L 258.386719 111.433594 C 258.699219 111.125 259.316406 110.8125 259.9375 110.8125 C 260.863281 110.8125 261.792969 111.433594 261.792969 112.359375 L 261.792969 135.214844 C 261.792969 136.449219 260.863281 137.070312 259.9375 137.378906 L 241.988281 137.378906 C 240.75 137.378906 240.128906 136.449219 240.128906 135.214844 C 239.820312 134.90625 239.820312 134.289062 240.128906 133.980469 Z M 228.679688 260.621094 C 228.679688 261.546875 227.75 262.472656 226.824219 262.472656 L 205.160156 262.472656 C 204.230469 262.472656 203.304688 261.546875 203.304688 260.621094 L 203.304688 247.027344 C 203.304688 246.101562 204.230469 245.175781 205.160156 245.175781 L 226.824219 245.175781 C 227.75 245.175781 228.679688 246.101562 228.679688 247.027344 Z M 228.679688 235.910156 C 228.679688 236.835938 227.75 237.761719 226.824219 237.761719 L 205.160156 237.761719 C 204.230469 237.761719 203.304688 236.835938 203.304688 235.910156 L 203.304688 222.320312 C 203.304688 221.390625 204.230469 220.464844 205.160156 220.464844 L 226.824219 220.464844 C 227.75 220.464844 228.679688 221.390625 228.679688 222.320312 Z M 228.679688 210.890625 C 228.679688 211.816406 227.75 212.742188 226.824219 212.742188 L 205.160156 212.742188 C 204.230469 212.742188 203.304688 211.816406 203.304688 210.890625 L 203.304688 197.300781 C 203.304688 196.375 204.230469 195.445312 205.160156 195.445312 L 226.824219 195.445312 C 227.75 195.445312 228.679688 196.375 228.679688 197.300781 Z M 228.988281 155.910156 L 228.988281 185.5625 C 228.988281 186.488281 228.058594 187.414062 227.132812 187.414062 L 205.46875 187.414062 C 204.539062 187.414062 203.613281 186.488281 203.613281 185.5625 L 203.613281 180.929688 C 203.613281 180.929688 203.613281 180.621094 203.921875 180.621094 C 203.921875 180.621094 203.921875 180.3125 204.230469 180.3125 C 207.015625 176.296875 219.394531 160.851562 224.65625 154.675781 L 225.273438 154.058594 C 225.585938 153.75 226.203125 153.4375 226.824219 153.4375 C 227.75 153.4375 228.679688 154.058594 228.679688 154.984375 L 228.679688 155.910156 Z M 262.101562 260.621094 C 262.101562 261.546875 261.171875 262.472656 260.246094 262.472656 L 238.582031 262.472656 C 237.652344 262.472656 236.726562 261.546875 236.726562 260.621094 L 236.726562 247.027344 C 236.726562 246.101562 237.652344 245.175781 238.582031 245.175781 L 260.246094 245.175781 C 261.171875 245.175781 262.101562 246.101562 262.101562 247.027344 Z M 262.101562 235.910156 C 262.101562 236.835938 261.171875 237.761719 260.246094 237.761719 L 238.582031 237.761719 C 237.652344 237.761719 236.726562 236.835938 236.726562 235.910156 L 236.726562 222.320312 C 236.726562 221.390625 237.652344 220.464844 238.582031 220.464844 L 260.246094 220.464844 C 261.171875 220.464844 262.101562 221.390625 262.101562 222.320312 Z M 262.101562 210.890625 C 262.101562 211.816406 261.171875 212.742188 260.246094 212.742188 L 238.582031 212.742188 C 237.652344 212.742188 236.726562 211.816406 236.726562 210.890625 L 236.726562 197.300781 C 236.726562 196.375 237.652344 195.445312 238.582031 195.445312 L 260.246094 195.445312 C 261.171875 195.445312 262.101562 196.375 262.101562 197.300781 Z M 262.101562 185.871094 C 262.101562 186.796875 261.171875 187.722656 260.246094 187.722656 L 238.582031 187.722656 C 237.652344 187.722656 236.726562 186.796875 236.726562 185.871094 L 236.726562 172.28125 C 236.726562 171.355469 237.652344 170.425781 238.582031 170.425781 L 260.246094 170.425781 C 261.171875 170.425781 262.101562 171.355469 262.101562 172.28125 Z M 262.101562 160.851562 C 262.101562 161.777344 261.171875 162.707031 260.246094 162.707031 L 238.582031 162.707031 C 237.652344 162.707031 236.726562 161.777344 236.726562 160.851562 L 236.726562 147.261719 C 236.726562 146.335938 237.652344 145.410156 238.582031 145.410156 L 260.246094 145.410156 C 261.171875 145.410156 262.101562 146.335938 262.101562 147.261719 Z M 262.101562 160.851562 " fill-opacity="1" fill-rule="nonzero"/>
  </g>
  </svg>
);

const ServicePlanIcon = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="28" className={className}>
  <defs>
    <clipPath id="7015cb6990">
      <path d="M 261 72 L 374.914062 72 L 374.914062 136 L 261 136 Z M 261 72 " clip-rule="nonzero"/>
    </clipPath>
  </defs>
  <path fill="#fff" d="M 329.335938 196.378906 L 319.117188 208.972656 L 302.285156 229.707031 L 301.597656 230.546875 L 287.945312 247.363281 L 264.480469 276.265625 C 262.84375 278.289062 260.367188 279.460938 257.765625 279.460938 L 162.144531 279.460938 C 150.566406 279.460938 139.484375 284.066406 131.296875 292.246094 L 130.382812 293.152344 L 129.71875 293.800781 L 76.867188 240.980469 C 76.875 240.964844 76.882812 240.949219 76.890625 240.9375 C 77.273438 240.195312 77.671875 239.453125 78.085938 238.726562 C 78.222656 238.496094 78.355469 238.265625 78.492188 238.035156 C 78.796875 237.507812 79.117188 236.980469 79.449219 236.460938 C 79.589844 236.230469 79.738281 236 79.878906 235.769531 C 80.292969 235.125 80.722656 234.492188 81.164062 233.867188 C 81.1875 233.835938 81.207031 233.800781 81.234375 233.769531 C 81.261719 233.726562 81.289062 233.683594 81.316406 233.640625 C 81.808594 232.945312 82.324219 232.265625 82.84375 231.59375 C 83 231.390625 83.164062 231.1875 83.320312 230.988281 C 83.707031 230.5 84.105469 230.019531 84.503906 229.542969 C 84.679688 229.335938 84.855469 229.125 85.035156 228.921875 C 85.511719 228.371094 86 227.828125 86.492188 227.292969 C 86.582031 227.199219 86.675781 227.097656 86.765625 227 C 87.351562 226.378906 87.953125 225.769531 88.566406 225.167969 C 88.738281 225.003906 88.910156 224.839844 89.085938 224.671875 C 89.550781 224.226562 90.019531 223.792969 90.492188 223.367188 C 90.691406 223.179688 90.894531 223 91.09375 222.824219 C 91.632812 222.351562 92.179688 221.890625 92.726562 221.4375 C 92.84375 221.335938 92.964844 221.234375 93.078125 221.140625 C 93.75 220.59375 94.4375 220.0625 95.132812 219.542969 C 95.300781 219.417969 95.476562 219.292969 95.644531 219.171875 C 96.1875 218.773438 96.734375 218.378906 97.292969 218 C 97.5 217.851562 97.714844 217.710938 97.925781 217.566406 C 98.519531 217.167969 99.125 216.777344 99.734375 216.398438 C 99.867188 216.3125 100.003906 216.226562 100.132812 216.140625 C 100.890625 215.679688 101.648438 215.234375 102.417969 214.800781 C 102.5625 214.71875 102.71875 214.640625 102.863281 214.5625 C 103.492188 214.214844 104.128906 213.878906 104.769531 213.546875 C 104.980469 213.441406 105.195312 213.335938 105.40625 213.226562 C 106.058594 212.902344 106.71875 212.589844 107.390625 212.285156 C 107.53125 212.222656 107.667969 212.15625 107.808594 212.09375 C 108.628906 211.726562 109.460938 211.371094 110.300781 211.039062 C 110.320312 211.03125 110.347656 211.019531 110.367188 211.007812 C 110.664062 210.890625 110.960938 210.785156 111.261719 210.671875 C 111.65625 210.519531 112.046875 210.371094 112.445312 210.226562 C 113 210.027344 113.554688 209.835938 114.109375 209.652344 C 114.375 209.566406 114.636719 209.488281 114.898438 209.402344 C 115.304688 209.273438 115.707031 209.152344 116.117188 209.03125 L 116.960938 208.792969 C 117.355469 208.679688 117.746094 208.574219 118.148438 208.472656 C 118.433594 208.394531 118.71875 208.328125 119.011719 208.253906 C 119.402344 208.160156 119.800781 208.0625 120.203125 207.980469 C 120.488281 207.914062 120.777344 207.847656 121.070312 207.792969 C 121.472656 207.707031 121.878906 207.628906 122.28125 207.550781 C 122.566406 207.5 122.855469 207.441406 123.140625 207.394531 C 123.554688 207.320312 123.972656 207.25 124.398438 207.191406 C 124.671875 207.144531 124.945312 207.109375 125.226562 207.066406 C 125.34375 207.050781 125.457031 207.027344 125.574219 207.007812 C 125.875 206.972656 126.171875 206.941406 126.476562 206.902344 C 126.773438 206.867188 127.070312 206.832031 127.371094 206.804688 C 127.789062 206.757812 128.210938 206.71875 128.628906 206.683594 C 128.929688 206.664062 129.21875 206.636719 129.511719 206.613281 C 129.972656 206.582031 130.429688 206.554688 130.890625 206.535156 C 131.148438 206.523438 131.402344 206.507812 131.660156 206.496094 C 132.328125 206.472656 132.996094 206.460938 133.664062 206.460938 C 133.714844 206.460938 133.761719 206.453125 133.8125 206.453125 C 143.109375 206.453125 152.578125 208.570312 161.613281 213.257812 C 162.316406 213.621094 163.027344 213.957031 163.746094 214.273438 C 163.78125 214.289062 163.808594 214.300781 163.839844 214.316406 C 163.851562 214.320312 163.863281 214.328125 163.875 214.332031 C 165.378906 214.984375 166.914062 215.53125 168.480469 215.984375 C 172.398438 217.128906 176.5 217.667969 180.613281 217.667969 L 241.964844 217.667969 C 242.285156 217.667969 242.609375 217.683594 242.929688 217.710938 C 243.019531 217.71875 243.117188 217.730469 243.207031 217.738281 C 243.53125 217.769531 243.851562 217.808594 244.167969 217.871094 C 244.195312 217.871094 244.214844 217.875 244.238281 217.878906 C 244.546875 217.9375 244.851562 218.007812 245.144531 218.089844 C 245.230469 218.109375 245.320312 218.136719 245.40625 218.164062 C 245.71875 218.25 246.027344 218.347656 246.324219 218.460938 C 246.347656 218.464844 246.367188 218.476562 246.390625 218.480469 C 246.679688 218.59375 246.949219 218.710938 247.234375 218.839844 C 247.308594 218.875 247.382812 218.914062 247.464844 218.949219 C 247.753906 219.085938 248.035156 219.238281 248.308594 219.394531 C 248.332031 219.410156 248.351562 219.421875 248.371094 219.433594 C 248.636719 219.589844 248.878906 219.753906 249.128906 219.929688 C 249.195312 219.972656 249.269531 220.023438 249.335938 220.066406 C 249.59375 220.261719 249.847656 220.449219 250.085938 220.65625 C 250.109375 220.671875 250.125 220.695312 250.148438 220.714844 C 250.375 220.902344 250.585938 221.105469 250.789062 221.3125 C 250.851562 221.371094 250.910156 221.4375 250.972656 221.5 C 251.1875 221.722656 251.398438 221.953125 251.59375 222.191406 C 251.625 222.226562 251.648438 222.257812 251.675781 222.292969 C 251.792969 222.445312 251.910156 222.597656 252.019531 222.753906 C 252.074219 222.820312 252.117188 222.894531 252.167969 222.96875 C 252.21875 223.039062 252.269531 223.109375 252.320312 223.191406 C 252.492188 223.453125 252.65625 223.722656 252.808594 223.996094 C 252.820312 224.023438 252.832031 224.050781 252.839844 224.070312 C 252.988281 224.335938 253.117188 224.609375 253.234375 224.882812 C 253.265625 224.957031 253.292969 225.03125 253.324219 225.101562 C 253.449219 225.402344 253.566406 225.714844 253.660156 226.03125 C 253.765625 226.34375 253.839844 226.671875 253.90625 227 C 253.921875 227.074219 253.933594 227.148438 253.949219 227.222656 C 254.015625 227.554688 254.0625 227.894531 254.097656 228.238281 C 254.179688 229.023438 254.171875 229.792969 254.097656 230.546875 C 253.828125 233.34375 252.578125 235.847656 250.6875 237.722656 C 248.566406 239.8125 245.65625 241.105469 242.4375 241.105469 L 182.746094 241.105469 C 180.945312 241.105469 179.289062 241.75 177.996094 242.8125 C 176.632812 243.941406 175.679688 245.542969 175.382812 247.363281 C 175.320312 247.757812 175.277344 248.15625 175.277344 248.5625 C 175.277344 248.84375 175.300781 249.117188 175.328125 249.386719 C 175.339844 249.472656 175.355469 249.550781 175.367188 249.636719 C 175.394531 249.820312 175.421875 250.003906 175.464844 250.183594 C 175.484375 250.28125 175.511719 250.375 175.535156 250.46875 C 175.578125 250.632812 175.625 250.796875 175.679688 250.957031 C 175.714844 251.054688 175.75 251.148438 175.78125 251.238281 C 175.84375 251.394531 175.910156 251.546875 175.976562 251.699219 C 176.023438 251.789062 176.0625 251.878906 176.105469 251.964844 C 176.1875 252.121094 176.277344 252.265625 176.363281 252.417969 C 176.410156 252.488281 176.449219 252.566406 176.5 252.632812 C 176.613281 252.808594 176.730469 252.972656 176.851562 253.128906 C 176.886719 253.175781 176.921875 253.222656 176.953125 253.261719 C 177.121094 253.46875 177.296875 253.664062 177.488281 253.851562 C 177.492188 253.859375 177.507812 253.871094 177.507812 253.875 C 177.683594 254.046875 177.875 254.210938 178.0625 254.367188 C 178.183594 254.460938 178.304688 254.554688 178.429688 254.644531 C 178.488281 254.679688 178.535156 254.722656 178.589844 254.757812 C 178.773438 254.875 178.964844 254.996094 179.152344 255.101562 C 179.214844 255.136719 179.28125 255.164062 179.347656 255.199219 C 179.484375 255.269531 179.621094 255.339844 179.761719 255.398438 C 179.84375 255.433594 179.921875 255.460938 180.003906 255.496094 C 180.132812 255.542969 180.261719 255.597656 180.398438 255.640625 C 180.488281 255.667969 180.574219 255.695312 180.664062 255.726562 C 180.796875 255.765625 180.9375 255.796875 181.078125 255.832031 C 181.164062 255.847656 181.25 255.871094 181.339844 255.886719 C 181.488281 255.914062 181.644531 255.9375 181.792969 255.953125 C 181.875 255.964844 181.953125 255.976562 182.03125 255.988281 C 182.253906 256.011719 182.484375 256.023438 182.714844 256.023438 L 241.96875 256.023438 C 242.847656 256.023438 243.734375 255.988281 244.609375 255.914062 C 246.480469 255.765625 248.335938 255.441406 250.132812 254.894531 C 250.929688 254.648438 251.707031 254.367188 252.460938 254.058594 C 252.539062 254.03125 252.605469 254 252.683594 253.964844 C 252.980469 253.839844 253.277344 253.710938 253.570312 253.574219 C 253.679688 253.53125 253.777344 253.476562 253.886719 253.425781 C 254.144531 253.304688 254.394531 253.183594 254.648438 253.054688 C 254.765625 252.992188 254.882812 252.925781 255 252.859375 C 255.230469 252.742188 255.460938 252.621094 255.6875 252.488281 C 255.816406 252.417969 255.9375 252.335938 256.066406 252.265625 C 256.277344 252.136719 256.488281 252.019531 256.691406 251.882812 C 256.824219 251.800781 256.953125 251.714844 257.082031 251.625 C 257.277344 251.503906 257.476562 251.375 257.660156 251.246094 C 257.792969 251.148438 257.921875 251.054688 258.058594 250.957031 C 258.238281 250.828125 258.417969 250.699219 258.597656 250.566406 C 258.730469 250.46875 258.855469 250.359375 258.992188 250.257812 C 259.15625 250.125 259.328125 249.988281 259.492188 249.855469 C 259.621094 249.742188 259.753906 249.628906 259.882812 249.519531 C 260.039062 249.382812 260.203125 249.246094 260.351562 249.109375 C 260.480469 248.988281 260.609375 248.867188 260.734375 248.746094 C 260.886719 248.609375 261.03125 248.472656 261.175781 248.332031 C 261.300781 248.203125 261.421875 248.078125 261.546875 247.945312 C 261.6875 247.804688 261.828125 247.660156 261.960938 247.515625 C 262.007812 247.464844 262.050781 247.417969 262.097656 247.363281 C 262.175781 247.28125 262.25 247.195312 262.320312 247.121094 C 262.449219 246.972656 262.578125 246.824219 262.707031 246.679688 C 262.828125 246.539062 262.9375 246.402344 263.058594 246.253906 C 263.175781 246.109375 263.296875 245.964844 263.417969 245.8125 C 263.527344 245.667969 263.640625 245.519531 263.746094 245.375 C 263.859375 245.222656 263.976562 245.070312 264.082031 244.921875 C 264.191406 244.769531 264.296875 244.613281 264.40625 244.460938 C 264.503906 244.308594 264.609375 244.15625 264.710938 244 C 264.820312 243.84375 264.914062 243.6875 265.015625 243.523438 C 265.109375 243.371094 265.203125 243.214844 265.300781 243.058594 C 265.394531 242.898438 265.492188 242.734375 265.585938 242.566406 C 265.671875 242.414062 265.761719 242.257812 265.847656 242.101562 C 265.941406 241.933594 266.023438 241.757812 266.113281 241.589844 C 266.191406 241.433594 266.277344 241.277344 266.355469 241.113281 C 266.4375 240.9375 266.519531 240.765625 266.601562 240.59375 C 266.675781 240.429688 266.746094 240.273438 266.820312 240.109375 C 266.898438 239.9375 266.972656 239.757812 267.046875 239.578125 C 267.113281 239.414062 267.179688 239.253906 267.242188 239.089844 C 267.316406 238.910156 267.382812 238.726562 267.445312 238.546875 C 267.503906 238.386719 267.566406 238.21875 267.621094 238.054688 C 267.683594 237.867188 267.746094 237.683594 267.808594 237.5 C 267.859375 237.332031 267.90625 237.167969 267.960938 237.003906 C 268.015625 236.8125 268.074219 236.621094 268.121094 236.433594 C 268.167969 236.269531 268.210938 236.101562 268.257812 235.9375 C 268.300781 235.75 268.347656 235.550781 268.390625 235.363281 C 268.433594 235.195312 268.46875 235.023438 268.503906 234.855469 C 268.542969 234.667969 268.582031 234.46875 268.617188 234.28125 C 268.648438 234.109375 268.683594 233.9375 268.710938 233.769531 C 268.746094 233.570312 268.773438 233.382812 268.800781 233.183594 C 268.824219 233.011719 268.851562 232.84375 268.867188 232.671875 C 268.894531 232.472656 268.914062 232.285156 268.933594 232.085938 C 268.953125 231.914062 268.96875 231.742188 268.988281 231.566406 C 269.003906 231.371094 269.015625 231.175781 269.023438 230.976562 C 269.035156 230.804688 269.046875 230.628906 269.054688 230.449219 C 269.0625 230.253906 269.0625 230.0625 269.070312 229.867188 C 269.074219 229.6875 269.074219 229.515625 269.074219 229.335938 C 269.074219 229.136719 269.070312 228.941406 269.070312 228.746094 C 269.0625 228.570312 269.058594 228.394531 269.054688 228.210938 C 269.042969 228.015625 269.03125 227.828125 269.019531 227.628906 C 269.003906 227.359375 268.988281 227.097656 268.957031 226.828125 C 268.914062 226.3125 268.839844 225.808594 268.761719 225.308594 C 268.628906 224.46875 268.445312 223.636719 268.234375 222.820312 L 288.992188 202.777344 L 302.285156 189.945312 L 312.769531 179.820312 C 313.84375 178.753906 315.070312 177.929688 316.382812 177.363281 C 316.390625 177.355469 316.394531 177.355469 316.40625 177.355469 C 316.621094 177.261719 316.832031 177.171875 317.046875 177.097656 C 317.269531 177.015625 317.496094 176.941406 317.71875 176.875 C 318.8125 176.550781 319.9375 176.386719 321.066406 176.386719 C 321.15625 176.386719 321.25 176.398438 321.347656 176.40625 C 321.996094 176.421875 322.652344 176.476562 323.292969 176.605469 C 323.351562 176.617188 323.40625 176.636719 323.464844 176.644531 C 325.066406 176.984375 326.605469 177.667969 327.980469 178.675781 C 328.453125 179.023438 328.90625 179.394531 329.335938 179.820312 C 331.640625 182.101562 332.765625 185.105469 332.765625 188.085938 C 332.765625 191.09375 331.640625 194.097656 329.335938 196.378906 Z M 124.007812 315.566406 C 123.925781 315.964844 123.816406 316.363281 123.6875 316.75 C 123.558594 317.140625 123.402344 317.523438 123.222656 317.898438 C 122.921875 318.523438 122.558594 319.121094 122.117188 319.6875 C 121.859375 320.019531 121.585938 320.34375 121.277344 320.652344 L 91.664062 350.253906 L 18.113281 276.738281 L 47.722656 247.132812 C 49.121094 245.738281 50.835938 244.847656 52.628906 244.449219 C 52.722656 244.425781 52.816406 244.398438 52.914062 244.382812 C 52.984375 244.367188 53.0625 244.359375 53.140625 244.347656 C 53.699219 244.253906 54.257812 244.199219 54.824219 244.199219 C 56.742188 244.199219 58.671875 244.746094 60.34375 245.851562 C 60.90625 246.214844 61.433594 246.648438 61.921875 247.132812 L 121.277344 306.460938 C 122.136719 307.320312 122.800781 308.292969 123.285156 309.328125 C 123.492188 309.769531 123.667969 310.230469 123.800781 310.695312 C 124.074219 311.621094 124.214844 312.582031 124.214844 313.542969 C 124.214844 314.21875 124.148438 314.902344 124.007812 315.566406 Z M 339.847656 169.230469 C 334.882812 164.246094 328.183594 161.476562 321.066406 161.476562 C 320.410156 161.476562 319.761719 161.503906 319.117188 161.550781 C 313.167969 161.976562 307.613281 164.335938 303.195312 168.34375 C 302.898438 168.613281 302.613281 168.886719 302.328125 169.167969 L 302.285156 169.207031 L 278.371094 192.300781 L 260.242188 209.800781 C 255.378906 205.4375 248.898438 202.746094 241.925781 202.746094 L 180.332031 202.746094 C 177.039062 202.746094 173.871094 202.183594 171.003906 201.117188 C 170.121094 200.792969 169.269531 200.421875 168.457031 200 C 157.625 194.398438 145.964844 191.542969 133.8125 191.542969 C 127.871094 191.542969 121.972656 192.230469 116.21875 193.566406 C 111.429688 194.683594 106.738281 196.238281 102.222656 198.214844 C 100.816406 198.828125 99.429688 199.492188 98.0625 200.1875 C 92.03125 203.246094 86.363281 207.074219 81.234375 211.597656 C 79.507812 213.109375 77.84375 214.699219 76.246094 216.371094 C 71.792969 221.03125 68.0625 226.105469 65.011719 231.476562 C 61.859375 230.046875 58.402344 229.28125 54.824219 229.28125 C 48.148438 229.28125 41.878906 231.878906 37.175781 236.589844 L 3.886719 269.851562 C 0.09375 273.640625 0.09375 279.804688 3.886719 283.613281 L 84.78125 364.464844 C 88.59375 368.253906 94.757812 368.253906 98.546875 364.464844 L 131.828125 331.203125 C 138.527344 324.507812 140.613281 314.984375 138.121094 306.5 L 140.292969 304.355469 C 146.667969 297.957031 155.324219 294.382812 164.363281 294.382812 L 257.792969 294.382812 C 264.886719 294.382812 271.605469 291.183594 276.058594 285.664062 L 307.15625 247.363281 L 319.117188 232.636719 L 340.507812 206.289062 C 345.160156 201.339844 347.691406 194.925781 347.691406 188.085938 C 347.691406 180.929688 344.902344 174.242188 339.847656 169.230469 " fill-opacity="1" fill-rule="nonzero"/>
    <path fill="#127bcb" d="M 55.886719 262.414062 C 51.179688 262.414062 47.359375 266.230469 47.359375 270.941406 C 47.359375 275.648438 51.179688 279.464844 55.886719 279.464844 C 60.597656 279.464844 64.417969 275.648438 64.417969 270.941406 C 64.417969 266.230469 60.597656 262.414062 55.886719 262.414062 " fill-opacity="1" fill-rule="nonzero"/>
    <path fill="#127bcb" d="M 344.148438 32.339844 C 344.148438 50.207031 329.664062 64.683594 311.792969 64.683594 C 293.917969 64.683594 279.429688 50.207031 279.429688 32.339844 C 279.429688 14.480469 293.917969 0 311.792969 0 C 329.664062 0 344.148438 14.480469 344.148438 32.339844 " fill-opacity="1" fill-rule="nonzero"/>
    <path fill="#127bcb" d="M 144.441406 32.339844 C 144.441406 50.207031 129.957031 64.683594 112.082031 64.683594 C 94.210938 64.683594 79.722656 50.207031 79.722656 32.339844 C 79.722656 14.480469 94.210938 0 112.082031 0 C 129.957031 0 144.441406 14.480469 144.441406 32.339844 " fill-opacity="1" fill-rule="nonzero"/>
    <g clip-path="url(#7015cb6990)">
      <path fill="#127bcb" d="M 329.476562 72.105469 L 294.109375 72.105469 C 283.007812 72.105469 272.804688 76.136719 264.894531 82.804688 C 260.234375 86.734375 260.621094 94.007812 265.691406 97.398438 C 269.015625 99.625 272.148438 102.191406 275.046875 105.089844 C 282.058594 112.09375 287.15625 120.484375 290.089844 129.621094 C 291.300781 133.386719 294.808594 135.941406 298.769531 135.941406 L 356.488281 135.941406 C 366.625 135.941406 374.914062 127.652344 374.914062 117.523438 C 374.914062 92.542969 354.46875 72.105469 329.476562 72.105469 " fill-opacity="1" fill-rule="nonzero"/>
    </g>
    <path fill="#127bcb" d="M 158.183594 97.398438 C 163.25 94.007812 163.640625 86.734375 158.980469 82.804688 C 151.066406 76.136719 140.867188 72.105469 129.769531 72.105469 L 94.398438 72.105469 C 69.40625 72.105469 48.957031 92.542969 48.957031 117.523438 C 48.957031 127.652344 57.25 135.941406 67.386719 135.941406 L 125.101562 135.941406 C 129.066406 135.941406 132.574219 133.386719 133.785156 129.621094 C 136.714844 120.484375 141.816406 112.09375 148.824219 105.089844 C 151.726562 102.191406 154.859375 99.625 158.183594 97.398438 " fill-opacity="1" fill-rule="nonzero"/>
    <path fill="#127bcb" d="M 231.871094 97.042969 L 192.003906 97.042969 C 163.824219 97.042969 140.773438 120.082031 140.773438 148.242188 C 140.773438 159.660156 150.125 169.003906 161.550781 169.003906 L 262.324219 169.003906 C 273.75 169.003906 283.101562 159.660156 283.101562 148.242188 C 283.101562 120.082031 260.046875 97.042969 231.871094 97.042969 " fill-opacity="1" fill-rule="nonzero"/>
    <path fill="#127bcb" d="M 248.417969 52.21875 C 248.417969 72.351562 232.082031 88.675781 211.9375 88.675781 C 191.789062 88.675781 175.457031 72.351562 175.457031 52.21875 C 175.457031 32.078125 191.789062 15.753906 211.9375 15.753906 C 232.082031 15.753906 248.417969 32.078125 248.417969 52.21875 " fill-opacity="1" fill-rule="nonzero"/>
  </svg>
);

const ElectricPlanIcon = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="28" className={className}>
    <defs>
      <clipPath id="f65fc69c5e">
        <path d="M 55.878906 46 L 208 46 L 208 309 L 55.878906 309 Z M 55.878906 46 " clip-rule="nonzero"/>
      </clipPath>
      <clipPath id="efb284797c">
        <path d="M 185 66 L 337.128906 66 L 337.128906 329 L 185 329 Z M 185 66 " clip-rule="nonzero"/>
      </clipPath>
      <clipPath id="11346981aa">
        <path d="M 102 23.289062 L 291 23.289062 L 291 351.789062 L 102 351.789062 Z M 102 23.289062 " clip-rule="nonzero"/>
      </clipPath>
    </defs>
    <g clip-path="url(#f65fc69c5e)">
      <path fill="#127bcb" d="M 79.363281 187.539062 C 79.363281 125.230469 128.164062 74.253906 189.476562 70.558594 L 207.246094 47.304688 C 203.683594 47.023438 200.136719 46.753906 196.503906 46.753906 C 118.875 46.753906 55.933594 109.789062 55.933594 187.539062 C 55.933594 239.054688 83.640625 283.964844 124.859375 308.496094 L 130.964844 284.714844 C 99.851562 263.609375 79.363281 227.910156 79.363281 187.539062 Z M 79.363281 187.539062 " fill-opacity="1" fill-rule="nonzero"/>
    </g>
    <g clip-path="url(#efb284797c)">
      <path fill="#127bcb" d="M 267.65625 66.277344 L 261.222656 89.835938 C 292.792969 110.894531 313.644531 146.792969 313.644531 187.539062 C 313.644531 249.835938 264.84375 300.824219 203.53125 304.496094 L 185.75 327.773438 C 189.324219 328.054688 192.871094 328.324219 196.503906 328.324219 C 274.132812 328.324219 337.074219 265.289062 337.074219 187.539062 C 337.074219 135.824219 309.148438 90.75 267.65625 66.277344 Z M 267.65625 66.277344 " fill-opacity="1" fill-rule="nonzero"/>
    </g>
    <g clip-path="url(#11346981aa)">
      <path fill="#127bcb" d="M 290.214844 152.34375 L 219.933594 152.34375 L 226.820312 127.023438 L 239.988281 78.699219 L 246.171875 55.964844 L 255.074219 23.289062 L 233.308594 51.796875 L 217.707031 72.234375 L 178.722656 123.28125 L 102.792969 222.734375 L 173.074219 222.734375 L 166.222656 247.902344 L 153.019531 296.378906 L 146.835938 319.117188 L 137.933594 351.789062 L 159.699219 323.28125 L 175.300781 302.84375 L 214.777344 251.128906 Z M 290.214844 152.34375 " fill-opacity="1" fill-rule="nonzero"/>
    </g>
  </svg>
);

const BankGuaranteeIcon = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="28" className={className}>
    <defs>
      <clipPath id="993062d152">
        <path d="M 22.035156 78.914062 L 352.785156 78.914062 L 352.785156 296.414062 L 22.035156 296.414062 Z M 22.035156 78.914062 " clip-rule="nonzero" />
      </clipPath>
    </defs>
    <g clip-path="url(#993062d152)">
      <path fill="#fff" d="M 42.707031 296.414062 L 332.113281 296.414062 C 343.484375 296.414062 352.785156 287.089844 352.785156 275.699219 L 352.785156 99.628906 C 352.785156 88.234375 343.484375 78.914062 332.113281 78.914062 L 42.707031 78.914062 C 31.335938 78.914062 22.035156 88.234375 22.035156 99.628906 L 22.035156 247.21875 L 248.652344 247.21875 C 251.492188 247.21875 253.820312 249.546875 253.820312 252.394531 C 253.820312 255.242188 251.492188 257.574219 248.652344 257.574219 L 22.035156 257.574219 L 22.035156 275.699219 C 22.035156 287.089844 31.335938 296.414062 42.707031 296.414062 Z M 270.097656 198.019531 C 270.097656 195.171875 272.421875 192.84375 275.265625 192.84375 L 316.609375 192.84375 C 319.453125 192.84375 321.777344 195.171875 321.777344 198.019531 C 321.777344 200.867188 319.453125 203.199219 316.609375 203.199219 L 275.265625 203.199219 C 272.421875 203.199219 270.097656 200.867188 270.097656 198.019531 Z M 301.105469 275.699219 C 288.1875 275.699219 277.851562 265.339844 277.851562 252.394531 C 277.851562 239.449219 288.1875 229.09375 301.105469 229.09375 C 314.027344 229.09375 324.363281 239.449219 324.363281 252.394531 C 324.363281 265.339844 314.027344 275.699219 301.105469 275.699219 Z M 187.410156 130.699219 L 316.609375 130.699219 C 319.453125 130.699219 321.777344 133.03125 321.777344 135.878906 C 321.777344 138.726562 319.453125 141.058594 316.609375 141.058594 L 187.410156 141.058594 C 184.566406 141.058594 182.242188 138.726562 182.242188 135.878906 C 182.242188 133.03125 184.566406 130.699219 187.410156 130.699219 Z M 187.410156 151.414062 L 316.609375 151.414062 C 319.453125 151.414062 321.777344 153.746094 321.777344 156.59375 C 321.777344 159.441406 319.453125 161.769531 316.609375 161.769531 L 187.410156 161.769531 C 184.566406 161.769531 182.242188 159.441406 182.242188 156.59375 C 182.242188 153.746094 184.566406 151.414062 187.410156 151.414062 Z M 63.378906 191.289062 L 63.378906 216.144531 C 63.378906 218.992188 61.054688 221.324219 58.210938 221.324219 C 55.367188 221.324219 53.042969 218.992188 53.042969 216.144531 L 53.042969 191.289062 C 53.042969 175.753906 60.019531 165.136719 71.90625 160.996094 C 74.492188 164.359375 77.332031 167.207031 80.949219 169.539062 C 69.324219 170.832031 63.378906 178.082031 63.378906 191.289062 Z M 118.675781 209.929688 L 108.339844 220.03125 C 107.308594 220.804688 106.015625 221.324219 104.722656 221.324219 C 103.429688 221.324219 102.140625 220.804688 101.105469 219.769531 L 90.769531 209.414062 C 89.476562 208.117188 88.960938 206.566406 89.21875 205.011719 L 93.871094 176.011719 C 97.230469 176.789062 100.589844 177.308594 104.207031 177.566406 L 100.070312 204.234375 L 104.980469 209.15625 L 109.632812 204.492188 L 105.5 177.308594 C 109.117188 177.308594 112.476562 176.789062 115.835938 175.753906 L 120.226562 205.269531 C 120.484375 207.082031 119.710938 208.636719 118.675781 209.929688 Z M 104.722656 166.949219 C 87.667969 166.949219 73.714844 152.96875 73.714844 135.878906 C 73.714844 118.789062 87.667969 104.808594 104.722656 104.808594 C 121.777344 104.808594 135.730469 118.789062 135.730469 135.878906 C 135.730469 152.96875 121.777344 166.949219 104.722656 166.949219 Z M 156.402344 216.144531 C 156.402344 218.992188 154.078125 221.324219 151.234375 221.324219 C 148.390625 221.324219 146.066406 218.992188 146.066406 216.144531 L 146.066406 191.289062 C 146.066406 178.082031 140.125 170.832031 128.496094 169.796875 C 131.855469 167.46875 134.957031 164.359375 137.539062 161.253906 C 149.683594 165.394531 156.402344 176.011719 156.402344 191.546875 Z M 228.753906 203.199219 L 187.410156 203.199219 C 184.566406 203.199219 182.242188 200.867188 182.242188 198.019531 C 182.242188 195.171875 184.566406 192.84375 187.410156 192.84375 L 228.753906 192.84375 C 231.597656 192.84375 233.921875 195.171875 233.921875 198.019531 C 233.921875 200.867188 231.597656 203.199219 228.753906 203.199219 Z M 187.410156 182.484375 C 184.566406 182.484375 182.242188 180.15625 182.242188 177.308594 C 182.242188 174.457031 184.566406 172.128906 187.410156 172.128906 L 316.609375 172.128906 C 319.453125 172.128906 321.777344 174.457031 321.777344 177.308594 C 321.777344 180.15625 319.453125 182.484375 316.609375 182.484375 Z M 187.410156 182.484375 " fill-opacity="1" fill-rule="nonzero" />
    </g>
  </svg>
);

const RenewLic = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="28" className={className}>
    <defs>
      <clipPath id="5b66c15768">
        <path d="M 17.644531 37.5 L 357.394531 37.5 L 357.394531 315 L 17.644531 315 Z M 17.644531 37.5 " clip-rule="nonzero" />
      </clipPath>
    </defs>
    <path d="M 57.617188 161.101562 L 219.140625 161.101562 C 221.808594 161.101562 223.972656 158.941406 223.972656 156.269531 C 223.972656 153.601562 221.808594 151.4375 219.140625 151.4375 L 57.617188 151.4375 C 54.949219 151.4375 52.785156 153.601562 52.785156 156.269531 C 52.785156 158.941406 54.949219 161.101562 57.617188 161.101562 " fill-opacity="1" fill-rule="nonzero" />
    <path d="M 57.617188 108.019531 L 219.140625 108.019531 C 221.808594 108.019531 223.972656 105.859375 223.972656 103.1875 C 223.972656 100.515625 221.808594 98.355469 219.140625 98.355469 L 57.617188 98.355469 C 54.949219 98.355469 52.785156 100.515625 52.785156 103.1875 C 52.785156 105.859375 54.949219 108.019531 57.617188 108.019531 " fill-opacity="1" fill-rule="nonzero" />
    <g clip-path="url(#5b66c15768)">
      <path d="M 324.195312 116.519531 L 224.898438 215.941406 C 224.140625 216.703125 223.152344 217.082031 222.160156 217.082031 C 221.171875 217.082031 220.175781 216.703125 219.417969 215.945312 C 217.910156 214.429688 217.90625 211.976562 219.417969 210.464844 L 318.71875 111.039062 C 320.226562 109.523438 322.683594 109.527344 324.195312 111.035156 C 325.707031 112.550781 325.707031 115.003906 324.195312 116.519531 Z M 215.957031 238.269531 C 222.105469 244.378906 226.820312 253.726562 229.195312 259.035156 L 197.554688 268.898438 C 196.324219 267.070312 194.550781 264.738281 192.066406 262.230469 C 189.734375 259.894531 187.640625 258.378906 185.96875 257.363281 L 195.875 225.605469 C 200.980469 227.808594 209.894531 232.203125 215.957031 238.269531 Z M 247.898438 303.863281 L 28.871094 303.863281 L 28.871094 48.71875 L 247.898438 48.71875 L 247.898438 159.585938 L 202.96875 204.527344 L 57.617188 204.527344 C 54.949219 204.527344 52.785156 206.691406 52.785156 209.359375 C 52.785156 212.03125 54.949219 214.195312 57.617188 214.195312 L 193.304688 214.195312 L 190.328125 217.171875 C 190.285156 217.214844 190.257812 217.257812 190.21875 217.304688 C 190.128906 217.40625 190.046875 217.507812 189.964844 217.617188 C 189.878906 217.726562 189.800781 217.839844 189.730469 217.957031 C 189.660156 218.070312 189.601562 218.1875 189.542969 218.308594 C 189.480469 218.4375 189.425781 218.5625 189.378906 218.695312 C 189.355469 218.753906 189.324219 218.804688 189.304688 218.863281 L 177.214844 257.621094 L 57.617188 257.621094 C 54.949219 257.621094 52.785156 259.785156 52.785156 262.453125 C 52.785156 265.125 54.949219 267.289062 57.617188 267.289062 L 174.199219 267.289062 L 170.480469 279.214844 C 170.019531 280.6875 170.417969 282.285156 171.503906 283.375 C 172.289062 284.167969 173.347656 284.589844 174.433594 284.589844 C 174.84375 284.589844 175.257812 284.53125 175.664062 284.402344 L 235.996094 265.589844 C 236.050781 265.574219 236.09375 265.546875 236.144531 265.53125 C 236.285156 265.476562 236.421875 265.414062 236.558594 265.351562 C 236.675781 265.292969 236.789062 265.238281 236.902344 265.171875 C 237.019531 265.097656 237.132812 265.019531 237.242188 264.933594 C 237.355469 264.847656 237.46875 264.761719 237.570312 264.664062 C 237.613281 264.628906 237.65625 264.601562 237.695312 264.566406 L 247.898438 254.355469 Z M 356.855469 141.902344 C 356.589844 141.191406 350.25 124.367188 340.019531 114.105469 C 329.761719 103.851562 313.488281 98.179688 312.800781 97.945312 C 311.308594 97.425781 309.648438 97.8125 308.527344 98.933594 L 259.085938 148.394531 L 259.085938 43.117188 C 259.085938 40.027344 256.578125 37.519531 253.488281 37.519531 L 23.28125 37.519531 C 20.191406 37.519531 17.6875 40.027344 17.6875 43.117188 L 17.6875 309.460938 C 17.6875 312.550781 20.191406 315.058594 23.28125 315.058594 L 253.488281 315.058594 C 256.578125 315.058594 259.085938 312.550781 259.085938 309.460938 L 259.085938 243.164062 L 355.902344 146.28125 C 357.050781 145.132812 357.417969 143.425781 356.855469 141.902344 " fill-opacity="1" fill-rule="nonzero" />
    </g>
  </svg>
);

const TransferLic = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="28" className={className}>
    <defs>
      <clipPath id="6583b95cf2">
        <path d="M 299 140 L 342.75 140 L 342.75 182 L 299 182 Z M 299 140 " clip-rule="nonzero" />
      </clipPath>
      <clipPath id="703cc74d64">
        <path d="M 37.5 11.449219 L 263 11.449219 L 263 352.699219 L 37.5 352.699219 Z M 37.5 11.449219 " clip-rule="nonzero" />
      </clipPath>
    </defs>
    <path fill="#127bcb" d="M 101.324219 165.703125 C 100.75 165.703125 100.234375 165.625 99.78125 165.46875 C 99.324219 165.316406 98.902344 165.027344 98.519531 164.613281 L 94.730469 160.429688 C 94.121094 160.59375 93.5 160.726562 92.859375 160.804688 C 92.222656 160.894531 91.554688 160.933594 90.867188 160.933594 C 88.914062 160.933594 87.128906 160.601562 85.511719 159.945312 C 83.898438 159.277344 82.515625 158.363281 81.363281 157.179688 C 80.210938 156.003906 79.328125 154.609375 78.691406 152.988281 C 78.058594 151.375 77.742188 149.628906 77.742188 147.734375 C 77.742188 145.839844 78.058594 144.082031 78.691406 142.46875 C 79.328125 140.855469 80.210938 139.460938 81.363281 138.28125 C 82.515625 137.105469 83.898438 136.179688 85.511719 135.523438 C 87.128906 134.863281 88.914062 134.527344 90.867188 134.527344 C 92.820312 134.527344 94.605469 134.863281 96.214844 135.53125 C 97.820312 136.195312 99.199219 137.121094 100.34375 138.289062 C 101.488281 139.460938 102.375 140.855469 103.007812 142.46875 C 103.636719 144.082031 103.957031 145.839844 103.957031 147.734375 C 103.957031 148.886719 103.832031 149.988281 103.597656 151.046875 C 103.355469 152.097656 103.015625 153.082031 102.570312 154 C 102.125 154.917969 101.574219 155.761719 100.933594 156.53125 C 100.289062 157.296875 99.558594 157.972656 98.738281 158.558594 L 105.300781 165.703125 Z M 68.601562 127.328125 C 68.601562 142.617188 68.601562 157.734375 68.601562 172.90625 C 84.039062 172.90625 99.261719 172.90625 114.441406 172.90625 C 114.441406 157.5625 114.441406 142.53125 114.441406 127.328125 C 99.097656 127.328125 83.953125 127.328125 68.601562 127.328125 " fill-opacity="1" fill-rule="nonzero" />
    <path fill="#127bcb" d="M 98.453125 143.917969 C 98.078125 142.792969 97.546875 141.835938 96.839844 141.050781 C 96.132812 140.269531 95.28125 139.667969 94.277344 139.25 C 93.265625 138.828125 92.128906 138.625 90.867188 138.625 C 89.605469 138.625 88.46875 138.828125 87.457031 139.25 C 86.4375 139.667969 85.574219 140.269531 84.871094 141.050781 C 84.164062 141.835938 83.613281 142.792969 83.230469 143.917969 C 82.855469 145.046875 82.660156 146.316406 82.660156 147.734375 C 82.660156 149.152344 82.855469 150.421875 83.230469 151.546875 C 83.613281 152.667969 84.164062 153.625 84.871094 154.40625 C 85.574219 155.183594 86.4375 155.785156 87.457031 156.199219 C 88.46875 156.617188 89.605469 156.828125 90.867188 156.828125 C 92.128906 156.828125 93.265625 156.617188 94.277344 156.199219 C 95.28125 155.785156 96.132812 155.183594 96.839844 154.40625 C 97.546875 153.625 98.078125 152.667969 98.453125 151.546875 C 98.832031 150.421875 99.019531 149.152344 99.019531 147.734375 C 99.019531 146.316406 98.832031 145.046875 98.453125 143.917969 " fill-opacity="1" fill-rule="nonzero" />
    <path fill="#127bcb" d="M 92.082031 230.140625 C 91.894531 229.578125 91.714844 228.964844 91.523438 228.308594 C 91.34375 228.964844 91.171875 229.578125 90.992188 230.148438 C 90.820312 230.722656 90.648438 231.214844 90.480469 231.644531 L 87.0625 240.925781 L 96.007812 240.925781 L 92.597656 231.605469 C 92.441406 231.191406 92.269531 230.707031 92.082031 230.140625 " fill-opacity="1" fill-rule="nonzero" />
    <path fill="#127bcb" d="M 101.191406 251.515625 C 100.734375 251.515625 100.367188 251.40625 100.078125 251.179688 C 99.789062 250.953125 99.574219 250.671875 99.441406 250.335938 L 97.351562 244.617188 L 85.722656 244.617188 L 83.628906 250.335938 C 83.527344 250.632812 83.324219 250.90625 83.019531 251.148438 C 82.714844 251.390625 82.34375 251.515625 81.90625 251.515625 L 77.84375 251.515625 L 88.867188 223.476562 L 94.207031 223.476562 L 105.226562 251.515625 Z M 68.6875 214.765625 C 68.6875 230.070312 68.6875 245.125 68.6875 260.234375 C 84.0625 260.234375 99.222656 260.234375 114.394531 260.234375 C 114.394531 244.953125 114.394531 229.976562 114.394531 214.765625 C 98.910156 214.765625 83.835938 214.765625 68.6875 214.765625 " fill-opacity="1" fill-rule="nonzero" />
    <path fill="#127bcb" d="M 295.40625 164.753906 L 321 186.835938 L 218.234375 305.804688 L 192.636719 283.726562 L 295.40625 164.753906 " fill-opacity="1" fill-rule="nonzero" />
    <g clip-path="url(#6583b95cf2)">
      <path fill="#127bcb" d="M 320.898438 140.933594 L 340.9375 158.214844 C 342.472656 159.539062 342.640625 161.863281 341.3125 163.398438 L 325.398438 181.820312 L 299.804688 159.742188 L 315.71875 141.320312 C 317.042969 139.785156 319.363281 139.613281 320.898438 140.933594 " fill-opacity="1" fill-rule="nonzero" />
    </g>
    <path fill="#127bcb" d="M 214.03125 310.929688 L 175.695312 329.1875 L 188.175781 288.636719 Z M 214.03125 310.929688 " fill-opacity="1" fill-rule="nonzero" />
    <g clip-path="url(#703cc74d64)">
      <path fill="#127bcb" d="M 147.476562 25.542969 C 157.25 25.542969 165.472656 32.101562 168.023438 41.050781 L 126.929688 41.050781 C 129.46875 32.101562 137.699219 25.542969 147.476562 25.542969 Z M 262.894531 267.167969 L 249.214844 283.003906 C 249.214844 293.789062 249.207031 304.574219 249.207031 315.359375 C 249.207031 327.390625 241.761719 334.878906 229.734375 334.878906 C 211.609375 334.886719 193.492188 334.886719 175.375 334.886719 L 170.992188 334.886719 C 137.550781 334.886719 104.105469 334.886719 70.671875 334.878906 C 58.613281 334.878906 51.144531 327.421875 51.144531 315.410156 L 51.144531 206.503906 C 51.152344 170.285156 51.152344 134.074219 51.152344 97.863281 C 51.152344 85.605469 58.488281 78.28125 70.78125 78.28125 C 76.628906 78.28125 82.484375 78.226562 88.335938 78.328125 L 88.335938 80.246094 C 88.335938 84.929688 92.136719 88.730469 96.816406 88.730469 L 107.5625 88.730469 C 108.199219 88.785156 108.835938 88.808594 109.492188 88.808594 C 135.042969 88.792969 160.597656 88.785156 186.148438 88.816406 C 186.851562 88.816406 187.535156 88.785156 188.21875 88.730469 L 199.433594 88.730469 C 204.125 88.730469 207.925781 84.929688 207.925781 80.246094 L 207.925781 78.335938 C 215.734375 78.242188 223.558594 78.226562 231.375 78.289062 C 241.117188 78.375 248.902344 85.996094 249.238281 95.726562 C 249.324219 98.066406 249.261719 100.417969 249.261719 102.757812 C 249.253906 138.101562 249.246094 173.441406 249.238281 208.78125 L 262.878906 192.984375 C 262.871094 155.894531 262.863281 118.808594 262.855469 81.710938 C 262.855469 80.332031 262.839844 78.921875 262.589844 77.570312 C 260.738281 67.511719 252.8125 60.703125 242.511719 60.570312 C 231.648438 60.4375 220.78125 60.546875 209.917969 60.546875 L 207.925781 60.546875 L 207.925781 49.535156 C 207.925781 44.851562 204.125 41.050781 199.433594 41.050781 L 182.257812 41.050781 C 179.476562 24.359375 164.972656 11.632812 147.476562 11.632812 C 129.984375 11.632812 115.480469 24.359375 112.691406 41.050781 L 96.816406 41.050781 C 92.136719 41.050781 88.335938 44.851562 88.335938 49.535156 L 88.335938 60.390625 C 88.320312 60.4375 88.304688 60.476562 88.289062 60.523438 L 85.527344 60.523438 C 76.660156 60.53125 67.792969 60.523438 58.929688 60.546875 C 45.96875 60.578125 37.441406 69.125 37.441406 82.136719 C 37.457031 165.246094 37.472656 248.367188 37.496094 331.480469 C 37.496094 343.777344 46.179688 352.496094 58.472656 352.503906 C 119.488281 352.519531 180.511719 352.519531 241.523438 352.503906 C 254.3125 352.496094 262.910156 343.863281 262.902344 331.050781 C 262.902344 309.761719 262.902344 288.464844 262.894531 267.167969 " fill-opacity="1" fill-rule="nonzero" />
    </g>
    <path fill="#127bcb" d="M 230.347656 143.449219 L 124.488281 143.449219 L 124.488281 127.328125 L 230.347656 127.328125 L 230.347656 143.449219 " fill-opacity="1" fill-rule="nonzero" />
    <path fill="#127bcb" d="M 230.347656 167.589844 L 124.488281 167.589844 L 124.488281 151.46875 L 230.347656 151.46875 L 230.347656 167.589844 " fill-opacity="1" fill-rule="nonzero" />
    <path fill="#127bcb" d="M 230.347656 230.613281 L 124.488281 230.613281 L 124.488281 214.492188 L 230.347656 214.492188 L 230.347656 230.613281 " fill-opacity="1" fill-rule="nonzero" />
    <path fill="#127bcb" d="M 224.058594 238.625 L 210.136719 254.742188 L 124.488281 254.742188 L 124.488281 238.625 L 224.058594 238.625 " fill-opacity="1" fill-rule="nonzero" />
    <path fill="#127bcb" d="M 203.339844 262.625 L 189.417969 278.742188 L 124.488281 278.742188 L 124.488281 262.625 L 203.339844 262.625 " fill-opacity="1" fill-rule="nonzero" />
  </svg>
);

const SurrenderLic = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="28" className={className}>
  <defs>
    <clipPath id="c15c8372af">
      <path d="M 159 10.65625 L 214 10.65625 L 214 65 L 159 65 Z M 159 10.65625 " clip-rule="nonzero" />
    </clipPath>
    <clipPath id="dce3cca247">
      <path d="M 159 303 L 214 303 L 214 357.15625 L 159 357.15625 Z M 159 303 " clip-rule="nonzero" />
    </clipPath>
    <clipPath id="8f5d5df945">
      <path d="M 305 156 L 359.527344 156 L 359.527344 211 L 305 211 Z M 305 156 " clip-rule="nonzero" />
    </clipPath>
    <clipPath id="bcbb8552b4">
      <path d="M 13.027344 156 L 68 156 L 68 211 L 13.027344 211 Z M 13.027344 156 " clip-rule="nonzero" />
    </clipPath>
  </defs>
  <g clip-path="url(#c15c8372af)">
    <path d="M 186.277344 64.796875 C 201.226562 64.796875 213.347656 52.679688 213.347656 37.726562 C 213.347656 22.777344 201.226562 10.65625 186.277344 10.65625 C 171.324219 10.65625 159.207031 22.777344 159.207031 37.726562 C 159.207031 52.679688 171.324219 64.796875 186.277344 64.796875 Z M 186.277344 64.796875 " fill-opacity="1" fill-rule="nonzero" />
  </g>
  <g clip-path="url(#dce3cca247)">
    <path d="M 186.277344 303.015625 C 171.324219 303.015625 159.207031 315.136719 159.207031 330.085938 C 159.207031 345.039062 171.324219 357.15625 186.277344 357.15625 C 201.226562 357.15625 213.347656 345.039062 213.347656 330.085938 C 213.347656 315.136719 201.226562 303.015625 186.277344 303.015625 Z M 186.277344 303.015625 " fill-opacity="1" fill-rule="nonzero" />
  </g>
  <g clip-path="url(#8f5d5df945)">
    <path d="M 332.457031 156.835938 C 317.503906 156.835938 305.386719 168.957031 305.386719 183.90625 C 305.386719 198.859375 317.503906 210.976562 332.457031 210.976562 C 347.40625 210.976562 359.527344 198.859375 359.527344 183.90625 C 359.527344 168.957031 347.40625 156.835938 332.457031 156.835938 Z M 332.457031 156.835938 " fill-opacity="1" fill-rule="nonzero" />
  </g>
  <g clip-path="url(#bcbb8552b4)">
    <path d="M 67.167969 183.90625 C 67.167969 168.957031 55.046875 156.835938 40.097656 156.835938 C 25.144531 156.835938 13.027344 168.957031 13.027344 183.90625 C 13.027344 198.859375 25.144531 210.976562 40.097656 210.976562 C 55.046875 210.976562 67.167969 198.859375 67.167969 183.90625 Z M 67.167969 183.90625 " fill-opacity="1" fill-rule="nonzero" />
  </g>
  <path d="M 289.144531 108.109375 C 304.09375 108.109375 316.214844 95.992188 316.214844 81.039062 C 316.214844 66.089844 304.09375 53.96875 289.144531 53.96875 C 274.191406 53.96875 262.074219 66.089844 262.074219 81.039062 C 262.074219 95.992188 274.191406 108.109375 289.144531 108.109375 Z M 289.144531 108.109375 " fill-opacity="1" fill-rule="nonzero" />
  <path d="M 83.410156 259.703125 C 68.457031 259.703125 56.339844 271.824219 56.339844 286.773438 C 56.339844 301.726562 68.460938 313.84375 83.410156 313.84375 C 98.359375 313.84375 110.480469 301.726562 110.480469 286.773438 C 110.480469 271.824219 98.359375 259.703125 83.410156 259.703125 Z M 83.410156 259.703125 " fill-opacity="1" fill-rule="nonzero" />
  <path d="M 289.144531 259.703125 C 274.195312 259.703125 262.074219 271.824219 262.074219 286.773438 C 262.074219 301.726562 274.195312 313.84375 289.144531 313.84375 C 304.09375 313.84375 316.214844 301.726562 316.214844 286.773438 C 316.214844 271.824219 304.09375 259.703125 289.144531 259.703125 Z M 289.144531 259.703125 " fill-opacity="1" fill-rule="nonzero" />
  <path d="M 83.410156 53.96875 C 68.457031 53.96875 56.339844 66.089844 56.339844 81.039062 C 56.339844 95.992188 68.457031 108.109375 83.410156 108.109375 C 98.359375 108.109375 110.480469 95.992188 110.480469 81.039062 C 110.480469 66.085938 98.359375 53.96875 83.410156 53.96875 Z M 83.410156 53.96875 " fill-opacity="1" fill-rule="nonzero" />
  <path d="M 219.746094 175.003906 C 218.191406 175.003906 216.671875 175.363281 215.320312 176.035156 C 215.25 175.804688 215.15625 175.605469 215.011719 175.417969 C 213.546875 171.976562 210.03125 169.527344 205.90625 169.527344 C 204.445312 169.527344 203.023438 169.839844 201.722656 170.429688 C 200.839844 166.109375 196.84375 162.84375 192.0625 162.84375 C 190.75 162.84375 189.4375 163.101562 188.238281 163.574219 L 188.238281 123.285156 C 188.238281 117.8125 183.980469 113.523438 178.550781 113.523438 C 173.238281 113.523438 169.074219 117.8125 169.074219 123.285156 L 169.074219 182.402344 C 169.074219 182.402344 169.195312 184.972656 168.449219 182.621094 C 166.378906 176.101562 159.875 166.746094 152.289062 166.746094 C 149.925781 166.746094 147.652344 167.585938 145.863281 169.105469 C 137.332031 176.359375 150.0625 192.648438 152.957031 200.523438 C 154.367188 204.351562 155.820312 208.308594 157.347656 211.773438 C 160.609375 221.113281 164.335938 226.984375 167.324219 231.703125 C 171.371094 238.074219 174.292969 242.675781 174.292969 252.265625 C 174.292969 253.382812 175.210938 254.289062 176.332031 254.289062 L 216.261719 254.289062 C 217.398438 254.289062 218.3125 253.382812 218.3125 252.265625 C 218.3125 249.003906 220.3125 244.992188 222.65625 240.347656 C 225.886719 233.894531 229.566406 226.574219 229.566406 218.042969 L 229.566406 203.167969 C 229.582031 203.039062 229.589844 202.90625 229.589844 202.765625 L 229.589844 184.40625 C 229.589844 179.226562 225.171875 175.003906 219.746094 175.003906 Z M 219.746094 175.003906 " fill-opacity="1" fill-rule="nonzero" />
</svg>
);

const StandardDesign = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="28" className={className}>
    <defs>
      <clipPath id="5cdc5108e2">
        <path d="M 37.5 21.921875 L 358.5 21.921875 L 358.5 353.421875 L 37.5 353.421875 Z M 37.5 21.921875 " clip-rule="nonzero" />
      </clipPath>
    </defs>
    <path  d="M 93.160156 151.996094 L 93.160156 112.242188 C 93.160156 110.789062 91.988281 109.613281 90.535156 109.613281 L 60.378906 109.613281 C 58.925781 109.613281 57.75 110.789062 57.75 112.242188 L 57.75 151.996094 C 57.75 153.449219 58.925781 154.628906 60.378906 154.628906 L 90.535156 154.628906 C 91.988281 154.628906 93.160156 153.449219 93.160156 151.996094 Z M 93.160156 151.996094 " fill-opacity="1" fill-rule="nonzero" />
    <path  d="M 201.128906 96.351562 C 164.570312 96.351562 134.828125 125.777344 134.828125 161.941406 C 134.828125 198.105469 164.566406 227.53125 201.128906 227.53125 C 237.683594 227.53125 267.425781 198.105469 267.425781 161.941406 C 267.425781 125.777344 237.6875 96.351562 201.128906 96.351562 Z M 201.128906 222.269531 C 167.46875 222.269531 140.085938 195.207031 140.085938 161.941406 C 140.085938 128.675781 167.472656 101.613281 201.128906 101.613281 C 234.785156 101.613281 262.167969 128.679688 262.167969 161.941406 C 262.167969 195.203125 234.789062 222.269531 201.128906 222.269531 Z M 201.128906 222.269531 " fill-opacity="1" fill-rule="nonzero" />
    <g clip-path="url(#5cdc5108e2)">
      <path  d="M 355.730469 21.921875 L 314.40625 21.921875 C 313.710938 21.921875 313.046875 22.195312 312.558594 22.683594 L 268.214844 66.542969 L 70.421875 66.542969 C 68.96875 66.542969 67.792969 67.722656 67.792969 69.171875 L 67.792969 89.722656 L 40.269531 89.722656 C 38.816406 89.722656 37.640625 90.898438 37.640625 92.351562 L 37.640625 350.789062 C 37.640625 352.242188 38.816406 353.421875 40.269531 353.421875 L 241.324219 353.421875 C 242.777344 353.421875 243.953125 352.242188 243.953125 350.789062 L 243.953125 330.214844 L 271.503906 330.214844 C 272.957031 330.214844 274.132812 329.039062 274.132812 327.585938 L 274.132812 201.09375 C 280.691406 189.113281 284.171875 175.597656 284.171875 161.941406 C 284.171875 147.398438 280.273438 133.226562 272.949219 120.765625 L 281.238281 112.589844 L 284.140625 115.460938 C 284.652344 115.960938 285.320312 116.214844 285.984375 116.214844 C 286.652344 116.214844 287.324219 115.960938 287.832031 115.453125 L 297.210938 106.175781 L 357.390625 57.058594 C 358 56.558594 358.355469 55.808594 358.355469 55.019531 L 358.355469 24.554688 C 358.359375 23.101562 357.183594 21.921875 355.730469 21.921875 Z M 250.621094 96 L 257.535156 89.167969 L 277.496094 108.890625 L 270.09375 116.195312 C 264.832031 108.453125 258.183594 101.558594 250.621094 96 Z M 73.050781 71.804688 L 258.140625 71.804688 L 250.964844 78.90625 C 250.464844 79.398438 250.183594 80.074219 250.183594 80.777344 C 250.183594 81.480469 250.464844 82.152344 250.964844 82.648438 L 253.800781 85.460938 L 246.183594 92.988281 C 232.777344 84.367188 217.265625 79.777344 201.128906 79.777344 C 187.265625 79.777344 173.589844 83.222656 161.515625 89.722656 L 73.050781 89.722656 Z M 238.695312 348.160156 L 42.898438 348.160156 L 42.898438 94.984375 L 153.042969 94.984375 C 131.277344 110.308594 118.058594 135.191406 118.058594 161.941406 C 118.058594 165.464844 118.363281 169.027344 118.832031 172.570312 L 63.71875 172.570312 C 62.265625 172.570312 61.089844 173.75 61.089844 175.199219 L 61.089844 324.296875 C 61.089844 325.75 62.265625 326.929688 63.71875 326.929688 L 217.875 326.929688 C 219.328125 326.929688 220.503906 325.75 220.503906 324.296875 L 220.503906 241.765625 C 226.824219 240.277344 232.917969 238.058594 238.695312 235.136719 Z M 200.390625 244.0625 C 200.640625 244.0625 200.882812 244.078125 201.128906 244.078125 C 205.839844 244.078125 210.570312 243.65625 215.242188 242.859375 L 215.242188 321.664062 L 200.390625 321.664062 Z M 195.132812 321.667969 L 180.28125 321.667969 L 180.28125 241.433594 C 185.132812 242.683594 190.105469 243.480469 195.132812 243.824219 Z M 175.023438 321.667969 L 160.199219 321.667969 L 160.199219 233.410156 C 164.882812 236.039062 169.847656 238.199219 175.023438 239.886719 Z M 154.941406 321.667969 L 140.085938 321.667969 L 140.085938 217.644531 C 144.523438 222.402344 149.511719 226.574219 154.941406 230.164062 Z M 103.230469 296.199219 L 103.230469 275.992188 L 134.828125 275.992188 L 134.828125 296.199219 Z M 103.230469 245.289062 L 103.230469 225.082031 L 134.828125 225.082031 L 134.828125 245.289062 Z M 66.347656 199.644531 L 97.972656 199.644531 L 97.972656 321.667969 L 66.347656 321.667969 Z M 66.347656 194.378906 L 66.347656 177.832031 L 97.972656 177.832031 L 97.972656 194.378906 Z M 103.230469 194.378906 L 103.230469 177.832031 L 119.675781 177.832031 C 120.785156 183.476562 122.511719 189.015625 124.84375 194.378906 Z M 243.953125 324.953125 L 243.953125 232.261719 C 253.785156 226.394531 262.257812 218.601562 268.871094 209.382812 L 268.871094 324.953125 Z M 269.210938 199.167969 C 262.355469 211.371094 252.257812 221.519531 240.015625 228.515625 C 232.949219 232.578125 225.320312 235.480469 217.335938 237.136719 C 210.925781 238.476562 204.355469 239.058594 197.867188 238.742188 C 191.226562 238.492188 184.683594 237.394531 178.414062 235.484375 C 171.492188 233.402344 164.957031 230.40625 158.984375 226.574219 C 151.53125 221.835938 144.988281 215.890625 139.527344 208.910156 C 136.378906 204.90625 133.597656 200.503906 131.269531 195.847656 C 127.929688 189.101562 125.621094 182.011719 124.410156 174.761719 C 123.683594 170.503906 123.316406 166.191406 123.316406 161.945312 C 123.316406 134.03125 138.679688 108.246094 163.414062 94.660156 C 174.863281 88.367188 187.90625 85.039062 201.132812 85.039062 C 216.949219 85.039062 232.144531 89.695312 245.085938 98.507812 C 254.035156 104.550781 261.761719 112.578125 267.433594 121.707031 C 267.433594 121.707031 267.433594 121.710938 267.433594 121.710938 C 274.949219 133.761719 278.921875 147.675781 278.921875 161.941406 C 278.914062 174.945312 275.558594 187.820312 269.210938 199.167969 Z M 353.101562 53.769531 L 295.617188 100.683594 L 268.382812 73.75 L 271.082031 71.082031 C 271.121094 71.042969 271.160156 71.007812 271.195312 70.96875 L 315.484375 27.183594 L 353.101562 27.183594 Z M 353.101562 53.769531 " fill-opacity="1" fill-rule="nonzero" />
    </g>
    <path d="M 161.804688 151.171875 C 162.054688 151.191406 162.296875 151.203125 162.542969 151.203125 C 167.359375 151.203125 171.453125 147.503906 171.832031 142.652344 C 172.023438 140.199219 171.246094 137.816406 169.636719 135.941406 C 168.003906 134.042969 165.726562 132.898438 163.238281 132.71875 C 160.738281 132.539062 158.316406 133.3125 156.414062 134.949219 C 154.539062 136.558594 153.410156 138.800781 153.234375 141.242188 C 153.042969 143.703125 153.824219 146.09375 155.433594 147.96875 C 157.0625 149.855469 159.328125 150.996094 161.804688 151.171875 Z M 161.804688 151.171875 " fill-opacity="1" fill-rule="nonzero" />
    <path d="M 169.125 173.28125 C 168.542969 170.710938 168.464844 168.082031 168.894531 165.449219 C 169.332031 162.652344 168.378906 159.839844 166.34375 157.929688 C 164.320312 156.03125 161.597656 155.292969 158.917969 155.886719 L 158.511719 155.96875 C 155.914062 156.503906 153.710938 158.261719 152.625 160.671875 C 149.296875 168.023438 150.316406 174.765625 150.90625 177.300781 C 152.449219 184.195312 156.378906 188.84375 159.421875 191.550781 C 161 192.921875 162.945312 193.65625 165.011719 193.65625 C 165.640625 193.65625 166.277344 193.589844 166.921875 193.449219 L 167.265625 193.359375 C 169.964844 192.753906 172.183594 190.875 173.210938 188.316406 C 174.21875 185.796875 173.910156 182.957031 172.386719 180.714844 C 170.832031 178.453125 169.707031 175.886719 169.125 173.28125 Z M 169.125 173.28125 " fill-opacity="1" fill-rule="nonzero" />
  </svg>
);

export {
  AnnouncementIcon,
  BPAIco,
  RenewLic,
  TransferLic,
  SurrenderLic,
  StandardDesign,
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
  LicencingIcon,
  ServicePlanIcon,
  ElectricPlanIcon,
  BankGuaranteeIcon,
  DeleteIcon,
  PMBIcon,
  GenericFileIcon,
  ArrowLeftWhite,
  WSICon,
  CameraIcon,
  RemoveIcon,
  GalleryIcon,
  EditPencilIcon,
  ErrorIcon
};
