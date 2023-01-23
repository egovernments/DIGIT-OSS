import React, { useCallback, useEffect, useState } from "react";

export const ViewImages = (props) => {
    const [uploadedImagesThumbs, setUploadedImagesThumbs] = useState(null);
    const [uploadedImagesIds, setUploadedImagesIds] = useState(props.fileStoreIds);

    useEffect(() => {
        setUploadedImagesIds(props.fileStoreIds)
    }, [props.fileStoreIds]);

    useEffect(() => {
        (async () => {
            if (uploadedImagesIds !== null) {
                await submit();
            }
        })();
    }, [uploadedImagesIds]);

    function addImageThumbnails(thumbnailsData) {
        var keys = Object.keys(thumbnailsData.data);
        var index = keys.findIndex((key) => key === "fileStoreIds");
        if (index > -1) {
            keys.splice(index, 1);
        }
        var thumbnails = [];

        const newThumbnails = keys.map((key) => {
            return { image: thumbnailsData.data[key].split(",")[2], key, fullImage: Digit.Utils.getFileUrl(thumbnailsData.data[key]) };
        });
        setUploadedImagesThumbs([...thumbnails, ...newThumbnails]);
    }

    const submit = useCallback(async () => {
        if (uploadedImagesIds !== null && uploadedImagesIds.length > 0) {
            const res = await Digit.UploadServices.Filefetch(uploadedImagesIds, props.tenantId);
            addImageThumbnails(res);
        }
    }, [uploadedImagesIds]);

    return (
        <React.Fragment>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {uploadedImagesThumbs?.map((thumbnail, index) => {
                    return (
                        <div key={index} style={{ minWidth: '160px', marginRight: '8px', marginBottom: '8px', maxWidth: '200px' }}>
                            <img src={thumbnail.image} alt="uploaded thumbnail" onClick={() => props.onClick(thumbnail.fullImage, index)} />
                        </div>
                    );
                })}
            </div>
        </React.Fragment>
    );
};