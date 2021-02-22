import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[800],
    },
    secondary: {
      main: green[800],
    },
  },
  typography: {
    h1: {
      fontSize: '4rem',
    },
    h2: {
      fontSize: '2rem',
    },
  },
});

export default theme;
