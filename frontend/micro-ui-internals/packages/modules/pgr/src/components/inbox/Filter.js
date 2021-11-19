import React, { useEffect, useMemo, useState } from "react";
import { Dropdown, RadioButtons, ActionBar, RemoveableTag, RoundedLabel } from "@egovernments/digit-ui-react-components";
import { ApplyFilterBar, CloseSvg } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Status from "./Status";

let pgrQuery = {};
let wfQuery = {};

const Filter = (props) => {
  let { uuid } = Digit.UserService.getUser().info;
  const { searchParams } = props;
  const { t } = useTranslation();
  const isAssignedToMe = searchParams?.filters?.wfFilters?.assignee && searchParams?.filters?.wfFilters?.assignee[0]?.code ? true : false;

  const assignedToOptions = useMemo(
    () => [
      { code: "ASSIGNED_TO_ME", name: t("ASSIGNED_TO_ME") },
      { code: "ASSIGNED_TO_ALL", name: t("ASSIGNED_TO_ALL") },
    ],
    [t]
  );

  const [selectAssigned, setSelectedAssigned] = useState(isAssignedToMe ? assignedToOptions[0] : assignedToOptions[1]);

  useEffect(() => setSelectedAssigned(isAssignedToMe ? assignedToOptions[0] : assignedToOptions[1]), [t]);

  const [selectedComplaintType, setSelectedComplaintType] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [pgrfilters, setPgrFilters] = useState(
    searchParams?.filters?.pgrfilters || {
      serviceCode: [],
      locality: [],
      applicationStatus: [],
    }
  );

  const [wfFilters, setWfFilters] = useState(
    searchParams?.filters?.wfFilters || {
      assignee: [{ code: uuid }],
    }
  );

  const tenantId = Digit.ULBService.getCurrentTenantId();
  // let localities = Digit.Hooks.pgr.useLocalities({ city: tenantId });
  const { data: localities } = Digit.Hooks.useBoundaryLocalities(tenantId, "admin", {}, t);
  let serviceDefs = Digit.Hooks.pgr.useServiceDefs(tenantId, "PGR");

  const onRadioChange = (value) => {
    setSelectedAssigned(value);
    uuid = value.code === "ASSIGNED_TO_ME" ? uuid : "";
    setWfFilters({ ...wfFilters, assignee: [{ code: uuid }] });
  };

  useEffect(() => {
    let count = 0;
    for (const property in pgrfilters) {
      if (Array.isArray(pgrfilters[property])) {
        count += pgrfilters[property].length;
        let params = pgrfilters[property].map((prop) => prop.code).join();
        if (params) {
          pgrQuery[property] = params;
        }
        else{
          delete pgrQuery?.[property]
        }
      }
    }
    for (const property in wfFilters) {
      if (Array.isArray(wfFilters[property])) {
        let params = wfFilters[property].map((prop) => prop.code).join();
        if (params) {
          wfQuery[property] = params;
        } else {
          wfQuery = {};
        }
      }
    }
    count += wfFilters?.assignee?.length || 0;

    if (props.type !== "mobile") {
      handleFilterSubmit();
    }

    Digit.inboxFilterCount = count;
  }, [pgrfilters, wfFilters]);

  const ifExists = (list, key) => {
    return list.filter((object) => object.code === key.code).length;
  };
  function applyFiltersAndClose() {
    handleFilterSubmit();
    props.onClose();
  }
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
    pgrQuery = {};
    wfQuery = {};
    setSelectedAssigned("");
    setSelectedComplaintType(null);
    setSelectedLocality(null);
  }

  const handleFilterSubmit = () => {
    props.onFilterChange({ pgrQuery: pgrQuery, wfQuery: wfQuery, wfFilters, pgrfilters });
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
              return <RemoveableTag key={index} text={`${value[optionKey].slice(0, 22)} ...`} onClick={() => onRemove(index, key)} />;
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
            <div className="filter-label">{t("ES_COMMON_FILTER_BY")}:</div>
            <div className="clearAll" onClick={clearAll}>
              {t("ES_COMMON_CLEAR_ALL")}
            </div>
            {props.type === "desktop" && (
              <span className="clear-search" onClick={clearAll}>
                {t("ES_COMMON_CLEAR_ALL")}
              </span>
            )}
            {props.type === "mobile" && (
              <span onClick={props.onClose}>
                <CloseSvg />
              </span>
            )}
          </div>
          <div>
            <RadioButtons onSelect={onRadioChange} selectedOption={selectAssigned} optionsKey="name" options={assignedToOptions} />
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
            <div>{GetSelectOptions(t("CS_PGR_LOCALITY"), localities, selectedLocality, onSelectLocality, "i18nkey", onRemove, "locality")}</div>
            {<Status complaints={props.complaints} onAssignmentChange={handleAssignmentChange} pgrfilters={pgrfilters} />}
          </div>
        </div>
      </div>
      <ActionBar>
        {props.type === "mobile" && (
          <ApplyFilterBar
            labelLink={t("ES_COMMON_CLEAR_ALL")}
            buttonLink={t("ES_COMMON_FILTER")}
            onClear={clearAll}
            onSubmit={applyFiltersAndClose}
          />
        )}
      </ActionBar>
    </React.Fragment>
  );
};

export default Filter;
