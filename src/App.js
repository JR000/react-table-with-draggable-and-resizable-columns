import React, { useState } from "react";
import styled from "styled-components";
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useColumnOrder
} from "react-table";

import makeData from "./makeData";

const Styles = styled.div`
  padding: 1rem;

  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      ${"" /* In this example we use an absolutely position resizer,
       so this is required. */}
      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;
        ${"" /* prevents from scrolling while dragging on touch devices */}
        touch-action:none;

        &.isResizing {
          background: red;
        }
      }
    }
  }
`;

function Table({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 150,
      width: 150,
      maxWidth: 400
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    resetResizing,
    setColumnOrder,
    visibleColumns
  } = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useBlockLayout,
    useResizeColumns,
    useColumnOrder
  );

  const [currentColumn, setCurrentColumn] = useState(null);

  function dragEnterHandler(e, column) {
    e.preventDefault();
    if (column === currentColumn) return;
    const arr = [...visibleColumns.map((d) => d.id)];
    const currentIndex = arr.indexOf(currentColumn.id);
    arr.splice(currentIndex, 1);
    const dropIndex = arr.indexOf(column.id);
    if (currentIndex > dropIndex) arr.splice(dropIndex, 0, currentColumn.id);
    else arr.splice(dropIndex + 1, 0, currentColumn.id);
    setColumnOrder(arr);
  }

  function dragLeaveHandler(e) {}

  function dragStartHandler(e, column) {
    setCurrentColumn(column);
  }

  function dragEndHandler(e) {}

  function dropHandler(e, column) {
    setCurrentColumn(null);
  }

  return (
    <>
      <button onClick={resetResizing}>Reset Resizing</button>
      <div>
        <div {...getTableProps()} className="table">
          <div>
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map((column) => (
                  <div {...column.getHeaderProps()} className="th">
                    <div
                      draggable={true}
                      //onDragOver={(e) => dragOverHandler(e, column)}
                      onDragEnter={(e) => dragEnterHandler(e, column)}
                      onDragLeave={(e) => dragLeaveHandler(e)}
                      onDragStart={(e) => dragStartHandler(e, column)}
                      onDragEnd={(e) => dragEndHandler(e)}
                      onDrop={(e) => dropHandler(e, column)}
                      key={column}
                    >
                      {column.render("Header")}
                    </div>

                    {/* Use column.getResizerProps to hook up the events correctly */}
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${
                        column.isResizing ? "isResizing" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <div {...row.getRowProps()} className="tr">
                  {row.cells.map((cell) => {
                    return (
                      <div {...cell.getCellProps()} className="td">
                        {cell.render("Cell")}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
    </>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName"
      },
      {
        Header: "Last Name",
        accessor: "lastName"
      },

      {
        Header: "Age",
        accessor: "age",
        width: 50
      },
      {
        Header: "Visits",
        accessor: "visits",
        width: 60
      },
      {
        Header: "Status",
        accessor: "status"
      },
      {
        Header: "Profile Progress",
        accessor: "progress"
      }
    ],
    []
  );

  const data = React.useMemo(() => makeData(10), []);

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default App;
