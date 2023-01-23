import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

const WeekDateRange = (props) => {
  const [localSearchParams, setLocalSearchParams] = useState(() => ({}));
  const { t } = useTranslation();
  const handleChange = useCallback((data) => {
    setLocalSearchParams(() => ({ ...data }));
  }, []);

  return (
    <div className="employee-data-table">
      <div className="row border-none date-range-pair">
        <h2>{props.title}</h2>
        <div className="value">
          <AttendancePDateRange
            t={t}
            values={localSearchParams?.range}
            onFilterChange={handleChange}
            filterLabel="MARK_ATTENDENCE_FOR_WEEK"
            classname="attendance-date-range"
            labelRequired={false}
          />
        </div>
      </div>
    </div>
  );
};

export default WeekDateRange;
