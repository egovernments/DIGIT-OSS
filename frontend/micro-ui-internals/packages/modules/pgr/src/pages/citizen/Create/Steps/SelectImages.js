import React, { useState } from "react";
import { FormStep, ImageUploadHandler, Loader } from "@egovernments/digit-ui-react-components";

const SelectImages = ({ config, onSelect, cityCode }) => {
  const __initImages = Digit.SessionStorage.get("PGR_CREATE_IMAGES");
  const [uploadedImages, setUploadedImagesIds] = useState(__initImages ? __initImages : null);

  const handleUpload = (ids) => {
    setUploadedImagesIds(ids);
    Digit.SessionStorage.set("PGR_CREATE_IMAGES", ids);
  };

  return (
    <FormStep config={config} onSelect={() => onSelect(uploadedImages)}>
      <ImageUploadHandler tenantId={cityCode} onPhotoChange={handleUpload} />
    </FormStep>
  );
};

export default SelectImages;
