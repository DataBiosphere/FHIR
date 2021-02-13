import React, { useState } from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import { Alert } from '@material-ui/lab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import WhatshotIcon from '@material-ui/icons/Whatshot';

import Drawer from '../Drawer';
import Footer from '../Footer';
import Link from '../Link';
import SEO from '../SEO';

import config from '../../config';

const { iss: fhirUrl } = config;

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  brand: {
    color: 'white',
    flex: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  drawerText: {
    color: '#757575',
    fontWeight: 'bold',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
  fhirserver: {
    border: 'solid 2px darkgreen',
    borderRadius: '10px',
    padding: '.5rem',
    backgroundColor: 'green',
    fontSize: '1rem',
  },

  alert: {
    margin: '1rem',
    padding: '0px 16px',
  },
}));

function Layout({ topSideBarMenu, bottomSideBarMenu, children, iss }: any) {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [, setAnchorEl] = useState();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<any>();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: any) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircleIcon />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <SEO />

      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Link className={classes.brand} to="/">
            <Typography className={classes.title} variant="h6" noWrap>
              Broad FHIR
            </Typography>
          </Link>
          <div className={classes.sectionDesktop}>
            {iss ? (
              <Typography className={classes.fhirserver} variant="h6" noWrap>
                FHIR Server:
                {iss}
              </Typography>
            ) : (
              <>
                <Alert className={classes.alert} severity="error">
                  Unconnected. Make sure you launch from a SMART on FHIR context.
                </Alert>
                <Button
                  aria-label="SMART Launch"
                  aria-controls="smart-launch"
                  aria-haspopup="true"
                  color="secondary"
                  variant="contained"
                  component="button"
                  href={`/launch.html?iss=${encodeURIComponent(fhirUrl)}`}
                >
                  <WhatshotIcon />
                  SMART Launch
                </Button>
              </>
            )}
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}

      <Drawer
        open={open}
        handleDrawerClose={handleDrawerClose}
        top={topSideBarMenu}
        bottom={bottomSideBarMenu}
      />

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
        <Footer />
      </main>
    </div>
  );
}

Layout.propTypes = {
  topSideBarMenu: PropTypes.array.isRequired,
  bottomSideBarMenu: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  iss: PropTypes.string,
};

Layout.defaultProps = {
  iss: undefined,
};

export default Layout;
