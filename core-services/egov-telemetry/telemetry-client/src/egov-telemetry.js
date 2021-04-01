global.jQuery = require("jquery");
import exec from "script-loader!../vendor/telemetryLibrary.js";
import TelemetryManager from "./telemetry-class";
import "./polyfill";

function findParent(element, elementType) {
  if (element === null) {
    return undefined;
  }
  if (element.nodeName === elementType) {
    return element;
  }
  return findParent(element.parentElement, elementType);
}

var telemetryManager = new TelemetryManager();

function urlChanged(URL) {
  telemetryManager.resetTelemetries(URL);
}

function getFieldKey(inputElement) {
  let fieldKey = inputElement.id;
  if (inputElement.type === "radio") {
    fieldKey = inputElement.name + "-radio";
  }
  return fieldKey;
}

function getFormKey(inputElement) {
  let formElement = findParent(inputElement, "FORM");
  if (formElement) {
    let formKey = (formElement.id || "FormKeyNotSpecified") + "-form";
    return formKey;
  }
  return undefined;
}

function getFormTelemetryObject(formKey) {
  let formTelemetryObject = telemetryManager.getTelemetryObject(formKey);
  if (formTelemetryObject === undefined) {
    formTelemetryObject = telemetryManager.createFormTelemetry(
      formKey,
      window.location.href
    );
  }
  return formTelemetryObject;
}

// Field focus and blur events
window.document.addEventListener(
  "focus",
  event => {
    telemetryManager.pauseBackgroundForms();
    let inputElement = findParent(event.target, "INPUT");
    if (inputElement) {
      let fieldKey = getFieldKey(inputElement);
      let formKey = getFormKey(inputElement);
      if (formKey) {
        let formTelemetryObject = getFormTelemetryObject(formKey);
        formTelemetryObject.fieldInteractionStart(fieldKey);
      }
    }
  },
  true
);

window.document.addEventListener(
  "blur",
  event => {
    let inputElement = findParent(event.target, "INPUT");
    if (inputElement) {
      let fieldKey = getFieldKey(inputElement);
      let formKey = getFormKey(inputElement);
      if (formKey) {
        let formTelemetryObject = telemetryManager.getTelemetryObject(formKey);
        if (formTelemetryObject) {
          formTelemetryObject.fieldInteractionEnded(
            fieldKey,
            inputElement.value.length
          );
        }
      }
    }
  },
  true
);

window.addEventListener("submit", event => {
  let formKey = getFormKey(event.target);
  let formTelemetryObject = telemetryManager.getTelemetryObject(formKey);
  if (formTelemetryObject) {
    formTelemetryObject.submit();
    telemetryManager.deleteTelemetry(formKey);
  }
});

// Page load and unload events
window.addEventListener("load", event => {
  urlChanged(window.location.href);
});
window.addEventListener("beforeunload", event => {
  urlChanged(); //end = true
});

// Window background and foreground event
window.addEventListener("focus", event => {
  telemetryManager.resumeAll();
});
window.addEventListener("blur", event => {
  telemetryManager.pauseAll();
});

//Updated url methods after removing '?.....' and 'hostname'

// handle URL change on pressing back and forward buttons
window.addEventListener("popstate", function(event) {
  let fullURL = event.currentTarget.location.href;
  urlChanged(fullURL);
});

// handle URL change on user clicks inside pages
(function(history) {
  const pushState = history.pushState;
  history.pushState = function(state) {
    if (typeof history.onpushstate === "function") {
      history.onpushstate({ state: state });
    }
    var fullURL = arguments[2];

    urlChanged(window.location.protocol + "//" + window.location.host + fullURL);

    return pushState.apply(history, arguments);
  };
})(window.history);
