/**
 *
 * Link
 *
 */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';

function MyLink(props) {
  const { children, ...rest } = props;
  return (
    <Link component={RouterLink} {...rest}>
      {children}
    </Link>
  );
}

MyLink.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MyLink;
