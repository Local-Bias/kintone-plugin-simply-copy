import { appSpacesState } from '@/config/states/kintone';
import { getConditionPropertyState } from '@/config/states/plugin';
import {
  PluginFormDescription,
  PluginFormSection,
  PluginFormTitle,
  RecoilText,
} from '@konomi-app/kintone-utilities-react';
import { Autocomplete, Skeleton, TextField } from '@mui/material';
import React, { FC, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';

const spaceIdState = getConditionPropertyState('spaceId');

const Component: FC = () => {
  const spaceId = useRecoilValue(spaceIdState);
  const appSpaces = useRecoilValue(appSpacesState);

  const onSpaceIdChange = useRecoilCallback(
    ({ set }) =>
      (value: string) => {
        set(spaceIdState, value);
      },
    []
  );

  return (
    <Autocomplete
      value={appSpaces.find((spacer) => spacer.elementId === spaceId) ?? null}
      sx={{ width: '350px' }}
      options={appSpaces}
      isOptionEqualToValue={(option, v) => option.elementId === v.elementId}
      getOptionLabel={(option) => option.elementId}
      onChange={(_, group) => onSpaceIdChange(group?.elementId ?? '')}
      renderInput={(params) => (
        <TextField {...params} label='対象スペースID' variant='outlined' color='primary' />
      )}
    />
  );
};

const Placeholder: FC = () => {
  return <Skeleton variant='rounded' width='350px' height='56px' />;
};

const Container: FC = () => {
  const embeddingMode = useRecoilValue(getConditionPropertyState('embeddingMode'));

  if (embeddingMode === 'header') {
    return null;
  }

  return (
    <PluginFormSection>
      <PluginFormTitle>スペースの設定</PluginFormTitle>
      <PluginFormDescription last>
        ボタンを埋め込むスペースのスペースIDを指定してください。
      </PluginFormDescription>
      <Suspense fallback={<Placeholder />}>
        <Component />
      </Suspense>
    </PluginFormSection>
  );
};

export default Container;
