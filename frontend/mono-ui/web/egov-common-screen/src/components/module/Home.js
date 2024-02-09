import React from "react";
import Header from "../Header";
import Cards from "../Cards";
import Message from "../Message";
import Faqs from "../Faqs";
import Testimonials from "../Testimonials";
import Footer from "../Footer";
import digitLogo from './digit-footer.png';

function Home() {
  return (
    <div>

      <Header />
      <Cards />
      <Message />

      <center>
        <p
          style={{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "500",
            fontSize: "36px",
            lineHeight: "42px",
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.87)",
            marginLeft: "10%",
            marginRight: "10%",
          }}
        >
          Frequently Asked Questions
        </p>
      </center>
      <div
        style={{
          marginLeft: "45%",
          marginRight: "45%",
          marginTop: "-2%",
          borderBottom: "5px solid #f48952",
        }}
      ></div>

      <Faqs />

      <center>
        <p
          style={{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "500",
            fontSize: "36px",
            lineHeight: "42px",
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.87)",
            marginLeft: "10%",
            marginRight: "10%",
          }}
        >
          User Testimonials
        </p>
      </center>
      <div
        style={{
          marginLeft: "45%",
          marginTop: "-2%",
          marginRight: "45%",
          borderBottom: "5px solid #f48952",
        }}
      ></div>

      <Testimonials />

      <Footer />
      <div style={{ backgroundColor: "#ffffff" }}>
        <br />
        <center>
          <a href="https://www.digit.org/" target="_blank">
      <img style={{ height: "1.4em" }} src={digitLogo} />
    </a>
        </center>{" "}
        <br />
      </div>
    </div>
  );
}
export default Home;