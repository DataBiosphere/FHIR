import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// TODO: figure out defaultProp for external
// interface LinkType {
//   icon: React.ReactNode; // PropTypes.node
//   text: string;
//   to: string;
//   external: boolean;
// }

const useStyles = makeStyles(() => ({
  drawerText: {
    color: '#757575',
    fontWeight: 'bold',
  },
}));

const MyLink = ({ icon, text, to, external }: any) => {
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

MyLink.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  external: PropTypes.bool,
};

MyLink.defaultProps = {
  external: undefined,
};

export default MyLink;
