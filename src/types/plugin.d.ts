declare namespace Plugin {
  /** 🔌 プラグインがアプリ単位で保存する設定情報 */
  type Config = ConfigV2;

  /** 🔌 プラグインの詳細設定 */
  type Condition = Config['conditions'][number];

  type EmbeddingMode = Condition['embeddingMode'];

  /** 🔌 過去全てのバージョンを含むプラグインの設定情報 */
  type AnyConfig = ConfigV1 | ConfigV2; // | ...;

  type ConfigV2 = {
    version: 2;
    conditions: {
      buttonLabel: string;
      embeddingMode: 'space' | 'header';
      spaceId: string;
      copyTargetFields: { src: string; dst: string }[];
    }[];
  };

  type ConfigV1 = {
    version: 1;
    conditions: {
      fieldSrc: string;
      fieldDst: string;
      spaceId: string;
      buttonLabel: string;
    }[];
  };
}
