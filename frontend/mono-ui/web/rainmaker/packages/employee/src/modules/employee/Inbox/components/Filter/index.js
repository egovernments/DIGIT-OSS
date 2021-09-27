import React from "react";
import { MultiSelectDropdown } from "egov-ui-kit/components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";



const Filter = ({ filter, handleChangeFilter, clearFilter }) => {
    return (
        <div className="row" style={{marginLeft:'-5px' ,    marginBottom: '15px'}}>
            <div className="col-md-3">
                <MultiSelectDropdown
                    multiple
                    onChange={(e) => { handleChangeFilter('moduleFilter', e.target.value) }}
                    floatingLabelText={<Label label="CS_INBOX_MODULE_FILTER" fontSize="12px" />}//"Module"
                    className="filter-fields"
                    labelStyle={{fontWeight:500,color:'black!important'}}
                    dropDownData={filter.moduleFilter.dropdownData}
                    value={filter.moduleFilter.selectedValue}
                    underlineStyle={{
                        position: "absolute",
                        bottom: -1,
                        borderBottom: "1px solid #FE7A51",
                        width: "100%"
                    }}
                    prefix ={"CS_COMMON_INBOX_"}
                />
            </div>
            <div className="col-md-3">
                <MultiSelectDropdown
                    multiple
                    onChange={(e, index, value) => {
                        handleChangeFilter('localityFilter', e.target.value)
                    }}
                    floatingLabelText={<Label label="CS_INBOX_LOCALITY_FILTER" fontSize="12px"/>}
                    className="filter-fields"
                    dropDownData={filter.localityFilter.dropdownData}
                    value={filter.localityFilter.selectedValue}
                    underlineStyle={{
                        position: "absolute",
                        bottom: -1,
                        borderBottom: "1px solid #FE7A51",
                        width: "90%"
                    }}
                />
            </div>
            <div className="col-md-3" >
                <MultiSelectDropdown
                 multiple
                    floatingLabelText={<Label label="CS_INBOX_STATUS_FILTER" fontSize="12px"  />}
                    className="filter-fields"
                    dropDownData={filter.statusFilter.dropdownData}
                    onChange={(e, index, value) => {
                                               
                        handleChangeFilter('statusFilter', e.target.value) }}
                    value={filter.statusFilter.selectedValue}
                    underlineStyle={{
                        position: "absolute",
                        bottom: -1,
                        borderBottom: "1px solid #FE7A51",
                        width: "100%"
                    }}
                    prefix ={"COMMON_"}
                />
            </div>
            <div className="col-md-3">
                <div className="rainmaker-displayInline filter-clear-icon" onClick={clearFilter} >
                    <Label label="CS_INBOX_CLEAR" color="#fe7a51" fontSize="15px" />
                </div>
            </div>
        </div>
    );
};

export default Filter;
