import * as React from "react";
import SortingTable from "../Tables/SortingTable";
import { UserAuth } from "../../context/AuthContext";
import {
  getDatabase,
  ref,
  onValue,
} from "firebase/database";
import getCurrentStockPrice from "../APIFunctions/getCurrentStockPrice";
import getCurrentCryptoPrice from "../APIFunctions/getCurrentCryptoPrice";
import { red } from "@mui/material/colors";


export default function Orders() {
  const [currentStockPrice, updateCurrentStockPrice] = React.useState([]);

  function getStockDetails(userId) {
    const db = getDatabase();
    const dbRef = ref(db, `users/${userId}/stocks`);

    var records = [];
    onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        let keyName = childSnapshot.key;
        let data = childSnapshot.val();
        records.push({
          "ticker": keyName,
          "quantity": data.qty,
          "average_cost": "$" + data.average_cost.toFixed(2),
          "total_cost": "$" + data.total_cost.toFixed(2),
          "pl": (((data.current_price - data.average_cost)/data.average_cost) * 100).toFixed(2) + "%"
        });
      });
    });
    return records;
  }

  function getCryptoDetails(userId) {
    const db = getDatabase();
    const dbRef = ref(db, `users/${userId}/crypto`);

    var records = [];
    onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        let keyName = childSnapshot.key;
        let data = childSnapshot.val();
        records.push({
          "ticker": keyName,
          "quantity": data.qty,
          "average_cost": "$" + data.average_cost.toFixed(2),
          "total_cost": "$" + data.total_cost.toFixed(2),
          "pl": (((data.current_price - data.average_cost)/data.average_cost) * 100).toFixed(2) + "%"
        });
      });
    });
    return records;
  }

  const { user, logout } = UserAuth();
  const user_email = String(user.email);
  const slicedUser = (
    user_email.split("@")[0] + user_email.split("@")[1]
  ).split(".")[0];

  const columns = React.useMemo(() => [
    {
        Header: "Ticker",
        accessor: "ticker"
    },
    {
        Header: "Quantity",
        accessor: "quantity"
    },
    {
        Header: "Average Cost",
        accessor: "average_cost"
    },
    {
        Header: "Total Cost",
        accessor: "total_cost"
    }, 
    {
        Header: "P/L",
        accessor: "pl"
    }
  ], []);

  const stocks = getStockDetails(slicedUser);
  const crypto = getCryptoDetails(slicedUser);
  const data = [];

  // everytime we run this page, we pull the data from the api with the current price and update firebase
  for (let i = 0; i < stocks.length; i++) {
    const avg = stocks[i]["average_cost"];
    const ticker = stocks[i]["ticker"];
    getCurrentStockPrice(ticker);
    data.push(stocks[i]);
  }

  for (let i = 0; i < crypto.length; i++) {
    const avg = crypto[i]["average_cost"];
    const ticker = crypto[i]["ticker"] + "USDT";
    getCurrentCryptoPrice(ticker)
    data.push(crypto[i]);
  }

  return (
    <div className="Holdings">
      <SortingTable columns={columns} data={data} />
    </div>
  );
}
