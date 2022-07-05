import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
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
  const [ErrorMessage, setErrorMessage] = React.useState("");
  const [SuccessMessage, setSuccessMessage] = React.useState("");

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

  
  function buyCrypto(userId, date, ticker, qty, price) {
    const db = getDatabase();
    const cryptoListRef = ref(db, 'users/' + userId + '/crypto/' + ticker)
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${userId}/crypto/${ticker}`)).then((snapshot) => {
      const old_cash = getCash(userId);
      if (old_cash >= qty * price) {
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
          updateCash(userId, qty * price * -1);

          // success feedback
          setSuccessMessage(`You have successfully bought ${qty} ${ticker} at $${price}.`);
          setTimeout(() => {
            setSuccessMessage(""); 
          }, 5000);
        } else {
          // if the stock not already in the portfolio
          set(cryptoListRef, { 
            qty: Number(qty),
            total_cost: Number(qty * price),
            average_cost: Number(price)
          })
          addToHistory(userId, 'BUY', date, ticker, qty, price);
          updateCash(userId, qty * price * -1);
          
          // success feedback
          setSuccessMessage(`You have successfully bought ${qty} ${ticker} at $${price}.`);
          setTimeout(() => {
            setSuccessMessage(""); 
          }, 5000);
        }
      } else {
        // insufficient funds
        setErrorMessage("Insufficient funds, please top up!");
        setTimeout(() => {
          setErrorMessage(""); 
        }, 3000);
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
        if (old_qty > Number(qty)) {
          updatePL(userId, 'crypto', ticker, price, qty);
          update(cryptoListRef, {
            qty: old_qty - Number(qty),
            total_cost: old_total_cost - Number(old_average_cost * qty),
            average_cost: (old_total_cost - Number(old_average_cost * qty)) / (old_qty - Number(qty))
          })
          addToHistory(userId, 'SELL', date, ticker, qty, price);
          updateCash(userId, qty * price);

          // success feedback
          setSuccessMessage(`You have successfully sold ${qty} ${ticker} at $${price}.`);
          setTimeout(() => {
            setSuccessMessage(""); 
          }, 5000);
        } else if (old_qty === Number(qty)) {
          updatePL(userId, 'crypto', ticker, price, qty);
          remove(cryptoListRef);
          addToHistory(userId, 'SELL', date, ticker, qty, price);
          updateCash(userId, qty * price);

          // success feedback
          setSuccessMessage(`You have successfully sold ${qty} ${ticker} at $${price}.`);
          setTimeout(() => {
            setSuccessMessage(""); 
          }, 5000);
        } else {
          // insufficient qty to sell 
          console.log("Insufficient crypto to sell");
          setErrorMessage("Insufficient crypto to sell");
          setTimeout(() => {
            setErrorMessage(""); 
          }, 3000);
        }
  
      } else {
        // if the crypto not in the portfolio
        console.log("No such crypto available");
        setErrorMessage("You do not own this crypto!");
        setTimeout(() => {
          setErrorMessage(""); 
        }, 3000);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  function handleNegativeQty(e) {
    const val = e.target.value;
    if (val < 0) {
      setErrorMessage("You have entered a negative quantity. Please amend accordingly.");
      setTimeout(() => {
        setErrorMessage(""); 
      }, 3000);
    } else {
      setQuantity(val);
    }
  }

  function handleNegativePrice(e) {
    const val = e.target.value;
    if (val < 0) {
      setErrorMessage("You have entered a negative price. Please amend accordingly.");
      setTimeout(() => {
        setErrorMessage(""); 
      }, 3000);
    } else {
      setPrice(val);
    }
  }

  //BuySellToggle
  const [buysellaction, setBuySell] = React.useState("");
  //Date Toggle
  const [date, setDate] = React.useState(new Date());
  //Select Stock
  const [crypto, setCrypto] = React.useState("");
  //Select Quantity
  const [quantity, setQuantity] = React.useState("");
  //Select Price
  const [price, setPrice] = React.useState("");
  const { user, logout } = UserAuth();
  const userId = (user.email.split("@")[0] + user.email.split("@")[1]).split(".")[0];

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
      if (buysellaction === "buy") {
        buyCrypto(userId, Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(date), crypto, quantity, price);
      } 
      if (buysellaction === "sell") {
        sellCrypto(userId, Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(date), crypto, quantity, price);
      }
      // clear form when submit is clicked
      event.target.reset();
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
              onChange={(e) => updateTextFunc(e.target.value.toUpperCase())}
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
                  onChange={(e) => setCrypto(e.target.value.toUpperCase())}
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
                  onChange={handleNegativeQty}
                ></TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  onChange={handleNegativePrice}
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
            {SuccessMessage ? <label className="success">{SuccessMessage}</label> : null}
          </div>
        </Item>
      </Grid>
    </Grid>
  );
}

export default CryptoData;
