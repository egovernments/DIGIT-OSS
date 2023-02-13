import React from "react";
import { Link } from "react-router-dom";

const Option = ({name, Icon, onClick, links, className }) => {
    return <div className={className || `ServiceCardData`}>
        <div className="ServiceCardHeader">
            <div className="Icon-side">{Icon}</div>
        </div>
        <div className="ServiceCardCaption">
            <h3>{name}</h3>
            <div className="links-redirect">
                {/* <p>{links}</p> */}
                {links?.map((e, i) => (
                <Link key={i} to={{ pathname: e.link, state: e.state }}>
                    {e.i18nKey}
                </Link>
                ))}
            </div>
        </div>
        

    </div>
}

const ServiceCardOptions = ({header, sideOption, options, styles={}}) => {
    return <div className="ServiceCardOptions">
        {/* <div className="headContent">
            <h2>{header}</h2>
            <p onClick={sideOption.onClick}>{sideOption.name}</p>
        </div> */}
        <div className="mainContent citizenHomeAllServiceGrid">
            {options.map( (props, index) => 
                <Option key={index} {...props} />
            )}
        </div>
    </div>
}

export default ServiceCardOptions