## UI Autogen

The framework is intended to create CRUD screens with JSON configuration.

An high level overview of the UI Autogen Flow.

**Specs => Specs Interpreter => Specs to View Adapter => View**

The bulk of framework business logic resides in [Redux](https://redux.js.org/) . 

App is bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Running the app
+ Clone the repository
+ Navigate to ui-app-v2 folder.
+ npm install - Install the dependencies
+ npm start - To run the dev server. The app runs on http://locahost:3000
+ npm run build - To get a production build.


### Specs

The Specs can render the screens of following types

   + Create
   + Update - fields in the create screen + Search API Calls => FormData => Render
   + View - fields in the create screen => View Adapters for each Create Field => Search Api Call => FormData => Render 
   + Search

A spec may look like this.
  ```
  {
    createUrl: "",
    viewUrl: "",
    searchUrl: "",
    groups: [
      {
        label: "Group One",
        fields: [
          {
            label: "First Name",
            jsonPath : "",
            type: "text",
            target: "name",
            width: "",
            viewAdapter: ""
          },
          {
            width: "",
            jsonPath : "",
            label: "Country",
            type: "dropdown",
            target: "country",
            sourceUrl: "http://somedatasource.com/api/...",
            options: ["India", "USA", "AUSTRALIA"],
            dependency: [
              {
                target: "",
                type: "API_CALL",
                dataSource: "...some url with selected value"
              },
              {
                target: "",
                type: "VISIBILITY_TOGGLE",
                toggleValue: ""
              },
              {
                target: "",
                type: "INTERACTIVITY_TOGGLE",
                toggleValue: ""
              }
            ]
          },
          {
            width: "",
            label: "City",
            type: "dropdown",
            target: "country"
          }
        ]
      }
    ],
    search: {
    searchParams : [{param1 : value1, param2 : value2}],
    groups: [
      {
        label: "Search Group One",
        fields: [
          {
            label: "First Name",
            type: "text",
            target: "name",
            width: "",
            viewAdapter: ""
          }
        ]
      }
    ]
  }
 }
 ```

By default, the view adapter assumes the following. All single value fields will be translated to Labels. If this is not the desired behaviour a view adapter field can be used to override the default implementation.  

### Core Actions

Here are the main actions the framework can do.

SET_SPECS    
SET_MODULE_NAME   
SET_ACTION_NAME    
HANDLE_CHANGE    
SET_DROPDOWN_DATA   
SET_FORM_DATA  
SUBMIT_FORM_DATA  
RESET_FORM_DATA   
API_CALL  
API_WAITING  
API_SUCCESS  
API_FAILED  
SET_ROUTE  


## Redux State
```
{
  specs: {},
  form: {},
  dropdownData: {},
  moduleAction: "",
  moduleName: "",
  moduleMaster: "",
  loadingStatus: false
}
```


### Writing Components

Every Component should be written with its accompanying HoC(Higher Order Component).
All the API calls, logic, event binding, redux subscriptions should happen in the HoC.  
The presentation components should be purely dumb. It should ideally be stateless, without implementing any lifecycle methods. 


### Extending the framework
 The extensibility to the framework is provided by [Redux middlewares](https://redux.js.org/docs/advanced/Middleware.html).
 
 Certain modules might want to **transform** the formData before it is set to the redux store and might want to a **reverse transformation** before it sends the form data back to the server. Middlewares comes in handy in those cases.
 
 If there is a need to transform the formData before setting it to the redux store, we could use a middleware which taps into `SET_FORM_DATA` action.

```
const middleware = store => next => action => {
  const { type } = action;
  switch (type) {
    case "SET_FORM_DATA":
      const {formData,target} = action;
      // do some transformation with the form data
      break;
  }
  next(action);
}
```

Similarly if the formData needs to be transformed before making a server call, we could tap into SUBMIT_FORM_DATA action.

### Performance Considerations

+ Bundle Size - Can be reduced be using Code Splitting. Code Splitting can happen at two levels.

    1) Resource Level
        The main bundle is split into module level bundles which loads the resource only when requrired.
        Ensures caching of smaller bundles by the browser.
        Resource Level Code Splitting requires the create-react-app to be ejected. 

    2) Dynamic imports 
        This is Promise based import of files.

+ Minimizing Wasteful Renders
   The lifecycle method componentShouldUpdate hook can be used to prevent unecessary renders or PureComponents can be 


## Proposed Folder Structure

  + src
    + actions - Framework Actions 
    + components - Atomic Level Components such as TextField, TextLabel, SelectField
    + constants
    + containers - The components can be wrapped in a container component which implements the business logic.
    + hocs - Higer Order Components
    + middlewares - A middleware to redux actions
    + reducers 
    + specs - Contains all the Specs files. 
    + store - redux store
    + styles
