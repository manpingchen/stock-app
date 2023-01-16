import { useContext, useEffect, useState } from "react";
import { DateRangeContext } from "../pages/TimeSeriesChart";
import { datetimeFormatter } from "../helpers/dateHandlers";
import { DAY, MAX, MONTH, WEEK } from "../config/dayRanges";

function CustomAxisTick(props) {
  const { metaData, selectedRange } = useContext(DateRangeContext);
  const [tickText, setTickText] = useState("");
  const { x, y, payload } = props;

  useEffect(() => {
    const { value } = payload;
    let text;

    if (selectedRange === DAY) {
      text = datetimeFormatter({
        date: value,
        config: {
          hour: "2-digit",
        },
      });
    }

    if (selectedRange === WEEK || selectedRange === MONTH) {
      text = datetimeFormatter({
        date: value,
        config: {
          day: "numeric",
          month: "short",
        },
      });
    }
    if (selectedRange === MAX) {
      text = datetimeFormatter({
        date: value,
        config: {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      });
    }

    setTickText(text);
  }, [metaData, selectedRange, payload]);

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={14} fontSize={10} textAnchor="middle" fill="#666">
        {tickText}
      </text>
    </g>
  );
}

export default CustomAxisTick;
