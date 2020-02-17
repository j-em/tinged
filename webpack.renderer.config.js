const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const path = require("path");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }]
});

rules.push({ test: /\.(png|woff)$/, use: [{ loader: "file-loader" }] });

module.exports = {
  module: {
    rules
  },
  plugins: plugins,
  devServer: {
    hot: true
  },
  resolve: {
    alias: {
      images: path.resolve(__dirname, "src/images"),
      views: path.resolve(__dirname, "src/views"),
      ui: path.resolve(__dirname, "src/ui")
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".png"]
  }
};
