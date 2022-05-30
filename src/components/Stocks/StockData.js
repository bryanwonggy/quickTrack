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
import "./StockData.css"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function getRelevantData(data) {
    const wantedInfo = ['companyName', 'currency', 'iexAskPrice', 'iexAskSize', 'iexBidPrice', 'iexBidSize', 'iexClose', 'iexOpen', 'iexVolume', 'marketCap', 'peRatio', 'previousClose', 'previousVolume', 'primaryExchange', 'week52High', 'week52Low'];
    return wantedInfo.includes(data);
}

function StockData() {
  const [searchText, updateTextFunc] = React.useState("");
  const [StockInfo, updateInfoFunc] = React.useState({});
  const API_KEY = "R8QVYYFNVOKVRKP4"; //AlphaVantage
  const [tickerSymbol, updateTicker] = React.useState("");
  const IEX_API_Key = "pk_7ae7f450e7bd4274a7e4ded7019573ae"; //for stock summary data such as PE Ratio
  const [summaryData, updateSummaryData] = React.useState({});

  const [timeSeriesData, updateTimeSeriesData] = React.useState({
    stockChartXValues: [],
    stockChartYValues: [],
  }); //toPlotChart

  function searchForStock(event) {
    var APICallString = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${searchText}&apikey=${API_KEY}`; //check AlphaVantage API (outputsize=full for full 20years data)
    var IEX_APICallString = `https://cloud.iexapis.com/stable/stock/${searchText}/quote?token=${IEX_API_Key}`;
    let tempStoreChartXValue = [];
    let tempStoreChartYValue = [];
    let tempSummaryInfo = [];

    axios
      .get(APICallString)
      .then(function (response) {
        // console.log(response);
        updateInfoFunc(response.data);
        for (let key in response.data["Time Series (Daily)"]) {
          tempStoreChartXValue.push(key);
          tempStoreChartYValue.push(
            response.data["Time Series (Daily)"][key]["1. open"]
          );
        }
        updateTimeSeriesData({
          stockChartXValues: tempStoreChartXValue,
          stockChartYValues: tempStoreChartYValue,
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
            <button onClick={(event) => searchForStock(event)}>Submit</button>

            {JSON.stringify(StockInfo) !== "{}" ? (
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
                x: timeSeriesData.stockChartXValues,
                y: timeSeriesData.stockChartYValues,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "red" },
              },
            ]}
            layout={{ title: summaryData[0] }} //KIV Follow size of container dynamic
          />
        </Item>
      </Grid>
      <Grid item xs={4}>
        <Item>
        <div id="containerIntro">
        <h1>Ask Price: </h1>
        <p>{summaryData[2] !== 0 ? summaryData[2]: "Market Not Open"}</p>
      </div>
      <div id="containerIntro">
        <h1>Ask Size: </h1>
        <p>{summaryData[3] !== 0 ? summaryData[3]: "Market Not Open"}</p>
      </div>
      <div id="containerIntro">
        <h1>Bid Price: </h1>
        <p>{summaryData[4] !== 0 ? summaryData[4]: "Market Not Open"}</p>
      </div>
      <div id="containerIntro">
        <h1>Bid Size: </h1>
        <p>{summaryData[5] !== 0 ? summaryData[5]: "Market Not Open"}</p>
      </div>
      <div id="containerIntro">
        <h1>Open: </h1>
        <p>{summaryData[7]}</p>
      </div>
      <div id="containerIntro">
        <h1>Close: </h1>
        <p>{summaryData[6]}</p>
      </div>
      <div id="containerIntro">
        <h1>Volume: </h1>
        <p>{summaryData[8]}</p>
      </div>
      <div id="containerIntro">
        <h1>Market Cap: </h1>
        <p>{summaryData[9]}</p>
      </div>
      <div id="containerIntro">
        <h1>PE Ratio: </h1>
        <p>{summaryData[10]}</p>
      </div>
      <div id="containerIntro">
        <h1>52 Week High: </h1>
        <p>{summaryData[14]}</p>
      </div>
      <div id="containerIntro">
        <h1>52 Week Low: </h1>
        <p>{summaryData[15]}</p>
      </div>
        </Item>
      </Grid>

      <Grid item xs={12}>
        <Item>Buy Sell</Item>
      </Grid>
    </Grid>
  );
}

export default StockData;
