import { useContext, useEffect, useState } from "react";
import { DateRangeContext } from "../pages/TimeSeriesChart";
import { datetimeFormatter } from "../helpers/dateHandlers";

function CustomAxisTick(props) {
  const { metaData, selectedRange } = useContext(DateRangeContext);
  const [tickText, setTickText] = useState("");
  const { x, y, payload } = props;

  useEffect(() => {
    const { value } = payload;
    let text;

    if (selectedRange === "1day") {
      text = datetimeFormatter({
        date: value,
        config: {
          hour: "2-digit",
        },
      });
    }

    if (selectedRange === "7days" || selectedRange === "1month") {
      text = datetimeFormatter({
        date: value,
        config: {
          day: "numeric",
          month: "short",
        },
      });
    }
    if (selectedRange === "max") {
      text = datetimeFormatter(value, {
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
