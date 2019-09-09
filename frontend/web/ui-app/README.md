## Running the app
    + Clone the repository
    + Navigate to ui-app folder.
    + npm install - Install the dependencies
    + npm start - To run the dev server.
    + npm run build - To get a production build.

## Folder Structure
   Some of the important folders which a developer should be aware is listed down here.Please remember that this is not the exhaustive list of files/folders but only the ones the developer needs to be aware of.
   + api - This contains the file which is responsible for making the api calls.
   + components  
        + framework 
            + specs - Contains the specs files.
            + components - Contains the UI components. 
            + utility
            + mdms
            + create.js - Code for create screens
            + view.js - View Screens
            + search.js - Search Screens
        + non-framework - Any screen which as a developer feels the framework does not support can be included here.
   + reducers - All the reducers can be found here.

## Redux State of the App
Since bulk of the business logic resides with redux, the developer should be aware of the redux state.

+ common
  + actionList - List of menu items. Visible once the user logs in.
  + token
  + tenantInfo
+ form - This section of the state is deprecated. **This will be removed in the future versions.**
+ framework
  + actionName - Suggests if the current screen is a create/update/view/search screen.
  + moduleName
  + dropDownData - All dropdowndata in the application is stored here.
      It is a map with key indicating the json path of the dropdowndata. As you can see in the example the object is expected to take the shape such as ```{key:'',value:''}```
      Example Dropdown value. 
      ```{
        vehicles[0].driver.code : [
          {key: null, value: "-- Please Select --"},
          {key: "Driver1", value: "Driver1"},
          {key: "Driver3", value: "DriverThree"}
         ]
      }
  + dropDownOringalData - Stores all the entire dropdown response for receieved from the server.
  + metaData - The entire specs file can be obtained here.

  + mockData - Any modifications to the specs file is stored here.

+ frameworkForm - All the form data 
    + fieldErrors - Key Value pair with json path and error messages
    + form - All the form data is stored here. Again a key value pair of json path and the form value.
    + isFormValid - Expects a Boolean. Used in create/update screens to 
    + loadingStatus - If you need to trigger a loading indicator, for instance if a user needs to wait for the data from the server, this is useful.
    + requiredFields - List of json paths where fields are required.
        Example
        ```["vehicles[0].vehicleType.code", "vehicles[0].regNumber", "vehicles[0].driver.code", "vehicles[0].manufacturingDetails.vehicleCapacity", "vehicles[0].manufacturingDetails.engineSrNumber", ...]```
    + snackbarOpen
    + toastMsg - If one needs to show a toast message an action can be dispatched to set the toastMsg.

## Routing

All the routes can be found in the **router.js**, which maps the path to a component.

