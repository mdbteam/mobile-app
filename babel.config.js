module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // ❌ NO usar react-native-worklets/plugin
      // ❌ NO usar plugins extra que afecten web

      // ✔️ Reanimated siempre último
      "react-native-reanimated/plugin",
    ],
  };
};
