import React, { useState } from "react";
import { FormStep, ImageUploadHandler, Loader } from "@egovernments/digit-ui-react-components";

const SelectImages = ({ t, config, onSelect, onSkip }) => {
  const __initImages = Digit.SessionStorage.get("PGR_CREATE_IMAGES");
  const [uploadedImages, setUploadedImagesIds] = useState(__initImages ? __initImages : null);

  const handleUpload = (ids) => {
    setUploadedImagesIds(ids);
    Digit.SessionStorage.set("PGR_CREATE_IMAGES", ids);
  };

  // const onSkip = () => onSelect();
  const handleSubmit = () => {
    if (!uploadedImages || uploadedImages.length === 0) return onSkip();
    const _uploadImages = uploadedImages.map((url) => ({
      documentType: "PHOTO",
      fileStore: url,
      documentUid: "",
      additionalDetails: {},
    }));
    onSelect({ uploadedImages: _uploadImages });
  };

  return (
    <FormStep config={config} onSelect={handleSubmit} onSkip={onSkip} t={t}>
      <ImageUploadHandler onPhotoChange={handleUpload} />
    </FormStep>
  );
};

export default SelectImages;
