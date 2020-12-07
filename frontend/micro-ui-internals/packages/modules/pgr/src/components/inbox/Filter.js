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
import { useDispatch, useSelector } from "react-redux";
import { searchComplaints } from "../../redux/actions";
import useLocalities from "../../hooks/useLocalities";
import useComplaintStatus from "../../hooks/useComplaintStatus";
import { ApplyFilterBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const Filter = (props) => {
  // let userType = Digit.SessionStorage.get("userType");
  const SessionStorage = Digit.SessionStorage;
  const MDMSService = Digit.MDMSService;
  const [selectAssigned, setSelectedAssigned] = useState("");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  //const dispatchFilterChange = useCallback((filters) => dispatch(applyFilters(filters)), [dispatch]);
  const getComplaints = useCallback((filters) => dispatch(searchComplaints(filters)), [dispatch]);
  let localities = useLocalities({ city: "Amritsar" });
  let complaintStatus = useComplaintStatus();
  console.log("useComplaintStatus:", complaintStatus);

  const assignmentOptions = [
    { lable: "Pending Assignment", type: "pendingforassignment" },
    { lable: "Pending Reassignment", type: "pendingforreassignment" },
  ];

  const onRadioChange = (value) => {
    console.log("onSelect", value);
    setSelectedAssigned(value);
    setFilters({ ...filters, assigned: value });
  };

  const { common, pgr } = useSelector((state) => state);

  console.log("appstate:::>>", common, pgr);

  const [localMenu, setLocalMenu] = useState([]);
  const [selectedComplaintType, setSelectedComplaintType] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [currentLocalities, setCurrentLocalities] = useState([]);
  const [pendingComplaintCount, setPendingComplaintCount] = useState([]);

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
          tenantId: common.stateInfo.code,
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
  }, [common]);

  useEffect(() => {
    let queryString = "";
    for (const property in filters.pending) {
      queryString += filters.pending[property] ? `${property},` : "";
    }
    queryString = queryString.substring(0, queryString.length - 1);
    getComplaints({ status: queryString });
  }, [filters]);

  const getCount = (value) => {
    console.log("pgr.complaint:", pgr.complaints);
    return (
      pgr.complaints &&
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

    // const pendingForAssignment =
    //   pgr.complaints &&
    //   pgr.complaints.response.filter((complaint) => {
    //     console.log("complaint 1:", complaint);
    //     return complaint.serviceCode === "PENDINGFORASSIGNMENT";
    //   }).length;
    // const pendingForReAssignment =
    //   pgr.complaints &&
    //   pgr.complaints.response.filter((complaint) => {
    //     console.log("complaint 2:", complaint);
    //     return complaint.serviceCode === "PENDINGFORREASSIGNMENT";
    //   }).length;
    // setPendingComplaintCount({ pendingForAssignment, pendingForReAssignment });
  };

  useEffect(() => {
    getPendingCount();
  }, [complaintStatus.length]);

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
    if (e.target.checked) {
      setFilters({ ...filters, applicationStatus: [...filters.applicationStatus, type] });
    } else {
      const filteredStatus = filters.applicationStatus.filter((value) => {
        return value !== type;
      });
      setFilters({ ...filters, applicationStatus: filteredStatus });
    }
  };

  const handleFilterClear = () => {
    console.log("hhhh");
  };

  const handleFilterSubmit = () => {
    console.log("handleFilterSubmit");
    console.log("filters:", filters);
  };

  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">FILTER BY:</div>
            <div className="clearAll">Clear all</div>
          </div>
          <div>
            <RadioButtons onSelect={onRadioChange} selectedComplaintType={selectAssigned} options={["Assigned To Me", "Assigned To ALL"]} />
            <div>
              <div>
                <div className="filter-label">Complaint Subtype *</div>
                <Dropdown option={localMenu} selected={selectedComplaintType} select={complaintType} style={{ width: "100%" }} />
                <div className="tag-container">
                  {filters.serviceCodes.length > 0 &&
                    filters.serviceCodes.map((value, index) => {
                      return <RemoveableTag text={value} onClick={() => onRemoveComplaintType(index)} />;
                    })}
                </div>
              </div>
              <div>
                <div className="filter-label">Locality *</div>
                <Dropdown option={localities} selected={selectedLocality} select={onSelectLocality} style={{ width: "100%" }} />
                <div className="tag-container">
                  {filters.localities.length > 0 &&
                    filters.localities.map((value, index) => {
                      return <RemoveableTag text={value} onClick={() => onRemoveLocality(index)} />;
                    })}
                </div>
              </div>
            </div>
            <div className="status-container">
              <div className="filter-label">Status</div>
              {console.log("pendingComplaintCount:", pendingComplaintCount)}
              {pendingComplaintCount.map((option) => (
                <CheckBox onChange={(e) => handleAssignmentChange(e, option.type)} label={`${option.name} (${option.count})`} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ActionBar>
        {console.log("props.type :", props.type)}
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
