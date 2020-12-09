import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CardHeader from "./CardHeader";
import CardText from "./CardHeader";
import UploadImages from "./UploadImages";
// import { Filestorage, Filefetch } from "../@egovernments/digit-utils/services/Filestorage";

export const ImageUploadHandler = (props) => {
  const { t } = useTranslation();
  const __initImageIds = Digit.SessionStorage.get("PGR_CREATE_IMAGES");
  const __initThumbnails = Digit.SessionStorage.get("PGR_CREATE_THUMBNAILS");
  const [image, setImage] = useState(null);
  const [uploadedImagesThumbs, setUploadedImagesThumbs] = useState(__initThumbnails ? __initThumbnails : null);
  const [uploadedImagesIds, setUploadedImagesIds] = useState(__initImageIds ? __initImageIds : null);
  const [rerender, setRerender] = useState(1);

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
        props.onPhotoChange(uploadedImagesIds);
      }
    })();
  }, [uploadedImagesIds]);

  useEffect(() => {
    console.log("uploaded image thmbs are ehher", uploadedImagesThumbs);
    Digit.SessionStorage.set("PGR_CREATE_THUMBNAILS", uploadedImagesThumbs);
  }, [uploadedImagesThumbs]);

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

  const uploadImage = useCallback(async () => {
    const response = await Digit.UploadServices.Filestorage(image);
    setUploadedImagesIds(addUploadedImageIds(response));
  }, [addUploadedImageIds, image]);

  function addImageThumbnails(thumbnailsData) {
    var keys = Object.keys(thumbnailsData.data);
    var index = keys.findIndex((key) => key === "fileStoreIds");
    if (index > -1) {
      keys.splice(index, 1);
    }
    var thumbnails = [];
    if (uploadedImagesThumbs !== null) {
      thumbnails = uploadedImagesThumbs;
    }
    setUploadedImagesThumbs([...thumbnails, { image: thumbnailsData.data[keys[0]].split(",")[2], key: keys[0] }]);
  }

  function getImage(e) {
    if (e.target.files[0] && e.target.files[0].size > 2097152) {
      alert("File is too big!");
    } else {
      setImage(e.target.files[0]);
    }
  }

  const submit = useCallback(async () => {
    if (uploadedImagesIds !== null) {
      const res = await Digit.UploadServices.Filefetch([uploadedImagesIds[uploadedImagesIds.length - 1]], "pb.amritsar");
      addImageThumbnails(res);
    }
  }, [uploadedImagesIds]);

  // function getImage(e) {
  //   setImage(e.target.files[0]);
  // }

  function deleteImage(img) {
    console.log("to delte ", img);
    var deleteImageKey = uploadedImagesThumbs.filter((o, index) => o.image === img);
    console.log("to delte ", deleteImageKey);

    var uploadedthumbs = uploadedImagesThumbs;
    var newThumbsList = uploadedthumbs.filter((thumbs) => thumbs != deleteImageKey[0]);
    // var thumbs = uploadedImagesThumbs.filter((o, index) => o.image !== img);

    var newUploadedImagesIds = uploadedImagesIds.filter((key) => key != deleteImageKey[0].key);
    // setUploadedImagesIds(newUploadedImagesIds)
    setUploadedImagesThumbs(newThumbsList);
    // if (index > -1) {
    //   var arr = uploadedImagesIds;
    //   arr.splice(index, 1);
    //   setUploadedImagesIds(arr);
    // }

    // var thumbs = uploadedImagesThumbs;

    // console.log(deleteImageKey);
    // console.log(thumbs);
    // thumbs.splice(deleteImageKey[1], 1);
    // setUploadedImagesThumbs(thumbs);
    // setRerender(rerender + 1);
  }

  return (
    // <Card>
    <React.Fragment>
      <UploadImages onUpload={getImage} onDelete={deleteImage} thumbnails={uploadedImagesThumbs ? uploadedImagesThumbs.map((o) => o.image) : []} />
    </React.Fragment>
  );
};
