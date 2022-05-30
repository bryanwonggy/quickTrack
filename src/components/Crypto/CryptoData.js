import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "../Sidebar/listItems";
import Chart from "../Dashboard/Chart";
import Deposits from "../Dashboard/Deposits";
import Orders from "../Dashboard/Orders";
import axios from "axios";
import Plot from "react-plotly.js";
import '../Stocks/StockData.css';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function getRelevantData(data) {
  const wantedInfo = [
    "symbol",
    "sector",
    "latestPrice",
    "latestVolume",
    "bidPrice",
    "bidSize",
    "askPrice",
    "askSize",
    "high",
    "low",
    "previousClose",
  ];
  return wantedInfo.includes(data);
}

function CryptoData() {
  const [searchText, updateTextFunc] = React.useState("");
  const [CryptoInfo, updateInfoFunc] = React.useState({});
  const API_KEY = "R8QVYYFNVOKVRKP4"; //AlphaVantage
  const [tickerSymbol, updateTicker] = React.useState("");
  const IEX_API_KEY = "pk_7ae7f450e7bd4274a7e4ded7019573ae";
  const [summaryData, updateSummaryData] = React.useState({});

  const [timeSeriesData, updateTimeSeriesData] = React.useState({
    cryptoChartXValues: [],
    cryptoChartYValues: [],
  }); //toPlotChart

  function searchForCrypto(event) {
    var APICallString = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${searchText}&market=CNY&apikey=${API_KEY}`; //check AlphaVantage API (outputsize=full for full 20years data)
    var IEX_APICallString = `https://cloud.iexapis.com/stable/crypto/${searchText}usdt/quote?token=${IEX_API_KEY}`;
    let tempStoreChartXValue = [];
    let tempStoreChartYValue = [];
    let tempSummaryInfo = [];

    axios
      .get(APICallString)
      .then(function (response) {
        console.log(response);
        updateInfoFunc(response.data);
        for (let key in response.data["Time Series (Digital Currency Daily)"]) {
          tempStoreChartXValue.push(key);
          tempStoreChartYValue.push(
            response.data["Time Series (Digital Currency Daily)"][key][
              "1b. open (USD)"
            ]
          );
        }
        updateTimeSeriesData({
          cryptoChartXValues: tempStoreChartXValue,
          cryptoChartYValues: tempStoreChartYValue,
        });
        updateTicker(searchText.toLocaleUpperCase());
      })
      .catch(function (error) {
        console.log(error);
      });

    axios //NEW FOR STOCK INFO
      .get(IEX_APICallString)
      .then(function (response) {
        console.log("HERE");
        console.log(response);
        // for (let key in response) {
        //   if (getRelevantData(key)) {
        //     let str = JSON.stringify(response[key]);
        //     tempSummaryInfo.push(str);
        //   }
        //   //   let str = JSON.stringify(key) + " : " + JSON.stringify(response.data[key]);
        //   //   tempSummaryInfo.push(str);
        // }
        for (let key in response.data) {
          if (getRelevantData(key)) {
            let obj = response.data[key];
            tempSummaryInfo.push(obj);
          }
        }
        updateSummaryData(tempSummaryInfo);
        console.log(summaryData);
        console.log(summaryData);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //   return (
  //   <div>
  //     <label>Enter ticker symbol:</label>
  //     <input type="text" onChange={(e) => updateTextFunc(e.target.value)}></input>
  //     <button onClick={(event) => searchForStock(event)}>Submit</button>

  //     {JSON.stringify(StockInfo) != "{}" ? <p>We have data</p> : <p>No data</p>}
  //   </div>;
  //   );
  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Item>
          <div>
            <label>Enter ticker symbol:</label>
            <input
              type="text"
              onChange={(e) => updateTextFunc(e.target.value)}
            ></input>
            <button onClick={(event) => searchForCrypto(event)}>Submit</button>

            {JSON.stringify(CryptoInfo) !== "{}" ? (
              <p>Now Displaying: {tickerSymbol}</p>
            ) : (
              <p>No Search Results</p>
            )}
          </div>
        </Item>
        <Item>
          <Plot
            data={[
              {
                x: timeSeriesData.cryptoChartXValues,
                y: timeSeriesData.cryptoChartYValues,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "red" },
              },
            ]}
            layout={{ title: tickerSymbol }} //KIV Follow size of container dynamic
          />
        </Item>
      </Grid>
      <Grid item xs={4}>
        <Item>
          <div id="containerIntro">
            <h1>Symbol: </h1>
            <p>{summaryData[0]}</p>
          </div>
          <div id="containerIntro">
            <h1>Sector: </h1>
            <p>{summaryData[1]}</p>
          </div>
          <div id="containerIntro">
            <h1>Latest Price: </h1>
            <p>{summaryData[2]}</p>
          </div>
          <div id="containerIntro">
            <h1>Latest Volume: </h1>
            <p>{summaryData[3]}</p>
          </div>
          <div id="containerIntro">
            <h1>Bid Price: </h1>
            <p>{summaryData[4]}</p>
          </div>
          <div id="containerIntro">
            <h1>Bid Size: </h1>
            <p>{summaryData[5]}</p>
          </div>
          <div id="containerIntro">
            <h1>Ask Price: </h1>
            <p>{summaryData[6]}</p>
          </div>
          <div id="containerIntro">
            <h1>Ask Size: </h1>
            <p>{summaryData[7]}</p>
          </div>
          <div id="containerIntro">
            <h1>High: </h1>
            <p>{summaryData[8]}</p>
          </div>
          <div id="containerIntro">
            <h1>Low: </h1>
            <p>{summaryData[9]}</p>
          </div>
          <div id="containerIntro">
            <h1>Previous Close: </h1>
            <p>{summaryData[10]}</p>
          </div>
        </Item>
      </Grid>

      <Grid item xs={12}>
        <Item>Buy Sell</Item>
      </Grid>
    </Grid>
  );
}

export default CryptoData;
