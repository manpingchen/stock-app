import { useContext, useEffect } from "react";
import { DateRangeContext } from "../pages/TimeSeriesChart";
import { dayRanges } from "../config/dayRanges";
import "./DateRanger.scss";

function DateRanger() {
  const {
    isPending,
    setChartData,
    metaData,
    selectedRange,
    setSelectedRange,
    handleUpdateDayRange,
  } = useContext(DateRangeContext);

  const handleButtonOnClick = (range) => {
    setSelectedRange(range);
    setChartData(null);
    handleUpdateDayRange({ range });
  };

  const isActive = (value) => selectedRange === value;

  const { daily } = metaData;

  useEffect(() => {
    if (daily) {
      setSelectedRange("7days");
    } else {
      setSelectedRange("1day");
    }
  }, [daily, setSelectedRange]);

  return (
    <div className="buttons">
      {dayRanges.map((range, index) => {
        if (daily && range.value === "1day") return null;
        return (
          <button
            type="button"
            key={index}
            className={isActive(range.value) ? "active" : null}
            disabled={isActive(range.value) || isPending}
            onClick={() => handleButtonOnClick(range.value)}
          >
            {range.name}
          </button>
        );
      })}
    </div>
  );
}

export default DateRanger;
