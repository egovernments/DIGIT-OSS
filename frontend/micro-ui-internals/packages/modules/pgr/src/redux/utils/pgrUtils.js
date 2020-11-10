// export const GetCityLocalizationKeysFromPGR = (cityTenants) => {
//   let cityDropDownList = GetCityLocatizationKeys(
//     cityTenants.filter((tenant) => {
//       return tenant.code === "PGR";
//     })[0]
//   );
//   return cityDropDownList;
// };

// const GetCityLocatizationKeys = (citykeys) => {
//   let keys = [];
//   citykeys.tenants.forEach((tenant) => {
//     const code = tenant.code.replace(".", "_").toUpperCase();
//     const city = code.split("_")[1];
//     keys.push({ city, key: "TENANT_TENANTS_" + code });
//   });
//   return keys;
// };

// export const GetLocalityLocalizationKeysFromPGR = (code, boundaries, pgrKeys) => {
//   console.log("code-->", code);
//   let key = "";
//   return boundaries.reduce((obj, item) => {
//     key = code + "_" + item.code;
//     return { ...obj, [key]: pgrKeys[key] };
//   }, {});
// };

// export const GetLocalityDropDownList = (localitiesMap) => {
//   let localityNames = [];
//   for (let key in localitiesMap) {
//     localityNames.push({ key, value: localitiesMap[key] });
//   }
//   return localityNames;
// };
