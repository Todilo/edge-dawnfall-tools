const darkTheme = require("antd/dist/dark-theme");
const { override, fixBabelImports, addLessLoader } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),

  addLessLoader({
    javascriptEnabled: true,
    hack: `true;@import "${require.resolve(
      "antd/lib/style/color/colorPalette.less"
    )}";`,

    modifyVars: {
      ...darkTheme,

      "primary-color": "#f5a623",
      "success-color": "rgb(20, 192, 192)"
    }
  })
);
