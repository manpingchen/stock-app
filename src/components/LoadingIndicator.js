import "./LoadingIndicator.scss";

function Loading({ fullScreen, text }) {
  return (
    <div className={`loading ${fullScreen ? "fullScreen" : null}`}>{text || "Loading..."}</div>
  );
}

export default Loading;
