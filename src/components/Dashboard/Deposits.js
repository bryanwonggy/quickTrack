import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
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

export function getCurrentDate(separator='/'){

  let newDate = new Date()
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  
  return `${date}${separator}${month<10?`0${month}`:`${month}`}${separator}${year}`
  }

function preventDefault(event) {
  event.preventDefault();
}

function getPL(userId) {
  const db = getDatabase();
  const dbRef = ref(db, `users/${userId}`);

  var records = [];

  onValue(dbRef, (snapshot) => {
    const pnl = snapshot.val().pnl;
    records.push(pnl);
  });
  return records[0];
}

export default function Deposits() {
  const { user, logout } = UserAuth();

  const userId = (user.email.split("@")[0] + user.email.split("@")[1]).split(
    "."
  )[0]; 

  const current_pnl = getPL(userId).toFixed(2);

  const date = getCurrentDate();

  return (
    <React.Fragment>
      <Title>Realised P/L</Title>
      <Typography component="p" variant="h4">
        ${current_pnl}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {date}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}
