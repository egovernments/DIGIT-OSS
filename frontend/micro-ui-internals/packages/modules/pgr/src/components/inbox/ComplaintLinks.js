import React from "react";

const ComplaintsLink = () => {
  const links = [
    { text: "New Complaint", link: "/" },
    { text: "Reports", link: "/" },
    { text: "Dashboard", link: "/" },
  ];

  return (
    <div style={{ display: "flex", padding: "10px", flexDirection: "column", alignItems: "center" }}>
      {links.map(({ link, text }) => (
        <span style={{ padding: "8px" }}>
          <a href={link}>{text}</a>
        </span>
      ))}
    </div>
  );
};

export default ComplaintsLink;
