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
import { ApplyFilterBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Status from "./Status";

const Filter = (props) => {
  // let userType = Digit.SessionStorage.get("userType");
  let { uuid } = Digit.UserService.getUser().info;

  const { t } = useTranslation();
  const { pgr } = useSelector((state) => state);

  const [selectAssigned, setSelectedAssigned] = useState("");
  const [selectedComplaintType, setSelectedComplaintType] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [pendingComplaintCount, setPendingComplaintCount] = useState([]);

  const [pgrfilters, setPgrFilters] = useState({
    serviceCode: [],
    locality: [],
    applicationStatus: [],
  });

  const [wfFilters, setWfFilters] = useState({
    assignee: [],
  });

  //TODO change city fetch from user tenantid
  let localities = Digit.Hooks.pgr.useLocalities({ city: "Amritsar" });
  let complaintStatus = Digit.Hooks.pgr.useComplaintStatus();
  let serviceDefs = Digit.Hooks.pgr.useServiceDefs();

  const onRadioChange = (value) => {
    setSelectedAssigned(value);
    uuid = value.code === "ASSIGNED_TO_ME" ? uuid : "";
    setWfFilters({ ...wfFilters, assignee: [{ code: uuid }] });
  };
  let pgrQuery = {};
  let wfQuery = {};
  useEffect(() => {
    for (const property in pgrfilters) {
      if (Array.isArray(pgrfilters[property])) {
        let params = pgrfilters[property].map((prop) => prop.code).join();
        if (params) {
          pgrQuery[property] = params;
        }
      }
    }
    for (const property in wfFilters) {
      if (Array.isArray(wfFilters[property])) {
        let params = wfFilters[property].map((prop) => prop.code).join();
        if (params) {
          wfQuery[property] = params;
        }
      }
    }
    //queryString = queryString.substring(0, queryString.length - 1);
    handleFilterSubmit({ pgrQuery: pgrQuery, wfQuery: wfQuery });
  }, [pgrfilters, wfFilters]);

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
      setPgrFilters({ ...pgrfilters, applicationStatus: [...pgrfilters.applicationStatus, { code: type.code }] });
    } else {
      const filteredStatus = pgrfilters.applicationStatus.filter((value) => {
        return value.code !== type.code;
      })[0];
      setPgrFilters({ ...pgrfilters, applicationStatus: [{ code: filteredStatus }] });
    }
  };

  function clearAll() {
    setPgrFilters({ serviceCode: [], locality: [], applicationStatus: [] });
    setWfFilters({ assigned: [{ code: [] }] });
    setSelectedAssigned("");
    setSelectedComplaintType(null);
    setSelectedLocality(null);
  }

  const handleFilterSubmit = () => {
    props.onFilterChange({ pgrQuery: pgrQuery, wfQuery: wfQuery });
    //props.onClose();
  };

  const GetSelectOptions = (lable, options, selected, select, optionKey, onRemove, key, displayKey) => (
    <div>
      <div className="filter-label">{lable}</div>
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
              selectedOption={selectAssigned}
              optionsKey="name"
              options={[
                { code: "ASSIGNED_TO_ME", name: t("ASSIGNED_TO_ME") },
                { code: "ASSIGNED_TO_ALL", name: t("ASSIGNED_TO_ALL") },
              ]}
            />
            <div>
              {GetSelectOptions(t("Complaint Subtype"), serviceDefs, selectedComplaintType, complaintType, "i18nKey", onRemove, "serviceCode", "key")}
            </div>
            <div>{GetSelectOptions(t("Locality"), localities, selectedLocality, onSelectLocality, "name", onRemove, "locality", "name")}</div>
            <Status complaints={props.complaints} onAssignmentChange={handleAssignmentChange} pgrfilters={pgrfilters} />
          </div>
        </div>
      </div>
      <ActionBar>
        {props.type === "mobile" && (
          <ApplyFilterBar labelLink={t("CS_COMMON_CLEAR_ALL")} buttonLink={t("CS_COMMON_FILTER")} onClear={clearAll} onSubmit={props.onClose} />
        )}
      </ActionBar>
      {/* <ActionBar>
        <SubmitBar label="Take Action" />
      </ActionBar> */}
    </React.Fragment>
  );
};

export default Filter;
