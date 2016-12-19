var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	spritesmith = require('gulp.spritesmith'),
  browserSync = require('browser-sync').create(),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglifyjs'),
  cssnano = require('gulp-cssnano'),
  rename = require('gulp-rename');


// autoload
gulp.task('browser-sync', function() { 
    browserSync.init({
        server: {
            baseDir: 'app'
        }
        
    });
});

// sass compilier with autoprefixer

gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
            cascade: false
        }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}));
});

// scripts base

gulp.task('scripts:base', function() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js'
    ])
    .pipe(concat('base.min.js'))
    .pipe(gulp.dest('app/js'));
});

// scripts libs

gulp.task('scripts:libs', function() {
  return gulp.src([
      'bower_components/owl.carousel/dist/owl.carousel.min.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('app/js'));
});

// minify css

gulp.task('minify', ['sass', 'sprite'], function() {
    return gulp.src(['app/css/*.css', '!app/css/*.min.css'])
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});

// sprite generator

gulp.task('sprite', function () {
  var spriteData = gulp.src('app/img/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  return spriteData.pipe(gulp.dest('app/css'));
});

// uglify

gulp.task('scripts', ['scripts:base', 'scripts:libs'], function() {
  gulp.src('app/js/main.js')
    .pipe(uglify('main.min.js'))
    .pipe(gulp.dest('app/js'))
});

gulp.task('watch', ['browser-sync', 'minify', 'scripts', 'minify'],  function () {
  gulp.watch('app/sass/**/*.scss', ['minify']);
  gulp.watch('app/img/icons/*.png', ['minify']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
  gulp.watch('app/js/main.js', ['scripts']);
});