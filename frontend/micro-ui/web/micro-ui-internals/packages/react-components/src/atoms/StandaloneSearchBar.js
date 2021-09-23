import React from "react"
import { SearchIconSvg } from "./svgindex"
const StandaloneSearchBar = ({placeholder}) => {
    return <div className="StandaloneSearchBar">
        <SearchIconSvg/>
        <input type="text" placeholder={placeholder} />
    </div>
}

export default StandaloneSearchBar