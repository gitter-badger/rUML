var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var uglifycss = require('gulp-uglifycss');
var gls = require('gulp-live-server');

gulp.task('default', function() {
	gulp.run(['html', 'js', 'css', 'server']);
});

gulp.task('html', function() {
	gulp.src('src/*.html')
		.pipe(gulp.dest('dist/public'));
});

gulp.task('server', function() {
	gulp.src('src/server.js')
		.pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
	gulp.src('src/script.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/public'));
});

gulp.task('css', function() {
	gulp.src('src/*.css')
		.pipe(uglifycss({
			"uglyComments": true
		}))
		.pipe(concat('styles.css'))
		.pipe(gulp.dest('dist/public'));
});

gulp.task('watch', function() {
	gulp.watch('src/server.js', ['server']);
	gulp.watch('src/script.js', ['js']);
	gulp.watch('src/*.css', ['css']);
	gulp.watch('src/*.html', ['html']);
});

gulp.task('serve', ['default', 'watch'], function() {
	//1. run your script as a server
	var server = gls.new('dist/server.js');
	server.start();

	//use gulp.watch to trigger server actions(notify, start or stop)
	gulp.watch(['dist/public/**/*.css', 'dist/public/**/*.html'], function(file) {
		server.notify.apply(server, [file]);
	});
	//gulp.watch('dist/server.js', server.start.bind(server)); //restart my server

	//Note: try wrapping in a function if getting an error like `TypeError: Bad argument at TypeError (native) at ChildProcess.spawn`
	gulp.watch('dist/server.js', function() {
		server.start.bind(server)();
	});
});
