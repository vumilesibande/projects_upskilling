const { src, dest, watch, series } = require('gulp');
const rename = require('gulp-rename');
const sassCompiler = require('gulp-sass')(require('sass'));

const scssEntry = 'scss/main.scss';
const scssWatch = 'scss/**/*.scss';
const staticAssets = ['index.html', 'script.js', '.nojekyll'];

function styles() {
  return src(scssEntry)
    .pipe(
      sassCompiler({ style: 'expanded' }).on('error', sassCompiler.logError),
    )
    .pipe(rename('styles.css'))
    .pipe(dest('dist'));
}

function stylesPublic() {
  return src(scssEntry)
    .pipe(
      sassCompiler({ style: 'expanded' }).on('error', sassCompiler.logError),
    )
    .pipe(rename('styles.css'))
    .pipe(dest('public/dist'));
}

function copyToPublic() {
  return src(staticAssets, { allowEmpty: true }).pipe(dest('public'));
}

function watchStyles() {
  watch(scssWatch, styles);
}

exports.styles = styles;
exports['build:public'] = series(copyToPublic, stylesPublic);
exports.build = series(copyToPublic, stylesPublic);
exports.watch = series(styles, watchStyles);
exports.default = styles;
