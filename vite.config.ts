import { createRequire } from "node:module";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const require = createRequire(import.meta.url);
const darkTheme = require("antd/dist/dark-theme");

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          hack: `true; @import "${require.resolve(
            "antd/lib/style/color/colorPalette.less"
          )}";`,
          ...darkTheme,
          "primary-color": "#f5a623",
          "success-color": "rgb(20, 192, 192)",
        },
      },
    },
  },
});
