const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 注：“__dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录。
  entry:  __dirname + "/app/main.js",//唯一入口文件
  output: {
    path: __dirname + "/build",//打包后的文件存放的地方
    filename: "bundle.js"//打包后输出文件的文件名
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './build',//本地服务器所加载的页面所在的目录
    stats: { colors: true },
    // colors: true, //终端中输出结果为彩色
    historyApiFallback: true,//不跳转
    inline: true, //实时刷新
    port: 8888, //设置默认监听端口，省略默认为 “8080”
    hot: true,
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["es2015", "react"]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {loader: "style-loader"},
          {
            loader: "css-loader",
            options: {
              modules :true
            }
          }, {
            loader: "postcss-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin('版权所有，翻版必究'),
    new HtmlWebpackPlugin({
      template: __dirname + '/app/index.tmpl.html'
    }),
    new webpack.HotModuleReplacementPlugin()//热加载插件
  ]
}
/* const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 入口文件，如果有多个不同的入口文件，可以写成对象的形式
    entry: './app/index.js',
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
      new HtmlWebpackPlugin({
          title: "This is the result",
          filename: "./index.html",
          template: "./app/index.html",
          inject: "body",
          favicon: "",
          minify: {
              caseSensitive: false,
              collapseBooleanAttributes: true,
              collapseWhitespace: true
          },
          hash: true,
          cache: true,
          showErrors: true,
          chunks: "",
          chunksSortMode: "auto",
          excludeChunks: "",
          xhtml: false
      })
  ]
}; */