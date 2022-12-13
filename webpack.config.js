
var path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HandlebarsPlugin = require("handlebars-webpack-plugin");

module.exports = env => 
{
  let outputPath = path.resolve(__dirname, (env.output !== undefined ? env.output : "build"));

  return {
    mode: 'production',
    target: ['web', 'es5'],
    entry: './src/index.ts',
    output: {
      path: outputPath,
      filename: 'bundle.js',
      clean: true
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          "public/**",
          { from: "src/*.css", to: "[name][ext]" }
        ],
      }),
      new HandlebarsPlugin({
        entry: './src/*.hbs',
        data: path.join(__dirname, "/project.json"),
        output: outputPath + '/[name].html'
      })
    ],
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader'
        },
        {
          test: /\.(glsl|vs|fs)$/,
          loader: 'ts-shader-loader'
        }
      ]
    },
    devtool: 'inline-source-map'
  }
}
