import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
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
  const [ErrorMessage, setErrorMessage] = React.useState("");

  const [timeSeriesData, updateTimeSeriesData] = React.useState({
    stockChartXValues: [],
    stockChartYValues: [],
  }); //toPlotChart

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

  function getAvgCost(userId, ticker, type) {
    const db = getDatabase();
    const tickerListRef = ref(db, `users/${userId}/${type}/${ticker}`);

    var records = [];

    onValue(tickerListRef, (snapshot) => {
      const avg_cost = snapshot.val().average_cost;
      records.push(avg_cost);
    });
    return records[0];
  }
  
  function updatePL(userId, type, ticker, price, qty) {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    const dbRef = ref(getDatabase());
    const avg_cost = getAvgCost(userId, ticker, type);
    const amount = price * qty - avg_cost * qty;

    //update PL
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const old_pnl = Number(snapshot.val().pnl);
        const new_amount = Number(old_pnl + amount);
        console.log(new_amount);
        update(userRef, {
          pnl: new_amount
        })
      }
    })
  }

  
  function getCash(userId) {
    const db = getDatabase();
    const dbRef = ref(db, `users/${userId}`);

    var records = [];

    onValue(dbRef, (snapshot) => {
      const old_cash = snapshot.val().cash;
      records.push(old_cash);
    });
    return records[0];
  }

  function updateCash(userId, amount) {
    const db = getDatabase();
    const dbRef = ref(getDatabase());
    const userRef = ref(db, `users/${userId}`)
    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const old_cash = Number(snapshot.val().cash);
        update(userRef, {
          cash: old_cash + amount
        })
      }
    })
  }

  function buyStock(userId, date, ticker, qty, price) {
    const db = getDatabase();
    const stocksListRef = ref(db, 'users/' + userId + '/stocks/' + ticker)
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${userId}/stocks/${ticker}`)).then((snapshot) => {
      // if the stock already in your portfolio 
      const old_cash = getCash(userId);
      if (old_cash >= qty * price) {
        if (snapshot.exists()) {
          const old_qty = Number(snapshot.val().qty);
          const old_average_cost = Number(snapshot.val().average_cost);
          const old_total_cost = Number(snapshot.val().total_cost);
          update(stocksListRef, {
            qty: old_qty + Number(qty),
            total_cost: old_total_cost + Number(qty * price),
            average_cost: (old_total_cost + Number(qty * price)) / (old_qty + Number(qty))
          })
          addToHistory(userId, 'BUY', date, ticker, qty, price);
          updateCash(userId, qty * price * -1);
        } else {
          // if the stock not in the portfolio
          set(stocksListRef, { 
            qty: Number(qty),
            total_cost: Number(qty * price),
            average_cost: Number(price)
          })
          addToHistory(userId, 'BUY', date, ticker, qty, price);
          updateCash(userId, qty * price * -1);
        }
      } else {
        setErrorMessage("Insufficient funds, please top up!");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  
  function sellStock(userId, date, ticker, qty, price) {
    const db = getDatabase();
    const stocksListRef = ref(db, 'users/' + userId + '/stocks/' + ticker)
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${userId}/stocks/${ticker}`)).then((snapshot) => {
      // if the stock already in your portfolio 
      if (snapshot.exists()) {
        const old_qty = Number(snapshot.val().qty);
        const old_average_cost = Number(snapshot.val().average_cost);
        const old_total_cost = Number(snapshot.val().total_cost);
        if (old_qty > Number(qty)) {
          updatePL(userId, 'stocks', ticker, price, qty);
          update(stocksListRef, {
            qty: old_qty - Number(qty),
            total_cost: old_total_cost - Number(old_average_cost * qty),
            average_cost: (old_total_cost - Number(old_average_cost * qty)) / (old_qty - Number(qty))
          })
          addToHistory(userId, 'SELL', date, ticker, qty, price);
          updateCash(userId, qty * price);
        } else if (old_qty === Number(qty)) {
          updatePL(userId, 'stocks', ticker, price, qty);
          remove(stocksListRef);
          addToHistory(userId, 'SELL', date, ticker, qty, price);
          updateCash(userId, qty * price);
        } else {
          // insufficient qty to sell 
          console.log("Insufficient stock to sell");
          setErrorMessage("Insufficient stock to sell");
        }
  
      } else {
        // if the stock not in the portfolio
        console.log("You do not own this stock!");
        setErrorMessage("You do not own this stock!");
      }
    }).catch((error) => {
      console.error(error);
    });
  }


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


  const [buysellaction, setBuySell] = React.useState("");
  const [date, setDate] = React.useState(null);
  const [stock, setStock] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [price, setPrice] = React.useState("");
  const userId = (user.email.split("@")[0] + user.email.split("@")[1]).split(".")[0];

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      console.log(buysellaction); //These are the variables to parse into backend function as inputs
      console.log(date);
      console.log(stock);
      console.log(quantity);
      console.log(price);
      console.log(userId)
      
      // executing of the functions into the database when submit
      if (buysellaction === "buy") {
        buyStock(userId, Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(date), stock, Number(quantity), Number(price));
      } 
      if (buysellaction === "sell") {
        sellStock(userId, Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(date), stock, Number(quantity), Number(price));
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
            <button className="button" onClick={(event) => searchForStock(event)}>
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

export default StockData;
