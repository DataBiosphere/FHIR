import React from 'react';
import { FormattedMessage } from 'react-intl';

import Divider from '@material-ui/core/Divider';

import A from '../A';
import Wrapper from './Wrapper';
import messages from './messages';

function Footer() {
  return (
    <React.Fragment>
      <Divider />
      <Wrapper>
        <section>
          <FormattedMessage
            {...messages.authorMessage}
            values={{
              author: <A href="https://www.broadinstitute.org/">Broad Institute</A>,
            }}
          />
        </section>
      </Wrapper>
    </React.Fragment>
  );
}

export default Footer;
