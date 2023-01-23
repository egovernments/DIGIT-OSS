import React, { useReducer } from "react"
import RadioButtons from "../atoms/RadioButtons"
import TextInput from "../atoms/TextInput"
import { SearchIconSvg } from "../atoms/svgindex"

const SearchOnRadioButtons = ({options,optionsKey,additionalWrapperClass,onSelect,selectedOption, SignatureImage = () => <SearchIconSvg />, onSearchQueryChange, SearchQueryValue, placeholder}) => {
    
    function optionsReducer(state, action){
        switch (action.type){
            case "filter":
                return action.options.filter(i => i[optionsKey].toUpperCase().includes(action.payload.toUpperCase()))
        }
    }

    const [ filteredOptions, optionsDispatch ] = useReducer(optionsReducer, options)

    function defaultSearchQueryChange(e){
        optionsDispatch({type: "filter", payload: e.target.value, options})
    }

    return <div className="SearchOnRadioButton">
        <TextInput textInputStyle={{maxWidth:"100%"}} signature={true} signatureImg={<SignatureImage />} onChange={onSearchQueryChange || defaultSearchQueryChange} value={SearchQueryValue} placeholder={placeholder} />
        <RadioButtons {...{options: filteredOptions,optionsKey,additionalWrapperClass,onSelect,selectedOption}} />
    </div>
}

export default SearchOnRadioButtons