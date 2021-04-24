import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, useRowSelect, useExpanded } from 'react-table';
import { COLUMNS } from './ColumnsTH'
import './table.css';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { GlobalFilter } from './GlobalFilter';
import TestsCards from './TestsCards';
import { Checkbox } from './CheckBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons'

export const AllTestsBin = (props) => {
    
    const columns = useMemo(() => COLUMNS, [])
    //const data = useMemo(() => props.deletedTests, [])
    const [data, setData] = useState(props.deletedTests, []);
    
    const tableInstance = useTable({
            columns,
            data,
            initialState: {
                sortBy: [
                    {
                        id: 'updatedAt',
                        desc: true
                    }
                ],
                groupBy: ['lotNr'],
                hiddenColumns: ['updatedAt']
            },
        },         
        useGlobalFilter,
        useSortBy,
        useExpanded,
        useRowSelect,        
        (hooks) => {
            hooks.visibleColumns.push((columns) => {
                return [                    
                    ...columns,
                    {
                        id: 'selection',
                        Header: ({ getToggleAllRowsSelectedProps }) => (
                            <Checkbox {...getToggleAllRowsSelectedProps()} />
                        ),
                        Cell: ({ row }) => (
                            <Checkbox {...row.getToggleRowSelectedProps()}/>
                        )
                    }    
                ]
            })
        })

    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        rows, 
        prepareRow,
        state,
        setGlobalFilter,
        selectedFlatRows,
        visibleColumns,
        //state: { expanded },
    } = tableInstance

    const { globalFilter } = state

    const [selectedRow, setSelectRows] = useState('')

    const undoDelete = () => { 
        selectedFlatRows.forEach(row => {     
            var update = {
                _id: row.original._id,
                status: "OK"
            }
            props.putTest(update);
        });
    }

    const switchToMyTests = () => {
        var dataCopy = [...data];
        const userName = 'Alyda Jarnell';
        const myTests = dataCopy.filter(({conductedBy}) => conductedBy === userName);
        //props.switchTests(myTests);
    }

    const switchToAllTests = () => { 
        props.fetchTests();
    }

    const renderRowSubComponent = React.useCallback(
        ({ row }) => (
        //   <pre
        //     style={{
        //       fontSize: '10px',
        //     }}
        //   >
        //     <code>{JSON.stringify({ values: row.original }, null, 2)}</code>
        //   </pre>
        // ),
        // []
            <TestsCards testValues={row.original}/>
        )
      )

    return(
        <>        
        <div className="row header table">
            <div className="col-12 col-lg-6">
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
            </div>
            <div style={{"padding-right":"20px"}} className="col-2 ml-auto text-right">
            </div>
        </div>
        {selectedFlatRows[0] ? (
            <>
            <div className="action-button-row row d-xl-none float-left">
                <div className="col-2 col-md-1">
                    <a type="button" onClick={undoDelete} 
                        style={{"backgroundColor":"rgba(67, 47, 135, 0.9)",
                            "boxShadow":"0px 0px 5px 0px rgba(67, 47, 135, 0.9)"}}
                        className="dot action-button">
                    <FontAwesomeIcon icon={faUndo} color="white" size='lg'/></a>
                </div>
            </div>
            <div className="row proxy-row d-xl-none"></div>
            </>
        ) : null}
        <div className="table-container row"> 
            <div style={{"padding-top":"10px", "padding-bottom":"0px", "padding-left":"0px", "padding-right":"10px"}} className="col-11">
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('Header')}
                                            <span>
                                                {column.isSorted ? (column.isSortedDesc ? <AiFillCaretDown/> : <AiFillCaretUp/>) : ''}
                                            </span>
                                        </th>
                                    ))}
                            </tr>
                        ))}                
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                        // Use a React.Fragment here so the table markup is still valid
                        <React.Fragment {...row.getRowProps()}>
                            <tr>
                            {row.cells.map(cell => {
                                return (
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                )
                            })}
                            </tr>
                            {/*
                                If the row is in an expanded state, render a row with a
                                column that fills the entire length of the table.
                            */}
                            {row.isExpanded ? (
                            <tr>
                                <td colSpan={visibleColumns.length}>
                                {/*
                                    Inside it, call our renderRowSubComponent function. In reality,
                                    you could pass whatever you want as props to
                                    a component like this, including the entire
                                    table instance. But for this example, we'll just
                                    pass the row
                                    */}
                                {renderRowSubComponent({ row })}
                                </td>
                            </tr>
                            ) : null}
                        </React.Fragment>
                        )
                    })}
                    </tbody>
                </table>
            </div>
            <div className="col-1 text-center button-col d-none d-xl-block">
                {selectedFlatRows[0] ? (
                    <ul className="list-unstyled">
                        <li>
                            <div className="textCenter">
                                <a type="button" onClick={undoDelete} 
                                    style={{"backgroundColor":"rgba(67, 47, 135, 0.9)",
                                        "boxShadow":"0px 0px 5px 0px rgba(67, 47, 135, 0.9)"}}
                                    className="dot action-button">
                                <FontAwesomeIcon icon={faUndo} color="white" size='lg'/></a>
                            </div>
                            <div className="subtitle">Restore</div>
                        </li>
                    </ul>
                ) : null}
            </div>   
        </div>
        
        </>
    );
}

