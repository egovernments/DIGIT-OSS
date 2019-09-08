/*
* Telemetry Classes
* @author Rushang Dhanesha
*/

if(navigator){
  var ua_parser = require("ua-parser-js");
  var parser = new ua_parser(navigator.userAgent);
  var ua_result = parser.getResult();
}

//Default Config Data
class ConfigData {
  constructor() {
    this.config = {
      pdata: {
        id: "",
        ver: "",
        pid: ""
      },
      apislug: "",
      env: "Rainmaker",
      channel: "org.egov",
      did: "",
      authtoken: "XXXX",
      uid: getUserUUID(),
      sid: "",
      batchsize: 10,
      mode: "",
      host: "",
      endpoint: "/v1/telemetry",
      tags: [],
      cdata: []
    };
    this.content_id = "1";
    this.content_ver = "1.0";
    this.data = {
      type: "",
      mode: "",
      stageid: "",
      duration: "0"
    };
    this.options = {
      actor: {
        id: getUserUUID()
      }
    };
  }
}

//Default Data
class TelemetryData {
  constructor() {
    this.data = {};
    this.options = {
      actor: {
        id: getUserUUID()
      }
    };
  }
}


function getUserUUID() {
  if(localStorage.getItem("user-info")) {
    return JSON.parse(localStorage.getItem("user-info"))["uuid"];
  } else {
    return "UserNotFound";
  }
}

class TelemetryManager {
  constructor() {
    this.telemetries = {};
    this.parentTelemetryType = "PARENT_TELEMETRY_TYPE";
  }

  getParentTelemetry() {
    return this.telemetries[this.parentTelemetryType];
  }

  resetTelemetries(url, end = false) {
    this.deleteAll();
    if (!end) {
      this.createPageTelemetry(url, this.parentTelemetryType);
    }
  }

  createPageTelemetry(url, identifier = undefined) {
    this.telemetries[identifier] = new PageTelemetry(url);
    if (identifier === undefined) {
      identifier = url;
    }
    this.getTelemetryObject(identifier).start();
    return this.telemetries[identifier];
  }

  createFormTelemetry(formKey, url) {
    if (formKey in this.telemetries) {
      return undefined;
    }
    this.telemetries[formKey] = new FormTelemetry(formKey, url);
    this.getTelemetryObject(formKey).start();
    return this.telemetries[formKey];
  }

  getFormId(formKey) {
    if(formKey.indexOf("-form") !== -1) {
      return formKey.substring(0, formKey.indexOf("-form"));
    }
    return undefined;
  }

  isFormInBackground(formKey) {
    let formId = this.getFormId(formKey);
    if(formId) {
      if(document.getElementById(formId) === null) {
        return true;
      }
    }
    return false;
  }

  pauseBackgroundForms() {
    for(var key in this.telemetries) {
      if(this.isFormInBackground(key)) {
        this.getTelemetryObject(key).pause();
      }
    }
  }

  getTelemetryObject(key) {
    return this.telemetries[key];
  }

  deleteTelemetry(key) {
    delete this.telemetries[key];
  }

  deleteAll() {
    for (var key in this.telemetries) {
      this.getTelemetryObject(key).summary();
      this.getTelemetryObject(key).end();
      this.deleteTelemetry(key);
    }
  }

  pauseAll() {
    for (var key in this.telemetries) {
      this.getTelemetryObject(key).pause();
    }
  }

  resumeAll() {
    for (var key in this.telemetries) {
      if(!this.isFormInBackground(key)){
        this.getTelemetryObject(key).resume();
      }
    }
  }
}

class TimeTracker {
  constructor() {
    this.startTime = [];
    this.endTime = [];
    this.timeSpentArray = [];
    this.active = false;
  }

  pause() {
    if (this.active) {
      this.endTime.push(new Date().getTime());
      this.active = false;
    }
  }

  resume() {
    if (!this.active) {
      this.startTime.push(new Date().getTime());
      this.active = true;
    }
  }

  generateTimeSpentArray() {
    this.pause();
    this.timeSpentArray = [];
    try {
      for (var i = 0; i < this.startTime.length; i++) {
        this.timeSpentArray.push(this.endTime[i] - this.startTime[i]);
      }
    } catch (err) {}
  }

  addStartTime(data) {
    data["startTime"] = this.startTime[0];
  }

  addEndTime(data) {
    data["endTime"] = this.endTime[this.endTime.length - 1];
  }

  addStartTimeArray(data) {
    data["startTimeArray"] = this.startTime;
  }

  addEndTimeArray(data) {
    data["endTimeArray"] = this.endTime;
  }

  addTimeSpent(data) {
    this.generateTimeSpentArray();
    data["timeSpent"] = this.timeSpentArray.reduce((a, b) => a + b, 0);
  }

  addTimeSpentArray(data) {
    this.generateTimeSpentArray();
    data["timeSpentArray"] = this.timeSpentArray;
  }

  addNumberOfInteractions(data) {
    this.generateTimeSpentArray();
    data["numberOfInteractions"] = this.timeSpentArray.length;
  }

  addSummary(data) {
    this.addStartTimeArray(data);
    this.addEndTimeArray(data);
    this.addTimeSpent(data);
  }
}

class BaseTelemetry {
  constructor(type) {
    this.type = type;
    this.configData = new ConfigData();
    this.telemetryData = new TelemetryData();
    this.timeTracker = new TimeTracker();
  }

