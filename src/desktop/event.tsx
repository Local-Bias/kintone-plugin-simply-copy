import React from 'react';
import { render } from 'react-dom';
import { getCurrentRecord, getSpaceElement, setCurrentRecord } from '@common/kintone';
import { restoreStorage } from '@common/plugin';
import { PLUGIN_NAME } from '@common/statics';

import Button from './button';

const events: launcher.EventTypes = ['app.record.create.show', 'app.record.edit.show'];

const action: launcher.Action = async (event, pluginId) => {
  const config = restoreStorage(pluginId);

  if (!config || !config.conditions) {
    return event;
  }

  for (const condition of config.conditions) {
    const element = getSpaceElement(condition.spaceId);

    const onClick = () => {
      try {
        const { record } = getCurrentRecord();

        record[condition.fieldDst].value = record[condition.fieldSrc].value;

        console.log(record);
        setCurrentRecord({ record });
      } catch (error) {
        console.error(PLUGIN_NAME + 'でエラーが発生しました。設定情報をご確認ください。');
      }
    };

    const buttonLabel = condition.buttonLabel;

    render(<Button {...{ onClick, buttonLabel }} />, element);
  }

  return event;
};

export default { events, action };
