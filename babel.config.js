module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo já inclui suporte a TypeScript e JSX
    presets: ['babel-preset-expo'],
  };
};
