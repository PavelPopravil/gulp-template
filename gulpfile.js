var gulp = require('gulp'),
	  sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin');
    


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
    'bower_components/owl.carousel/dist/owl.carousel.min.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('app/js'));
});

// Scripts min
gulp.task('scripts', ['scripts:base', 'scripts:libs'], function() {
  gulp.src('app/js/main.js')
    .pipe(uglify('main.min.js'))
    .pipe(gulp.dest('app/js'))
});

// Watcher
gulp.task('watch', ['browser-sync', 'minify', 'scripts'], function () {
  gulp.watch('app/sass/**/*.scss', ['minify']);
  gulp.watch("app/*.html", browserSync.reload);
  gulp.watch("app/js/*.js", browserSync.reload);
  gulp.watch("app/js/main.js", ['scripts']);
});

/* Build */
gulp.task('clear', ['minify', 'scripts'], function() {
  return del.sync('dist');
});


// copy
gulp.task('copy', ['clear'],  function() {
  return gulp.src(['app/**/*', '!app/img/**/*'])
    .pipe(gulp.dest('dist'));
});


gulp.task('clean', ['copy'], function() {
  return del.sync([
    'dist/sass',
    'dist/css/*.css',
    '!dist/css/*.min.css',
    'dist/js/*.js',
    '!dist/js/*.min.js'
    ])
});

// image-min
gulp.task('build', ['clean'], function() {
  return gulp.src(['app/img/**/*', '!app/img/favicons/**/*'])
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

// // autoload
// gulp.task('browser-sync', function() { 
//     browserSync.init({
//         server: {
//             baseDir: 'app'
//         }
        
//     });
// });

// // sass compilier with autoprefixer

// gulp.task('sass', function () {
//   return gulp.src('app/sass/**/*.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(autoprefixer({
//             browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
//             cascade: false
//         }))
//     .pipe(gulp.dest('app/css'))
//     .pipe(browserSync.reload({stream: true}));
// });

// // scripts base

// gulp.task('scripts:base', function() {
//   return gulp.src([
//       'bower_components/jquery/dist/jquery.min.js',
//       'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js'
//     ])
//     .pipe(concat('base.min.js'))
//     .pipe(gulp.dest('app/js'));
// });

// // scripts libs

// gulp.task('scripts:libs', function() {
//   return gulp.src([
//       'bower_components/owl.carousel/dist/owl.carousel.min.js'
//     ])
//     .pipe(concat('libs.min.js'))
//     .pipe(gulp.dest('app/js'));
// });

// // minify css

// gulp.task('minify', ['sass'], function() {
//     return gulp.src(['app/css/*.css', '!app/css/*.min.css'])
//         .pipe(cssnano())
//         .pipe(rename({suffix: '.min'}))
//         .pipe(gulp.dest('app/css'));
// });


// // uglify

// gulp.task('scripts', ['scripts:base', 'scripts:libs'], function() {
//   gulp.src('app/js/main.js')
//     .pipe(uglify('main.min.js'))
//     .pipe(gulp.dest('app/js'))
// });

// gulp.task('watch', ['browser-sync', 'minify', 'scripts', 'minify'],  function () {
//   gulp.watch('app/sass/**/*.scss', ['minify']);
//   gulp.watch('app/img/icons/*.png', ['minify']);
//   gulp.watch('app/*.html', browserSync.reload);
//   gulp.watch('app/js/**/*.js', browserSync.reload);
//   gulp.watch('app/js/main.js', ['scripts']);
// });