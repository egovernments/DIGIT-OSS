# Data Uploader Service

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## How to Run the code
- Clone the repository
- Navigate to the folder
- `npm install`
- `REACT_APP_USERNAME=username REACT_APP_PASSWORD=password npm start`

Note : REACT_APP_USERNAME and REACT_APP_PASSWORD is important for standalone development

`window.addEventListener("message", this.handleFrameTasks)` listens for message from parent DOM when deployed in an Iframe.

## Folder Structure

- src
  - actions
  - api
  - app-components
  - atomic-components
  - constants
  - containers
  - reducers
  - store
  - styles 
  - utils

### actions
Contains the action creators for the redux store.

### api
Contains the api calls and related functions.

### app-components
Presentational app components.

### atomic-components
Reusable components which can be used across applications.

### constants
App constants such as api endpoints and action types.

### containers
Container components which connects to the redux store. Container components are part of a strategy of separating responsibility between high-level and low-level concerns. Containers manage things like subscriptions and state, and pass props to components that handle things like rendering UI. 

### store
Redux create store.

### styles
App styles are present here.

### utils
Common utilities for the applications.

