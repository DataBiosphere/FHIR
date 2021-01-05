/**
 *
 * Home
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';

import {
  makeStyles,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableHead,
  TableContainer,
  TableRow,
  TableCell,
} from '@material-ui/core';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { selectSummaryInfo } from './selectors';
import reducer from './reducer';
import { getSummaryInfoAction } from './actions';
import saga from './saga';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3, 2),
  },
  title: {
    marginBottom: '1rem',
  },
  cardFooter: {
    padding: theme.spacing(2, 2),
  },

  cardBlurb: {
    marginBottom: theme.spacing(2),
  },
}));

export function Home(props) {
  useInjectReducer({ key: 'home', reducer });
  useInjectSaga({ key: 'home', saga });

  const { getSummaryInfo, summaryInfo } = props;

  const classes = useStyles();

  useEffect(() => {
    getSummaryInfo();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Description of Home" />
      </Helmet>
      <Typography variant="h1" className={classes.title}>
        Broad FHIR
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="About" />
            <CardContent>
              <Typography className={classes.cardBlurb} variant="body1">
                FHIR is an interoperability standard intended to facilitate the exchange of
                healthcare information between healthcare providers, patients, caregivers, payers,
                researchers, and any one else involved in the healthcare ecosystem. It consists of 2
                main parts – a content model in the form of ‘resources’, and a specification for the
                exchange of these resources in the form of real-time RESTful interfaces as well as
                messaging and Documents.
              </Typography>
              <Typography className={classes.cardBlurb} variant="body1">
                Although this application intended to be used with the Broad FHIR server, you can
                perform a SMART launch against your own FHIR server aswell.
              </Typography>
              <Typography className={classes.cardBlurb} variant="body1">
                Try performing a SMART Launch by clicking the button on the Navigation bar.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Overview" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography>Resource Type</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>Total</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summaryInfo ? (
                      summaryInfo.map((info) => (
                        <TableRow>
                          <TableCell>{info.resourceType}</TableCell>
                          <TableCell>{info.total}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <></>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions className={classes.cardFooter}>
              <Button color="primary" variant="contained" href="/search">
                Search
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

const mapStateToProps = (state) => ({ summaryInfo: selectSummaryInfo(state) });

function mapDispatchToProps(dispatch) {
  return {
    getSummaryInfo: () => dispatch(getSummaryInfoAction()),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Home);
