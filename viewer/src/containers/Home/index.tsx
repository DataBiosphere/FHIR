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
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableHead,
  TableContainer,
  TableRow,
  TableCell,
  CardActionArea,
} from '@material-ui/core';

import GitHub from '@material-ui/icons/GitHub';
import ReceiptIcon from '@material-ui/icons/Receipt';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { selectSummaryInfo, selectLoading } from './selectors';
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
  loadingBox: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export function Home(props: any) {
  useInjectReducer({ key: 'home', reducer });
  useInjectSaga({ key: 'home', saga });

  const { getSummaryInfo, summaryInfo, loading } = props;

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
        Viewer
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
              {summaryInfo ? (
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
                      {summaryInfo.map((info: any) => (
                        <TableRow key={info.resourceType}>
                          <TableCell>{info.resourceType}</TableCell>
                          <TableCell>{info.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <></>
              )}
              {loading ? (
                <div className={classes.loadingBox}>
                  <CircularProgress size={60} />
                </div>
              ) : (
                <></>
              )}
            </CardContent>
            <CardActions className={classes.cardFooter}>
              <Button color="primary" variant="contained" href="/search">
                Search
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Explore the Broad FHIR Server" />
            <CardContent>
              <Grid>
                <CardActionArea href="https://github.com/DataBiosphere/FHIR">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography color="primary" variant="h6">
                      Broad FHIR on Github
                    </Typography>
                    <GitHub style={{ fontSize: 30 }} />
                  </div>
                </CardActionArea>
                <CardActionArea href="/metadata">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography color="primary" variant="h6">
                      View the CapabilityStatement
                    </Typography>
                    <ReceiptIcon style={{ fontSize: 30 }} />
                  </div>
                </CardActionArea>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

Home.propTypes = {
  getSummaryInfo: PropTypes.func.isRequired,
  summaryInfo: PropTypes.arrayOf(
    PropTypes.shape({
      resourceType: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    })
  ),
  loading: PropTypes.bool,
};

Home.defaultProps = {
  summaryInfo: null,
  loading: null,
};

const mapStateToProps = (state: any) => ({
  summaryInfo: selectSummaryInfo(state),
  loading: selectLoading(state),
});

function mapDispatchToProps(dispatch: any) {
  return {
    getSummaryInfo: () => dispatch(getSummaryInfoAction()),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Home);
