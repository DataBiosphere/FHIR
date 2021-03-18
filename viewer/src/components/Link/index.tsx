/**
 *
 * Link
 *
 */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

interface MyLinkType {
  children: React.ReactNode;
  className: string;
  to: string;
}

function MyLink({ children, className, to }: MyLinkType) {
  return (
    <Link component={RouterLink} className={className} to={to}>
      {children}
    </Link>
  );
}

export default MyLink;
