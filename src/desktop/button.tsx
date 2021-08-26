import React, { VFC, VFCX } from 'react';
import styled from '@emotion/styled';
import { Button } from '@material-ui/core';

type ContainerProps = Readonly<{ onClick: () => void; buttonLabel: string }>;
type Props = ContainerProps & Readonly<{}>;

const Component: VFCX<Props> = ({ className, onClick, buttonLabel }) => (
  <div {...{ className }}>
    <Button variant='contained' size='large' color='primary' {...{ onClick }}>
      {buttonLabel}
    </Button>
  </div>
);

const StyledComponent = styled(Component)``;

const Container: VFC<ContainerProps> = (props) => {
  return <StyledComponent {...props} />;
};

export default Container;
