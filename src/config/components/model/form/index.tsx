import React, { FC } from 'react';

import {
  PluginFormSection,
  PluginFormTitle,
  PluginFormDescription,
  RecoilText,
} from '@konomi-app/kintone-utilities-react';
import DeleteButton from './condition-delete-button';
import CopyTargetFieldsForm from './form-copy-target-fields';
import EmbeddingModeForm from './form-embedding-mode';
import { getConditionPropertyState } from '@/config/states/plugin';
import SpaceIdForm from './form-space-id';

const Component: FC = () => (
  <div className='p-4'>
    <PluginFormSection>
      <PluginFormTitle>ボタンの場所</PluginFormTitle>
      <PluginFormDescription>ボタンを埋め込む場所を選択します。</PluginFormDescription>
      <PluginFormDescription last>
        "ヘッダー"を選択すると、レコードのヘッダーにボタンが表示されます。
        "スペース"を選択すると、指定したスペースにボタンが表示されます。
      </PluginFormDescription>
      <EmbeddingModeForm />
    </PluginFormSection>
    <SpaceIdForm />
    <PluginFormSection>
      <PluginFormTitle>ボタンのラベル</PluginFormTitle>
      <PluginFormDescription last>ボタンに表示するテキストを入力してください</PluginFormDescription>
      <RecoilText state={getConditionPropertyState('buttonLabel')} label='ボタンのテキスト' />
    </PluginFormSection>
    <PluginFormSection>
      <PluginFormTitle>コピー設定</PluginFormTitle>
      <PluginFormDescription last>
        ボタンを押した際に、どのフィールドをコピーするかを設定します。
      </PluginFormDescription>
      <CopyTargetFieldsForm />
    </PluginFormSection>
    <DeleteButton />
  </div>
);

export default Component;
