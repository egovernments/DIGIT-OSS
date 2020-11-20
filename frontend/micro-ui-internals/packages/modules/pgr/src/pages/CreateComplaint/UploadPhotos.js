import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardText, SubmitBar, UploadImages, LinkButton, ImageUploadHandler } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../constants/Localization";

const UploadPhotos = (props) => {
  const { t } = useTranslation();
  const [uploadedImagesIds, setUploadedImagesIds] = useState(null);

  const handleUpload = (ids) => {
    setUploadedImagesIds(ids);
  };

  return (
    <Card>
      {/* <UploadImages onUpload={getImage} onDelete={deleteImage} thumbnails={uploadedImagesThumbs ? uploadedImagesThumbs.map((o) => o.image) : []} /> */}
      <ImageUploadHandler header={t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_UPLOAD_PHOTO`)} cardText="" onPhotoChange={handleUpload} />
      {console.log("uploadedImagesIds:", uploadedImagesIds)}
      <Link to="/create-complaint/details" onClick={() => props.save(uploadedImagesIds)}>
        <SubmitBar label="Next" />
      </Link>
      {props.skip ? (
        <Link to="/create-complaint/details">
          <LinkButton label={t(`${LOCALIZATION_KEY.CS_COMMON}_SKIP_CONTINUE`)} />
        </Link>
      ) : null}
    </Card>
  );
};

export default UploadPhotos;
