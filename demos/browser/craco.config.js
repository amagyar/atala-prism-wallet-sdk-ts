const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Pluto - include not src file
      const moduleScopePlugin = webpackConfig.resolve.plugins.find(({ constructor }) => constructor?.name === "ModuleScopePlugin");
      const demosPath = path.resolve(__dirname, "../");
      moduleScopePlugin.appSrcs = [demosPath];
      const oneOfRule = webpackConfig.module.rules.find(x => x.oneOf);
      const tsxRule = oneOfRule.oneOf.find(x => x.test && x.test.toString().includes("tsx"));
      const plutoPath = `${demosPath}/pluto/`;
      tsxRule.include = [tsxRule.include, plutoPath];

      // Wasms - copy to public
      webpackConfig.resolve.extensions.push(".wasm");
      webpackConfig.plugins = [
        new CopyPlugin({
          patterns: [
            {
              context:
                "node_modules/@input-output-hk/atala-prism-wallet-sdk/build/browser/",
              from: path.resolve(
                __dirname,
                "node_modules/@input-output-hk/atala-prism-wallet-sdk/build/browser/*.wasm"
              ),
              to: path.resolve(__dirname, "public"),
            },
          ],
        }),
        ...(webpackConfig.plugins || []),
      ];

      webpackConfig.resolve.fallback = {
        fs: false,
        crypto: false,
        // assert: require.resolve("assert/"),
        // url: require.resolve("url/"),
        // buffer: require.resolve("buffer/"),
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
        //util: require.resolve("util/"),
      };

      return webpackConfig;
    },
  },
};
