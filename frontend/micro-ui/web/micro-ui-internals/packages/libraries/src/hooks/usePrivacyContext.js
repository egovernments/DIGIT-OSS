import React, { useContext } from "react";

/**
 * Custom hook which can gives the privacy functions to access
 *
 * @author jagankumar-egov
 *
 * Feature :: Privacy
 * 
 * @example
 *         const { privacy , updatePrivacy } = Digit.Hooks.usePrivacyContext()
 *
 * @returns {Object} Returns the object which contains privacy value and updatePrivacy method
 */
export const usePrivacyContext = () => {
  const { privacy, updatePrivacy, ...rest } = useContext(Digit.Contexts.PrivacyProvider);
  return { privacy, updatePrivacy, ...rest };
};
