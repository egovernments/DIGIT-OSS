import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppRouter from './AppRouter';
import Spinner from '../components/common/Spinner';
// import SideBar from '../components/common/sidebar'
import { isMobile } from 'react-device-detect';

const styles = (theme) => ({
    root: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        padding: isMobile ? '5px' : '10px'
      },
      appContainer: {
        display: 'flex',
    
      },
      main: {
        display: 'flex',
        flex: 1
      }
});

class Layout extends Component {
    prepareLayout() {
        const { classes } = this.props;
        return (
            <div className={`App ${classes.root}`}>
                {/* <div>
                    Change Language: <select onChange={this.handleLanguageChange}>
                        <option value="en">En- English</option>
                        <option value="hi">hi- Hindi</option>
                    </select>
                </div> */}
                {/* <NavBar /> */}
                <div className={classes.appContainer}>
                    {/* <div className="row"> */}
                    <Spinner />
                    <main role="main" style={{ backgroundColor: '#f4f7fb' }} className={classes.main}>
                    {/* <SideBar /> */}
                        <AppRouter />
                    </main>
                </div>
            </div>
        )

    }

    render() {
        return this.prepareLayout();
    }

}

export default withStyles(styles)(Layout);