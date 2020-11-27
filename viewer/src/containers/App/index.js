import React from 'react';
import { Switch } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import SearchIcon from '@material-ui/icons/Search';
import GitHubIcon from '@material-ui/icons/GitHub';
import ReceiptIcon from '@material-ui/icons/Receipt';

import Layout from '../../components/Layout';

const useStyles = makeStyles((theme) => ({}));

export default function App() {
  const classes = useStyles();

  const top = [
    {
      icon: <SearchIcon />,
      to: '/',
      text: 'Search',
    },
    {
      icon: <ReceiptIcon />,
      to: '/capability',
      text: 'CapabilityStatement',
    },
  ];

  const bottom = [
    {
      icon: <GitHubIcon />,
      to: 'https://github.com/databiosphere/fhir',
      text: 'Github',
      external: true,
    },
  ];

  return (
    <Layout topSideBarMenu={top} bottomSideBarMenu={bottom}>
      <Switch></Switch>
    </Layout>
  );
}
