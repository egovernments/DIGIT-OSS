import React, { Fragment, useEffect, useState } from "react";
import { ArrowDown, Modal, ButtonSelector, Calender } from "@egovernments/digit-ui-react-components";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";

function isEndDateFocused(focusNumber) {
  return focusNumber === 1;
}

const DateRange = ({ values, onFilterChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusedRange, setFocusedRange] = useState([0, 0]);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const getDuration = (startDate, endDate) => {
    let noOfDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    if (noOfDays > 91) {
      return "month";
    }
    if (noOfDays < 90 && noOfDays >= 14) {
      return "week";
    }
    if (noOfDays <= 14) {
      return "day";
    }
  };

  const handleSelect = (ranges) => {
    const { range1: selection } = ranges;
    setSelectionRange(selection);
    handleSubmit(selection);
  };

  const handleFocusChange = (focusedRange) => {
    setFocusedRange(focusedRange);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (selectionRange) => {
    const startDate = selectionRange?.startDate;
    const endDate = selectionRange?.endDate;
    const duration = getDuration(selectionRange?.startDate, selectionRange?.endDate);
    const title = `${format(selectionRange?.startDate, "MMM d, yy")} - ${format(selectionRange?.endDate, "MMM d, yy")}`;
    onFilterChange({ range: { startDate, endDate, duration, title } });
    if (isEndDateFocused(focusedRange[1])) {
      setIsModalOpen(false);
    }
  };
  return (
    <>
      <div>Date Range</div>
      <div className="employee-select-wrap">
        <div className="select">
          <input className="employee-select-wrap--elipses" type="text" value={values?.title ? `${values?.title}` : ""} />
          <Calender onClick={() => setIsModalOpen((prevState) => !prevState)} />
        </div>
        {isModalOpen && (
          <div className="options-card" style={{ overflow: "visible", width: "unset", maxWidth: "unset" }}>
            <DateRangePicker
              focusedRange={focusedRange}
              ranges={[values]}
              rangeColors={["#f47738"]}
              onChange={handleSelect}
              onRangeFocusChange={handleFocusChange}
              showSelectionPreview={true}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DateRange;
