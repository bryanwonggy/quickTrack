import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import { getDatabase, ref, onValue } from "firebase/database";
import { UserAuth } from '../../context/AuthContext'

// sort the data before displaying to confirm that it will be in order
function compare(a, b) {
  if (a.date < b.date) {
    return -1;
  }
  if (a.date > b.date) {
    return 1;
  }
  return 0;
}

function getPLHistory(userId) {
  const db = getDatabase();
  const dbRef = ref(db, `users/${userId}/pnlHistory`);

  var records = [];

  onValue(dbRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
          let keyName = childSnapshot.key;
          let data = childSnapshot.val();
          records.push({
              "date": data.date,
              "pnl": data.pnl,
          });
      });
  });
  return records;
}

export default function Chart() {
  const theme = useTheme();
  const { user, logout } = UserAuth();
  const userId = (user.email.split("@")[0] + user.email.split("@")[1]).split(".")[0];

  const rawData = getPLHistory(userId);
  const sortedData = rawData.sort(compare);

  return (
    <React.Fragment>
      <Title>Realised P/L over Time</Title>
      <ResponsiveContainer>
        <LineChart
          data={sortedData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Amount ($)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="pnl"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
