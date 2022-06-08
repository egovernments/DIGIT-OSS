import get from "lodash/get";
import set from "lodash/set";
export const setServiceCategory = (businessServiceData, dispatch, state, setCategory = true) => {
  String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
  };
  let nestedServiceData = {};
  businessServiceData.forEach((item) => {
    if (item.code.includes("BILLINGSERVICE_BUSINESSSERVICE_")) {
      let str = item.code.replace("BILLINGSERVICE_BUSINESSSERVICE_", "");
      var frags = str.split("_");
      for (let i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].toLowerCase().slice(1);
      }
      frags[0] = frags[0].toUpperCase();
      item.code = frags.join("_");
      item.code = item.code.replaceAt(item.code.indexOf("_"), ".");
    }
    if (item.code && item.code.indexOf(".") > 0) {
      if (nestedServiceData[item.code.split(".")[0]]) {
        let child = get(nestedServiceData, `${item.code.split(".")[0]}.child`, []);
        child.push(item);
        set(nestedServiceData, `${item.code.split(".")[0]}.child`, child);
      } else {
        set(nestedServiceData, `${item.code.split(".")[0]}.code`, item.code.split(".")[0]);
        set(nestedServiceData, `${item.code.split(".")[0]}.child[0]`, item);
      }
    } else {
      set(nestedServiceData, `${item.code}`, item);
    }
  });

  let serviceCategories = Object.values(nestedServiceData).filter((item) => item.code);
  return serviceCategories;
};
