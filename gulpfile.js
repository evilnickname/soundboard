'use strict';

const gulp          = require('gulp'),
      connect       = require('gulp-connect'),
      inlinesource  = require('gulp-inline-source'),
      replace       = require('gulp-replace'),
      fs            = require('fs');

const json = JSON.parse(fs.readFileSync('./soundboards.json'));

const copy = (done) => {
  gulp.src(['./assets/**/*'])
    .pipe(gulp.dest('build/'));

  done();
};

const serve = (done) => {
  connect.server({
    root: 'build',
    livereload: true
  });

  done();
};

const generate = (done) => {
  let output = '';
  
  function generateButtons () {
      for (let b of json.boards) {  
      for (let s of b.sounds) {
        output += `<span><button type="button" class="btn" id="${s.tag}" data-board="${b.boardId}">${s.text}</button></span>`;
      }
    }
  
    return output;
  }

  function jsonAsString () {
    return JSON.stringify(json);
  }

  gulp.src(['./sw.js', './manifest.json'])
    .pipe(gulp.dest('build/'));

  gulp.src('./index.html')
    .pipe(replace('{BUTTONS}', generateButtons))
    .pipe(replace('{JSON}', jsonAsString))
    .pipe(replace('{TIMESTAMP}', function() {
      return (new Date()).toISOString()
    }))
    .pipe(inlinesource())
    .pipe(gulp.dest('build/'))
    .pipe(connect.reload());
  
    done();
};

const watch = (done) => {
  gulp.watch(['./*.css', './*.html', './*.js', './*.json'], generate);
  done();
};

gulp.task('build', gulp.series(copy, generate));
gulp.task('develop', gulp.series(copy, serve, generate, watch));