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
import "./StockData.css";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import { UserAuth } from '../../context/AuthContext'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const action = [
  {
    value: "buy",
    label: "BUY",
  },
  {
    value: "sell",
    label: "SELL",
  },
];

function getRelevantData(data) {
  const wantedInfo = [
    "companyName",
    "currency",
    "iexAskPrice",
    "iexAskSize",
    "iexBidPrice",
    "iexBidSize",
    "iexClose",
    "iexOpen",
    "iexVolume",
    "marketCap",
    "peRatio",
    "previousClose",
    "previousVolume",
    "primaryExchange",
    "week52High",
    "week52Low",
  ];
  return wantedInfo.includes(data);
}

function StockData() {
  const [searchText, updateTextFunc] = React.useState("");
  const [StockInfo, updateInfoFunc] = React.useState({});
  const API_KEY = "R8QVYYFNVOKVRKP4"; //AlphaVantage
  const [tickerSymbol, updateTicker] = React.useState("");
  const IEX_API_Key = "pk_7ae7f450e7bd4274a7e4ded7019573ae"; //for stock summary data such as PE Ratio
  const [summaryData, updateSummaryData] = React.useState({});
  const { user, logout } = UserAuth();

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

  //BuySellToggle
  const [buysellaction, setBuySell] = React.useState("");
  //Date Toggle
  const [date, setDate] = React.useState(null);
  //Select Stock
  const [stock, setStock] = React.useState("");
  //Select Quantity
  const [quantity, setQuantity] = React.useState("");
  //Select Price
  const [price, setPrice] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      console.log(buysellaction); //These are the variables to parse into backend function as inputs
      console.log(date);
      console.log(stock);
      console.log(quantity);
      console.log(price);
      console.log(user.email)
      //PSEUDOCODE
      //IF buysellaction == "buy" => execute buystock(user.email, date, stock, quantity, price)
      //IF buysellaction == "sell" => execute sellstock(user.email, date, stock, quantity, price)
    } catch (error) {
      console.log("pop up to be made still work in progress");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Item>
          <div>
            <label>Enter ticker symbol:</label>
            <input
              type="text"
              class="txtbox"
              onChange={(e) => updateTextFunc(e.target.value)}
            ></input>
            <button class="button" onClick={(event) => searchForStock(event)}>
              Submit
            </button>
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
            <p>
              {summaryData[2] !== (0 || null)
                ? summaryData[2]
                : "Market Not Open"}
            </p>
          </div>
          <div id="containerIntro">
            <h1>Ask Size: </h1>
            <p>
              {summaryData[3] !== (0 || null)
                ? summaryData[3]
                : "Market Not Open"}
            </p>
          </div>
          <div id="containerIntro">
            <h1>Bid Price: </h1>
            <p>
              {summaryData[4] !== (0 || null)
                ? summaryData[4]
                : "Market Not Open"}
            </p>
          </div>
          <div id="containerIntro">
            <h1>Bid Size: </h1>
            <p>
              {summaryData[5] !== (0 || null)
                ? summaryData[5]
                : "Market Not Open"}
            </p>
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
        <Item>
          <form id="buysellform" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box //BUYSELL Toggle
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "25ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-select-action"
                    select
                    label="Select"
                    value={buysellaction}
                    onChange={(e) => setBuySell(e.target.value)}
                    helperText="Please select action to take"
                  >
                    {action.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  onChange={(e) => setStock(e.target.value)}
                  type="text"
                  placeholder="Choose Stock"
                ></TextField>
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Date"
                    value={date}
                    onChange={(newDate) => {
                      setDate(newDate);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  placeholder="Enter Quantity"
                  onChange={(e) => setQuantity(e.target.value)}
                ></TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  placeholder="Enter Price"
                ></TextField>
              </Grid>
              <Grid item xs={4}>
                <Button
                  type="submit"
                  form="buysellform"
                  variant="contained"
                  size="large"
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Item>
      </Grid>
    </Grid>
  );
}

export default StockData;
