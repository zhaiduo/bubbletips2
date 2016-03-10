var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var less = require('gulp-less');
var path = require('path');
var clean = require('gulp-clean');
var nano = require('gulp-cssnano');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var exec = require('child_process').exec;
var ngmin = require('gulp-ngmin');
var minifyCss = require('gulp-minify-css');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;

var merge = require('merge-stream');
var fs = require('fs');
var gulpif = require('gulp-if');
var Q = require('q');
var karmaServer = require('karma').Server;
var eslint = require('gulp-eslint');

//压缩css插件
var LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleancss = new LessPluginCleanCSS({
        advanced: true
    });

gulp.task('cleancss', function() {
    // Specify the directories to clean.
    return gulp.src(['./css/**/*.css'], {
            read: false
        })
        // Clean them.
        .pipe(clean());
});

//less生成压缩版css
gulp.task('lessmin', function() {
    return gulp.src('./css/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'css')],
            plugins: [cleancss]
        }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream({
            match: "**/*.css"
        }));
});

//生成css
gulp.task('less', function() {
    return gulp.src('./css/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'css')]
        }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream({
            match: "**/*.css"
        }));
});

//js生成压缩版js
gulp.task('jsmin', function() {
    var miniPublic = gulp.src('./src/**/*.js')
        .pipe(uglify({
            output: {
                beautify: false
            },
            compress: {
                sequences: true,
                booleans: true,
                conditionals: true,
                hoist_funs: false,
                hoist_vars: false,
                warnings: false,
            },
            mangle: false,
            outSourceMap: false,
            basePath: './',
            sourceRoot: './src'
        }))
        /*.pipe(rename({
            suffix: '.min'
        }))*/
        .pipe(gulp.dest('./js/'));

    return merge(
        miniPublic
    );
});

gulp.task('karma', function(done) {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('lint', function(done) {
    return gulp.src(['./src/**/*.js','!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

//重新发布测试环境
gulp.task('dev', [
    'cleancss', 'lessmin'
]);

gulp.task('deploy', [
    'lint', 'karma'
]);

//启动默认开发环境： gulp
gulp.task('default', [
    'dev', 'serve' //启动本地测试服务器
]);

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            directory: false
        },
        port: 8166
    });
    gulp.watch("./**/*.html").on("change", function() {
        gulp.start('dev', function(done) {
            browserSync.reload();
        });
    });
    gulp.watch("./css/**/*.less").on("change", function() {
        gulp.start('dev', function(done) {
            browserSync.reload();
        });
    });
    gulp.watch("./src/**/*.js").on("change", function() {
        gulp.start('dev', function(done) {
            browserSync.reload();
        });
    });
});
