import React, { VFC } from 'react';
import { Button } from '@material-ui/core';

type Props = Readonly<{ onClick: () => void; buttonLabel: string }>;

const Component: VFC<Props> = ({ onClick, buttonLabel }) => (
  <div>
    <Button variant='contained' size='large' color='primary' {...{ onClick }}>
      {buttonLabel}
    </Button>
  </div>
);

export default Component;
