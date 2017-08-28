/* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
'use strict';

const webpack = require('webpack');

const prod = process.env.NODE_ENV === 'production';

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js'}),
];

if (prod) {
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false},
      comments: /^\**!|@preserve|copyright|license/i,
    }),
  ]);
}  else {
  // this is largely to not fail on typescript module loading.
  // these "cannot find module" and related errors are benign -- just make sure
  // they don't happen during development in your local build when you have
  // types installed.
  //plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: 'browser/tsconfig.json',
        },
      },
    ],
  },

  node: {
    fs: 'empty'
  },

  entry: {
    app: ['./browser/app.tsx'], //add 'core-js/shim' to npm
    vendor: ['core-js/shim', 'history', 'moment', 'react', 'react-dom', 'react-redux', 'react-router', 'react-select', 'redux', 'redux-thunk', 'whatwg-fetch'],
  },

  output: {
    path: __dirname + 'build/server/ext',
    filename: 'app.js',
    publicPath: '/js/',
  },

  devtool: prod ? 'source-map' : 'cheap-module-eval-source-map',

  plugins: plugins,
};