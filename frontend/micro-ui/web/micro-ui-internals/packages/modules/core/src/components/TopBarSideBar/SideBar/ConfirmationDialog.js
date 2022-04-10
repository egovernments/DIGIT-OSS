import React from "react";
import { Card, CardText,  CloseSvg } from "@egovernments/digit-ui-react-components";

const Dialog = ({ onSelect, onCancel,userType}) => {
  const handleLogout = () => {
    onSelect();
    Digit.UserService.logout();
  };

  return (
    window.innerWidth <= 400 ? (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0,0,0,0.7)",
        zIndex:"1000"
      }}
    >
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          padding: "20px",
          borderRadius: "4px",
          width: "319px",
          height: "173px",
        
        }}
      >
        <h2 style={{ fontSize: "18px", width: "100%", textAlign: "left", fontWeight: "bold", margin: "5px" }}> Logout</h2>
        <div style={{ position: "absolute", top: "5px", right: "5px", height: "24px", width: "24px", fill: "grey" }}>

          <button onClick={onCancel}>
            <CloseSvg />
          </button>
        </div>

        <CardText stlye={{ color: "#0B0C0C", fontSize: "16px", width: "301px", height: "48px" }}>Are you sure you want to Logout of Mseva?</CardText>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => onCancel()}
            style={{
              background: "#B1B4B6",
              color: "white",
              padding: "2px",
              marginLeft: "4px",
              border: "none",
              cursor: "pointer",
              width: "149px",
              height: "40px",
              boxShadow: "inset 0px -2px 0px #0B0C0C",
            }}
          >
            No
          </button>
          <button
            onClick={() => handleLogout()}
            style={{
              background: "#F47738",
              color: "white",
              padding: "2px",
              marginRight: "4px",
              border: "none",
              cursor: "pointer",
              width: "148px",
              height: "40px",
              boxShadow: "inset 0px -2px 0px #0B0C0C",
            }}
          >
            Yes
          </button>
        </div>
      </Card>
    </div>

  ):(

    <div
    style={{
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      backgroundColor: "rgba(0,0,0,0.7)",
      zIndex:"1000"
    }}
  >
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "absolute",
        top: "200px",
        left: "50%",
        transform: "translate(-50%,-50%)",
        padding: "20px",
        borderRadius: "4px",
        width: "402px",
        height: "252px",
        boxShadow:"0px 1px 2px rgba(0, 0, 0, 0.16)",
      }}
    >
      <h2 style={{ fontSize: "24px", width: "100%", textAlign: "left", fontWeight: "bold",fontFamily:"Roboto"}}> Logout</h2>
      <div style={{ position: "absolute", top: "5px", right: "5px", height: "24px", width: "24px", fill: "grey" }}>

        <button onClick={onCancel}>
          <CloseSvg />
        </button>
      </div>
        
      <h3 stlye={{ fontSize: "16px", width: "100%",fontFamily:"Roboto",textAlign:"left"}}>Are you sure you want to <span style={{fontWeight:"bold"}}>Logout</span>?</h3>
      
      <div style={{ display: "flex", gap: "28px",marginLeft:"90px"}}>
        <button
          onClick={() => onCancel()}
          style={{
            background: "#B1B4B6",
            color: "#505A5F",
            padding: "2px",
            marginLeft: "4px",
            border: "none",
            cursor: "pointer",
            width: "107px",
            height: "40px",
            boxShadow: "inset 0px -2px 0px #0B0C0C",
            fontFamily:"Roboto",
            fontSize:"19px"
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => handleLogout()}
          style={{
            background: "#F47738",
            color: "white",
            padding: "2px",
            border: "none",
            cursor: "pointer",
            width: "148px",
            height: "40px",
            boxShadow: "inset 0px -2px 0px #0B0C0C",
            fontFamily:"Roboto",
            fontSize:"19px"
          }}
        >
          Yes,Logout
        </button>
      </div>
    </Card>
  </div>
  )
  );
};
export default Dialog;
