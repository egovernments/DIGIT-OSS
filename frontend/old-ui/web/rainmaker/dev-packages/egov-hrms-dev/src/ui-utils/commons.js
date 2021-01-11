import axios from "axios";
import commonConfig from "config/common.js";
import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrl
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import {
  getTranslatedLabel
} from "../ui-config/screens/specs/utils";
import { httpRequest, uploadFile } from "../ui-utils/api";


export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return label;
    } else {
      return translatedLabel;
    }
  } else {
    return label;
  }
};

// HRMS Search API
export const getSearchResults = async (queryObject, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/egov-hrms/employees/_search",
      "",
      queryObject
    );

    response.Employees = [...response.Employees]
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
  }
};

// HRMS Create API
export const createEmployee = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/egov-hrms/employees/_create",
      "",
      queryObject,
      { Employees: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};

// HRMS Update API
export const updateEmployee = async (queryObject, payload, dispatch) => {
  try {
    const response = await httpRequest(
      "post",
      "/egov-hrms/employees/_update",
      "",
      queryObject,
      { Employees: payload }
    );
    return response;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      )
    );
    throw error;
  }
};


export const getImageUrlByFile = file => {
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      const fileurl = e.target.result;
      resolve(fileurl);
    };
  });
};

export const getFileSize = file => {
  const size = parseFloat(file.size / 1024).toFixed(2);
  return size;
};

export const isFileValid = (file, acceptedFiles) => {
  const mimeType = file["type"];
  return (
    (mimeType &&
      acceptedFiles &&
      acceptedFiles.indexOf(mimeType.split("/")[1]) > -1) ||
    false
  );
};

export const acceptedFiles = acceptedExt => {
  const splitExtByName = acceptedExt.split(",");
  const acceptedFileTypes = splitExtByName.reduce((result, curr) => {
    if (curr.includes("image")) {
      result.push("image");
    } else {
      result.push(curr.split(".")[1]);
    }
    return result;
  }, []);
  return acceptedFileTypes;
};

export const handleFileUpload = (event, handleDocument, props) => {
  const S3_BUCKET = {
    endPoint: "filestore/v1/files"
  };
  let uploadDocument = true;
  const { inputProps, maxFileSize } = props;
  const input = event.target;
  if (input.files && input.files.length > 0) {
    const files = input.files;
    Object.keys(files).forEach(async (key, index) => {
      const file = files[key];
      const fileValid = isFileValid(file, acceptedFiles(inputProps.accept));
      const isSizeValid = getFileSize(file) <= maxFileSize;
      if (!fileValid) {
        // dispatch(
        //   toggleSnackbar(
        //     true,
        //     `Only image or pdf files can be uploaded`,
        //     "error"
        //   )
        // );
        alert(`Only image or pdf files can be uploaded`);
        uploadDocument = false;
      }
      if (!isSizeValid) {
        // dispatch(
        //   toggleSnackbar(
        //     true,
        //     `Maximum file size can be ${Math.round(maxFileSize / 1000)} MB`,
        //     "error"
        //   )
        // );
        alert(`Maximum file size can be ${Math.round(maxFileSize / 1000)} MB`);
        uploadDocument = false;
      }
      if (uploadDocument) {
        if (file.type.match(/^image\//)) {
          //const imageUri = await getImageUrlByFile(file);
          const fileStoreId = await uploadFile(
            S3_BUCKET.endPoint,
            "TL",
            file,
            commonConfig.tenantId
          );
          handleDocument(file, fileStoreId);
        } else {
          const fileStoreId = await uploadFile(
            S3_BUCKET.endPoint,
            "TL",
            file,
            commonConfig.tenantId
          );
          handleDocument(file, fileStoreId);
        }
      }
    });
  }
};

const setApplicationNumberBox = (state, dispatch) => {
  let applicationNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.Licenses[0].applicationNumber",
    null
  );
  if (applicationNumber) {
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "props.number",
        applicationNumber
      )
    );
  }
};

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};


export const convertToFilestoreid = async (link) => {
  const FILESTORE = {
    endPoint: "filestore/v1/files"
  };

  var response = await axios.get(getFileUrl(link), {
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/*"
    }
  });
  // var response1 = await axios.get(getFileUrl(link), {
  //   responseType: "blob",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/*"
  //   }
  // });
  const base64 = Buffer.from(response.data, 'binary').toString('base64');


  const fileStoreId = await uploadFile(
    FILESTORE.endPoint,
    'rainmaker-pgr',
    base64,
    commonConfig.tenantId
  );
  return fileStoreId;
  // var img = new Image();
  // img.crossOrigin = "Anonymous";
  // img.onload = function () {
  //     var canvas = document.createElement("CANVAS");
  //     var ctx = canvas.getContext("2d");
  //     canvas.height = this.height;
  //     canvas.width = this.width;
  //     ctx.drawImage(this, 0, 0);
  // };
  // img.src = link;
  // const file = new Blob([response.data], { type: "application/jpeg" });
  // console.log(file,'file');
  // const fileStoreId = await uploadFile(
  //   FILESTORE.endPoint,
  //   'rainmaker-pgr',
  //   file,
  //   commonConfig.tenantId
  // );

  // const fileStoreId1 = await uploadFile(
  //   FILESTORE.endPoint,
  //   'rainmaker-pgr',
  //   img,
  //   commonConfig.tenantId
  // );
  // const fileStoreId23 = await uploadFile(
  //   FILESTORE.endPoint,
  //   'rainmaker-pgr',
  //   response1,
  //   commonConfig.tenantId
  // );
  // console.log(fileStoreId,base64,'fileStoreId',fileStoreId1,fileStoreId2,fileStoreId23);

  // const fileURL = URL.createObjectURL(file);
  // var myWindow = window.open(fileURL);
  // if (myWindow != undefined) {
  //   myWindow.addEventListener("load", event => {
  //     myWindow.focus();
  //     myWindow.print();
  //   });
  // }
}