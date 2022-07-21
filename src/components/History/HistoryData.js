import React, { useMemo, useState, useEffect } from "react";
import { UserAuth } from "../../context/AuthContext";
import FilteringTable from "../Tables/FilteringTable";
import { getDatabase, ref, set, onValue } from "firebase/database";

function getRealtimeHistory(userId) {
    const db = getDatabase();
    const dbRef = ref(db, `users/${userId}/history`);

    var records = [];

    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            let keyName = childSnapshot.key;
            let data = childSnapshot.val();
            records.push({
                "date": data.date,
                "type": data.type,
                "ticker": data.ticker,
                "quantity": data.quantity,
                "price": "$" + data.price,
            });
        });
    });
    return records;
}

function HistoryData() {
    const { user, logout } = UserAuth();
    const user_email = String(user.email);
    const slicedUser = (
        user_email.split("@")[0] + user_email.split("@")[1]
    ).split(".")[0];
    const records = getRealtimeHistory(slicedUser);

    console.log(records);
    const data = useMemo(() => records, []);
    const columns = useMemo(() => [
        {
            Header: "Type",
            accessor: "type"
        },
        {
            Header: "Date",
            accessor: "date"
        },
        {
            Header: "Ticker",
            accessor: "ticker"
        },
        {
            Header: "Quantity",
            accessor: "quantity"
        },
        {
            Header: "Price",
            accessor: "price"
        }
    ], []);

    return (
        <div className="History">
            <FilteringTable columns={columns} data={data} />
        </div>
    );
}

export default HistoryData;