  addType(data) {
    data["type"] = this.type;
  }

  addDeviceInfo(data) {
    if (navigator) {
      data["userAgent"] = navigator.userAgent;
      if(ua_result) {
        data["web-browser"] = ua_result.browser.name;
        data["platform"] = ua_result.os.name;
      }
    }
  }

  addCityId(data) {
    if (localStorage.getItem("user-info")) {
      data["cityId"] = JSON.parse(localStorage.getItem("user-info"))[
        "permanentCity"
      ];
    }
  }

  addBaseInfo(data) {
    this.addType(data);
    this.addDeviceInfo(data);
    this.addCityId(data);
  }

  addDefaultStartData(data = {}) {
    return Object.assign(this.makeCopyOfData(this.configData.data), data);
  }

  addDefaultStartOptions(options = {}) {
    return Object.assign(this.makeCopyOfData(this.configData.options), options);
  }

  addDefaultData(data = {}) {
    return Object.assign(this.makeCopyOfData(this.telemetryData.data), data);
  }

  addDefaultOptions(options = {}) {
    return Object.assign(
      this.makeCopyOfData(this.telemetryData.options),
      options
    );
  }

  makeCopyOfData(data = {}) {
    return JSON.parse(JSON.stringify(data));
  }

  pause() {
    this.timeTracker.pause();
  }

  resume() {
    this.timeTracker.resume();
  }

  start(inputData, inputOptions) {
    var data = this.addDefaultStartData(inputData);
    var options = this.addDefaultStartOptions(inputOptions);
    this.addBaseInfo(data);
    this.timeTracker.resume();
    EkTelemetry.start(
      this.configData.config,
      this.configData.content_id,
      this.configData.content_ver,
      data,
      options
    );
  }

  summary(inputData, inputOptions) {
    var data = this.addDefaultData(inputData);
    var options = this.addDefaultOptions(inputOptions);
    this.addBaseInfo(data);
    this.timeTracker.pause();
    this.timeTracker.addSummary(data);
    EkTelemetry.summary(data, options);
  }

  end(inputData, inputOptions) {
    var data = this.addDefaultData(inputData);
    var options = this.addDefaultOptions(options);
    this.addBaseInfo(data);
    EkTelemetry.end(data, options);
  }
}

class PageTelemetry extends BaseTelemetry {
  constructor(url, type = "page") {
    super(type);
    this.url = url;
  }

  addURL(data) {
    data["url"] = this.url;
  }

  addPageInfo(data) {
    this.addURL(data);
  }

  start(inputData) {
    var data = this.makeCopyOfData(inputData);
    this.addPageInfo(data);
    super.start(data);
  }

  summary(inputData) {
    var data = this.makeCopyOfData(inputData);
    this.addPageInfo(data);
    super.summary(data);
  }

  end(inputData) {
    var data = this.makeCopyOfData(inputData);
    this.addPageInfo(data);
    super.end(data);
  }
}

class FormTelemetry extends PageTelemetry {
  constructor(formKey, url) {
    super(url, "form");
    this.formKey = formKey;
    this.fields = {};
  }

  fieldInteractionStart(fieldKey) {
    this.timeTracker.resume();
    if (!(fieldKey in this.fields)) {
      this.fields[fieldKey] = new Field(fieldKey);
    }
    this.fields[fieldKey].resume();
  }

  fieldInteractionEnded(fieldKey, fieldLength) {
    if (fieldKey in this.fields) {
      this.fields[fieldKey].pause();
      this.fields[fieldKey].fieldDataLength = fieldLength;
    }
  }

  addFormKey(data) {
    data["formKey"] = this.formKey;
  }

  addFieldSummary(data) {
    var fieldSummary = [];
    for (var key in this.fields) {
      this.fields[key].pause();
      fieldSummary.push(this.fields[key].getSummary());
    }
    data["fieldSummary"] = fieldSummary;
  }

  submit(inputData) {
    var data = this.makeCopyOfData(inputData);
    data["submit"] = "true";
    this.summary(data);

    var data = this.makeCopyOfData(inputData);
    this.end(data);
  }

  start(inputData) {
    var data = this.makeCopyOfData(inputData);
    this.addFormKey(data);
    super.start(data);
  }

  summary(inputData) {
    var data = this.makeCopyOfData(inputData);
    this.addFormKey(data);
    this.addFieldSummary(data);
    super.summary(data);
  }

  end(inputData) {
    var data = this.makeCopyOfData(inputData);
    this.addFormKey(data);
    super.end(data);
  }
}

class Field {
  constructor(fieldKey) {
    this.fieldKey = fieldKey;
    this.timeTracker = new TimeTracker();
    this.fieldDataLength = -1;
  }

  addFieldKey(data) {
    data["fieldKey"] = this.fieldKey;
  }

  addFieldDataLength(data) {
    data["fieldDataLength"] = this.fieldDataLength;
  }

  resume() {
    this.timeTracker.resume();
  }

  pause() {
    this.timeTracker.pause();
  }

  getSummary() {
    var data = {};
    this.addFieldKey(data);
    this.addFieldDataLength(data);
    this.timeTracker.addTimeSpent(data);
    this.timeTracker.addNumberOfInteractions(data);
    return data;
  }
}

export default TelemetryManager;
