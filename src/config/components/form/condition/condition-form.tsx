import React, { ChangeEvent, ChangeEventHandler, useState, VFC, VFCX } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';
import produce from 'immer';
import { Properties } from '@kintone/rest-api-client/lib/client/types';

import { appFieldsState, spacesState, storageState } from '../../../states';
import { MenuItem, TextField } from '@material-ui/core';
import { Spacer } from '@kintone/rest-api-client/lib/KintoneFields/types/fieldLayout';

type ContainerProps = Readonly<{ condition: kintone.plugin.Condition; index: number }>;
type Props = Readonly<{
  condition: kintone.plugin.Condition;
  appFields: Properties;
  spacers: Spacer[];
  onSrcChange: ChangeEventHandler<HTMLInputElement>;
  onDstChange: ChangeEventHandler<HTMLInputElement>;
  onSpaceIdChange: ChangeEventHandler<HTMLInputElement>;
  onButtonLabelChange: ChangeEventHandler<HTMLInputElement>;
}>;

const Component: VFCX<Props> = ({
  className,
  condition,
  appFields,
  spacers,
  onSrcChange,
  onDstChange,
  onSpaceIdChange,
  onButtonLabelChange,
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
    <div>
      <TextField
        label='ボタンに表示する文字列'
        fullWidth
        value={condition.buttonLabel}
        onChange={onButtonLabelChange}
      />
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

  const onChange = (e: ChangeEvent<HTMLInputElement>, field: keyof kintone.plugin.Condition) => {
    setStorage((_, _storage = _!) =>
      produce(_storage, (draft) => {
        draft.conditions[index][field] = e.target.value;
      })
    );
  };

  const onSrcChange: ChangeEventHandler<HTMLInputElement> = (e) => onChange(e, 'fieldSrc');
  const onDstChange: ChangeEventHandler<HTMLInputElement> = (e) => onChange(e, 'fieldDst');
  const onSpaceIdChange: ChangeEventHandler<HTMLInputElement> = (e) => onChange(e, 'spaceId');
  const onButtonLabelChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    onChange(e, 'buttonLabel');

  return (
    <StyledComponent
      {...{
        condition,
        appFields,
        spacers,
        onSrcChange,
        onDstChange,
        onSpaceIdChange,
        onButtonLabelChange,
      }}
    />
  );
};

export default Container;
