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

function PaginatedTable({ count, rows, renderers, columns, onView, page, onChangePage }) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.flexCenter}>
        <TablePagination
          className={classes.pagination}
          count={count}
          onChangePage={onChangePage}
          page={page}
          rowsPerPage={25}
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
            {rows.map((entry) => {
              return (
                <TableRow>
                  {renderers.map((row) => {
                    if (Array.isArray(row)) {
                      const [key, renderer] = row;
                      return renderer(_.get(entry, key));
                    }
                    return <TableCell>{_.get(entry, row)}</TableCell>;
                  })}
                  <TableCell>
                    <Button onClick={onView} variant="contained" color="primary" disabled>
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
};

export default PaginatedTable;
