# eGov Telemetry Client

This telemetry module will capture client’s interaction with the app, such as time spent on a particular page, time spent to fill up a form, etc. It is written in plain javascript so it is independent of the front end framework. It is going to listen to the events and extract the data from html source code. For this to happen, the source code should have the attributes specified in the guideline given below.

Primarily, there are following different Telemetry being captured:
- Page Telemetry
- Form Telemetry

### Guidelines:

Page Telemetry:
- Each page should have a unique url (primary-id)

Form Telemetry:
- Every form element should have an ancestor \<form\> tag.
- Each form tag should have id attribute (primary-id).
- Each field (\<input\>) should have id attribute to uniquely identify it.
- Each radio button (\<radio\>) should have name attribute to uniquely identify the radio-group.


### Dependencies

We have used Sunbird’s Telemetry JS Library to send the telemetry signals to the server. http://docs.sunbird.org/latest/developer-docs/telemetry/overview/


### Build

```
npm install
npx run build
```

This will generate a transpiled ES5 JavaScript file "egov-telemetry.js” in the build folder.
​