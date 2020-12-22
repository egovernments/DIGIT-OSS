import Urls from "../services/urls";
import Axios from "axios";

class FileStorage {
  constructor() {}
  Filestorage = async (filedata) => {
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
  };

  Filefetch = async (filesArray, tenantId) => {
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
  };

  getThumbnails = async (ids, tenantId) => {
    const res = await this.Filefetch(ids, tenantId);
    if (res.data.fileStoreIds && res.data.fileStoreIds.length !== 0) {
      return res.data.fileStoreIds.map((o) => o.url.split(",")[3]);
    } else {
      return null;
    }
  };
}

export const fileStorageService = new FileStorage();
