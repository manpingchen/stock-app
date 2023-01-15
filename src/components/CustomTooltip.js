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
        <p className="dec">
          <span className="tooltip__data-title">Open</span>
          <span>{numberFormatter(payload["1. open"])}</span>
        </p>
        <p className="dec">
          <span className="tooltip__data-title">High</span>
          <span>{numberFormatter(payload["2. high"])}</span>
        </p>
        <p className="dec">
          <span className="tooltip__data-title">Low</span>
          <span>{numberFormatter(payload["3. low"])}</span>
        </p>
        <p className="dec">
          <span className="tooltip__data-title">Close</span>
          <span>{numberFormatter(payload["4. close"])}</span>
        </p>
        <p className="dec">
          <span className="tooltip__data-title">Volume</span>
          <span>{payload["5. volume"]}</span>
        </p>
      </div>
    </div>
  );
}

export default CustomTooltip;
