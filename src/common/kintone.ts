import { Layout, Properties } from '@kintone/rest-api-client/lib/client/types';
import { OneOf as AppField } from '@kintone/rest-api-client/lib/KintoneFields/types/property';
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { Cybozu } from '../types/cybozu';
import {
  OneOf as LayoutField,
  Spacer,
} from '@kintone/rest-api-client/lib/KintoneFields/types/fieldLayout';

/** kintoneアプリに初期状態で存在するフィールドタイプ */
const DEFAULT_DEFINED_FIELDS: PickType<AppField, 'type'>[] = [
  'UPDATED_TIME',
  'CREATOR',
  'CREATED_TIME',
  'CATEGORY',
  'MODIFIER',
  'STATUS',
];

declare const cybozu: Cybozu;

/**
 * 実行されている環境がモバイル端末である場合はTrueを返却します
 */
export const isMobile = (eventType?: string) => {
  if (eventType) {
    return eventType.includes('mobile.');
  }
  return cybozu?.data?.IS_MOBILE_DEVICE ?? !kintone.app.getId();
};

export const getApp = (eventType?: string): typeof kintone.mobile.app | typeof kintone.app =>
  isMobile(eventType) ? kintone.mobile.app : kintone.app;

export const getAppId = () => getApp().getId();
export const getRecordId = () => getApp().record.getId();

export const getSpaceElement = (spaceId: string) => getApp().record.getSpaceElement(spaceId);

/**
 * 現在表示しているレコード情報を返却します
 * - デバイス毎に最適な情報を返します
 * @returns レコード情報
 */
export const getCurrentRecord = () => getApp().record.get();

/**
 * 現在表示しているレコード情報へデータを反映します
 * @param record レコード情報
 */
export const setCurrentRecord = (record: { record: any }) => getApp().record.set(record);

export const getAppFields = async (targetApp?: string | number) => {
  const app = targetApp || kintone.app.getId();

  if (!app) {
    throw new Error('アプリのフィールド情報が取得できませんでした');
  }

  const client = new KintoneRestAPIClient();

  const { properties } = await client.app.getFormFields({ app });

  return properties;
};

export const getUserDefinedFields = async (): Promise<Properties> => {
  const fields = await getAppFields();

  const filterd = Object.entries(fields).filter(
    ([_, value]) => !DEFAULT_DEFINED_FIELDS.includes(value.type)
  );

  return filterd.reduce<Properties>((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};

export const getAppLayout = async () => {
  const app = getAppId();

  if (!app) {
    throw new Error('アプリのフィールド情報が取得できませんでした');
  }

  const client = new KintoneRestAPIClient();

  const { layout } = await client.app.getFormLayout({ app });

  return layout;
};

export const getLayoutFields = async () => {
  const layout = await getAppLayout();

  return reduceLayout(layout);
};

const reduceLayout = (layout: Layout) => {
  let fields: LayoutField[] = [];
  for (const field of layout) {
    switch (field.type) {
      case 'ROW':
      case 'SUBTABLE': {
        fields = [...fields, ...field.fields];
        break;
      }
      case 'GROUP': {
        const a = field.layout;

        fields = [...fields, ...reduceLayout(field.layout)];
        break;
      }
    }
  }
  return fields;
};

export const getSpaces = async () => {
  const fields = await getLayoutFields();

  return fields.filter((field) => field.type === 'SPACER') as Spacer[];
};
