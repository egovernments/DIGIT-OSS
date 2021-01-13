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
  let { uuid } = Digit.UserService.getUser().info;

  const { t } = useTranslation();
  const { pgr } = useSelector((state) => state);

  const [selectAssigned, setSelectedAssigned] = useState("");
  const [selectedApplicationType, setSelectedApplicationType] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [pendingApplicationCount, setPendingApplicationCount] = useState([]);

  const [pgrfilters, setPgrFilters] = useState({
    serviceCode: [],
    locality: ["ALakapuri", "Railway medical Colony"],
    applicationStatus: [],
  });

  const [wfFilters, setWfFilters] = useState({
    assignee: [],
  });

  //TODO change city fetch from user tenantid
  // let localities = Digit.Hooks.pgr.useLocalities({ city: "Amritsar" });
  let localities = ["Alakapuri", "Railway medical Colony"];
  // let applicationStatus = Digit.Hooks.pgr.useApplicationStatus();
  // let serviceDefs = Digit.Hooks.pgr.useServiceDefs();

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

  function applicationType(_type) {
    const type = { key: t("SERVICEDEFS." + _type.serviceCode.toUpperCase()), code: _type.serviceCode };
    if (!ifExists(pgrfilters.serviceCode, type)) {
      setPgrFilters({ ...pgrfilters, serviceCode: [...pgrfilters.serviceCode, type] });
    }
  }

  function onSelectLocality(value, type) {
    // if (!ifExists(pgrfilters.locality, value)) {
    //   setPgrFilters({ ...pgrfilters, locality: [...pgrfilters.locality, value] });
    // }
    setPgrFilters((prevState) => {
      return { ...prevState, locality: [...prevState.locality.filter((item) => item !== value), value] };
    });
  }

  useEffect(() => {
    if (pgrfilters.serviceCode.length > 1) {
      setSelectedApplicationType(`${pgrfilters.serviceCode.length} selected`);
    } else {
      setSelectedApplicationType(pgrfilters.serviceCode[0]);
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
    setSelectedApplicationType(null);
    setSelectedLocality(null);
  }

  const handleFilterSubmit = () => {
    props.onFilterChange({ pgrQuery: pgrQuery, wfQuery: wfQuery });
    //props.onClose();
  };

  const GetSelectOptions = (lable, options, selected, select, optionKey, onRemove, key, displayKey) => (
    <div>
      <div className="filter-label">{lable}</div>
      <Dropdown
        option={options}
        selected={selected}
        select={(value) => {
          select(value, key);
        }}
      />
      <div className="tag-container">
        {pgrfilters[key].length > 0 &&
          pgrfilters[key].map((value, index) => {
            if (value[displayKey]) {
              return <RemoveableTag key={index} text={value[displayKey]} onClick={() => onRemove(index, key)} />;
            } else {
              return <RemoveableTag key={index} text={value} onClick={() => onRemove(index, key)} />;
            }
          })}
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">{t("ES_INBOX_FILTER_BY")}:</div>
            <div className="clearAll" onClick={clearAll}>
              {t("ES_COMMON_CLEAR_ALL")}
            </div>
            {props.type === "desktop" && (
              <span className="clear-search" onClick={clearAll}>
                {t("ES_COMMON_CLEAR_ALL")}
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
                { code: "ASSIGNED_TO_ME", name: t("ES_INBOX_ASSIGNED_TO_ME") },
                { code: "ASSIGNED_TO_ALL", name: t("ES_INBOX_ASSIGNED_TO_ALL") },
              ]}
            />
            <div>
              {GetSelectOptions(t("ES_INBOX_LOCALITY"), localities, selectedLocality, onSelectLocality, "name", onRemove, "locality", "name")}
            </div>
            <Status applications={props.applications} onAssignmentChange={handleAssignmentChange} pgrfilters={pgrfilters} />
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
