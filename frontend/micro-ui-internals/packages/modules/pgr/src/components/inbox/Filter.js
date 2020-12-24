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
  // let userType = Digit.SessionStorage.get("userType");
  let { uuid } = Digit.UserService.getUser().info;
  console.log("user in filter uuid--------->:", uuid);

  const { t } = useTranslation();
  const { pgr } = useSelector((state) => state);

  const [selectAssigned, setSelectedAssigned] = useState("");
  const [selectedComplaintType, setSelectedComplaintType] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [pendingComplaintCount, setPendingComplaintCount] = useState([]);

  const [pgrfilters, setPgrFilters] = useState({
    // uuid: [],
    serviceCode: [],
    locality: [],
    applicationStatus: [],
  });

  const [wfFilters, setWfFilters] = useState({
    uuid: [],
  });

  //TODO change city fetch from user tenantid
  let localities = useLocalities({ city: "Amritsar" });
  let complaintStatus = useComplaintStatus();
  let serviceDefs = useServiceDefs();

  const onRadioChange = (value) => {
    setSelectedAssigned(value);
    uuid = value.code === "ASSIGNED_TO_ME" ? uuid : "";
    setWfFilters({ ...wfFilters, uuid: [{ code: uuid }] });
  };

  useEffect(() => {
    let pgrQueryObj = {};
    let wfQueryObj = {};
    for (const property in pgrfilters) {
      if (Array.isArray(pgrfilters[property])) {
        let params = pgrfilters[property].map((prop) => prop.code).join();
        if (params) {
          pgrQueryObj[property] = params;
        }
      }
    }
    for (const property in wfFilters) {
      if (Array.isArray(wfFilters[property])) {
        let params = wfFilters[property].map((prop) => prop.code).join();
        if (params) {
          wfQueryObj[property] = params;
        }
      }
    }
    //queryString = queryString.substring(0, queryString.length - 1);
    handleFilterSubmit({ pgrQuery: pgrQueryObj, wfQuery: wfQueryObj });
  }, [pgrfilters, wfFilters]);

  const getCount = (value) => {
    return (
      pgr.complaints.hasOwnProperty("response") &&
      pgr.complaints.response.filter((complaint) => {
        return complaint.applicationStatus === value;
      }).length
    );
  };

  const getPendingCount = () => {
    let statusWithCount = complaintStatus.map((status) => ({
      ...status,
      count: getCount(status.code),
    }));
    setPendingComplaintCount(statusWithCount);
  };

  useEffect(() => {
    getPendingCount();
  }, [complaintStatus.length]);

  const ifExists = (list, key) => {
    return list.filter((object) => object.code === key.code).length;
  };

  function complaintType(_type) {
    const type = { key: t("SERVICEDEFS." + _type.serviceCode.toUpperCase()), code: _type.serviceCode };
    if (!ifExists(pgrfilters.serviceCode, type)) {
      setPgrFilters({ ...pgrfilters, serviceCode: [...pgrfilters.serviceCode, type] });
    }
  }

  function onSelectLocality(value, type) {
    if (!ifExists(pgrfilters.locality, value)) {
      setPgrFilters({ ...pgrfilters, locality: [...pgrfilters.locality, value] });
    }
  }

  useEffect(() => {
    if (pgrfilters.serviceCode.length > 1) {
      setSelectedComplaintType(`${pgrfilters.serviceCode.length} selected`);
    } else {
      setSelectedComplaintType(pgrfilters.serviceCode[0]);
    }
  }, [pgrfilters.serviceCode]);

  useEffect(() => {
    if (pgrfilters.locality.length > 1) {
      setSelectedLocality(`${pgrfilters.locality.length} selected`);
    } else {
      setSelectedLocality(pgrfilters.locality[0]);
    }
  }, [pgrfilters.locality]);

  const onRemove = (index, key) => {
    let afterRemove = pgrfilters[key].filter((value, i) => {
      return i !== index;
    });
    setPgrFilters({ ...pgrfilters, [key]: afterRemove });
  };

  const handleAssignmentChange = (e, type) => {
    if (e.target.checked) {
      setPgrFilters({ ...pgrfilters, applicationStatus: [...pgrfilters.applicationStatus, type] });
    } else {
      const filteredStatus = pgrfilters.applicationStatus.filter((value) => {
        return value !== type;
      });
      setPgrFilters({ ...pgrfilters, applicationStatus: filteredStatus });
    }
  };

  function clearAll() {
    setPgrFilters({ assigned: [], serviceCode: [], locality: [], applicationStatus: [] });
    setSelectedAssigned("");
    setSelectedComplaintType(null);
    setSelectedLocality(null);
  }

  const handleFilterSubmit = (queryString) => {
    props.onFilterChange(queryString);
  };

  const GetSelectOptions = (lable, options, selected, select, optionKey, onRemove, key, displayKey) => (
    <div>
      <div className="filter-label">{lable}</div>
      {console.log("options heiaisndao", options)}
      <Dropdown option={options} selected={selected} select={(value) => select(value, key)} optionKey={optionKey} />
      <div className="tag-container">
        {pgrfilters[key].length > 0 &&
          pgrfilters[key].map((value, index) => {
            return <RemoveableTag key={index} text={value[displayKey]} onClick={() => onRemove(index, key)} />;
          })}
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">FILTER BY:</div>
            <div className="clearAll" onClick={clearAll}>
              Clear all
            </div>
            {props.type === "desktop" && (
              <span className="clear-search" onClick={clearAll}>
                Clear all
              </span>
            )}
            {props.type === "mobile" && <span onClick={props.onClose}>x</span>}
          </div>
          <div>
            <RadioButtons
              onSelect={onRadioChange}
              selectedoption={selectAssigned}
              optionskey="name"
              options={[
                { code: "ASSIGNED_TO_ME", name: t("ASSIGNED_TO_ME") },
                { code: "ASSIGNED_TO_ALL", name: t("ASSIGNED_TO_ALL") },
              ]}
            />
            <div>
              {GetSelectOptions(t("Complaint Subtype"), serviceDefs, selectedComplaintType, complaintType, "i18nKey", onRemove, "serviceCode", "key")}
            </div>
            <div>{GetSelectOptions(t("Locality"), localities, selectedLocality, onSelectLocality, "name", onRemove, "locality", "name")}</div>
            <div className="status-container">
              <div className="filter-label">Status</div>
              {pendingComplaintCount.map((option, index) => (
                <CheckBox
                  key={index}
                  onChange={(e) => handleAssignmentChange(e, option)}
                  checked={pgrfilters.applicationStatus.filter((e) => e.name === option.name).length !== 0 ? true : false}
                  label={`${option.name} (${option.count})`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ActionBar>
        {props.type === "mobile" && (
          <ApplyFilterBar labelLink={t("CS_COMMON_CLEAR_ALL")} buttonLink={t("CS_COMMON_FILTER")} onClear={clearAll} onSubmit={handleFilterSubmit} />
        )}
      </ActionBar>
      {/* <ActionBar>
        <SubmitBar label="Take Action" />
      </ActionBar> */}
    </React.Fragment>
  );
};

export default Filter;
