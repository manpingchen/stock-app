import { useContext, useEffect } from "react";
import { DateRangeContext } from "../pages/TimeSeriesChart";
import { DAY, dayRanges, WEEK } from "../config/dayRanges";
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
    setTimeout(() => {
      handleUpdateDayRange({ range });
    }, 100);
  };

  const isActive = (value) => selectedRange === value;

  const { daily } = metaData;

  useEffect(() => {
    if (daily) {
      setSelectedRange(WEEK);
    } else {
      setSelectedRange(DAY);
    }
  }, [daily, setSelectedRange]);

  return (
    <div className="buttons">
      {dayRanges.map((range, index) => {
        if (daily && range.value === DAY) return null;
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
