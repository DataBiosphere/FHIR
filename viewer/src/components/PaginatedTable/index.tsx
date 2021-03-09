import React from 'react';
import _ from 'lodash';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';

interface PaginatedTableType {
  count: number;
  rows: any[];
  renderers: any[];
  columns: any[];
  onView: (event: any, item: any) => any;
  page: number;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => void;
  itemKey: string;
  rowsPerPage: number;
  onChangeRowsPerPage: React.ChangeEventHandler<Element>;
}

const useStyles = makeStyles(() => ({
  pagination: {
    borderBottom: '0px',
    marginLeft: '0px',
  },
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const labelDisplayedRows = ({ from, to, count }: any) =>
  `Displaying ${from}-${to} of ${count} results`;
const rowsPerPageOptions = [25, 50, 100, 250];

function PaginatedTable({
  count,
  rows,
  renderers,
  columns,
  onView,
  page,
  onChangePage,
  itemKey,
  onChangeRowsPerPage,
  rowsPerPage,
}: PaginatedTableType) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.flexCenter}>
        <TablePagination
          className={classes.pagination}
          count={count}
          labelDisplayedRows={labelDisplayedRows}
          onChangePage={onChangePage}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </div>

      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column: any) => (
                <TableCell key={column}>
                  <Typography variant="h6">{column}</Typography>
                </TableCell>
              ))}
              <TableCell>
                <Typography variant="h6">View</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((item: any) => {
              return (
                <TableRow key={item[itemKey]}>
                  {renderers.map((row: any) => {
                    if (Array.isArray(row)) {
                      const [key, renderer] = row;
                      return renderer(_.get(item, key));
                    }
                    return <TableCell key={`${item.id}${row}`}>{_.get(item, row)}</TableCell>;
                  })}
                  <TableCell>
                    <Button
                      onClick={(event) => onView(event, item)}
                      variant="contained"
                      color="primary"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default PaginatedTable;
