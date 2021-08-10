import React from "react";
import SearchIcon from "material-ui/svg-icons/action/search";
import { Icon, TextFieldIcon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import ReactTable from "react-table";
import "react-table/react-table.css";

const addIconStyle = { width: 20, height: 20, marginLeft: 8 };

const searchIconStyle = {
  height: "20px",
  width: "35px",
  fill: "#767676",
};

const getTableProps = () => {
  return {
    style: {
      height: "auto",
      minHeight: 370,
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 5px 0 rgba(0, 0, 0, 0.13), 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
    },
  };
};

const getTdProps = () => {
  return {
    style: {
      borderRight: "none",
      fontSize: "13px",
      fontWeight: "normal",
    },
  };
};

const getThProps = () => {
  return {
    style: {
      lineHeight: 40,
    },
  };
};
const getTheadTrProps = () => {
  return {
    style: {
      height: 56,
      boxShadow: "none",
    },
  };
};

const getTheadProps = () => {
  return {
    style: {
      boxShadow: "none",
      backgroundColor: "#f8f8f8",
      borderBottom: "1px solid #e0e0e0",
    },
  };
};

const getTheadThProps = () => {
  return {
    style: {
      lineHeight: "40px",
      borderRight: "none",
      fontFamily: "Roboto",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: "0.5px",
      textAlign: "center",
      color: "#767676",
    },
  };
};

const getTrGroupProps = () => {
  return {
    style: {
      height: 0,
      borderBottom: "1px solid #e0e0e0",
    },
  };
};

const getTrProps = () => {
  return {
    style: {
      alignItems: "center",
    },
  };
};

const MDMSTable = ({ masterName, onSearch, onAddClick, columns, tableData, defaultPageSize, searchValue }) => {
  return (
    <div>
      <div>
        <div className="title-add-search-bar">
          <div className="col-md-6 text-left table-title" style={{ marginTop: "22px" }}>
            <Label id="mdms-table-title" label={masterName} style={{}} labelStyle={{ letterSpacing: 0.6 }} dark={true} bold={true} />
          </div>

          <div className="col-md-6 table-top-bar">
            <div className="mdms-table-search-bar">
              <TextFieldIcon
                textFieldStyle={{ height: "48px" }}
                inputStyle={{
                  marginTop: "4px",
                  left: 0,
                  position: "absolute",
                }}
                iconPosition="after"
                onChange={onSearch}
                underlineShow={true}
                fullWidth={false}
                hintText={<Label label="ES_MYCOMPLAINTS_SEARCH_BUTTON" />}
                Icon={SearchIcon}
                value={searchValue}
                id="search-mdms"
                iconStyle={searchIconStyle}
              />
            </div>
            <div className="mdms-add">
              <Icon action="content" name="add" color="#767676" onClick={onAddClick} style={addIconStyle} />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <ReactTable
            data={tableData}
            columns={columns}
            getTableProps={getTableProps}
            getTdProps={getTdProps}
            getThProps={getThProps}
            getTheadProps={getTheadProps}
            getTheadTrProps={getTheadTrProps}
            getTheadThProps={getTheadThProps}
            getTrProps={getTrProps}
            getTrGroupProps={getTrGroupProps}
            defaultPageSize={defaultPageSize}
            className="-stripped -highlight -responsive text-center"
          />
        </div>
      </div>
    </div>
  );
};

export default MDMSTable;
