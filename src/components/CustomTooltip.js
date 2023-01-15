import { datetimeFormatter } from "../helpers/dateHandlers";
import { numberFormatter } from "../helpers/numberFormatter";
import "./CustomTooltip.scss";

function CustomTooltip(props) {
  const { data, active } = props;

  if (!active) {
    return;
  }
  const { payload, value } = data[0];

  const dateTime = datetimeFormatter({
    date: payload.name,
    config: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "numeric",
    },
  });


  return (
    <div className="tooltip">
      <div className="tooltip__data">
        <p className="label">{dateTime}</p>
        <p className="value">{numberFormatter(value)}</p>
        <p className="dec">Open {numberFormatter(payload["1. open"])}</p>
        <p className="dec">High {numberFormatter(payload["2. high"])}</p>
        <p className="dec">Low {numberFormatter(payload["3. low"])}</p>
        <p className="dec">Close {numberFormatter(payload["4. close"])}</p>
        <p className="dec">Volume {payload["5. volume"]}</p>
      </div>
    </div>
  );
}

export default CustomTooltip;
