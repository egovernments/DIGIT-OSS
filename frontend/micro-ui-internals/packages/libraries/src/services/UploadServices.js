import Axios from "axios";
import Urls from "./urls";
export const UploadServices = {
  Filestorage: async (filedata) => {
    const formData = new FormData();

    formData.append("file", filedata, filedata.name);
    formData.append("tenantId", "pb.amritsar");
    formData.append("module", "property-upload");
    var config = {
      method: "post",
      url: Urls.FileStore,
      data: formData,
    };

    return await Axios(config);
  },

  Filefetch: async (filesArray, tenantId) => {
    var config = {
      method: "get",
      url: Urls.FileFetch,
      params: {
        tenantId: tenantId,
        fileStoreIds: filesArray.join(","),
      },
    };
    const res = await Axios(config);
    return res;
  },
};
