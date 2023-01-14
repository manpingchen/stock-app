export const fetchData = async () => {
  
    try {
    
    const response = await fetch(
      "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo"
    );

    const data = await response.json();
    const timeSeriesData = data["Time Series (5min)"];
    const metaData = {
      information: data["Meta Data"]["1. Information"],
      symbol: data["Meta Data"]["2. Symbol"],
      lastRefreshed: data["Meta Data"]["3. Last Refreshed"],
    };

    return { metaData, timeSeriesData };
  } catch (error) {
    return console.log("fetchData", { error });
  }
};
