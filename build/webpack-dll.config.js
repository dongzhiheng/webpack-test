var webpack = require('webpack');
var config = require('../config');
var AssetsPlugin = require('assets-webpack-plugin');

const vendors = [
    'vue',
    'vue-router',
    'element-ui',
    'lodash',
    'js-cookie',
    'highcharts'
    // ...其它库
];
module.exports = {
    output: {
        path: config.build.dllDir,
        filename: '[name].[chunkhash].js',
        library: '[name]',
    },
    entry: {
        "lib": vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: config.build.dllDir,
        }),
        new AssetsPlugin({
        	filename: 'bundle-config.json'
        }),
    ]
};
