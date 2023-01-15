import { useContext, useEffect, useState } from "react";
import { DateRangeContext } from "../pages/TimeSeriesChart";

function CustomizedAxisTick(props) {
  const { metaData, selectedRange } = useContext(DateRangeContext);
  const [tickText, setTickText] = useState("");
  const { x, y, payload } = props;

  useEffect(() => {
    const { value } = payload;
    const date = new Date(value);
    let text;

    if (selectedRange === "1day") {
      text = date.toLocaleString("default", {
        hour: "2-digit",
        timeZone: metaData.timeZone,
      });
    }

    if (selectedRange === "7days" || selectedRange === "1month") {
      text = date.toLocaleString("default", {
        day: "numeric",
        month: "short",
        timeZone: metaData.timeZone,
      });
    }
    if (selectedRange === "all") {
      text = date.toLocaleString("default", { month: "short", timeZone: metaData.timeZone });
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

export default CustomizedAxisTick;
