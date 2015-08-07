// Packages
var gulp = require("gulp"),
	sass = require("gulp-ruby-sass"),
	imagemin = require("gulp-imagemin"),
	del = require("del"),
	uglify = require("gulp-uglify");
	rename = require("gulp-rename"),
	rsync = require ("rsyncwrapper").rsync;

var path = {
	styles: 		['src/scss/**/*.scss', 'assets/css/'],
	scripts: 		['src/js/*.js', 'assets/js/'],
	images: 		['src/images/', 'assets/images/']
}

// Uglify JS
gulp.task('jsmin', function(){
	gulp.src(path.scripts[0])
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(path.scripts[1]))
});

// Styles
gulp.task('compile-sass', function(){
	return gulp.src(path.styles[0] + '*.scss')
		.pipe(sass({
			'sourcemap=none' : true,
			style: "compressed",
			noCache: true
		})).on('error', function(err) {
			console.log('ERROR:', err.message);
		})
		.pipe(gulp.dest(path.styles[1]))
});

// Images Task
gulp.task('imagemin', function(){
	return gulp.src(path.images[0] + '**/*')
	.pipe(imagemin({
		optimizationLevel: 7,
		progressive: true,
		interlaced: true
	}))
	.pipe(gulp.dest(path.images[1]))
});

// Clean Task
gulp.task('clean', function(cb) {
    del('assets/', cb)
});

// Build
gulp.task('build', function(){
	rsync({
		src: '', // source path
		dest: '', // destination
		exclude: ['node_modules', '.DS_Store', '.editorconfig', '.gitignore'],
		recursive: true,
		compareMode: 'checksum',
		// deleteAll: true, (optional)
		onStdout: function( data ) {
			console.log( data.toString() );
		}
	}, function( error, stdout, stderr, cmd ) {
		console.log('Build - END');
	});
});

// Default Task
gulp.task('default', ['clean'], function(){
	gulp.start('jsmin','compile-sass', 'imagemin')
});

// Gulp Watch
gulp.task('watch', function(){
	gulp.watch(path.styles[0], ['compile-sass']);
	gulp.watch(path.scripts[0], ['jsmin']);
	gulp.watch(path.images, ['imagemin']);
})
