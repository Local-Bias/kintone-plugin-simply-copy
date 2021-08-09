import React, { VFC, VFCX } from 'react';
import styled from '@emotion/styled';
import { Button } from '@material-ui/core';

type ContainerProps = Readonly<{ onClick: () => void }>;
type Props = ContainerProps & Readonly<{}>;

const Component: VFCX<Props> = ({ className, onClick }) => (
  <div {...{ className }}>
    <Button variant='contained' size='large' color='primary' {...{ onClick }}>
      データをコピー
    </Button>
  </div>
);

const StyledComponent = styled(Component)``;

const Container: VFC<ContainerProps> = (props) => {
  return <StyledComponent {...props} />;
};

export default Container;
