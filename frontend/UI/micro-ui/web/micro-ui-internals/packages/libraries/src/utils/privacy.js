/**
 * Contains all utils used for Privacy
 *
 * @author jagankumar-egov
 *
 *  Feature :: Privacy
 */

/**
 * Custom util to get the privacy object of current screen
 *
 * @author jagankumar-egov
 *
 * @example
 *  Digit.Utils.getPrivacyObject()
 *
 * @returns {object} Returns the privacy object
 */
export const getPrivacyObject = () => {
  const privacyObj = getAllPrivacyObject();
  return privacyObj?.[window.location.pathname] || {};
};

/**
 * Custom util to get the complete privacy object.
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Utils.getAllPrivacyObject()
 *
 * @returns {object} Returns the key value pair of privacy object in every screens
 */
export const getAllPrivacyObject = () => {
  return Digit.SessionStorage.get("PRIVACY_OBJECT") || {};
};

/**
 * Custom util to update the privacy object.
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Utils.setPrivacyObject({})
 *
 */
export const setPrivacyObject = (updatedPrivacyValue = {}) => {
  return Digit.SessionStorage.set("PRIVACY_OBJECT", { ...updatedPrivacyValue });
};

/**
 * Main Util to update the privacy
 *
 * @author jagankumar-egov
 *
 * Feature :: Privacy
 *
 * @example
 *    Digit.Utils.updatePrivacy(uuid, fieldName)
 *
 * @returns {object} Returns the updated privacy object
 */
export const updatePrivacy = (uuid, fieldName) => {
  const privacyObj = Digit.Utils.getAllPrivacyObject();
  const plainRequestFields =
    privacyObj?.[window.location.pathname]?.recordId === uuid ? privacyObj?.[window.location.pathname]?.plainRequestFields || [] : [];
  const newObj = {
    ...privacyObj,
    [window.location.pathname]: { recordId: uuid, plainRequestFields: Array.isArray(fieldName) ? [...fieldName, ...plainRequestFields]  : [fieldName, ...plainRequestFields] },
  };
  Digit.Utils.setPrivacyObject({ ...newObj });
  return newObj;
};

/**
 * Core Component Logic for showing the unmask button and for which fields will be controlled by
 *  mdms ->  DataSecurity -> SecurityPolicy.json
 *
 * @author jagankumar-egov
 *
 * Feature :: Privacy
 *
 * @example
 *  Digit.Utils.checkPrivacy(mdmsObj, privacyDetail)
 *
 * @returns {boolean} Returns the show or hide in boolean type
 */

export const checkPrivacy = (mdmsObj, privacyDetail) => {
  if (mdmsObj?.attributes?.some((ele) => (ele?.name === privacyDetail?.fieldName || privacyDetail?.fieldName?.includes(ele?.name) )&& ele?.defaultVisibility === "MASKED")) {
    return true;
  }
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);
  if (
    mdmsObj?.roleBasedDecryptionPolicy?.some(
      (ele) =>
        ele?.roles?.some((e) => userRoles?.includes(e)) &&
        ele?.attributeAccessList?.some(
          (ele) => (ele?.attribute === privacyDetail?.fieldName || privacyDetail?.fieldName?.includes(ele?.attribute)) && ele?.firstLevelVisibility === "MASKED" && ele?.secondLevelVisibility === "PLAIN"
        )
    )
  ) {
    return true;
  }
  return false;
};
