module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  plugins: ["emotion"],
  // plugins: [
  //   [
  //     "@babel/plugin-transform-react-jsx",
  //     {
  //       runtime: "automatic",
  //     },
  //   ],
  // ],
};
