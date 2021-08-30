import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Carousel } from "react-responsive-carousel";
import Div from "../../ui-atoms/HtmlElements/Div";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";

class MihyCarousel extends Component {
  render() {
    const { items } = this.props;
    return (
      <Carousel showThumbs={false}>
        {items.map((item, key) => {
          return (
            <Div key={key}>
              <img src={item.src} />
              <p className="legend">{item.legend}</p>
            </Div>
          );
        })}
      </Carousel>
    );
  }
}

export default MihyCarousel;
