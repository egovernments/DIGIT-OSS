export const getPropertyTypeLocale = (value) => {
  return `PROPERTYTYPE_MASTERS_${value?.split(".")[0]}`;
};

export const getPropertySubtypeLocale = (value) => `PROPERTYTYPE_MASTERS_${value}`;

export const getVehicleType = (vehicle, t) => {
  return (vehicle?.i18nKey && vehicle?.capacity && `${t(vehicle.i18nKey)} - ${vehicle.capacity} ${t("CS_COMMON_CAPACITY_LTRS")}`) || null;
};

export const updateConfiguration = ({ config, defaultConfig, detailsConfig, customConfiguration, isDefaultConfig }) => {
  const fieldSectionNamesInsideConfig = [];
  const detailsConfigCopy = { ...detailsConfig };

  customConfiguration.forEach((detail) => {
    // Adding custom fields to FieldSection fields array (body)
    if (detailsConfigCopy[detail.name] && detail.addFields) {
      detailsConfigCopy[detail.name].body.push(...detail.addFields);
    }

    let body = [];

    // adding fields to body array
    if (detail?.fieldsOrder?.length > 0) {
      // fields order
      detail.fieldsOrder.forEach((fieldName) => {
        if (detailsConfigCopy[detail.name]) {
          body.push(detailsConfigCopy[detail.name].body.find((value) => value.name === fieldName));
        }
      });

      // adding remaining fields to the body array which are not in detail?.fieldsOrder
      if (detail?.allFields) {
        detailsConfigCopy[detail.name]?.body?.forEach((field) => {
          if (!detail?.fieldsOrder?.includes(field.name)) {
            body.push(detailsConfigCopy[detail.name].body.find((value) => value.name === field.name));
          }
        });
      }
    } else {
      body = detailsConfigCopy[detail.name].body;
    }

    // remove fields
    if (detail?.removeFields) {
      detail?.removeFields?.forEach((fieldName) => {
        body = body.filter((field) => field.name !== fieldName);
      });
    }

    // adding FieldSection to config
    if (detailsConfigCopy[detail.name]) {
      config.push({
        head: detailsConfigCopy[detail.name].head,
        body,
      });
      fieldSectionNamesInsideConfig.push(detail.name);
    }
  });

  // adding remaining FieldSection to config
  if (isDefaultConfig) {
    defaultConfig?.forEach((fieldSectionName) => {
      if (!fieldSectionNamesInsideConfig.includes(fieldSectionName) && detailsConfigCopy[fieldSectionName]) {
        config.push(detailsConfigCopy[fieldSectionName]);
        fieldSectionNamesInsideConfig.push(fieldSectionName);
      }
    });
  }
};

export const checkForEmployee = (roles) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const userInfo = Digit.UserService.getUser();
  let rolesArray = [];

  const rolearray = userInfo?.info?.roles.filter((item) => {
    for (let i = 0; i < roles.length; i++) {
      if (item.code == roles[i] && item.tenantId === tenantId) rolesArray.push(true);
    }
  });

  return rolesArray?.length;
};

/* methid to get date from epoch */
export const convertEpochToDate = (dateEpoch) => {
  // Returning null in else case because new Date(null) returns initial date from calender
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
};

// How to use above updateConfiguration function
// let config = [];

// const defaultConfig = ["applicationDetails", "propertyDetails", "locationDetails", "paymentDetails"];

// const { Customizations } = window.Digit;
// let employeeCustomizations = false;

// if (Customizations?.FSM?.getEmployeeApplicationCustomization) {
//   employeeCustomizations = Customizations?.FSM?.getEmployeeApplicationCustomization(defaultConfig, t);
// }

// if (employeeCustomizations?.config?.length > 0) {
//   updateConfiguration({
//     config,
//     defaultConfig,
//     detailsConfig,
//     customConfiguration: employeeCustomizations?.config,
//     isDefaultConfig: employeeCustomizations?.defaultConfig,
//   });
// } else {
//   defaultConfig.forEach((fieldSectionName) => config.push(detailsConfig[fieldSectionName]));
// }
