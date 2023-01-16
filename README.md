# Stock React App

<img width="800" alt="Screen Shot 2023-01-16 at 10 55 10 AM" src="https://user-images.githubusercontent.com/10693128/212661870-5586e67c-3ce9-493e-a072-cbb3d9584d64.png">

https://user-images.githubusercontent.com/10693128/212664282-e712e877-5975-45cb-9731-a0b8dcc3a9a2.mov


## Third Party Libraries or Dependencies:
- [Recharts](https://recharts.org/en-US/)
- [Axios](https://axios-http.com/docs/intro)
- [Sass](https://www.npmjs.com/package/sass)

## Folder Structure

### :file_folder: pages - the main view component
#### TimeSeriesChart.js

### :file_folder: api - fetch data
```js
// ref: https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo
// Response Format:
// {
//   "Meta Data": {
//     "1. Information": "Intraday (5min) open, high, low, close prices and volume",
//     "2. Symbol": "IBM",
//     "3. Last Refreshed": "2023-01-13 16:30:00",
//     "4. Interval": "5min",
//     "5. Output Size": "Full size",
//     "6. Time Zone": "US/Eastern",
//   },
//   "Time Series (5min)": {
//     "2023-01-13 16:30:00": {
//       "1. open": "145.6000",
//       "2. high": "145.6000",
//       "3. low": "145.6000",
//       "4. close": "145.6000",
//       "5. volume": "223",
//     },
//     "2023-01-13 16:15:00": {
//       "1. open": "145.8900",
//       "2. high": "145.8900",
//       "3. low": "145.8900",
//       "4. close": "145.8900",
//       "5. volume": "5928",
//     },
//   },
// };

const fetchData = async ({ method, symbol, apikey, interval, outputsize }) => {
  try {
    const baseUrl = "https://www.alphavantage.co/query";
    const response = await axios.get(baseUrl, {
      params: {
        function: method,
        symbol,
        interval,
        outputsize,
        apikey,
      },
    });

    const data = await response.data;

    const timeSeriesData = Object.values(data)[1];
    const metaDataValue = Object.values(data)[0];

    const metaData = {
      information: metaDataValue["1. Information"],
      symbol: metaDataValue["2. Symbol"],
      timeZone: metaDataValue["6. Time Zone"],
      lastRefreshed,
      daily: !interval,
    };

    lastRefreshed = metaDataValue["3. Last Refreshed"];

    return { metaData, timeSeriesData };
  } catch (error) {
    return console.log("fetchData", { error });
  }
};
```

### :file_folder: components (js & scss)
#### Chart
Main responsive line chart component from Recharts

#### CustomAxisTick, CustomTooltip 
Custom styled components used in Chart component

#### LoadingIndicator
Loading indicator used when loading symbol data and chart data

#### DateRanger
Buttons to get the date range of chart data with/without a start date

### :file_folder: helpers
#### dateHandlers.js, three helpers included:
##### Sort
``` js 
const sortDatesAsc = (key) => (a, b) => {
  return new Date(a[key]) - new Date(b[key]);
};
```
##### Get date range for chart data
``` js 
const subtractDays = (date, range) => {
  
  let days;

  switch (range) {
    case WEEK:
      days = 7;
      break;
    case MONTH:
      days = 30;
      break;
    case DAY:
    default:
      days = 1;
      break;
  }

  const duplicatedDate = new Date(date);
  duplicatedDate.setDate(duplicatedDate.getDate() - days);

  // get the last min of the day
  const newDate = new Date(duplicatedDate).setHours(23, 59, 59, 999);
  return newDate;
};
```
##### Format DateTime
``` js 
const datetimeFormatter = ({ date, config, showTimeZoneName = false }) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  config = showTimeZoneName
    ? { ...config, timeZone, timeZoneName: "longOffset" }
    : { ...config, timeZone };

  // to be improved, getting GMT from timezone
  const dateObj = new Date(`${date} GMT-05:00`);
  const dateTime = new Intl.DateTimeFormat("en-US", config).format(dateObj);
  return dateTime;
};

```
#### numberFormatter.js
```js
const numberFormatter = (string) => Number(string).toFixed(2);
```

### :file_folder: config - for constants of symbols and day ranges
``` js
export const DAY = "1day";
export const WEEK = "7days";
export const MONTH = "1month";
export const MAX = "max";
```

```js
export const TSCO = "TSCO.LON";
export const IBM = "IBM";

// For Demo
export const symbolDataDefaultRange = {
  "TSCO.LON": WEEK,
  IBM: DAY,
};

export const fetchConfig = {
  IBM: {
    symbol: IBM,
    method: "TIME_SERIES_INTRADAY",
    apikey: "demo",
    interval: "5min",
    outputsize: "full",
  },
  "TSCO.LON": {
    symbol: TSCO,
    method: "TIME_SERIES_DAILY",
    apikey: "demo",
    interval: null,
    outputsize: "full",
  },
};

```

### :file_folder: assets - for styles variables and mixins
```css
$border-radius: 0.5rem;
$main-padding: 1rem;
$flex-gap: 1rem;
```

```css
@mixin row-full($gap: $flex-gap, $type: space-around) {
  display: flex;
  flex-direction: row;
  justify-content: $type;
  gap: $gap;
}

@mixin column($gap: $flex-gap) {
  display: flex;
  flex-direction: column;
  gap: $gap;
}
```



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
