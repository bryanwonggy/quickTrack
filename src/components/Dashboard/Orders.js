import * as React from "react";
import Link from "@mui/material/Link";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Table } from "react-bootstrap";
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

// function getStockDetails(userId) {
//   const db = getDatabase();
//   const dbRef = ref(db, `users/${userId}/stocks`);

//   var records = [];
//   onValue(dbRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       let keyName = childSnapshot.val();
//       let data = childSnapshot.val();
//       console.log(data)
//       records.push([keyName, data.qty, data.average_cost, data.total_cost]);
//       console.log("HERE")
//       console.log(records)
//     });
//   });
//   console.log("THERE")
//   console.log(records)
//   return records;
// }

// function getCryptoDetails(userId) {
//   const db = getDatabase();
//   const dbRef = ref(db, `users/${userId}/crypto`);

//   var records = [];
//   onValue(dbRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       let keyName = childSnapshot.val();
//       let data = childSnapshot.val();
//       records.push([keyName, data.qty, data.average_cost, data.total_cost]);
//     });
//   });
//   return records;
// }

const mdTheme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#3f50b5",
    },
  },
});

export default function Orders() {
  function getStockDetails(userId) {
    const db = getDatabase();
    const dbRef = ref(db, `users/${userId}/stocks`);

    var records = [];
    onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        let keyName = childSnapshot.key;
        let data = childSnapshot.val();
        //console.log(childSnapshot);
        records.push([keyName, data.qty, data.average_cost, data.total_cost]);
        //console.log("HERE");
        //console.log(records);
      });
    });
    //console.log("THERE");
    //console.log(records);
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
        records.push([keyName, data.qty, data.average_cost, data.total_cost]);
      });
    });
    return records;
  }

  const { user, logout } = UserAuth();
  const user_email = String(user.email);
  const slicedUser = (
    user_email.split("@")[0] + user_email.split("@")[1]
  ).split(".")[0];
  const records1 = getStockDetails(slicedUser);
  const records2 = getCryptoDetails(slicedUser);
  const records = [];
  for (let i = 0; i< records1.length; i++) {
    records.push(records1[i]);
  }
  for (let j = 0; j < records2.length; j++) {
    records.push(records2[j]);
  }
  const Ticker = [];
  const Quantity = [];
  const Average_Cost = [];
  const Total_Cost = [];
  // console.log(records);
  // console.log(getStockDetails(slicedUser))
  for (let i = 0; i < records.length; i++) {
    Ticker.push(records[i][0]);
    Quantity.push(records[i][1]);
    Average_Cost.push(records[i][2]);
    Total_Cost.push(records[i][3]);
  }

  var rows = [];
  for (var i = 0; i < records.length; i++) {
    rows.push(
      <tr>
        <td>{Ticker[i]}</td>
        <td>{Quantity[i]}</td>
        <td>${Average_Cost[i]}</td>
        <td>${Total_Cost[i]}</td>
      </tr>
    );
  }

  return (
    <Table>
      <thead>
        <tr><th>Current Holdings</th></tr>
        <tr>
          <th scope="col">Ticker</th>
          <th scope="col">Quantity</th>
          <th scope="col">Average Cost</th>
          <th scope="col">Total Cost</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
