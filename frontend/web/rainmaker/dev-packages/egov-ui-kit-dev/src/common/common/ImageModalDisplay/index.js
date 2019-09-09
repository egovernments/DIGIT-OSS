import React from "react";
import { ImageModal } from "components";

const ImageModalDisplay = ({ history, location }) => {
  // very bad way to do it!! temp fix only
  const imageSource = location.search.replace("?source=", "");
  return <ImageModal imageSource={imageSource} onCloseClick={() => history.goBack()} />;
};

export default ImageModalDisplay;
