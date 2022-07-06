import * as React from "react";
import SortingTable from "../History/SortingTable";
import { UserAuth } from "../../context/AuthContext";
import {
  getDatabase,
  ref,
  onValue,
} from "firebase/database";

export default function Orders() {
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
          "average_cost": data.average_cost.toFixed(2),
          "total_cost": data.total_cost.toFixed(2)
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
          "average_cost": data.average_cost.toFixed(2),
          "total_cost": data.total_cost.toFixed(2)
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
        Header: "Average Cost ($)",
        accessor: "average_cost"
    },
    {
        Header: "Total Cost ($)",
        accessor: "total_cost"
    }
  ], []);

  const records1 = getStockDetails(slicedUser);
  const records2 = getCryptoDetails(slicedUser);
  const data = [];
  for (let i = 0; i< records1.length; i++) {
    data.push(records1[i]);
  }
  for (let j = 0; j < records2.length; j++) {
    data.push(records2[j]);
  }

  return (
    <div className="Holdings">
      <SortingTable columns={columns} data={data} />
    </div>
  );
}
