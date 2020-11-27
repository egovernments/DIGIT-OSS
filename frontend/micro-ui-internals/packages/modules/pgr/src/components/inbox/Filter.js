import React, { useCallback, useEffect, useState } from "react";
import { Card, CardCaption } from "@egovernments/digit-ui-react-components";
import { RadioButtons } from "@egovernments/digit-ui-react-components";
import { Dropdown } from "@egovernments/digit-ui-react-components";
import { CardLabel } from "@egovernments/digit-ui-react-components";
import { CheckBox } from "@egovernments/digit-ui-react-components";
import { useDispatch, useSelector } from "react-redux";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { applyFilters, searchComplaints } from "../../redux/actions";

const Filter = (props) => {
  const [selectAssigned, setSelectedAssigned] = useState("");
  const dispatch = useDispatch();
  //const dispatchFilterChange = useCallback((filters) => dispatch(applyFilters(filters)), [dispatch]);
  const getComplaints = useCallback((filters) => dispatch(searchComplaints(filters)), [dispatch]);

  const SessionStorage = Digit.SessionStorage;
  const MDMSService = Digit.MDMSService;

  const assignmentOptions = [
    { lable: "Pending Assignment", type: "pendingforassignment" },
    { lable: "Pending Reassignment", type: "pendingforreassignment" },
  ];

  const onRadioChange = (value) => {
    console.log("onSelect", value);
    setSelectedAssigned(value);
    setFilters({ ...filters, assigned: value });
  };

  const appState = useSelector((state) => state);

  console.log("appstate:::>>", appState);

  const [localMenu, setLocalMenu] = useState([]);
  const [selectedComplaintType, setSelectedComplaintType] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [currentLocalities, setCurrentLocalies] = useState([]);
  const [pendingComplaintCount, setPendingComplaintCount] = useState({ pendingAssignment: 0, pendingReAssignment: 0 });

  const [filters, setFilters] = useState({
    assigned: "",
    serviceCodes: [],
    localities: [],
    applicationStatus: [],
  });

  //TODO: Move this to separate hook
  useEffect(() => {
    (async () => {
      const criteria = {
        type: "serviceDefs",
        details: {
          tenantId: appState.stateInfo.code,
          moduleDetails: [
            {
              moduleName: "RAINMAKER-PGR",
              masterDetails: [
                {
                  name: "ServiceDefs",
                },
              ],
            },
          ],
        },
      };

      const serviceDefs = await MDMSService.getDataByCriteria(criteria);
      SessionStorage.set("serviceDefs", serviceDefs);
      var __localMenu__ = [];
      await Promise.all(
        serviceDefs.map((def) => {
          if (!__localMenu__.find((e) => e.key === def.menuPath)) {
            def.menuPath === "" ? __localMenu__.push("SERVICEDEFS.OTHERS") : __localMenu__.push("SERVICEDEFS." + def.menuPath.toUpperCase());
          }
        })
      );
      setLocalMenu(__localMenu__);
    })();
  }, [appState]);

  useEffect(() => {
    let queryString = "";
    for (const property in filters.pending) {
      queryString += filters.pending[property] ? `${property},` : "";
    }
    queryString = queryString.substring(0, queryString.length - 1);
    getComplaints({ status: queryString });
  }, [filters]);

  // const getPendingCount = () => {
  //   const pendingForAssignment =
  //     appState.complaints &&
  //     appState.complaints.list.filter((complaint) => {
  //       return complaint.service.applicationStatus === "PENDINGFORASSIGNMENT";
  //     }).length;
  //   const pendingForReAssignment =
  //     appState.complaints &&
  //     appState.complaints.list.filter((complaint) => {
  //       return complaint.service.applicationStatus === "PENDINGFORREASSIGNMENT";
  //     }).length;
  //   setPendingComplaintCount({ pendingForAssignment, pendingForReAssignment });
  // };

  // useEffect(() => {
  //   getPendingCount();
  // }, []);

  function complaintType(type) {
    setFilters({ ...filters, serviceCodes: [...filters.serviceCodes, type] });
  }

  function onSelectLocality(type) {
    setFilters({ ...filters, localities: [...filters.localities, type] });
  }

  useEffect(() => {
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

  const onRemoveComplaintType = (index) => {
    let afterRemove = filters.serviceCodes.filter((value, i) => {
      return i !== index;
    });
    setFilters({ ...filters, serviceCodes: afterRemove });
  };

  const onRemoveLocality = (index) => {
    let afterRemove = filters.localities.filter((value, i) => {
      return i !== index;
    });
    setFilters({ ...filters, localities: afterRemove });
  };

  const handleAssignmentChange = (e, type) => {
    console.log("e:::>", e.target.checked);
    if (e.target.checked) {
      setFilters({ ...filters, applicationStatus: [...filters.applicationStatus, type] });
    } else {
      const filteredStatus = filters.applicationStatus.filter((value) => {
        return value !== type;
      });
      setFilters({ ...filters, applicationStatus: filteredStatus });
    }
  };

  return (
    <div className="filter-card">
      {console.log("filters", filters)}
      <div class="heading">
        <CardCaption>FILTER BY:</CardCaption>
        <div>Clear all</div>
      </div>
      <div>
        <RadioButtons onSelect={onRadioChange} selectedComplaintType={selectAssigned} options={["Assigned To Me", "Assigned To ALL"]} />
        <div>
          <div>
            <CardLabel>Complaint Type *</CardLabel>
            <Dropdown option={localMenu} selected={selectedComplaintType} select={complaintType} style={{ width: "100%" }} />

            {filters.serviceCodes.length > 0 &&
              filters.serviceCodes.map((value, index) => {
                return <span onClick={() => onRemoveComplaintType(index)}>{value}</span>;
              })}
          </div>
          <div>
            <CardLabel>Locality *</CardLabel>
            <Dropdown option={["SUN1", "SUN2"]} selected={selectedLocality} select={onSelectLocality} style={{ width: "100%" }} />
            {filters.localities.length > 0 &&
              filters.localities.map((value, index) => {
                return <span onClick={() => onRemoveLocality(index)}>{value}</span>;
              })}
          </div>
        </div>
        <div>
          <div>
            {assignmentOptions.map((option) => (
              <CheckBox
                onChange={(e) => handleAssignmentChange(e, option.type)}
                label={`${option.lable} (${pendingComplaintCount.pendingForAssignment})`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
