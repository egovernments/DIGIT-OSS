import { ptComponents } from "./pt";
import { tlComponents } from "./tl";

var Digit = window.Digit || {};

const customisedComponent = {
    ...ptComponents,
    ...tlComponents
}



export const initCustomisationComponents = () => {
    Object.entries(customisedComponent).forEach(([key, value]) => {
        Digit.ComponentRegistryService.setComponent(key, value);
    });
};


