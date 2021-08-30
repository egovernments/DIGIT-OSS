import { INIT_FORM } from "../actionTypes";
import { toggleSnackbarAndSetText } from "redux/app/actions";
import transform from "config/forms/transformers";
import { initForm, setFieldProperty } from "redux/form/actions";
import { httpRequest } from "utils/api";
import { upperCaseFirst } from "utils/commons";
import get from "lodash/get";

const fieldInitFormMiddleware = (store) => (next) => async (action) => {
  const { type } = action;
  const dispatch = store.dispatch;
  const state = store.getState();
  if (type === INIT_FORM) {
    const { form } = action;
    const { name: formKey, fields } = form;
    let formData = null;
    try {
      Object.keys(fields).map((key) => {
        let item = fields[key];
        if (item.dataFetchConfig) {
          switch (item.type) {
            case "singleValueList":
              const dropDownData = fetchDropdownData(dispatch, item.dataFetchConfig, formKey, key);
          }
        }
      });
    } catch (error) {
      const { message } = error;
      dispatch(toggleSnackbarAndSetText(true, message, true));
      return;
    }
  }
  next(action);
};

const fetchDropdownData = async (dispatch, dataFetchConfig, formKey, fieldKey) => {
  const { url, action, requestBody } = dataFetchConfig;
  try {
    const payloadSpec = await httpRequest(url, action, [], requestBody);
    let dropdownData = get(payloadSpec, dataFetchConfig.dataPath);
    const ddData = dropdownData.reduce((ddData, item) => {
      ddData.push({ label: item.name, value: item.code });
      return ddData;
    }, []);
    dispatch(setFieldProperty(formKey, fieldKey, "dropDownData", ddData));
  } catch (error) {
    const { message } = error;
    dispatch(toggleSnackbarAndSetText(true, message, true));
    return;
  }
};

export default fieldInitFormMiddleware;
