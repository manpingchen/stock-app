import { useContext } from "react";
import { DateRangeContext } from "../pages/TimeSeriesChart";
import { dayRanges } from "../config/dayRanges";

function DateRanger() {
  const { selectedRange, setSelectedRange, handleUpdateDayRange } = useContext(DateRangeContext);

  const handleButtonOnClick = (range) => {
    handleUpdateDayRange({ range });
    setSelectedRange(range);
  };

  return (
    <div className="day-ranger-buttons">
      {dayRanges.map((range, index) => (
        <button
          type="button"
          key={index}
          disabled={selectedRange === range.value}
          onClick={() => handleButtonOnClick(range.value)}
        >
          {range.name}
        </button>
      ))}
    </div>
  );
}

export default DateRanger;
