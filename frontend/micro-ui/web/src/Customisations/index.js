import { ptComponents } from "./pt";
import { tlComponents } from "./tl";
import { obpsComponent } from "./obps";
var Digit = window.Digit || {};

const customisedComponent = {
    ...ptComponents,
    ...tlComponents,
    ...obpsComponent
}



export const initCustomisationComponents = () => {
    Object.entries(customisedComponent).forEach(([key, value]) => {
        Digit.ComponentRegistryService.setComponent(key, value);
    });
};


