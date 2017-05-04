var gulp = require('gulp');
var del = require('del');
var gPrint = require('gulp-print');
var args = require('yargs').argv;
var config = require('./gulp.config')();

var $ = require('gulp-load-plugins')({ lazy: true });

gulp.task('vet', function(){
    log('Analysing JSHint & JSCS');
    return gulp
        .src(config.alljs)
        //.pipe(gulpDebug())
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function(){
    log('Less -> CSS');
    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({ browsers: ['last 2 versions', '> 5%'] }))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function(done){
    var files = config.temp + '**/*.css';
    clean(files, done);
});

gulp.task('less-watcher', function(){
    return gulp.watch([config.less], ['styles']);
});

gulp.task('wiredep', function(){
    log("Wire up the bower css and js into index.html");
    var options = config.getWiredepDefaultoptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles'], function(){
    log("Wire up the bower css and js into index.html");

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});

function  clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path).then(() => done());
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}