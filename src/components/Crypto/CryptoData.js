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
import "../Stocks/StockData.css";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import { UserAuth } from '../../context/AuthContext'
import { getDatabase, ref, set, child, get, push, update, remove, onValue } from "firebase/database";


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


  function addToHistory(userId, type, date, ticker, qty, price) {
    const db = getDatabase();
    const historyListRef = ref(db, `users/${userId}/history`);
    const newTxnRef = push(historyListRef);
    set(newTxnRef, {
        type: type,
        date: date,
        ticker: ticker,
        quantity: qty,
        price: price
    });
  }
  
  function buyCrypto(userId, date, ticker, qty, price) {
    const db = getDatabase();
    const cryptoListRef = ref(db, 'users/' + userId + '/crypto/' + ticker)
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${userId}/crypto/${ticker}`)).then((snapshot) => {
      // if the crypto already in your portfolio 
      if (snapshot.exists()) {
        const old_qty = Number(snapshot.val().qty);
        const old_average_cost = Number(snapshot.val().average_cost);
        const old_total_cost = Number(snapshot.val().total_cost);
        update(cryptoListRef, {
          qty: old_qty + Number(qty),
          total_cost: old_total_cost + Number(qty * price),
          average_cost: (old_total_cost + Number(qty * price)) / (old_qty + Number(qty))
        })
        addToHistory(userId, 'BUY', date, ticker, qty, price);
      } else {
        // if the stock not in the portfolio
        set(cryptoListRef, { 
          qty: qty,
          total_cost: qty * price,
          average_cost: price
        })
        addToHistory(userId, 'BUY', date, ticker, qty, price);
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  
  function sellCrypto(userId, date, ticker, qty, price) {
    const db = getDatabase();
    const cryptoListRef = ref(db, 'users/' + userId + '/crypto/' + ticker)
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${userId}/crypto/${ticker}`)).then((snapshot) => {
      // if the stock already in your portfolio 
      if (snapshot.exists()) {
        const old_qty = Number(snapshot.val().qty);
        const old_average_cost = Number(snapshot.val().average_cost);
        const old_total_cost = Number(snapshot.val().total_cost);
        if (old_qty > qty) {
          update(cryptoListRef, {
            qty: old_qty - Number(qty),
            total_cost: old_total_cost - Number(old_average_cost * qty),
            average_cost: (old_total_cost - Number(old_average_cost * qty)) / (old_qty - Number(qty))
          })
          addToHistory(userId, 'SELL', date, ticker, qty, price);
        } else if (old_qty == qty) {
          remove(cryptoListRef);
          addToHistory(userId, 'SELL', date, ticker, qty, price);
        } else {
          // insufficient qty to sell 
          console.log("Insufficient crypto to sell");
          setErrorMessage("Insufficient crypto to sell");
        }
  
      } else {
        // if the stock not in the portfolio
        console.log("No such crypto available");
        setErrorMessage("You do not own this crypto!");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  //BuySellToggle
  const [buysellaction, setBuySell] = React.useState("");
  //Date Toggle
  const [date, setDate] = React.useState(null);
  //Select Stock
  const [crypto, setCrypto] = React.useState("");
  //Select Quantity
  const [quantity, setQuantity] = React.useState("");
  //Select Price
  const [price, setPrice] = React.useState("");
  const { user, logout } = UserAuth();
  const userId = (user.email.split("@")[0] + user.email.split("@")[1]).split(".")[0];
  const [ErrorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      console.log(buysellaction); //These are the variables to parse into backend function as inputs
      console.log(date);
      console.log(crypto);
      console.log(quantity);
      console.log(price);
      console.log(user.email);
      // executing of the functions into the database when submit
      if (buysellaction == "buy") {
        buyCrypto(userId, Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(date), crypto, quantity, price);
      } 
      if (buysellaction == "sell") {
        sellCrypto(userId, Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(date), crypto, quantity, price);
      }
    } catch (error) {
      console.log(error);
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
              className="txtbox"
              onChange={(e) => updateTextFunc(e.target.value)}
            ></input>
            <button className="button" onClick={(event) => searchForCrypto(event)}>
              Submit
            </button>

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
                  onChange={(e) => setCrypto(e.target.value)}
                  type="text"
                  placeholder="Choose Crypto"
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
      <Grid item xs={12}>
        <Item>
          <div>
            {ErrorMessage ? <label className="danger">{ErrorMessage}</label> : null}
          </div>
        </Item>
      </Grid>
    </Grid>
  );
}

export default CryptoData;
