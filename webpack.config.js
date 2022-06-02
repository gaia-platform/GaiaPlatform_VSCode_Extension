//@ts-check

const path = require("path");
const webpack = require('webpack');

module.exports = {
  entry: {
    dataViewer: "./src/data_view/app/index.tsx"
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js"
  },
  devtool: "cheap-module-source-map",
  externals: {
    vscode: 'commonjs vscode'
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json", ".css"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        options: {}
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
    ]
  },
  performance: {
    hints: false
  }
};
