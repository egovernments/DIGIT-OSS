import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Link } from "react-router-dom";
import ServiceCardOptions from './ServiceCardOptions';
import {HomeIcon,LicencingIcon,BPAIco}  from "./svgindex";
import PhoneIcon from '@material-ui/icons/Phone'; 
const LabTabs = ({ menuOption }) => {
    const dataoptions = [
        {
            value: "1",
            text:"Home",
            Icon: <HomeIcon  />, 
        },
        {
            value: "2",
            text:"Licencing",
            Icon: <LicencingIcon />,
        },
        {
            value: "3",
            text:"BPA",
            Icon: <BPAIco />,
        },
    ] 
    const [value, setValue] = React.useState("1");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const OptionBanner = ({name, value, Icon, onClick, className }) => {
        return <Tab value={value} label={<span className={className || `BannerMenu`}>
        <div className="BannerMenuItems">{Icon}</div>
        <p className="BannerMenuCaption">{name}</p>
    </span>} />
    }

    // const Option = ({name, Icon,value, onClick, links, className }) => {
    //     return  <TabPanel value={value}>
    //         <div className={className || `ServiceCardData`}>
    //             <div className="ServiceCardHeader">
    //                 <div className="Icon-side">{Icon}</div>
    //             </div>
    //             <div className="ServiceCardCaption">
    //                 <h3>{name}</h3>
    //                 <div className="links-redirect">
    //                     {/* <p>{links}</p> */}
    //                     {links?.map((e, i) => (
    //                     <Link key={i} to={{ pathname: e.link, state: e.state }}>
    //                         {e.i18nKey}
    //                     </Link>
    //                     ))}
    //                 </div>
    //             </div>
                
        
    //         </div>
    //     </TabPanel>
    // }
    const Option = ({name, Icon,value, list,onClick, links, className }) => {
        return  <TabPanel value={value}>
            <ServiceCardOptions {...list}/>
        </TabPanel>
    }

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
                    <div className="banner-row">
                    <TabList onChange={handleChange}  aria-label="lab API tabs example">
                        {/* <div className='banner-mid-item'> */}
                            {dataoptions.map((props, index) =>
                                // <OptionBanner  value={value} key={index} {...props} />
                                <Tab icon={props.Icon} iconPosition="start" label={props.text} value={props.value} />
                            )}
                        {/* </div> */}
                        
                        {/* <Tab label="Item One" value="1" />
                        <Tab label="Item Two" value="2" />
                        <Tab label="Item Three" value="3" /> */}
                    </TabList>
                    </div>
                </Box>
                {menuOption.map((props, index) => 
                    <Option value={props.value} key={index} {...props} />
                )}
            </TabContext>
        </Box>
    );
}

export default LabTabs;