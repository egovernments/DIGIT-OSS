import { prepareFormData, getTenantForLatLng } from "egov-ui-kit/utils/commons";
import {
  getTenantId,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";

const updateComplaintStatus = (state, form) => {
  const formData = prepareFormData(form);
  const serviceRequestId = decodeURIComponent(
    window.location.pathname.split("/").pop()
  );
  const complaint = state.complaints.byId[serviceRequestId];
  if (!formData.services) {
    formData.services = [];
    formData.services[0] = complaint;
  } else {
    formData.services[0] = { ...formData.services[0], ...complaint };
  }
  return formData;
};

const filterObjByKey = (obj, predicate) => {
  return Object.keys(obj)
    .filter(key => predicate(key))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});
};

const transformer = (formKey, form = {}, state = {}) => {
  const transformers = {
    assignComplaint: () => {
      const formData = prepareFormData(form);
      const serviceRequestId = decodeURIComponent(
        window.location.pathname.split("/").pop()
      );
      const serviceData = state.complaints.byId[serviceRequestId];
      var filteredServiceData = filterObjByKey(
        serviceData,
        key => key !== "actions"
      );
      if (!formData.services) formData.services = [];
      formData.services[0] = filteredServiceData;
      return formData;
    },
    comment: () => {
      const formData = prepareFormData(form);
      const serviceRequestId = decodeURIComponent(
        window.location.pathname.split("/").pop()
      );
      const serviceData = state.complaints.byId[serviceRequestId];
      var filteredServiceData = filterObjByKey(
        serviceData,
        key => key !== "actions"
      );
      if (!formData.services) formData.services = [];
      formData.services[0] = filteredServiceData;
      return formData;
    },
    requestReassign: () => {
      return updateComplaintStatus(state, form);
    },
    reopenComplaint: () => {
      return updateComplaintStatus(state, form);
    },
    feedback: () => {
      return updateComplaintStatus(state, form);
    },
    rejectComplaint: () => {
      return updateComplaintStatus(state, form);
    },
    complaintResolved: () => {
      return updateComplaintStatus(state, form);
    },
    profile: () => {
      const { fields } = form;
      let { userInfo: user } = state.auth;
      user = {
        ...user,
        name: fields.name.value,
        permanentCity: fields.city.value,
        emailId: fields.email.value
      };
      const photos = form.files && form.files["photo"];
      let photo = (photos && photos.length && photos[0]) || null;
      photo = photo ? photo.fileStoreId || photo.imageUri : null;
      user = { ...user, photo };
      return { user };
    },
    profileEmployee: () => {
      const { fields } = form;
      let { userInfo: user } = state.auth;
      user = {
        ...user,
        name: fields.name.value,
        mobileNumber: fields.phonenumber.value,
        emailId: fields.email.value
      };
      const photos = form.files && form.files["photo"];
      let photo = (photos && photos.length && photos[0]) || null;
      photo = photo ? photo.fileStoreId || photo.imageUri : null;
      user = { ...user, photo };
      return { user };
    },
    otp: () => {
      const { previousRoute } = state.app;
      const { fields: otpFields } = form;
      let fields;

      if (previousRoute.endsWith("register")) {
        fields = state.form["register"].fields;
        fields = {
          ...otpFields,
          username: {
            jsonPath: "User.username",
            value: fields.phone.value
          },
          name: {
            jsonPath: "User.name",
            value: fields.name.value
          },
          tenantId: {
            jsonPath: "User.tenantId",
            value: fields.city.value
          }
        };
      } else if (previousRoute.endsWith("login")) {
        fields = state.form["login"].fields;
        fields = {
          password: {
            jsonPath: "login.password",
            value: otpFields.otp.value
          },
          username: {
            jsonPath: "login.username",
            value: fields.phone.value
          }
        };
      }
      return prepareFormData({ ...form, fields });
    },
    employeeOTP: () => {
      const formData = prepareFormData(form);
      const commonConfig = require("config/common").default;
      formData.tenantId = commonConfig.tenantId;
      const { fields } = state.form.employeeForgotPasswd || {};

      formData.userName = fields.username.value;
      return formData;
    },
    employeeChangePassword: () => {
      const formData = prepareFormData(form);
      const tenantId = getTenantId();
      formData.tenantId = tenantId;
      return formData;
    },
    complaint: async () => {
      const formData = prepareFormData(form);
      const userInfo = getUserInfo();
      const isNative = localStorageGet("isNative");
      let userPhone = null;
      let userRole = null;
      try {
        userPhone = JSON.parse(userInfo).mobileNumber;
        userRole = JSON.parse(userInfo).roles[0].code;
        formData.services[0].source =
          userRole === "CITIZEN" ? (isNative ? "mobileapp" : "web") : "";
        formData.services[0].phone = userPhone;
      } catch (error) {}

      try {
        const { latitude, longitude } = form.fields;
        const tenantId = await getTenantForLatLng(
          latitude.value,
          longitude.value
        );
        formData.services[0].tenantId = tenantId;
      } catch (error) {
        throw new Error(error.message);
      }
      return formData;
    }
  };

  if (formKey in transformers) {
    try {
      return transformers[formKey]();
    } catch (error) {
      throw new Error(error.message);
    }
  } else {
    return prepareFormData(form);
  }
};

export default transformer;
