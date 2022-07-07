import React from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table"; 
import "./table.css";
import { GlobalFilter } from "./GlobalFilter";

export default function FilteringTable({ columns, data }) {
    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        rows, // rows for the table based on the data passed
        prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
        state,
        setGlobalFilter
    } = useTable({
        columns,
        data
    }, 
    useGlobalFilter,
    useSortBy);

    const { globalFilter } = state;

    return (
        <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} /> 
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render("Header")}
                            <span>
                                {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                            </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
        </>
    );

}