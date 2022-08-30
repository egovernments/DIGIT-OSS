import React from 'react'
import {
    TextInput,
    SearchIconSvg,

} from "@egovernments/digit-ui-react-components";

const Searchbar = ({searchValue, onChange, handleKeyPress, handleSearch, t}) => {
 

    return (
        <div>
            <TextInput textInputStyle={{maxWidth:"960px"}}
            className="searchInput" 
            placeholder={t("CE_SERACH_DOCUMENTS")} 
            value={searchValue}
            onChange={(ev) => onChange(ev.target.value)} 
            signature={true}
            signatureImg={<SearchIconSvg className="signature-img" onClick={() => handleSearch()}/>}
            onKeyPress={handleKeyPress}
            />
        </div>
    )
}

export default Searchbar;
