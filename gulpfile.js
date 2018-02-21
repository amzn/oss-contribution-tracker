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

const spawn = require('child_process').spawn;
const gulp = require('gulp');
const del = require('del');
const jasmine = require('gulp-jasmine');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

const tsServer = ts.createProject('server/tsconfig.json', {
  typescript: require('typescript'),
});
gulp.task('build-server', ['copy-config', 'copy-json'], () => {
  return src(['server/**/*.ts'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(tsServer())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/server'));
});

const tsSelenium = ts.createProject('selenium/tsconfig.json', {
  typescript: require('typescript'),
});
gulp.task('build-selenium', () => {
  return gulp.src(['selenium/**/*.ts'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(tsSelenium())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/selenium'));
});

gulp.task('copy-json', () => {
  return src('server/**/*.json')
    .pipe(dest('build/server'));
});

gulp.task('build-browser', () => {
  return src(['browser/app.jsx', 'styles/style.scss'])
    .pipe(plumber())
    .pipe(webpackStream(require('./webpack.config.js'), webpack))
    .pipe(dest('build/res'));
});

gulp.task('copy-assets', () => {
  return src('assets/**/*')
    .pipe(dest('build/server/assets'));
});

gulp.task('copy-config', () => {
  return gulp.src('config/**/*')
    .pipe(gulp.dest('build/config'));
});

gulp.task('test-server', ['build-server'], () => {
  require('source-map-support/register');
  const winston = require('winston');
  winston.remove(winston.transports.Console);
  process.on('unhandledRejection', err => {winston.error('\nUnhandled rejection:', err.stack);});
  return gulp.src('build/server/**/*.spec.js')
    .pipe(jasmine());
});

gulp.task('test-ui', ['build-selenium'], () => {
  require('source-map-support/register');
  require('core-js/shim');
  const winston = require('winston');
  winston.remove(winston.transports.Console);
  process.on('unhandledRejection', err => {winston.error('\nUnhandled rejection:', err.stack);});
  return gulp.src('build/selenium/**/*.spec.js')
    .pipe(jasmine({config: {random: false}}))
    .on('end', () => {
      console.log('Tests Completed');
    })
    .on('error', () => {
      console.log('THE WORLD IS BURNING');
    });
});


gulp.task('test', ['test-server']);

let node;
gulp.task('launch-dev-server', ['build-server'], done => {
  if (node) {
    node.kill();
  }
  process.env.NODE_ENV = process.env.NODE_ENV == null ? 'development' : process.env.NODE_ENV;
  node = spawn('node', [`${__dirname}/build/server/localserver.js`]);
  // pass through stdout and wait on a "ready" message in output
  node.stdout.on('data', data => {
    const text = data.toString();
    process.stdout.write(text);
    if (/server running.*http:/i.test(text)) {
      done();
    }
  });
  // pass through stderr
  node.stderr.on('data', data => {
    process.stderr.write(data.toString());
  });
  // if it exits early (i.e., not killed for reload) then finish with error
  node.on('close', (code, signal) => {
    if (signal == null) {
      done(`child dev server exited prematurely (code ${code})`);
    }
  });
});

gulp.task('server', ['default', 'launch-dev-server'], () => {
  gulp.watch([`${__dirname}/server/**/*.{ts,json}`], ['launch-dev-server']);
  gulp.watch([`${__dirname}/browser/**/*.{ts,tsx}`, `${__dirname}/styles/**/*.{css,scss}`], ['build-browser']);
  gulp.watch([`${__dirname}/assets/**/*`], ['copy-assets']);
});

gulp.task('default', ['build-server', 'build-browser', 'copy-assets']);

gulp.task('clean', () => {
  return del([
    'node_modules',
    'build',
  ]);
});

process.on('exit', () => {
  if (node) {
    node.kill();
  }
});


/* Always read sources relative to the current directory. */
function src(globs, opts) {
  opts = opts || {};
  opts.cwd = __dirname;
  return gulp.src(globs, opts);
}

/* Always write sources relative to the current directory. */
function dest(globs, opts) {
  opts = opts || {};
  opts.cwd = __dirname;
  return gulp.dest(globs, opts);
}