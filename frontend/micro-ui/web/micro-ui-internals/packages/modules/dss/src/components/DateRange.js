import { Calender } from "@egovernments/digit-ui-react-components";
import {
  addHours,
  addMinutes,
  addMonths,
  addSeconds,
  differenceInDays,
  endOfMonth,
  endOfDay,
  endOfQuarter,
  endOfToday,
  endOfWeek,
  endOfYear,
  endOfYesterday,
  format,
  startOfMonth,
  startOfQuarter,
  startOfToday,
  startOfWeek,
  startOfYear,
  startOfYesterday,
  subSeconds,
  subYears,
} from "date-fns";
import React, { useEffect, Fragment, useMemo, useRef, useState } from "react";
import { createStaticRanges, DateRangePicker } from "react-date-range";

function isEndDateFocused(focusNumber) {
  return focusNumber === 1;
}

function isStartDateFocused(focusNumber) {
  return focusNumber === 0;
}

const DateRange = ({ values, onFilterChange, t }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusedRange, setFocusedRange] = useState([0, 0]);
  const [selectionRange, setSelectionRange] = useState(values);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (!isModalOpen) {
      const startDate = selectionRange?.startDate;
      const endDate = selectionRange?.endDate;
      const interval = getDuration(selectionRange?.startDate, selectionRange?.endDate);
      const title = `${format(selectionRange?.startDate, "MMM d, yyyy")} - ${format(selectionRange?.endDate, "MMM d, yyyy")}`;
      onFilterChange({ range: { startDate, endDate, interval, title }, requestDate: { startDate, endDate, interval, title } });
    }
  }, [selectionRange, isModalOpen]);

  const staticRanges = useMemo(() => {
    return createStaticRanges([
      {
        label: t("DSS_TODAY"),
        range: () => ({
          startDate: startOfToday(new Date()),
          endDate: endOfToday(new Date()),
        }),
      },
      {
        label: t("DSS_YESTERDAY"),
        range: () => ({
          startDate: startOfYesterday(new Date()),
          endDate: subSeconds(endOfYesterday(new Date()), 1),
        }),
      },
      {
        label: t("DSS_THIS_WEEK"),
        range: () => ({
          startDate: startOfWeek(new Date()),
          endDate: endOfToday(new Date()),
        }),
      },
      {
        label: t("DSS_THIS_MONTH"),
        range: () => ({
          startDate: startOfMonth(new Date()),
          endDate: endOfToday(new Date()),
          // endDate: subSeconds(endOfMonth(new Date()), 1),
        }),
      },
      {
        label: t("DSS_THIS_QUARTER"),
        range: () => ({
          startDate: startOfQuarter(new Date()),
          endDate: subSeconds(endOfToday(new Date()), 1),
          // endDate: subSeconds(endOfQuarter(new Date()), 1),
        }),
      },
      {
        label: t("DSS_PREVIOUS_YEAR"),
        range: () => {
          if (new Date().getMonth() < 3) {
            return {
              startDate: subYears(addMonths(startOfYear(new Date()), 3), 2),
              endDate: subSeconds(subYears(addMonths(endOfYear(new Date()), 3), 2), 1),
            };
          } else {
            return {
              startDate: subYears(addMonths(startOfYear(new Date()), 3), 1),
              endDate: subSeconds(subYears(addMonths(endOfYear(new Date()), 3), 1), 1),
            };
          }
        },
      },
      {
        label: t("DSS_THIS_YEAR"),
        range: () => {
          return {
            startDate: Digit.Utils.dss.getDefaultFinacialYear().startDate,
            endDate: Digit.Utils.dss.getDefaultFinacialYear().endDate,
          };
          /*
          Removed Current financial thing
          const currDate = new Date().getMonth();
          if (currDate < 3) {
            return {
              startDate: subYears(addMonths(startOfYear(new Date()), 3), 1),
              endDate: subSeconds(subYears(addMonths(endOfYear(new Date()), 3), 1), 1),
            };
          } else {
            return {
              startDate: addMonths(startOfYear(new Date()), 3),
              endDate: subSeconds(addMonths(endOfYear(new Date()), 3), 1),
            };
          }
          */
        },
      },
    ]);
  }, []);
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

  const handleSelect = (ranges, e) => {
    let { range1: selection } = ranges;
    selection = { ...selection, endDate: endOfDay(selection?.endDate) };
    const { startDate, endDate, title, interval } = selection;
    if (
      staticRanges.some((range) => {
        let newRange = range.range();
        return differenceInDays(newRange.startDate, startDate) === 0 && differenceInDays(newRange.endDate, endDate) === 0;
      })
    ) {
      setSelectionRange(selection);
      setIsModalOpen(false);
    } else if (isStartDateFocused(focusedRange[1])) {
      setSelectionRange(selection);
    } else if (isEndDateFocused(focusedRange[1])) {
      setSelectionRange({ title, interval, startDate, endDate: endDate });
      setIsModalOpen(false);
    }
  };

  const handleFocusChange = (focusedRange) => {
    const [rangeIndex, rangeStep] = focusedRange;
    setFocusedRange(focusedRange);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="mbsm">{t(`ES_DSS_DATE_RANGE`)}</div>
      <div className="employee-select-wrap" ref={wrapperRef}>
        <div className={`select ${isModalOpen ? "dss-input-active-border" : ""}`}>
          <input
            className={`employee-select-wrap--elipses`}
            type="text"
            value={values?.title ? `${values?.title}` : ""}
            readOnly
            onClick={() => setIsModalOpen((prevState) => !prevState)}
          />
          <Calender className="cursorPointer" onClick={() => setIsModalOpen((prevState) => !prevState)} />
        </div>
        {isModalOpen && (
          <div className="options-card" style={{ overflow: "visible", width: "unset", maxWidth: "unset" }}>
            <DateRangePicker
              className="pickerShadow"
              focusedRange={focusedRange}
              ranges={[selectionRange]}
              rangeColors={["#9E9E9E"]}
              onChange={handleSelect}
              onRangeFocusChange={setFocusedRange}
              retainEndDateOnFirstSelection={true}
              showSelectionPreview={true}
              staticRanges={staticRanges}
              inputRanges={[]}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DateRange;
