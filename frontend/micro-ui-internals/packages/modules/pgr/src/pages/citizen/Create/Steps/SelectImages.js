import React, { useState } from "react";
import { FormStep, ImageUploadHandler, Loader } from "@egovernments/digit-ui-react-components";

const SelectImages = ({ config, onSelect }) => {
  const [uploadedImages, setUploadedImagesIds] = useState(null);

  const handleUpload = (ids) => {
    setUploadedImagesIds(ids);
  };

  return (
    <FormStep config={config} onSelect={() => onSelect(uploadedImages)}>
      <ImageUploadHandler onPhotoChange={handleUpload} />
    </FormStep>
  );
};

export default SelectImages;
