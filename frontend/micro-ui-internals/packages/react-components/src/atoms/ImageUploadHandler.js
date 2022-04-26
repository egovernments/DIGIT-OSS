import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Toast from "./Toast";
import UploadImages from "./UploadImages";

export const ImageUploadHandler = (props) => {
  // const __initImageIds = Digit.SessionStorage.get("PGR_CREATE_IMAGES");
  // const __initThumbnails = Digit.SessionStorage.get("PGR_CREATE_THUMBNAILS");
  const [image, setImage] = useState(null);
  const [uploadedImagesThumbs, setUploadedImagesThumbs] = useState(null);
  const [uploadedImagesIds, setUploadedImagesIds] = useState(props.uploadedImages);

  const [rerender, setRerender] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

  useEffect(() => {
    if (!isDeleting) {
      (async () => {
        if (uploadedImagesIds !== null) {
          await submit();
          setRerender(rerender + 1);
          props.onPhotoChange(uploadedImagesIds);
        }
      })();
    } else {
      setIsDeleting(false);
    }
  }, [uploadedImagesIds]);

  useEffect(() => {
    if (imageFile && imageFile.size > 2097152) {
      setError("File is too large");
    } else {
      setImage(imageFile);
    }
  }, [imageFile]);

  const addUploadedImageIds = useCallback(
    (imageIdData) => {
      if (uploadedImagesIds === null) {
        var arr = [];
      } else {
        arr = uploadedImagesIds;
      }
      return [...arr, imageIdData.data.files[0].fileStoreId];
    },
    [uploadedImagesIds]
  );

  function getImage(e) {
    setError(null);
    setImageFile(e.target.files[0]);
  }

  const uploadImage = useCallback(async () => {
    const response = await Digit.UploadServices.Filestorage("property-upload", image, props.tenantId);
    setUploadedImagesIds(addUploadedImageIds(response));
  }, [addUploadedImageIds, image]);

  function addImageThumbnails(thumbnailsData) {
    var keys = Object.keys(thumbnailsData.data);
    var index = keys.findIndex((key) => key === "fileStoreIds");
    if (index > -1) {
      keys.splice(index, 1);
    }
    var thumbnails = [];
    // if (uploadedImagesThumbs !== null) {
    //   thumbnails = uploadedImagesThumbs.length > 0 ? uploadedImagesThumbs.filter((thumb) => thumb.key !== keys[0]) : [];
    // }

    const newThumbnails = keys.map((key) => {
      return { image: thumbnailsData.data[key].split(",")[2], key };
    });

    setUploadedImagesThumbs([...thumbnails, ...newThumbnails]);
  }

  const submit = useCallback(async () => {
    if (uploadedImagesIds !== null && uploadedImagesIds.length > 0) {
      const res = await Digit.UploadServices.Filefetch(uploadedImagesIds, props.tenantId);
      addImageThumbnails(res);
    }
  }, [uploadedImagesIds]);

  function deleteImage(img) {
    setIsDeleting(true);
    var deleteImageKey = uploadedImagesThumbs.filter((o, index) => o.image === img);

    var uploadedthumbs = uploadedImagesThumbs;
    var newThumbsList = uploadedthumbs.filter((thumbs) => thumbs != deleteImageKey[0]);

    var newUploadedImagesIds = uploadedImagesIds.filter((key) => key !== deleteImageKey[0].key);
    setUploadedImagesThumbs(newThumbsList);
    setUploadedImagesIds(newUploadedImagesIds);
    Digit.SessionStorage.set("PGR_CREATE_IMAGES", newUploadedImagesIds);
  }

  return (
    <React.Fragment>
      {error && <Toast error={true} label={error} onClose={() => setError(null)} />}
      <UploadImages onUpload={getImage} onDelete={deleteImage} thumbnails={uploadedImagesThumbs ? uploadedImagesThumbs.map((o) => o.image) : []} />
    </React.Fragment>
  );
};
