import { useStore } from "./Store/hook";

export const initServices = () => {
  window.eGov = window.eGov || {};
  window.eGov.Services = window.eGov.Services || {};
  window.eGov.Services = { ...window.eGov.Services, useStore };
};

export { useStore };
