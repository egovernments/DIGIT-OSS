import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppRouter from './AppRouter';
import Spinner from '../components/common/Spinner';
// import SideBar from '../components/common/sidebar'
import { isMobile } from 'react-device-detect';
import { isNurtDashboard } from './commons';

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
        let sourceUrl = `${window.location.origin}/citizen`;
            sourceUrl="https://s3.ap-south-1.amazonaws.com/egov-qa-assets";
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
                    <main role="main" 
                    // style={{ backgroundColor:isNurtDashboard()? "#EEEEEE":'#f4f7fb' }} 
                    style={{ backgroundColor:"#EEEEEE" }} 
                    className={classes.main}>
                    {/* <SideBar /> */}
                        <AppRouter />
                    </main>
                </div>
                <div className="employee-home-footer">
                    <img
                        alt="Powered by DIGIT"
                        src={`${sourceUrl}/digit-footer.png`}
                        onError={"this.src='./../digit-footer.png'"}
                        style={{ height: "1.1em", cursor: "pointer" }}
                        onClick={() => {
                        window.open('https://www.digit.org/', '_blank').focus();
                        }}/>
                </div>
            </div>
        )

    }

    render() {
        return this.prepareLayout();
    }

}

export default withStyles(styles)(Layout);