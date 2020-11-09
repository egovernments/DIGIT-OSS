import { useStore } from "./Store/hook";

export const initServices = () => {
  window.Digit = window.Digit || {};
  window.Digit.Services = window.Digit.Services || {};
  window.Digit.Services = { ...window.Digit.Services, useStore };
};

export { useStore };
