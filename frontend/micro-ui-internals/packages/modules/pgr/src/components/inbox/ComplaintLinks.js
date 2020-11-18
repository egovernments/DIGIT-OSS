import React from "react";

const ComplaintsLink = () => {
  const links = [
    { text: "New Complaint", link: "/" },
    { text: "Reports", link: "/" },
    { text: "Dashboard", link: "/" },
  ];

  const GetLogo = () => (
    <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #D6D5D4" }}>
      <span style={{ backgroundColor: "#F47738", padding: "12px", radius: "4px" }}>Logo</span> <span style={{ padding: "0 16px" }}>Complaints</span>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#fff" }}>
      {GetLogo()}
      <div style={{ display: "flex", padding: "10px", flexDirection: "column", alignItems: "left", marginLeft: "64px" }}>
        {links.map(({ link, text }) => (
          <span style={{ padding: "8px" }}>
            <a href={link}>{text}</a>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsLink;
