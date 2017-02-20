var gulp = require('gulp'),
	  sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    pngquant = require('imagemin-pngquant'),
    babel = require("gulp-babel");
    


// Server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app"
        }
    });
});

// Sass compiler + Autoprefixer
gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
            cascade: false
        }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});
// Css min
gulp.task('minify', ['sass'], function() {
    return gulp.src(['app/css/*.css', '!app/css/*.min.css'])
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});

// Scripts base
var concat = require('gulp-concat');
 
gulp.task('scripts:base', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    ])
    .pipe(concat('base.min.js'))
    .pipe(gulp.dest('app/js'));
});

// Scripts libs
gulp.task('scripts:libs', function() {
  return gulp.src([
    'bower_components/svg4everybody/dist/svg4everybody.min.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('app/js'));
});

// babel
gulp.task('babel', function() {
  return gulp.src('app/js/es6/main.js')
    .pipe(babel({
       presets: ['es2015']
    }))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream())
});

// Scripts min
gulp.task('scripts', ['babel', 'scripts:base', 'scripts:libs'], function() {
    gulp.src(['app/js/*.js', '!app/js/*.min.js'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/js'))
});


// svg-sprites
gulp.task('svgSpriteBuild', function () {
  return gulp.src(['app/img/icons_svg/*.svg', '!app/img/icons_svg/sprite.svg'])
  // minify svg
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    // remove all fill, style and stroke declarations in out shapes
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: {xmlMode: true}
    }))
    // cheerio plugin create unnecessary string '&gt;', so replace it.
    .pipe(replace('&gt;', '>'))
    // build svg sprite
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "../../sprite.svg",
          render: {
            scss: {
              dest:'../../../sass/_sprite.scss',
              template:"app/sass/templates/_sprite_template.scss"
            }
          }
        }
      }
    }))
    .pipe(gulp.dest('app/img/icons_svg'));
});

// Watcher
gulp.task('watch', ['browser-sync', 'minify', 'scripts', 'svgSpriteBuild'], function () {
  gulp.watch('app/sass/**/*.scss', ['minify']);
  gulp.watch("app/*.html", browserSync.reload);
  gulp.watch("app/img/icons_svg/*.svg", ['svgSpriteBuild'], browserSync.reload);
  gulp.watch("app/js/es6/*.js", ['scripts']);
  gulp.watch("app/js/*.js", browserSync.reload);
});





/* Build */
gulp.task('clear', ['minify', 'scripts'], function() {
  return del.sync('dist');
});


// copy
gulp.task('copy', ['clear'],  function() {
  return gulp.src(['app/**/*'])
    .pipe(gulp.dest('dist'));
});


gulp.task('clean', ['copy'], function() {
  return del.sync([
    'dist/img/icons_svg',
    'dist/sass',
    'dist/css/*.css',
    '!dist/css/*.min.css',
    'dist/js/es6',
    'dist/js/*.js',
    '!dist/js/*.min.js'
    ])
});

// image-min BUILD
gulp.task('build', ['clean'], function() {
  return gulp.src(['app/img/**/*', '!app/img/icons_svg/**/*', '!app/img/favicons/**/*', '!app/img/*.svg'])
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/img'));
});

