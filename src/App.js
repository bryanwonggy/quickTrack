import Dashboard from "./components/Dashboard/Dashboard";
import CashMainPage from "./components/Cash/CashMainPage";
import StocksMainPage from "./components/Stocks/StocksMainPage";
import CryptoMainPage from "./components/Crypto/CryptoMainPage";
import ChartsMainPage from "./components/Charts/ChartsMainPage";
import NewsMainPage from "./components/News/NewsMainPage";
import HistoryMainPage from "./components/History/HistoryMainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { getDatabase, ref, set, child, get, push, update, remove, onValue } from "firebase/database";
import { data } from "autoprefixer";
import { QuizTwoTone } from "@mui/icons-material";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserAuth } from './context/AuthContext'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthContextProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Signin />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/Cash" element={<ProtectedRoute><CashMainPage /></ProtectedRoute>} />
              <Route path="/Stocks" element={<ProtectedRoute><StocksMainPage /></ProtectedRoute>} />
              <Route path="/Crypto" element={<ProtectedRoute><CryptoMainPage /></ProtectedRoute>} />
              <Route path="/Charts" element={<ProtectedRoute><ChartsMainPage /></ProtectedRoute>} />
              <Route path="/News" element={<ProtectedRoute><NewsMainPage /></ProtectedRoute>} />
              <Route path="/History" element={<ProtectedRoute><HistoryMainPage /></ProtectedRoute>} />
            </Routes>
          </Router>
        </AuthContextProvider>
      </header>
    </div>
  );
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

function buyStock(userId, date, ticker, qty, price) {
  const db = getDatabase();
  const stocksListRef = ref(db, 'users/' + userId + '/stocks/' + ticker)
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userId}/stocks/${ticker}`)).then((snapshot) => {
    // if the stock already in your portfolio 
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
    } else {
      // if the stock not in the portfolio
      set(stocksListRef, { 
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
      if (old_qty > qty) {
        update(stocksListRef, {
          qty: old_qty - Number(qty),
          total_cost: old_total_cost - Number(old_average_cost * qty),
          average_cost: (old_total_cost - Number(old_average_cost * qty)) / (old_qty - Number(qty))
        })
        addToHistory(userId, 'SELL', date, ticker, qty, price);
      } else if (old_qty == qty) {
        remove(stocksListRef);
        addToHistory(userId, 'SELL', date, ticker, qty, price);
      } else {
        // insufficient qty to sell 
        console.log("Insufficient crypto to sell");
      }

    } else {
      // if the stock not in the portfolio
      console.log("No such stock available");
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
      }

    } else {
      // if the stock not in the portfolio
      console.log("No such crypto available");
    }
  }).catch((error) => {
    console.error(error);
  });
}

function getRealtimeHistory(userId) { // how to get userId
    const db = getDatabase();
    const dbRef = ref(db, `users/${userId}/history`);
    
    var records = [];
  
    onValue(dbRef, (snapshot) => {
        snapshot.forEach(childSnapshot => {
            let keyName = childSnapshot.key;
            let data = childSnapshot.val();
            records = [data.date, data.type, data.ticker, data.quantity, data.price];
        });
    })
    return records;
  }


//buyStock('testinggmail', '3/6/2022','AAPL', 5, 150.1);
//buyCrypto('bryanwongymail', '3/6/2022', 'ADA', 300, 0.488);
//sellStock('bryanwongymail', '3/6/2022', 'AAPL', 1, 600);
//sellCrypto('bryanwongymail', '3/6/2022', 'ADA', 500, 1.5);

/*
const dbRef = ref(getDatabase());
get(child(dbRef, `users/${"bryanwong"}`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
*/

export default App;
