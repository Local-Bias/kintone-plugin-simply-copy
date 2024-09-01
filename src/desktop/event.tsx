import { restorePluginConfig } from '@/lib/plugin';
import { manager } from '@/lib/event-manager';
import {
  getCurrentRecord,
  getHeaderSpace,
  getSpaceElement,
  setCurrentRecord,
} from '@lb-ribbit/kintone-xapp';
import { createRoot } from 'react-dom/client';
import { Button } from '@mui/material';
import React from 'react';
import { getFieldValueAsString, kintoneAPI } from '@konomi-app/kintone-utilities';

const TEXT_FIELD_TYPES: kintoneAPI.Field['type'][] = [
  'SINGLE_LINE_TEXT',
  'MULTI_LINE_TEXT',
  'RICH_TEXT',
  'LINK',
  'NUMBER',
];

manager.add(['app.record.create.show', 'app.record.edit.show'], async (event) => {
  const config = restorePluginConfig();

  for (const condition of config.conditions) {
    const { buttonLabel, embeddingMode, spaceId, copyTargetFields } = condition;

    const buttonContainer = document.createElement('span');
    buttonContainer.classList.add('mx-2', 'inline-flex', 'items-center');
    const onClick = () => {
      const { record } = getCurrentRecord();
      for (const { src, dst } of copyTargetFields) {
        const srcField = record[src];
        const dstField = record[dst];

        if (!srcField) {
          console.warn(`Field ${src} is not found`);
          continue;
        }
        if (!dstField) {
          console.warn(`Field ${dst} is not found`);
          continue;
        }

        if (TEXT_FIELD_TYPES.includes(dstField.type)) {
          dstField.value = getFieldValueAsString(srcField);
        } else {
          dstField.value = srcField.value;
        }
      }
      setCurrentRecord({ record });
    };

    if (embeddingMode === 'header') {
      buttonContainer.classList.add('mt-2');
      const headerElement = getHeaderSpace(event.type);
      if (!headerElement) {
        process.env.NODE_ENV === 'development' && console.warn('headerElement is not found');
        continue;
      }
      headerElement.appendChild(buttonContainer);
    } else {
      const spaceElement = getSpaceElement(spaceId);
      if (!spaceElement) {
        process.env.NODE_ENV === 'development' && console.warn('spaceElement is not found');
        continue;
      }
      spaceElement.appendChild(buttonContainer);
    }
    createRoot(buttonContainer).render(
      <Button variant='contained' color='primary' size='large' onClick={onClick}>
        {buttonLabel}
      </Button>
    );
  }
  return event;
});
