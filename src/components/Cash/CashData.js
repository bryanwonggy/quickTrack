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
import { UserAuth } from "../../context/AuthContext";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  push,
  update,
  remove,
  onValue,
} from "firebase/database";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const action = [
  {
    value: "deposit",
    label: "DEPOSIT",
  },
  {
    value: "withdraw",
    label: "WITHDRAW",
  },
];

function addToHistory(userId, type, date, ticker, qty, price) {
  const db = getDatabase();
  const historyListRef = ref(db, `users/${userId}/history`);
  const newTxnRef = push(historyListRef);
  set(newTxnRef, {
    type: type,
    date: date,
    ticker: ticker,
    quantity: qty,
    price: price,
  });
}

function depositCash(userId, date, amount) {
  const db = getDatabase();
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userId}`))
    .then((snapshot) => {
      const old_cash = Number(snapshot.val().cash);
      update(ref(db, `users/${userId}`), {
        cash: old_cash + Number(amount),
      });
      addToHistory(userId, "DEPOSIT", date, "-", "-", amount);
    })
    .catch((error) => {
      console.error(error);
    });
}

function withdrawCash(userId, date, amount) {
  const db = getDatabase();
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userId}`))
    .then((snapshot) => {
      const old_cash = Number(snapshot.val().cash);
      if (amount > old_cash) {
        console.log("Insufficient Funds.");
      } else if (amount == old_cash) {
        update(ref(db, `users/${userId}`), {
          cash: 0,
        });
        addToHistory(userId, "WITHDRAW", date, "-", "-", amount);
      } else {
        update(ref(db, `users/${userId}`), {
          cash: old_cash - Number(amount),
        });
        addToHistory(userId, "WITHDRAW", date, "-", "-", amount);
      }
    })
    .catch((error) => {
      console.error(error);
    });
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


function CashData() {
  //BuySellToggle
  const [depositWithdrawAction, setDepositWithdraw] = React.useState("");
  //Date Toggle
  const [date, setDate] = React.useState(null);
  //Select Price
  const [price, setPrice] = React.useState("");

  const { user, logout } = UserAuth();

  const userId = (user.email.split("@")[0] + user.email.split("@")[1]).split(
    "."
  )[0];

  const current_cash = getCash(userId);

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      console.log(depositWithdrawAction); //These are the variables to parse into backend function as inputs
      console.log(date);
      console.log(price);
      console.log(userId);

      // executing of the functions into the database when submit
      if (depositWithdrawAction == "deposit") {
        depositCash(userId, Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(date), price);
      }
      if (depositWithdrawAction == "withdraw") {
        withdrawCash(userId, Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(date), price);
      }
    } catch (error) {
      console.log("pop up to be made still work in progress");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Item>
          <div>
            <h1>Current Cash: ${current_cash}</h1>
          </div>
        </Item>
      </Grid>
      <Grid item xs={12}>
        <Item>
          <form id="buysellform" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
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
                    value={depositWithdrawAction}
                    onChange={(e) => setDepositWithdraw(e.target.value)}
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
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <TextField
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  placeholder="Enter Amount"
                ></TextField>
              </Grid>
              <Grid item xs={6}>
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

export default CashData;
