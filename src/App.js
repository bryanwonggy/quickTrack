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
import 'bootstrap/dist/css/bootstrap.min.css';
import { getDatabase, ref, set, onValue, push } from "firebase/database";

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

function storePL(userId, pnl, date) {
  const db = getDatabase();
  const historyListRef = ref(db, `users/${userId}/pnlHistory`);
  const newTxnRef = push(historyListRef);
  set(newTxnRef, {
    date: date,
    pnl: pnl
  });
}

//storePL('bryan3gmail', 100, '06/24/2022')

export default App;
