import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
// import configureStore from '../store';
import { BrowserRouter } from 'react-router-dom';
import storeFactory from './store/store';
import App from './App';
import 'typeface-roboto';
//import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(
    <Provider store={storeFactory}>
        <BrowserRouter basename="/">
            <App store={storeFactory} />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
//registerServiceWorker();
