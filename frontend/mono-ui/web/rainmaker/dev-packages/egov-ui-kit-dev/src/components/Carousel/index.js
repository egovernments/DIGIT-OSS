import React from "react";
import Swiper from "react-id-swiper";
import styles from "react-id-swiper/src/styles/css/swiper.css";
import "./index.css";

const CarouselUI = ({ items }) => {
  const params = {
    slidesPerView: 3,
    spaceBetween: -50,
    freeMode: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  };
  return (
    <Swiper {...params}>
      {items.map((item, index) => {
        return <div key={index}>{item}</div>;
      })}
    </Swiper>
  );
};

export default CarouselUI;
