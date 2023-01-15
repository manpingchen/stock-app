import "./LoadingIndicator.scss";

function Loading({ fullScreen }) {
  return (
    <div className={`loading ${fullScreen ? "fullScreen" : ""}`}>
      <div className="loading__ring"></div>
    </div>
  );
}

export default Loading;
