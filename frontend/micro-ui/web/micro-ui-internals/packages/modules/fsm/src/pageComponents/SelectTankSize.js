import React, { useEffect, useState } from "react";
import { FormStep, PitDimension, ImageUploadHandler } from "@egovernments/digit-ui-react-components";
import Timeline from "../components/TLTimelineInFSM";

const isConventionalSpecticTank = (tankDimension) => tankDimension === "lbd";

const SelectTankSize = ({ config, onSelect, t, formData = {}, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const tankDimension = formData?.pitType?.dimension;
  const [disable, setDisable] = useState(true);
  const [images, setImages] = useState(formData?.pitDetail?.images || null);
  const [size, setSize] = useState();

  useEffect(() => {
    if (!formData?.pitType && userType !== "employee") {
      onSelect(config.key, {}, true);
    }
  }, []);

  useEffect(() => {
    if (isConventionalSpecticTank(tankDimension)) {
      setSize({ ...formData?.pitDetail, diameter: 0, ...(formData?.pitDetail?.length === 0 && { height: 0 }) });
    } else {
      setSize({ ...formData?.pitDetail, length: 0, width: 0, ...(formData?.pitDetail?.diameter === 0 && { height: 0 }) });
    }
    if (formData && formData.pitDetail) {
      setImages(formData?.pitDetail?.images || null)
    }
  }, [tankDimension]);

  useEffect(() => {
    if (images && images.length) {
      setDisable(false);
    }
  }, [images]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (!isNaN(value)) {
      setSize((prev) => ({ ...prev, [name]: value }));
      if (userType === "employee") {
        setTimeout(onSelect(config.key, { ...size, [name]: value }));
      }
    }
  };

  const handleSubmit = () => {
    onSelect(config.key, { images: images });
  };

  const handleUpload = (ids) => {
    setImages(ids);
  };

  const onSkip = () => onSelect();
  if (userType === "employee") {
    return <PitDimension sanitationType={formData.pitType} size={size} handleChange={handleChange} t={t} disable={!formData?.pitType} />;
  }

  return (
    <React.Fragment>
      <Timeline currentStep={1} flow="APPLY" />
      <FormStep config={config} onSkip={onSkip} onSelect={handleSubmit} isDisabled={disable} t={t}>
        <ImageUploadHandler
          tenantId={tenantId}
          onPhotoChange={handleUpload}
          uploadedImages={images}
        />
      </FormStep>
    </React.Fragment>
  );
};

function getPitDetail(pitDetail = {}, tankDimension) {
  let detail = { ...pitDetail };
  if (pitDetail) {
    if (tankDimension === "lbd") {
      detail = { length: pitDetail?.length || "", width: pitDetail?.width || "", height: pitDetail?.height || "" };
    } else {
      detail = { diameter: pitDetail?.diameter || "", height: pitDetail?.height || "" };
    }
  } else {
    if (tankDimension === "lbd") {
      detail = { length: "", width: "", height: "" };
    } else {
      detail = { diameter: "", height: "" };
    }
  }
  return detail;
}

export default SelectTankSize;
