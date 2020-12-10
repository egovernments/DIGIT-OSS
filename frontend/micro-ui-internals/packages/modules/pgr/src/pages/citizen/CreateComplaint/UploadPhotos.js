import React, { useState } from "react";
import { Card, SubmitBar, LinkButton, ImageUploadHandler, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LOCALIZATION_KEY } from "../../../constants/Localization";
import { PgrRoutes, getRoute } from "../../../constants/Routes";

const UploadPhotos = (props) => {
  const { t } = useTranslation();
  const [uploadedImagesIds, setUploadedImagesIds] = useState(null);
  const [valid, setValid] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

  useEffect(() => {
    (async () => {
      if (uploadedImagesIds !== null) {
        await submit();
        setRerender(rerender + 1);
      }
    })();
  }, [uploadedImagesIds]);

  function addUploadedImageIds(imageIdData) {
    if (uploadedImagesIds === null) {
      var arr = [];
    } else {
      arr = uploadedImagesIds;
    }
    return [...arr, imageIdData.data.files[0].fileStoreId];
  }
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
      setImage(e.target.files[0]);
    }
  }

  async function uploadImage() {
    const response = await Digit.UploadServices.Filestorage(image);
    setUploadedImagesIds(addUploadedImageIds(response));
  }

  async function submit() {
    if (uploadedImagesIds !== null) {
      const res = await Digit.UploadServices.Filefetch([uploadedImagesIds[uploadedImagesIds.length - 1]], "pb.amritsar");
      addImageThumbnails(res);
    }
  }

  function deleteImage(img) {
    var deleteImageKey;
    uploadedImagesThumbs.flatMap((o, index) => {
      if (o.image === img) {
        deleteImageKey = [o.key, index];
      }
    });

    var index = uploadedImagesIds.findIndex((key) => key === deleteImageKey[0]);

    if (index > -1) {
      var arr = uploadedImagesIds;
      arr.splice(index, 1);
      setUploadedImagesIds(arr);

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
      {props.skip ? <LinkButton label={t(`${LOCALIZATION_KEY.CORE_COMMON}_SKIP_CONTINUE`)} onClick={skip} /> : null}
    </Card>
  );
};

export default UploadPhotos;
