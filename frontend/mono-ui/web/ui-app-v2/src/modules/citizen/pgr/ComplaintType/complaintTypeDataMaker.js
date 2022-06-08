import set from "lodash/set";

export const getNestedObjFormat = (categories) => {
  let categoryList = {};
  Object.values(categories).map((item) => {
    set(categoryList, item.menuPath && item.menuPath.trim().length ? item.menuPath + "." + item.serviceCode : item.serviceCode, item);
  });
  return transform(categoryList);
};

const transform = (input) => {
  return Object.keys(input).reduce((result, itemKey) => {
    const item = Object.assign({}, input[itemKey]);
    const nestedItemKeys = Object.keys(item).filter((childItemKey) => item[childItemKey] && typeof item[childItemKey] === "object");
    const nestedItems = nestedItemKeys.map((key) => completeDetails(item[key], key));
    nestedItemKeys.forEach((key) => delete item[key]);
    item.nestedItems = transform(nestedItems, []);
    result.push(completeDetails(item, itemKey));
    return result;
  }, []);
};

// currently icon hardcoded to accumulation of litter but it should be dynamically formed
const completeDetails = (item, key) => {
  return Object.assign({}, item, {
    id: item.text || key,
    text: item.text || key,
    displayKey: (item.text && "SERVICEDEFS." + item.id.toUpperCase()) || "SERVICEDEFS." + key.toUpperCase(),
    icon: (item.menuPath && item.menuPath.toLowerCase()) || key.toLowerCase().replace(/\\s+/, "-"),
  });
};
