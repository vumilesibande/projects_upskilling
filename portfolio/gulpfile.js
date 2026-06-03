const { src, dest, watch, series } = require('gulp');
const rename = require('gulp-rename');
const sassCompiler = require('gulp-sass')(require('sass'));

const scssEntry = 'scss/main.scss';
const scssWatch = 'scss/**/*.scss';
const cssOutputDir = 'dist';

function styles() {
  return src(scssEntry)
    .pipe(
      sassCompiler({ style: 'expanded' }).on('error', sassCompiler.logError),
    )
    .pipe(rename('styles.css'))
    .pipe(dest(cssOutputDir));
}

function watchStyles() {
  watch(scssWatch, styles);
}

exports.styles = styles;
exports.build = styles;
exports.watch = series(styles, watchStyles);
exports.default = styles;
