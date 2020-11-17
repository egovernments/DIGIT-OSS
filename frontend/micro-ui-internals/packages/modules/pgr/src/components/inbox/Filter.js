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
  //   const [selected, setSelected] = useState("");
  const dispatch = useDispatch();
  //const dispatchFilterChange = useCallback((filters) => dispatch(applyFilters(filters)), [dispatch]);
  const getComplaints = useCallback((filters) => dispatch(searchComplaints(filters)), [dispatch]);

  const SessionStorage = Digit.SessionStorage;
  const MDMSService = Digit.MDMSService;
  const onRadioChange = (e) => {};

  const onSelect = () => {
    console.log("onSelect");
  };

  const appState = useSelector((state) => state);
  const [localMenu, setLocalMenu] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentSelected, setCurrentSelected] = useState([]);
  const [pendingComplaintCount, setPendingComplaintCount] = useState({ pendingAssignment: 0, pendingReAssignment: 0 });

  const [filters, setFilters] = useState({
    assigned: {
      assignedToMe: false,
      assignedToAll: false,
    },
    complaintType: [],
    locality: [],
    // pendingForAssignment: false,
    // pendingForReAssignment: false,
    pending: {
      pendingforassignment: false,
      pendingforreassignment: false,
    },
  });

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
      console.log(`${property}: ${filters.pending[property]}`);
      queryString += filters.pending[property] ? `${property},` : "";
    }
    queryString = queryString.substring(0, queryString.length - 1);
    getComplaints({ status: queryString });
  }, [filters]);

  const getPendingCount = () => {
    const pendingForAssignment = appState.complaints.list.filter((complaint) => {
      return complaint.service.applicationStatus === "PENDINGFORASSIGNMENT";
    }).length;
    const pendingForReAssignment = appState.complaints.list.filter((complaint) => {
      return complaint.service.applicationStatus === "PENDINGFORREASSIGNMENT";
    }).length;
    setPendingComplaintCount({ pendingForAssignment, pendingForReAssignment });
  };

  useEffect(() => {
    getPendingCount();
  }, []);

  function selected(type) {
    currentSelected.push(type);
    setCurrentSelected(currentSelected);
    setFilters({ ...filters, complaintType: currentSelected });
    if (currentSelected.length > 1) {
      setSelectedOption(`${currentSelected.length} selected`);
    } else {
      setSelectedOption(type);
    }
    SessionStorage.set("complaintType", type);
  }

  const onRemoveComplaintType = (index) => {
    let afterRemove = currentSelected.filter((value, i) => {
      return i !== index;
    });
    setCurrentSelected(afterRemove);
  };

  const handleAssignmentChange = (type) => {
    setFilters({ ...filters, pending: { ...filters.pending, [type]: !filters.pending[type] } });
  };

  return (
    <div style={{ padding: "16px", backgroundColor: "rgb(250, 250, 250)" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <CardCaption>FILTER BY:</CardCaption>
        <div>Clear all</div>
      </div>
      <div>
        <RadioButtons
          // handleChange={onRadioChange}
          onSelect={onRadioChange}
          selectedOption={selected}
          // selected={(value) => setSelected(value)}
          options={["Assigned To Me", "Assigned To ALL"]}
        />
        <div>
          <div>
            <CardLabel>Complaint Type *</CardLabel>
            <Dropdown option={localMenu} selected={selectedOption} style={{ width: "100%" }} select={selected} />
            {console.log("currentSelected:::", currentSelected)}

            {currentSelected.length > 0 &&
              currentSelected.map((value, index) => {
                return <span onClick={() => onRemoveComplaintType(index)}>{value}</span>;
              })}
          </div>
          <div>
            <CardLabel>Locality</CardLabel>
            <Dropdown style={{ width: "100%" }} />
          </div>
        </div>
        <div>
          <CheckBox
            onChange={() => handleAssignmentChange("pendingforassignment")}
            label={`Pending Assignment (${pendingComplaintCount.pendingForAssignment})`}
          />
          <CheckBox
            onChange={() => handleAssignmentChange("pendingforreassignment")}
            label={`Pending Reassignment (${pendingComplaintCount.pendingForReAssignment})`}
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;
