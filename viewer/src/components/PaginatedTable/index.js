import React from 'react';
import PropTypes from 'prop-types';
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

const rowLabel = ({ from, to, count }) => `Displaying ${from}-${to} of ${count} results`;

function PaginatedTable({ count, rows, renderers, columns, onView, page, onChangePage, itemKey }) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.flexCenter}>
        <TablePagination
          className={classes.pagination}
          count={count}
          labelDisplayedRows={rowLabel}
          onChangePage={onChangePage}
          page={page}
          rowsPerPage={25}
          // due to how the FHIR code is written, we can only parse 25 entires at a time
          rowsPerPageOptions={[]}
        />
      </div>

      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
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
            {rows.map((item) => {
              return (
                <TableRow key={item[itemKey]}>
                  {renderers.map((row) => {
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
                      {/* TODO: coming soon un-disable it above when ready */}
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

PaginatedTable.propTypes = {
  count: PropTypes.number.isRequired,
  rows: PropTypes.array.isRequired,
  renderers: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onView: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  itemKey: PropTypes.string.isRequired,
};

export default PaginatedTable;
