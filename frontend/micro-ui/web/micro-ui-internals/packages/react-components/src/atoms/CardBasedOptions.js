 import React from "react"

const Option = ({name, Icon, onClick, className }) => {
    return <div className={className || `CardBasedOptionsMainChildOption`} onClick={onClick}>
        <div className="ChildOptionImageWrapper">{Icon}</div>
        <p className="ChildOptionName">{name}</p>
    </div>
}

const CardBasedOptions = ({header, sideOption, options, styles={}}) => {
    return <div className="CardBasedOptions">
        <div className="headContent">
            <h2>{header}</h2>
            <p onClick={sideOption.onClick}>{sideOption.name}</p>
        </div>
        <div className="mainContent citizenAllServiceGrid">
            {options.map( (props, index) => 
                <Option key={index} {...props} />
            )}
        </div>
    </div>
}

export default CardBasedOptions