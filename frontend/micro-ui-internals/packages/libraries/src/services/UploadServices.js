import Axios from "axios";

export const UploadServices = {
  Filestorage: async (filedata) => {
    const formData = new FormData();

    formData.append("file", filedata, filedata.name);
    formData.append("tenantId", "pb.amritsar");
    formData.append("module", "property-upload");
    var config = {
      method: "post",
      url: "/filestore/v1/files",
      data: formData,
    };

    return await Axios(config);
  },

  Filefetch: async (filesArray, tenantId) => {
    var config = {
      method: "get",
      url: "/filestore/v1/files/url",
      params: {
        tenantId: tenantId,
        fileStoreIds: filesArray.join(","),
      },
    };
    return await Axios(config);
  },
};
