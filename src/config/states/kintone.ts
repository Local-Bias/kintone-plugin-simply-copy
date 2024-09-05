import { GUEST_SPACE_ID } from '@/lib/global';
import { getAppId, getFormFields, getFormLayout, kintoneAPI } from '@konomi-app/kintone-utilities';
import { selector } from 'recoil';

const PREFIX = 'kintone';

const READONLY_FIELDS: kintoneAPI.FieldPropertyType[] = [
  'RECORD_NUMBER',
  'CREATOR',
  'CREATED_TIME',
  'MODIFIER',
  'UPDATED_TIME',
  'STATUS',
  'CALC',
  'REFERENCE_TABLE',
];

export const appFieldsState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}appFieldsState`,
  get: async () => {
    const app = getAppId()!;
    const { properties } = await getFormFields({
      app,
      preview: true,
      guestSpaceId: GUEST_SPACE_ID,
      debug: process.env.NODE_ENV === 'development',
    });

    const values = Object.values(properties);

    return values.sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  },
});

export const dstFieldsState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}dstFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);
    return fields.filter((field) => !READONLY_FIELDS.includes(field.type));
  },
});

export const flatFieldsState = selector<kintoneAPI.FieldProperty[]>({
  key: `${PREFIX}flatFieldsState`,
  get: async ({ get }) => {
    const fields = get(appFieldsState);
    return fields.flatMap((field) => {
      if (field.type === 'SUBTABLE') {
        return Object.values(field.fields);
      }
      return field;
    });
  },
});

export const appLayoutState = selector<kintoneAPI.Layout>({
  key: `${PREFIX}appLayoutState`,
  get: async () => {
    const app = getAppId();
    if (!app) {
      throw new Error('アプリのフィールド情報が取得できませんでした');
    }

    const { layout } = await getFormLayout({
      app,
      preview: true,
      guestSpaceId: GUEST_SPACE_ID,
      debug: process.env.NODE_ENV === 'development',
    });
    return layout;
  },
});

export const appSpacesState = selector<kintoneAPI.layout.Spacer[]>({
  key: `${PREFIX}appSpacesState`,
  get: ({ get }) => {
    const layout = get(appLayoutState);

    const fields = flatLayout(layout);

    const spaces = fields.filter((field) => field.type === 'SPACER') as kintoneAPI.layout.Spacer[];

    const filtered = spaces.filter((space) => space.elementId);

    return filtered;
  },
});

const flatLayout = (layout: kintoneAPI.Layout): kintoneAPI.LayoutField[] => {
  const results: kintoneAPI.LayoutField[] = [];
  for (const chunk of layout) {
    if (chunk.type === 'ROW') {
      results.push(...flatLayoutRow(chunk));
      continue;
    } else if (chunk.type === 'GROUP') {
      results.push(...flatLayout(chunk.layout));
    } else if (chunk.type === 'SUBTABLE') {
      results.push(...chunk.fields);
    }
  }
  return results;
};

const flatLayoutRow = (row: kintoneAPI.layout.Row): kintoneAPI.LayoutField[] => {
  return row.fields.reduce<kintoneAPI.LayoutField[]>((acc, field) => [...acc, field], []);
};
