import Axios from "axios";
import { Storage } from "./Storage";

Axios.interceptors.request.use((req) => {
  document.body.classList.add("loader");
  return req;
});

Axios.interceptors.response.use((res) => {
  document.body.classList.remove("loader");
  return res;
});

export const Request = async ({ method = "POST", url, data = {}, useCache = false, params = {} }) => {
  let key = "";
  if (method.toUpperCase() === "POST") {
    data.RequestInfo = {
      apiId: "Rainmaker",
    };
  }
  if (useCache) {
    key = `${method.toUpperCase()}.${url}.${JSON.stringify(params, null, 0)}.${JSON.stringify(data, null, 0)}`;
    const value = Storage.get(key);
    if (value) {
      return value;
    }
  } else {
    params._ = Date.now();
  }

  const res = await Axios({ method, url, data, params });
  if (useCache) {
    Storage.set(key, res.data);
  }

  return res.data;
};
