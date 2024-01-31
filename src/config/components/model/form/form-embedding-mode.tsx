import { getConditionPropertyState } from '@/config/states/plugin';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React, { FC } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';

const MODE_LIST = [
  { label: 'ヘッダー', mode: 'header' },
  { label: 'スペース', mode: 'space' },
] satisfies { label: string; mode: Plugin.EmbeddingMode }[];

const Component: FC = () => {
  const mode = useRecoilValue(getConditionPropertyState('embeddingMode'));

  const onModeChange = useRecoilCallback(
    ({ set }) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        set(getConditionPropertyState('embeddingMode'), event.target.value as Plugin.EmbeddingMode);
      },
    []
  );

  return (
    <FormControl>
      <RadioGroup row value={mode} onChange={onModeChange}>
        {MODE_LIST.map(({ label, mode }) => (
          <FormControlLabel key={mode} value={mode} control={<Radio />} label={label} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default Component;
