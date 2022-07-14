import React from 'react';
import "../Stocks/StockData.css";

export const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <span>
            Search:{' '}
            <input className="txtbox" value = {filter || ''} onChange = {(e) => setFilter(e.target.value)}/>
        </span>
    )
}

