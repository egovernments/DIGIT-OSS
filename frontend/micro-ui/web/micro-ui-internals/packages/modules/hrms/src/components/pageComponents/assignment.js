import { CardLabel, CheckBox, DatePicker, Dropdown, LabelFieldPair, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import cleanup from "../Utils/cleanup";
import { convertEpochToDate } from "../Utils/index";

const Assignments = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: data = {}, isLoading } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {};
  const [currentassignemtDate, setCurrentAssiginmentDate] = useState(null);
  const [assignments, setassignments] = useState(
    formData?.Assignments || [
      {
        key: 1,
        fromDate: undefined,
        toDate: undefined,
        isCurrentAssignment: false,
        department: null,
        designation: null,
      },
    ]
  );
  const reviseIndexKeys = () => {
    setassignments((prev) => prev.map((unit, index) => ({ ...unit, key: index })));
  };

  const handleAddUnit = () => {
    setassignments((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        fromDate: undefined,
        toDate: undefined,
        isCurrentAssignment: false,
        department: null,
        designation: null,
      },
    ]);
  };

  const handleRemoveUnit = (unit) => {
    setassignments((prev) => prev.filter((el) => el.key !== unit.key));
    if (FormData.errors?.Assignments?.type == unit.key) {
      clearErrors("Jurisdictions");
    }
    reviseIndexKeys();
  };

  useEffect(() => {
    var promises = assignments?.map((assignment) => {
      return assignment
        ? cleanup({
          id: assignment?.id,
          position: assignment?.position,
          govtOrderNumber: assignment?.govtOrderNumber,
          tenantid: assignment?.tenantid,
          auditDetails: assignment?.auditDetails,
          fromDate: assignment?.fromDate ? new Date(assignment?.fromDate).getTime() : undefined,
          toDate: assignment?.toDate ? new Date(assignment?.toDate).getTime() : undefined,
          isCurrentAssignment: assignment?.isCurrentAssignment,
          department: assignment?.department?.code,
          designation: assignment?.designation?.code,
        })
        : [];
    });

    Promise.all(promises).then(function (results) {
      onSelect(
        config.key,
        results.filter((value) => Object.keys(value).length !== 0)
      );
    });

    assignments.map((ele) => {
      if (ele.isCurrentAssignment) {
        setCurrentAssiginmentDate(ele.fromDate);
      }
    });
  }, [assignments]);

  let department = [];
  let designation = [];
  const [focusIndex, setFocusIndex] = useState(-1);

  function getdepartmentdata() {
    return data?.MdmsRes?.["common-masters"]?.Department.map((ele) => {
      ele["i18key"] = t("COMMON_MASTERS_DEPARTMENT_" + ele.code);
      return ele;
    });
  }
  function getdesignationdata() {
    return data?.MdmsRes?.["common-masters"]?.Designation.map((ele) => {
      ele["i18key"] = t("COMMON_MASTERS_DESIGNATION_" + ele.code);
      return ele;
    });
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      {assignments?.map((assignment, index) => (
        <Assignment
          t={t}
          key={index}
          keys={index.key}
          formData={formData}
          assignment={assignment}
          setassignments={setassignments}
          index={index}
          focusIndex={focusIndex}
          setFocusIndex={setFocusIndex}
          getdepartmentdata={getdepartmentdata}
          department={department}
          designation={designation}
          getdesignationdata={getdesignationdata}
          assignments={assignments}
          handleRemoveUnit={handleRemoveUnit}
          setCurrentAssiginmentDate={setCurrentAssiginmentDate}
          currentassignemtDate={currentassignemtDate}
        />
      ))}
      <label onClick={handleAddUnit} className="link-label" style={{ width: "12rem" }}>
        {t("HR_ADD_ASSIGNMENT")}
      </label>
    </div>
  );
};
function Assignment({
  t,
  assignment,
  assignments,
  setassignments,
  index,
  focusIndex,
  setFocusIndex,
  getdepartmentdata,
  department,
  formData,
  handleRemoveUnit,
  designation,
  getdesignationdata,
  setCurrentAssiginmentDate,
  currentassignemtDate,
}) {
  const selectDepartment = (value) => {
    setassignments((pre) => pre.map((item) => (item.key === assignment.key ? { ...item, department: value } : item)));
  };
  const selectDesignation = (value) => {
    setassignments((pre) => pre.map((item) => (item.key === assignment.key ? { ...item, designation: value } : item)));
  };

  const onAssignmentChange = (value) => {
    setassignments((pre) =>
      pre.map((item) => (item.key === assignment.key ? { ...item, isCurrentAssignment: value } : { ...item, isCurrentAssignment: false }))
    );
    if (value) {
      setassignments((pre) =>
        pre.map((item) =>
          item.key === assignment.key
            ? {
              ...item,
              toDate: null,
            }
            : item
        )
      );
      assignments.map((ele) => {
        if (ele.key == assignment.key) {
          setCurrentAssiginmentDate(ele.fromDate);
        }
      });
    } else {
      setCurrentAssiginmentDate(null);
    }
  };
  const onIsHODchange = (value) => {
    setassignments((pre) => pre.map((item) => (item.key === assignment.key ? { ...item, isHOD: value } : item)));
  };

  const ValidateDatePickers = (value) => {
    assignments;
  };
  return (
    <div key={index + 1} style={{ marginBottom: "16px" }}>
      <div style={{ border: "1px solid #E3E3E3", padding: "16px", marginTop: "8px" }}>
        <LabelFieldPair>
          <div className="label-field-pair" style={{ width: "100%" }}>
            <h2 className="card-label card-label-smaller" style={{ color: "#505A5F" }}>
              {t("HR_ASSIGNMENT")} {index + 1}
            </h2>
          </div>
          {assignments.length > 1 && !assignment?.id && !assignment?.isCurrentAssignment ? (
            <div onClick={() => handleRemoveUnit(assignment)} style={{ marginBottom: "16px", padding: "5px", cursor: "pointer", textAlign: "right" }}>
              X
            </div>
          ) : null}
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel className={assignment?.id ? "card-label-smaller" : "card-label-smaller"}> {`${t("HR_ASMT_FROM_DATE_LABEL")} * `} </CardLabel>
          <div className="field">
            <DatePicker
              type="date"
              name="fromDate"
              max={currentassignemtDate ? currentassignemtDate : convertEpochToDate(new Date())}
              min={formData?.SelectDateofEmployment?.dateOfAppointment}
              disabled={assignment?.id ? true : false}
              onChange={(e) => {
                setassignments((pre) => pre.map((item) => (item.key === assignment.key ? { ...item, fromDate: e } : item)));
                setFocusIndex(index);
              }}
              date={assignment?.fromDate}
              autoFocus={focusIndex === index}
            />
          </div>
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className={assignment?.isCurrentAssignment ? "card-label-smaller" : "card-label-smaller"}>
            {t("HR_ASMT_TO_DATE_LABEL")}
            {assignment?.isCurrentAssignment ? "" : " * "}{" "}
          </CardLabel>
          <div className="field">
            <DatePicker
              type="date"
              name="toDate"
              min={assignment?.fromDate}
              max={currentassignemtDate ? currentassignemtDate : convertEpochToDate(new Date())}
              disabled={assignment?.isCurrentAssignment}
              onChange={(e) => {
                setassignments((pre) => pre.map((item) => (item.key === assignment.key ? { ...item, toDate: e } : item)));
                setFocusIndex(index);
              }}
              date={assignment?.toDate}
              autoFocus={focusIndex === index}
            />
          </div>
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel className="card-label-smaller" style={{ color: "white" }}>
            .
          </CardLabel>
          <div className="field">
            <CheckBox
              onChange={(e) => onAssignmentChange(e.target.checked)}
              checked={assignment?.isCurrentAssignment}
              label={t("HR_CURRENTLY_ASSIGNED_HERE_SWITCH_LABEL")}
            />
          </div>
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className={assignment?.id ? "card-label-smaller" : "card-label-smaller"}> {`${t("HR_DEPT_LABEL")} * `}</CardLabel>
          <Dropdown
            className="form-field"
            selected={assignment?.department}
            disable={assignment?.id ? true : false}
            optionKey={"i18key"}
            option={getdepartmentdata(department) || []}
            select={selectDepartment}
            optionCardStyles={{maxHeight:"300px"}}
            t={t}
          />
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel className={assignment?.id ? "card-label-smaller" : "card-label-smaller"}>{`${t("HR_DESG_LABEL")} * `}</CardLabel>
          <Dropdown
            className="form-field"
            selected={assignment?.designation}
            disable={assignment?.id ? true : false}
            option={getdesignationdata(designation) || []}
            select={selectDesignation}
            optionCardStyles={{maxHeight:"250px"}}
            optionKey={"i18key"}
            t={t}
          />
        </LabelFieldPair>
      </div>
    </div>
  );
}

export default Assignments;
