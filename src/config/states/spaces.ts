import { getSpaces } from '@common/kintone';
import { Spacer } from '@kintone/rest-api-client/lib/KintoneFields/types/fieldLayout';
import { selector } from 'recoil';

const state = selector<Spacer[]>({
  key: 'Spaces',
  get: async () => {
    const spaces = await getSpaces();
    return spaces;
  },
});

export default state;
