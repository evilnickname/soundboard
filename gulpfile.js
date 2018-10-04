'use strict';

const gulp = require('gulp'),
      fs = require('fs'),
      replace = require('gulp-replace');

const json = JSON.parse(fs.readFileSync('./soundboards.json'));

const copyAssets = (done) => {
  gulp.src(['./assets/**/*', './node_modules/howler/dist/howler.core.min.js'])
    .pipe(gulp.dest('build/'));

  done();
}

const prepareIndex = (done) => {
  let output = '';
  
  function generateButtons () {
      for (let b of json.boards) {  
      for (let s of b.sounds) {
        output += `<button type="button" class="btn" id="${s.tag}" data-board="${b.boardId}">${s.text}</button>`;
      }
    }
  
    return output;
  }

  function jsonAsString () {
    return JSON.stringify(json);
  }


  gulp.src('./index.html')
    .pipe(replace('%BUTTONS%', generateButtons))
    .pipe(replace(/<link rel="stylesheet" href=".\/soundboard.css">/, function() {
      const style = fs.readFileSync('./soundboard.css', 'utf8');
      return '<style>\n' + style + '\n</style>';
    }))
    .pipe(replace('%HOWLER%', '<script src="howler.core.min.js"></script>'))
    .pipe(replace('%JSON%', jsonAsString))
    .pipe(replace('%TIMESTAMP%', function() {
      return (new Date()).toISOString()
    }))
    .pipe(gulp.dest('build/'));
  
    done();
}

gulp.task('build', gulp.series(prepareIndex));