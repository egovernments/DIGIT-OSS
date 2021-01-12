import React, { useEffect, useState } from "react";
import { Dropdown, RadioButtons, ActionBar, RemoveableTag, RoundedLabel } from "@egovernments/digit-ui-react-components";
import { ApplyFilterBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Status from "./Status";

const Filter = (props) => {
  let { uuid } = Digit.UserService.getUser().info;

  const { t } = useTranslation();

  const [selectAssigned, setSelectedAssigned] = useState(null);
  const [selectedComplaintType, setSelectedComplaintType] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);

  const [pgrfilters, setPgrFilters] = useState(
    Digit.SessionStorage.get("pgr_filters") || {
      serviceCode: [],
      locality: [],
      applicationStatus: [],
    }
  );

  const [wfFilters, setWfFilters] = useState(
    Digit.SessionStorage.get("pgr_wfFilters") || {
      assignee: [],
    }
  );

  const tenantId = Digit.ULBService.getCurrentTenantId();
  let localities = Digit.Hooks.pgr.useLocalities({ city: tenantId });
  let serviceDefs = Digit.Hooks.pgr.useServiceDefs();

  const onRadioChange = (value) => {
    setSelectedAssigned(value);
    Digit.SessionStorage.set("pgr_assigned", value.code === "ASSIGNED_TO_ME" ? value : "");
    uuid = value.code === "ASSIGNED_TO_ME" ? uuid : "";
    setWfFilters({ ...wfFilters, assignee: [{ code: uuid }] });
  };
  let pgrQuery = {};
  let wfQuery = {};

  useEffect(() => {
    let count = 0;
    for (const property in pgrfilters) {
      if (Array.isArray(pgrfilters[property])) {
        count += pgrfilters[property].length;
        let params = pgrfilters[property].map((prop) => prop.code).join();
        if (params) {
          pgrQuery[property] = params;
        }
      }
    }
    for (const property in wfFilters) {
      if (Array.isArray(wfFilters[property])) {
        count += wfFilters[property].length;
        let params = wfFilters[property].map((prop) => prop.code).join();
        if (params) {
          wfQuery[property] = params;
        }
      }
    }
    Digit.SessionStorage.set("pgr_filters", pgrfilters);
    Digit.SessionStorage.set("pgr_wfFilters", wfFilters);

    Digit.SessionStorage.set("pgr_filter_count", count);
    //queryString = queryString.substring(0, queryString.length - 1);
    handleFilterSubmit({ pgrQuery: pgrQuery, wfQuery: wfQuery });
    // console.log("pgrQuery::::>", pgrQuery, "wfQuery::::>", wfQuery);
    if (Digit.SessionStorage.get("pgr_assigned")) {
      setSelectedAssigned(Digit.SessionStorage.get("pgr_assigned"));
    }
  }, [pgrfilters, wfFilters]);

  const ifExists = (list, key) => {
    return list.filter((object) => object.code === key.code).length;
  };

  function complaintType(_type) {
    const type = { i18nKey: t("SERVICEDEFS." + _type.serviceCode.toUpperCase()), code: _type.serviceCode };
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
      setSelectedComplaintType({ i18nKey: `${pgrfilters.serviceCode.length} selected` });
    } else {
      setSelectedComplaintType(pgrfilters.serviceCode[0]);
    }
  }, [pgrfilters.serviceCode]);

  useEffect(() => {
    if (pgrfilters.locality.length > 1) {
      setSelectedLocality({ name: `${pgrfilters.locality.length} selected` });
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
      });
      setPgrFilters({ ...pgrfilters, applicationStatus: filteredStatus });
    }
  };

  function clearAll() {
    let pgrReset = { serviceCode: [], locality: [], applicationStatus: [] };
    let wfRest = { assigned: [{ code: [] }] };
    setPgrFilters(pgrReset);
    setWfFilters(wfRest);
    setSelectedAssigned("");
    setSelectedComplaintType(null);
    setSelectedLocality(null);

    Digit.SessionStorage.set("pgr_filters", null);
    Digit.SessionStorage.set("pgr_wfFilters", null);
    Digit.SessionStorage.set("pgr_assigned", null);
  }

  const handleFilterSubmit = () => {
    props.onFilterChange({ pgrQuery: pgrQuery, wfQuery: wfQuery });
  };

  const GetSelectOptions = (lable, options, selected = null, select, optionKey, onRemove, key) => {
    selected = selected || { [optionKey]: " ", code: "" };
    return (
      <div>
        <div className="filter-label">{lable}</div>
        {<Dropdown option={options} selected={selected} select={(value) => select(value, key)} optionKey={optionKey} />}

        <div className="tag-container">
          {pgrfilters[key].length > 0 &&
            pgrfilters[key].map((value, index) => {
              return <RemoveableTag key={index} text={value[optionKey]} onClick={() => onRemove(index, key)} />;
            })}
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">{t("FILTER_BY")}:</div>
            <div className="clearAll" onClick={clearAll}>
              {t("CS_COMMON_CLEAR_ALL")}
            </div>
            {props.type === "desktop" && (
              <span className="clear-search" onClick={clearAll}>
                {t("CS_COMMON_CLEAR_ALL")}
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
              {GetSelectOptions(
                t("CS_COMPLAINT_DETAILS_COMPLAINT_SUBTYPE"),
                serviceDefs,
                selectedComplaintType,
                complaintType,
                "i18nKey",
                onRemove,
                "serviceCode"
              )}
            </div>
            <div>{GetSelectOptions(t("Locality"), localities, selectedLocality, onSelectLocality, "name", onRemove, "locality")}</div>
            {<Status complaints={props.complaints} onAssignmentChange={handleAssignmentChange} pgrfilters={pgrfilters} />}
          </div>
        </div>
      </div>
      <ActionBar>
        {props.type === "mobile" && (
          <ApplyFilterBar labelLink={t("CS_COMMON_CLEAR_ALL")} buttonLink={t("CS_COMMON_FILTER")} onClear={clearAll} onSubmit={props.onClose} />
        )}
      </ActionBar>
    </React.Fragment>
  );
};

export default Filter;
