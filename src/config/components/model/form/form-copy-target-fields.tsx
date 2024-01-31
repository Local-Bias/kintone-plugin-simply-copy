import { IconButton, Skeleton, Tooltip } from '@mui/material';
import React, { FC, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { produce } from 'immer';
import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-react';

import { appFieldsState } from '../../../states/kintone';
import { getConditionPropertyState } from '../../../states/plugin';
import { useRecoilRow } from '@/config/hooks/use-recoil-row';
import { ArrowRight } from '@mui/icons-material';

const copyTargetFieldsState = getConditionPropertyState('copyTargetFields');

const Component: FC = () => {
  const { addRow, deleteRow } = useRecoilRow({
    state: copyTargetFieldsState,
    getNewRow: () => ({ src: '', dst: '' }),
  });
  const copyTargetFields = useRecoilValue(copyTargetFieldsState);

  console.log({ copyTargetFields });

  const onSrcFieldChange = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number, value: string) => {
        set(copyTargetFieldsState, (current) =>
          produce(current, (draft) => {
            draft[rowIndex].src = value;
          })
        );
      },
    []
  );

  const onDstFieldChange = useRecoilCallback(
    ({ set }) =>
      (rowIndex: number, value: string) => {
        set(copyTargetFieldsState, (current) =>
          produce(current, (draft) => {
            draft[rowIndex].dst = value;
          })
        );
      },
    []
  );

  return (
    <div className='flex flex-col gap-4'>
      {copyTargetFields.map(({ src, dst }, i) => (
        <div key={i} className='flex items-center gap-2'>
          <RecoilFieldSelect
            label='コピー元のフィールド'
            state={appFieldsState}
            onChange={(code) => onSrcFieldChange(i, code)}
            fieldCode={src}
          />
          <ArrowRight />
          <RecoilFieldSelect
            label='コピー先のフィールド'
            state={appFieldsState}
            onChange={(code) => onDstFieldChange(i, code)}
            fieldCode={dst}
          />
          <Tooltip title='フィールドを追加する'>
            <IconButton size='small' onClick={() => addRow(i)}>
              <AddIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          {copyTargetFields.length > 1 && (
            <Tooltip title='この設定を削除する'>
              <IconButton size='small' onClick={() => deleteRow(i)}>
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

const Placeholder: FC = () => (
  <div className='flex flex-col gap-4'>
    {new Array(3).fill('').map((_, i) => (
      <div key={i} className='flex items-center gap-2'>
        <Skeleton variant='rounded' width={400} height={56} />
        <Skeleton variant='circular' width={24} height={24} />
        <Skeleton variant='circular' width={24} height={24} />
      </div>
    ))}
  </div>
);

const Container: FC = () => (
  <Suspense fallback={<Placeholder />}>
    <Component />
  </Suspense>
);

export default memo(Container);
