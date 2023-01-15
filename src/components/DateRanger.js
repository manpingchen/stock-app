import { useContext } from "react";
import { DateRangeContext } from "../pages/TimeSeriesChart";
import { dayRanges } from "../config/dayRanges";
import "./DateRanger.scss";

function DateRanger() {
  const { selectedRange, setSelectedRange, handleUpdateDayRange } = useContext(DateRangeContext);

  const handleButtonOnClick = (range) => {
    handleUpdateDayRange({ range });
    setSelectedRange(range);
  };

  const isActive = (value) => selectedRange === value;

  return (
    <div className="buttons">
      {dayRanges.map((range, index) => (
        <button
          type="button"
          key={index}
          className={isActive(range.value) ? "active" : null}
          disabled={isActive(range.value)}
          onClick={() => handleButtonOnClick(range.value)}
        >
          {range.name}
        </button>
      ))}
    </div>
  );
}

export default DateRanger;
