import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import Dashboard from '../components/Dashboard/dashboard';
import history from "./web.history";
import Home from '../components/Home/Home';
import Breadcrumbs from '../Breadcrumbs';


class AppRouter extends Component {
    authenticateUser = () => {
        return true;
    }

    render() {
        return (
            <Router history={history}>
                <div style={{ width: '97%' }}>
                    <Breadcrumbs/>
                    <Switch>
                        <Route exact path={`${process.env.PUBLIC_URL}/home`} component={Home} />
                        <Route exact path={`${process.env.PUBLIC_URL}/ulb-home`} component={Home} />
                        <Route exact path={`${process.env.PUBLIC_URL}/NURT_DASHBOARD`} component={Home} />
                        <Route path={`${process.env.PUBLIC_URL}/:pageId/:viewAll?`} component={Dashboard} />
                        <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home} />
                    </Switch>
                </div>
            </Router>

        );

    }

}

export default AppRouter;
