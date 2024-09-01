//@ts-check
const hp = 'https://konomi.app/';
const commonCdn = 'https://kintone-plugin.konomi.app/common';

/** @satisfies { Plugin.Meta.Config } */
export default /** @type { const } */ ({
  id: 'ribbit-kintone-plugin-simply-copy',
  pluginReleasePageUrl: `https://ribbit.konomi.app/kintone-plugin/`,
  server: {
    port: 3547,
  },
  lint: {
    build: true,
  },
  tailwind: {
    css: 'src/styles/global.css',
    config: {
      desktop: 'tailwind.config.desktop.mjs',
      config: 'tailwind.config.config.mjs',
    },
  },
  manifest: {
    base: {
      manifest_version: 1,
      version: '3.0.0',
      type: 'APP',
      name: {
        en: 'Field Data Copy Plugin',
        ja: 'フィールドデータコピープラグイン',
        zh: '字段数据复制插件',
      },
      description: {
        en: 'A plugin that copies the value of a specific field to another field when a button is pressed',
        ja: '特定のフィールドの値を、ボタンを押したタイミングで別フィールドへコピーします',
        zh: '一个在按下按钮时将特定字段的值复制到另一个字段的插件',
      },
      icon: 'icon.png',
      homepage_url: { ja: hp, en: hp },
      desktop: { js: [`${commonCdn}/desktop.js`], css: [] },
      mobile: { js: [`${commonCdn}/desktop.js`], css: [] },
      config: {
        html: 'config.html',
        js: [`${commonCdn}/config.js`],
        css: [],
        required_params: [],
      },
    },
    prod: {
      desktop: { js: ['desktop.js'], css: ['desktop.css'] },
      mobile: { js: ['desktop.js'], css: ['desktop.css'] },
      config: { js: ['config.js'], css: ['config.css'] },
    },
    standalone: {
      desktop: { js: ['desktop.js'], css: ['desktop.css'] },
      mobile: { js: ['desktop.js'], css: ['desktop.css'] },
      config: { js: ['config.js'], css: ['config.css'] },
    },
  },
});
