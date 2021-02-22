/**
 *
 * Link
 *
 */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';

function MyLink({ children, className, to }: { children: any; className: string; to: string }) {
  return (
    <Link component={RouterLink} className={className} to={to}>
      {children}
    </Link>
  );
}

MyLink.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MyLink;
