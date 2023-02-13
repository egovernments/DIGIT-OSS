import React from "react"

const Option = ({name, Icon, onClick, className }) => {
    return <div className={className || `BannerMenu`} onClick={onClick}>
        <div className="BannerMenuItems">{Icon}</div>
        <p className="BannerMenuCaption">{name}</p>
    </div>
}

const BannerAllCard = ({header, sideOption, options, styles={}}) => {
    return <div className="banner-mid-item">
            {options.map( (props, index) => 
                <Option key={index} {...props} />
            )}
        </div>
}

export default BannerAllCard