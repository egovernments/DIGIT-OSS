# DIGIT CityOS reference web apps

DIGIT (Digital Infrastructure for Governance, Impact & Transformation) is India's largest platform for governance services. Visit https://www.digit.org for more details.

This repository contains the reference responsive web app implementations of core modules for Citizens and Government employees/officers. 

#### License
These reference apps are released under MIT

## Rainmaker

Rainmaker Structural Diagram:

![alt text](https://raw.githubusercontent.com/egovernments/egov-web-app/rainmaker-v1/web/rainmaker/packages/assets/Rainmaker_structural_diagram.PNG)

---

Below are the steps to run project in dev and production, first time user should install lerna as global dependency, below is the command.

Note : Node should be above version 8. 

First switch to this working directory frontend/web/rainmaker
and do  

```
$ yarn install
$ yarn install --global lerna

```

### Steps for development

- Step 1 - go command will transpile all the dependent modules from /dev-packages to /packages and link them to the respective packages in the repo. It will also take care of installing all the required npm packages inside each module including citizen and employee.

```
$ yarn run go

```

- Step 2 - if you want to run citizen

```
$ yarn run dev:citizen

```

or

- Step 2 - if you want to run employee

```
$ yarn run dev:employee

```

### Steps for production

- Step 1 - lerna bootstrap will link dependencies in the repo together

```
$ lerna bootstrap

```

- Step 2 - if you want to build citizen

```
$ yarn run prod:citizen

```

or

- Step 2 - if you want to build employee

```
$ yarn run prod:employee

```

Tech stack used in Rainmaker App:-

- React JS - https://reactjs.org/
- Redux - https://redux.js.org/
- Material UI - https://material-ui.com/
- Javascript
- CSS/SASS

Dev tools:-

- Lerna - https://lernajs.io/
- Babel - https://babeljs.io/
- Webpack - https://webpack.js.org/

Links for tutorial related to get familiar with tech stack ( For new joinees/ contributors who wish to work on project):-

1) JavaScript ES6 Tutorial - https://www.youtube.com/playlist?list=PL4cUxeGkcC9gKfw25slm4CUDUcM_sXdml&fbclid=IwAR0XIm0bvO9mUG71kP-rTK8rTJAcCRlz2VlnaKzfjbCCGyNDOa4AwmHL6Ls  
This tutorial give idea about some of the new features available to us with ES6 - generators, constants, the let keyword, template strings and more.

2) How to Learn React — A roadmap from beginner to advanced  - https://medium.freecodecamp.org/learning-react-roadmap-from-scratch-to-advanced-bff7735531b6  
This guide gives consise idea about react and provides roadmap to excel in react. This provide curated links to one of best material along with prerequisites for react.

3) Getting Started With Material-UI For React (Material Design For React) - https://medium.com/codingthesmartway-com-blog/getting-started-with-material-ui-for-react-material-design-for-react-364b2688b555  
This 8 min read article gives idea about setting up material ui in your react application with deploying  sample application.

4) Understanding Redux: The World’s Easiest Guide to Beginning Redux - https://medium.freecodecamp.org/understanding-redux-the-worlds-easiest-guide-to-beginning-redux-c695f45546f6  
One of the best and comprehensive guide for redux beginners.

### Created by  
Murali M


### Updated by  
Gyan,  
Sudhanshu Deshmukh,
Jagan
---

