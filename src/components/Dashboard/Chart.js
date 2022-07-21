import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import { getDatabase, ref, onValue } from "firebase/database";
import { UserAuth } from '../../context/AuthContext'

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
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

//console.log(data1);

const data = [
  createData('00:00', 0),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00', undefined),
];

export default function Chart() {
  const theme = useTheme();
  const { user, logout } = UserAuth();
  const userId = (user.email.split("@")[0] + user.email.split("@")[1]).split(".")[0];

  const data1 = getPLHistory(userId);

  return (
    <React.Fragment>
      <Title>Realised P/L over Time</Title>
      <ResponsiveContainer>
        <LineChart
          data={data1}
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
