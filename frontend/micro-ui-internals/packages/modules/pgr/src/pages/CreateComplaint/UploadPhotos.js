import React, { useState } from "react";
import { Card, SubmitBar, LinkButton, ImageUploadHandler, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../constants/Localization";
import { PgrRoutes, getRoute } from "../../constants/Routes";

const UploadPhotos = (props) => {
  const { t } = useTranslation();
  const [uploadedImagesIds, setUploadedImagesIds] = useState(null);
  const [valid, setValid] = useState(true);
  const history = useHistory();

  const handleUpload = (ids) => {
    setUploadedImagesIds(ids);
  };

  function skip() {
    history.push(getRoute(props.match, PgrRoutes.Details));
  }

  function save() {
    if (uploadedImagesIds === null) {
      setValid(false);
    } else {
      props.save(uploadedImagesIds);
      history.push(getRoute(props.match, PgrRoutes.Details));
    }
  }

  return (
    <Card>
      {/* <UploadImages onUpload={getImage} onDelete={deleteImage} thumbnails={uploadedImagesThumbs ? uploadedImagesThumbs.map((o) => o.image) : []} /> */}
      <ImageUploadHandler header={t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_UPLOAD_PHOTO`)} cardText="" onPhotoChange={handleUpload} />
      {valid ? null : <CardLabelError>{t(`${LOCALIZATION_KEY.CS_ADDCOMPLAINT}_UPLOAD_ERROR_MESSAGE`)}</CardLabelError>}
      <SubmitBar label="Next" onSubmit={save} />
      {props.skip ? <LinkButton label={t(`${LOCALIZATION_KEY.CS_COMMON}_SKIP_CONTINUE`)} onClick={skip} /> : null}
    </Card>
  );
};

export default UploadPhotos;
