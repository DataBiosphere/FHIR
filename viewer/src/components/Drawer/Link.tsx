import React from 'react';

import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

interface LinkType {
  icon: React.ReactNode; // PropTypes.node
  text: string;
  to: string;
  external: boolean;
}

const useStyles = makeStyles(() => ({
  drawerText: {
    color: '#757575',
    fontWeight: 'bold',
  },
}));

const MyLink = ({ icon, text, to, external }: LinkType) => {
  const classes = useStyles();

  if (external) {
    return (
      <Link href={to} underline="none">
        <ListItem button>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={<Typography className={classes.drawerText}>{text}</Typography>} />
        </ListItem>
      </Link>
    );
  }
  return (
    <Link component={RouterLink} to={to} underline="none">
      <ListItem button>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={<Typography className={classes.drawerText}>{text}</Typography>} />
      </ListItem>
    </Link>
  );
};

// WARN: figure out defaultProp typing?
MyLink.defaultProps = {
  external: undefined,
};

export default MyLink;
