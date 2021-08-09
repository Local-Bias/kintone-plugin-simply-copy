import React, { ChangeEventHandler, useState, VFC, VFCX } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';
import produce from 'immer';
import { Properties } from '@kintone/rest-api-client/lib/client/types';

import { appFieldsState, spacesState, storageState } from '../../../states';
import { MenuItem, TextField } from '@material-ui/core';
import { Spacer } from '@kintone/rest-api-client/lib/KintoneFields/types/fieldLayout';

type ContainerProps = { condition: kintone.plugin.Condition; index: number };
type Props = ContainerProps & {
  appFields: Properties;
  spacers: Spacer[];
  onSrcChange: ChangeEventHandler<HTMLInputElement>;
  onDstChange: ChangeEventHandler<HTMLInputElement>;
  onSpaceIdChange: ChangeEventHandler<HTMLInputElement>;
};

const Component: VFCX<Props> = ({
  className,
  index,
  condition,
  appFields,
  spacers,
  onSrcChange,
  onDstChange,
  onSpaceIdChange,
}) => (
  <div {...{ className }}>
    <div>
      <TextField
        label='コピー元のフィールド'
        fullWidth
        select
        value={condition.fieldSrc}
        onChange={onSrcChange}
      >
        {Object.values(appFields).map(({ code, label }, i) => (
          <MenuItem key={i} value={code}>
            {label}({code})
          </MenuItem>
        ))}
      </TextField>
    </div>
    <div>
      <TextField
        label='コピー先のフィールド'
        fullWidth
        select
        value={condition.fieldDst}
        onChange={onDstChange}
      >
        {Object.values(appFields).map(({ code, label }, i) => (
          <MenuItem key={i} value={code}>
            {label}({code})
          </MenuItem>
        ))}
      </TextField>
    </div>
    <div>
      <TextField
        label='コピーボタンを設置するスペースID'
        fullWidth
        select
        value={condition.spaceId}
        onChange={onSpaceIdChange}
      >
        {Object.values(spacers).map(({ elementId }, i) => (
          <MenuItem key={i} value={elementId}>
            {elementId}
          </MenuItem>
        ))}
      </TextField>
    </div>
  </div>
);

const StyledComponent = styled(Component)`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  > div {
    min-width: 300px;
  }
`;

const Container: VFC<ContainerProps> = ({ condition, index }) => {
  const appFields = useRecoilValue(appFieldsState);
  const setStorage = useSetRecoilState(storageState);
  const spacers = useRecoilValue(spacesState);

  const onSrcChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setStorage((_, _storage = _!) =>
      produce(_storage, (draft) => {
        draft.conditions[index].fieldSrc = e.target.value;
      })
    );
  };
  const onDstChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setStorage((_, _storage = _!) =>
      produce(_storage, (draft) => {
        draft.conditions[index].fieldDst = e.target.value;
      })
    );
  };
  const onSpaceIdChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setStorage((_, _storage = _!) =>
      produce(_storage, (draft) => {
        draft.conditions[index].spaceId = e.target.value;
      })
    );
  };

  return (
    <StyledComponent
      {...{ condition, index, appFields, spacers, onSrcChange, onDstChange, onSpaceIdChange }}
    />
  );
};

export default Container;
