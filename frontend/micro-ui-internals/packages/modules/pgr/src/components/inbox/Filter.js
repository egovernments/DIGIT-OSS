import React, { useCallback, useEffect, useState } from "react";
import {
  Dropdown,
  CardLabel,
  RadioButtons,
  CardCaption,
  CheckBox,
  SubmitBar,
  ActionBar,
  RemoveableTag,
} from "@egovernments/digit-ui-react-components";
import { useSelector } from "react-redux";
import useLocalities from "../../hooks/useLocalities";
import useComplaintStatus from "../../hooks/useComplaintStatus";
import { ApplyFilterBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import useServiceDefs from "../../hooks/useServiceDefs";

const Filter = (props) => {
  console.log("props in filter--------->:", props);
  // let userType = Digit.SessionStorage.get("userType");

  const { t } = useTranslation();
  const { pgr } = useSelector((state) => state);

  const [selectAssigned, setSelectedAssigned] = useState("");
  const [selectedComplaintType, setSelectedComplaintType] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [pendingComplaintCount, setPendingComplaintCount] = useState([]);
  const [filters, setFilters] = useState({
    assigned: [],
    serviceCodes: [],
    localities: [],
    applicationStatus: [],
  });

  let localities = useLocalities({ city: "Amritsar" });
  let complaintStatus = useComplaintStatus();
  let serviceDefs = useServiceDefs();

  const onRadioChange = (value) => {
    console.log("vlaue:-------------", value);
    setSelectedAssigned(value.code);
    setFilters({ ...filters, assigned: [value] });
  };

  useEffect(() => {
    let queryObj = {};
    for (const property in filters) {
      console.log("property:-------->", property);
      // let values = filters[property].map((prop) => prop.code).join();
      if (Array.isArray(filters[property])) {
        let params = filters[property].map((prop) => prop.code).join();
        console.log("params>>:", params, filters[property]);
        if (params) {
          //queryString += `${property}=${params}&`;
          queryObj[property] = params;
        }
      }
    }
    //queryString = queryString.substring(0, queryString.length - 1);
    console.log("queryObj:", queryObj);
    handleFilterSubmit(queryObj);
  }, [filters]);

  const getCount = (value) => {
    console.log("pgr.complaints:", pgr);
    return (
      pgr.complaints.hasOwnProperty("response") &&
      pgr.complaints.response.filter((complaint) => {
        console.log("complaint.serviceCode", complaint.serviceCode, "value:", value);
        return complaint.applicationStatus === value;
      }).length
    );
  };

  const getPendingCount = () => {
    let statusWithCount = complaintStatus.map((status) => ({
      ...status,
      count: getCount(status.key),
    }));

    setPendingComplaintCount(statusWithCount);
  };

  useEffect(() => {
    getPendingCount();
  }, [complaintStatus.length]);

  function complaintType(type) {
    setFilters({ ...filters, serviceCodes: [...filters.serviceCodes, type] });
  }

  function onSelectLocality(value, type) {
    console.log("hi", type, value);
    setFilters({ ...filters, localities: [...filters.localities, value] });
  }

  useEffect(() => {
    console.log("filters:", filters.serviceCodes);
    if (filters.serviceCodes.length > 1) {
      setSelectedComplaintType(`${filters.serviceCodes.length} selected`);
    } else {
      setSelectedComplaintType(filters.serviceCodes[0]);
    }
  }, [filters.serviceCodes]);

  useEffect(() => {
    if (filters.localities.length > 1) {
      setSelectedLocality(`${filters.localities.length} selected`);
    } else {
      setSelectedLocality(filters.localities[0]);
    }
  }, [filters.localities]);

  const onRemove = (index, key) => {
    let afterRemove = filters[key].filter((value, i) => {
      return i !== index;
    });
    setFilters({ ...filters, [key]: afterRemove });
  };

  const handleAssignmentChange = (e, type) => {
    console.log("type:", type);
    if (e.target.checked) {
      setFilters({ ...filters, applicationStatus: [...filters.applicationStatus, type] });
    } else {
      const filteredStatus = filters.applicationStatus.filter((value) => {
        return value !== type;
      });
      setFilters({ ...filters, applicationStatus: filteredStatus });
    }
  };

  //   return (
  //     <div className="filter-card">
  //       {console.log("filters", filters)}
  //       <div className="heading">
  //         <CardCaption>FILTER BY:</CardCaption>
  //         <div>Clear all</div>
  const handleFilterClear = () => {
    console.log("clear");
  };

  const handleFilterSubmit = (queryString) => {
    props.onFilterChange(queryString);
  };

  const GetSelectOptions = (lable, options, selected, select, optionKey, onRemove, key) => (
    <div>
      <div className="filter-label">{lable}</div>
      <Dropdown option={options} selected={selected} select={(value) => select(value, key)} optionKey={optionKey} style={{ width: "100%" }} />
      <div className="tag-container">
        {filters[key].length > 0 &&
          filters[key].map((value, index) => {
            return <RemoveableTag text={value.name} onClick={() => onRemove(index, key)} />;
          })}
      </div>
    </div>
  );

  return (
    <React.Fragment>
      {console.log("filters:", filters)}
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">FILTER BY:</div>
            <div className="clearAll">Clear all</div>
            {props.type === "desktop" && <span className="clear-search">Clear all</span>}
          </div>
          <div>
            <RadioButtons
              onSelect={onRadioChange}
              selectedComplaintType={selectAssigned}
              optionskey="name"
              options={[
                { code: "ASSIGNED_TO_ME", name: t("ASSIGNED_TO_ME") },
                { code: "ASSIGNED_TO_ALL", name: t("ASSIGNED_TO_ALL") },
              ]}
            />
            <div>{GetSelectOptions(t("Complaint Subtype"), serviceDefs, selectedComplaintType, complaintType, "name", onRemove, "serviceCodes")}</div>
            <div>{GetSelectOptions(t("Locality"), localities, selectedLocality, onSelectLocality, "name", onRemove, "localities")}</div>
            <div className="status-container">
              <div className="filter-label">Status</div>
              {console.log("pendingComplaintCount:", pendingComplaintCount)}
              {pendingComplaintCount.map((option) => (
                <CheckBox onChange={(e) => handleAssignmentChange(e, option)} label={`${option.name} (${option.count})`} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ActionBar>
        {props.type === "desktop" ? (
          <SubmitBar label="Send" />
        ) : (
          <ApplyFilterBar
            labelLink={t("CS_COMMON_CLEAR_ALL")}
            buttonLink={t("CS_COMMON_FILTER")}
            onClear={handleFilterClear}
            onSubmit={handleFilterSubmit}
          />
        )}
      </ActionBar>
      {/* <ActionBar>
        <SubmitBar label="Take Action" />
      </ActionBar> */}
    </React.Fragment>
  );
};

export default Filter;
