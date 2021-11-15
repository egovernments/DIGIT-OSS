import React from "react"

export const SearchField = ({children, className}) => {
    return <div className={`form-field ${className || ""}`}>
        {children}
    </div>
}

export const SearchForm = ({ children, onSubmit, handleSubmit, id, className="" }) => {
    return <form className={`search-form-wrapper ${className}`} onSubmit={handleSubmit(onSubmit)} {...{id}} >
            {children}
    </form>
}
